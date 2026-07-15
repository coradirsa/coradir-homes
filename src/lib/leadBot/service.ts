import { buildAssistantReply, getConversionAction } from "./conversion";
import { generateAILeadBotReply, generateAILeadBotSummary, mergeAILeadData } from "./ai";
import {
  buildOtherProjectsReply,
  buildFinancingReply,
  buildBenefitsReply,
  buildCommercialLocationPreferenceReply,
  buildCommercialUseCaseReply,
  buildMediaOrBrochureReply,
  buildProjectFeatureReply,
  buildHumanContactReply,
  buildLocationReply,
  buildMixedInterestReply,
  buildProjectPageReply,
  buildPriceReply,
  buildProjectDetailReply,
  buildProjectIntroReply,
  buildProjectOverviewReply,
  buildPurchaseProcessReply,
  buildProjectScopeReply,
  buildResidentialRentalReply,
  buildConfusionRepairReply,
  buildGreetingReply,
  buildJuanaKoslayOptionsReply,
  buildSpecificInterestReply,
  buildComplaintReply,
  isFinancingQuestion,
  isBenefitsQuestion,
  isComplaintFlowRequest,
  isHumanContactRequest,
  isOtherProjectsQuestion,
  isProjectScopeQuestion,
  isResidentialRentalRequest,
  isConfusionAboutPreviousReply,
  isGreetingOnlyRequest,
  isJuanaKoslayOptionsRequest,
  isPriceQuestion,
  isProjectPageQuestion,
  isPurchaseProcessQuestion,
  shouldShowProjectOverview,
} from "./knowledge";
import { isRejectedContactText, mergeParsedLeadData, parseEmail, parsePhone, projectFromPath } from "./parser";
import { buildKnowledgeBaseAnswer, getKnowledgeContextForPrompt, shouldUseDirectKnowledgeAnswer } from "./retrieval";
import { scoreLead } from "./scoring";
import { submitLeadToConfiguredSink } from "./sinks/factory";
import { persistConversation, type BotEventType } from "./persistence";
import type { ConversionAction, KnowledgeSource, LeadBotApiRequest, LeadBotApiResponse, LeadBotMessage, LeadBotState } from "./types";

const ADVISOR_CONTACT_GATE_MESSAGE =
  "Para enviarle el resumen a un asesor, me dejas tu nombre y un email o numero de contacto? Con eso el equipo puede retomar el caso sin que repitas todo.";
const MAX_MESSAGES = 20;

function createInitialState(clientId: string, pathname?: string): LeadBotState {
  return {
    clientId,
    intent: "indefinido",
    project: projectFromPath(pathname),
    lastPageProject: projectFromPath(pathname),
    messages: [],
    score: 0,
    missingFields: [],
  };
}

function normalizeIncomingState(request: LeadBotApiRequest): LeadBotState {
  const base = createInitialState(request.clientId, request.tracking?.pathname);
  const incoming = request.state || {};

  // El proyecto de la pagina es el default cuando la conversacion no definio uno.
  // Si el usuario navega a la pagina de otro proyecto, resolveProject detecta el
  // cambio via lastPageProject y prioriza la pagina actual sin borrar historial.
  return {
    ...base,
    ...incoming,
    clientId: request.clientId,
    intent: incoming.intent || base.intent,
    project: incoming.project || base.project,
    lastPageProject: incoming.lastPageProject || base.lastPageProject,
    messages: Array.isArray(incoming.messages) ? incoming.messages.slice(-MAX_MESSAGES) : [],
    score: typeof incoming.score === "number" ? incoming.score : 0,
    missingFields: Array.isArray(incoming.missingFields) ? incoming.missingFields : [],
  };
}

function appendMessage(state: LeadBotState, message: LeadBotMessage): LeadBotState {
  return {
    ...state,
    messages: [...state.messages, message].slice(-MAX_MESSAGES),
  };
}

function shouldAppendContactPrompt(reply: string, nextAction: ReturnType<typeof getConversionAction>) {
  if (nextAction.type !== "request_contact") return false;
  if (/email|mail|numero|número|contacto/.test(reply.toLowerCase())) return false;
  return !reply.includes(nextAction.message);
}

function hasLeadContact(state: LeadBotState) {
  return Boolean(state.name && (state.email || state.phone));
}

function hasContactValue(message: string) {
  return Boolean(parseEmail(message) || parsePhone(message));
}

function hasRejectedContactAttempt(message: string) {
  const email = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0];
  return Boolean(email && isRejectedContactText(email));
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function previousAssistantOfferedAdvisor(state: LeadBotState) {
  const previousAssistant = [...state.messages].reverse().find((entry) => entry.role === "assistant");
  if (!previousAssistant) return false;

  const text = normalizeText(previousAssistant.content);
  return /asesor/.test(text) && /contacto|contactar|consultarlo|consultar|hablar|pasar|poner/.test(text);
}

function isAdvisorOfferAcceptance(message: string, state: LeadBotState) {
  if (!previousAssistantOfferedAdvisor(state)) return false;

  const text = normalizeText(message).trim();
  // Los arranques genericos ("dale", "si", "bueno") solo cuentan como aceptacion si el mensaje es corto;
  // "quiero alquilar casas" o "dale pero cuanto sale" son consultas nuevas, no aceptaciones.
  const isShortAcceptance =
    text.length <= 30 && /^(si|sí|dale|ok|okay|bueno|perfecto|de una|por favor|me sirve|si quiero|sí quiero)\b/.test(text);

  return isShortAcceptance || /quiero.*asesor|hablar.*asesor|contactame|contactenme|pasame.*asesor/.test(text);
}

function isContactRefusal(message: string, state: LeadBotState) {
  const text = normalizeText(message).trim();
  const previousAssistant = [...state.messages].reverse().find((entry) => entry.role === "assistant");
  const previousAskedContact = previousAssistant
    ? /nombre|email|mail|numero|contacto|datos/.test(normalizeText(previousAssistant.content))
    : false;

  return (
    (previousAskedContact || state.wantsHumanHandoff) &&
    (/^(no|no gracias|nop|nope|no chau|chau)[.!? ]*$/.test(text) ||
      /no\s+(quiero|voy a|me interesa).*(dejar|dar|pasar).*(dato|datos|contacto|mail|email|numero)/.test(text) ||
      /no.*(comoda|c[oó]moda|comod[ao]|confianza).*(datos|rtas|respuestas|chat)/.test(text) ||
      /no me senti comoda|no me senti comodo|no me siento comoda|no me siento comodo/.test(text))
  );
}

function buildContactRefusalReply(requestedHumanContact: boolean) {
  return [
    "Entendido, no te voy a insistir con tus datos.",
    requestedHumanContact
      ? "Si queres hablar con una persona, usa el boton de WhatsApp de la web. Tambien puedo seguir respondiendo por aca sin guardar contacto."
      : "Puedo seguir orientandote por aca sin guardar contacto.",
  ].join("\n\n");
}

function buildContactCapturedReply(state: LeadBotState) {
  if (!state.email && !state.phone) return undefined;

  if (!state.name) {
    const contactType = state.email ? "email" : "numero";
    if (state.wantsHumanHandoff) {
      return `Gracias, ya tengo tu ${contactType}. Me faltaria tu nombre para enviarle el resumen al asesor y que te contacte con el contexto.`;
    }

    return `Gracias, ya tengo tu ${contactType}. Me faltaria tu nombre para guardar la consulta y que el equipo retome el caso con el contexto.`;
  }

  if (state.wantsHumanHandoff) {
    return "Gracias, ya tengo tus datos. Preparo un resumen de la conversacion y lo envio al equipo para que un asesor te contacte con el contexto.";
  }

  return "Gracias, ya tengo tus datos. Con esto el equipo puede retomar la consulta con el contexto de lo que estas buscando.";
}

function buildContactGateAction(): ConversionAction {
  return {
    type: "request_contact",
    label: "Guardar consulta",
    message: ADVISOR_CONTACT_GATE_MESSAGE,
    shouldSubmitToCrm: false,
  };
}

function buildFallbackAdvisorSummary(state: LeadBotState) {
  const latestUserMessages = state.messages
    .filter((message) => message.role === "user")
    .slice(-6)
    .map((message) => message.content)
    .join(" | ");

  return [
    `Cliente: ${state.name || "sin nombre"}`,
    `Contacto: ${state.phone || state.email || "sin contacto"}`,
    state.intent !== "indefinido" ? `Interes: ${state.intent}` : null,
    state.project ? `Proyecto/zona: ${state.project}` : null,
    state.budgetText ? `Presupuesto/comentario: ${state.budgetText}` : null,
    state.timeline ? `Plazo: ${state.timeline}` : null,
    state.wantsComplaintFollowup ? "Motivo: reclamo o mala experiencia previa" : null,
    latestUserMessages ? `Contexto: ${latestUserMessages}` : null,
    "Proximo paso: contactar al cliente y validar datos pendientes sin hacerlo repetir la conversacion.",
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 1200);
}

function scrubVisibleInternalTerms(reply: string) {
  return reply
    .replace(/Â¿/g, "¿")
    .replace(/Â¡/g, "¡")
    .replace(/Ã¡/g, "á")
    .replace(/Ã©/g, "é")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã±/g, "ñ")
    .replace(/Ã/g, "Á")
    .replace(/Ã‰/g, "É")
    .replace(/Ã/g, "Í")
    .replace(/Ã“/g, "Ó")
    .replace(/Ãš/g, "Ú")
    .replace(/Ã‘/g, "Ñ")
    .replace(/Las ubicaciones estÃ¡n cargadas en la web:/gi, "Las ubicaciones son:")
    .replace(/Las ubicaciones están cargadas en la web:/gi, "Las ubicaciones son:")
    .replace(/lo que\s+s(?:i|í)\s+est(?:a|á|Ã¡)\s+cargado(?:\s+es|:)?/gi, "Del proyecto te puedo contar")
    .replace(/informaci(?:o|ó|Ã³)n\s+(?:cargada|publicada)/gi, "informacion del proyecto")
    .replace(/fuente\s+cargada/gi, "informacion del proyecto")
    .replace(/dato\s+publicado/gi, "dato")
    .replace(/\b(?:en\s+el\s+|del\s+)?corpus\b/gi, "informacion del proyecto")
    .replace(/condiciones\s+cargadas/gi, "condiciones comerciales de referencia")
    .replace(/precios\s+cargados/gi, "precios de referencia")
    .replace(/valores\s+cargados/gi, "valores de referencia")
    .replace(/ficha\s+cargada/gi, "ficha comercial")
    .replace(/financiacion\s+cargada/gi, "financiacion de referencia")
    .replace(/alquiler\s+mensual\s+cargado/gi, "alquiler mensual de referencia")
    .replace(/plazo\s+de\s+entrega\s+estimado\s+cargado/gi, "plazo de entrega estimado")
    .replace(/no\s+tengo\s+publicado/gi, "esa informacion todavia no la tengo")
    .replace(/no\s+est(?:a|á|Ã¡)\s+publicado/gi, "esa informacion todavia no la tengo");
}

function normalizeForFactCheck(value: string) {
  return normalizeText(value)
    .replace(/[$*_:;,.()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractRequiredFacts(canonicalReply: string) {
  const facts = new Set<string>();
  const patterns = [
    /\d{1,3}(?:\.\d{3})*(?:,\d{2})?\s*(?:USD|ARS|UVA|m2|m|meses|%)/gi,
    /\b\d+\s*m\s*x\s*\d+\s*m\b/gi,
    // Solo rutas/links reales (precedidos de espacio o parentesis), no fragmentos como "pozo/leasing".
    /(?<=^|[\s(])\/[a-z0-9\-/#%]+/gi,
    /\b(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+de\s+\d{4}\b/gi,
    /\b\d+\s+(?:departamentos|reservados|disponibles|locales|dormitorios)\b/gi,
    /\bRuta\s*3\s*km\s*0\.6\b/gi,
    /\bInocencio\s+Guerrero\s+517\b/gi,
    /\bJose\s+Hernandez\s+y\s+Chile\b/gi,
  ];

  for (const pattern of patterns) {
    for (const match of canonicalReply.matchAll(pattern)) {
      const fact = normalizeForFactCheck(match[0]);
      if (fact.length > 1) facts.add(fact);
    }
  }

  // Las frases de estilo no se exigen literales: la referencia va en el prompt y el LLM puede parafrasear.
  // Solo se exige que siga ofreciendo asesor y que no convierta una negacion en afirmacion.
  if (/asesor/i.test(canonicalReply)) facts.add("asesor");
  // Nombres de proyecto y la mencion del resumen son contenido, no estilo: deben sobrevivir a la parafrasis.
  if (/la torre ii/i.test(canonicalReply)) facts.add("torre");
  if (/juana\s*64/i.test(canonicalReply)) facts.add("juana");
  if (/san luis/i.test(canonicalReply)) facts.add("san luis");
  if (/resumen/i.test(canonicalReply)) facts.add("resumen");
  if (/no tengo|todavia no la tengo|no publica|no muestra|no confirma/i.test(canonicalReply)) facts.add("no");

  return [...facts];
}

function isGroundedReplyAcceptable(reply: string, canonicalReply: string) {
  const normalizedReply = normalizeForFactCheck(reply);
  const requiredFacts = extractRequiredFacts(canonicalReply);

  return requiredFacts.every((fact) => normalizedReply.includes(fact));
}

function buildGroundedKnowledgeContext(
  answer: { reply: string; sources?: KnowledgeSource[] },
  context?: ReturnType<typeof getKnowledgeContextForPrompt>
) {
  return {
    snippets: [
      {
        id: "canonical_retrieval_answer",
        title: "Respuesta canonica recuperada",
        content: answer.reply,
      },
      ...(context?.snippets || []),
    ],
    sources: context?.sources?.length ? context.sources : answer.sources || [],
  };
}

function shouldPreferDirectFeatureReply(message: string, state: LeadBotState) {
  const text = normalizeText(message);

  if (/expensa|expensas/.test(text)) return true;
  if (/pet\s*friendly|mascota|mascotas|perro|perros|terraza|patio|buena luz|luminos|material/.test(text)) return true;
  if (state.project === "san-luis" && /caracteristica|que incluye|mascota|expensa|local|seguridad|cocina|wifi/.test(text)) {
    return true;
  }
  if (/local|locales|comercial|comercio|negocio|ruta\s*3/.test(text) && /caracteristica|que incluye|medida|m2|bano|ba.o|energia|luz|backup/.test(text)) {
    return true;
  }

  return false;
}

export async function processLeadBotMessage(request: LeadBotApiRequest): Promise<LeadBotApiResponse> {
  const now = new Date().toISOString();
  const initialState = normalizeIncomingState(request);
  const hadContactBeforeMessage = hasLeadContact(initialState);
  let crmAttempted = false;
  let crmFailed = false;
  let crmSucceeded = false;
  const acceptedAdvisorOffer = isAdvisorOfferAcceptance(request.message, initialState);
  const requestedHumanContact = isHumanContactRequest(request.message) || acceptedAdvisorOffer;
  const withUserMessage = appendMessage(initialState, {
    role: "user",
    content: request.message,
    timestamp: now,
  });

  const contactRefusal = isContactRefusal(request.message, withUserMessage);
  // Navegar a la pagina de otro proyecto es una senal explicita del usuario: el
  // proyecto de la pagina actual pasa a mandar (sin borrar historial ni datos).
  const pageProjectThisTurn = projectFromPath(request.tracking?.pathname);
  const navigatedThisTurn = Boolean(pageProjectThisTurn && pageProjectThisTurn !== initialState.lastPageProject);
  const parsedDeterministicState = mergeParsedLeadData(withUserMessage, request.message, request.tracking?.pathname);
  const complaintFlow = isComplaintFlowRequest(request.message, {
    ...parsedDeterministicState,
    wantsComplaintFollowup: initialState.wantsComplaintFollowup,
  });
  const deterministicState = {
    ...parsedDeterministicState,
    wantsHumanHandoff: requestedHumanContact || complaintFlow || initialState.wantsHumanHandoff,
    wantsComplaintFollowup: complaintFlow || initialState.wantsComplaintFollowup,
    declinedContact: contactRefusal || initialState.declinedContact,
  };
  const contactRefusalReply = contactRefusal ? buildContactRefusalReply(requestedHumanContact || Boolean(deterministicState.wantsHumanHandoff)) : undefined;
  const complaintReply = complaintFlow
    ? buildComplaintReply(request.message, deterministicState, {
        invalidContactAttempt: hasRejectedContactAttempt(request.message),
      })
    : undefined;
  const greetingReply =
    !contactRefusalReply && !complaintReply && isGreetingOnlyRequest(request.message)
      ? buildGreetingReply(deterministicState)
      : undefined;
  const confusionRepairReply =
    !contactRefusalReply && !complaintReply && !greetingReply && isConfusionAboutPreviousReply(request.message)
      ? buildConfusionRepairReply(deterministicState)
      : undefined;
  const juanaKoslayOptionsReply =
    !contactRefusalReply &&
    !complaintReply &&
    !greetingReply &&
    !confusionRepairReply &&
    isJuanaKoslayOptionsRequest(request.message)
      ? buildJuanaKoslayOptionsReply()
      : undefined;
  const projectScopeReply =
    !contactRefusalReply && !complaintReply && !greetingReply && !confusionRepairReply && !juanaKoslayOptionsReply && isProjectScopeQuestion(request.message)
      ? buildProjectScopeReply()
      : undefined;
  const residentialRentalReply =
    !contactRefusalReply && !complaintReply && !greetingReply && !confusionRepairReply && !juanaKoslayOptionsReply && !projectScopeReply && isResidentialRentalRequest(request.message, deterministicState)
      ? buildResidentialRentalReply(request.message, deterministicState)
      : undefined;
  const contactCapturedReply =
    !contactRefusalReply && !complaintReply && !greetingReply && !confusionRepairReply && !juanaKoslayOptionsReply && !projectScopeReply && !residentialRentalReply && hasContactValue(request.message)
      ? buildContactCapturedReply(deterministicState)
      : undefined;
  const locationReply =
    requestedHumanContact || contactRefusalReply || complaintReply || greetingReply || confusionRepairReply || juanaKoslayOptionsReply || projectScopeReply || residentialRentalReply
      ? undefined
      : buildLocationReply(request.message, deterministicState);
  const projectPageReply =
    requestedHumanContact || contactRefusalReply || complaintReply || greetingReply || confusionRepairReply || juanaKoslayOptionsReply || projectScopeReply || residentialRentalReply || locationReply || !isProjectPageQuestion(request.message)
      ? undefined
      : buildProjectPageReply(deterministicState);
  const purchaseProcessReply =
    requestedHumanContact || contactRefusalReply || complaintReply || greetingReply || confusionRepairReply || juanaKoslayOptionsReply || projectScopeReply || residentialRentalReply || locationReply || projectPageReply || !isPurchaseProcessQuestion(request.message)
      ? undefined
      : buildPurchaseProcessReply(deterministicState);
  const mixedInterestReply = requestedHumanContact || contactRefusalReply || complaintReply || greetingReply || confusionRepairReply || juanaKoslayOptionsReply || projectScopeReply || residentialRentalReply ? undefined : buildMixedInterestReply(request.message, deterministicState);
  const knowledgeAnswer = requestedHumanContact || contactRefusalReply || complaintReply || greetingReply || confusionRepairReply || juanaKoslayOptionsReply || projectScopeReply || residentialRentalReply || locationReply || projectPageReply || purchaseProcessReply || mixedInterestReply
    ? undefined
    : buildKnowledgeBaseAnswer(request.message, deterministicState);
  const directKnowledgeAnswer =
    knowledgeAnswer && shouldUseDirectKnowledgeAnswer(request.message, deterministicState) ? knowledgeAnswer : undefined;
  const directProjectFeatureReply =
    requestedHumanContact ||
    contactRefusalReply ||
    complaintReply ||
    greetingReply ||
    confusionRepairReply ||
    juanaKoslayOptionsReply ||
    projectScopeReply ||
    residentialRentalReply ||
    contactCapturedReply ||
    locationReply ||
    projectPageReply ||
    purchaseProcessReply ||
    mixedInterestReply ||
    knowledgeAnswer ||
    !shouldPreferDirectFeatureReply(request.message, deterministicState)
      ? undefined
      : buildProjectFeatureReply(request.message, deterministicState);
  const commercialLocationPreferenceReply =
    requestedHumanContact ||
    contactRefusalReply ||
    complaintReply ||
    greetingReply ||
    confusionRepairReply ||
    juanaKoslayOptionsReply ||
    projectScopeReply ||
    residentialRentalReply ||
    contactCapturedReply ||
    locationReply ||
    projectPageReply ||
    purchaseProcessReply ||
    mixedInterestReply ||
    knowledgeAnswer ||
    directProjectFeatureReply
      ? undefined
      : buildCommercialLocationPreferenceReply(request.message, deterministicState);
  const commercialUseCaseReply =
    requestedHumanContact ||
    contactRefusalReply ||
    complaintReply ||
    greetingReply ||
    confusionRepairReply ||
    juanaKoslayOptionsReply ||
    projectScopeReply ||
    residentialRentalReply ||
    contactCapturedReply ||
    locationReply ||
    projectPageReply ||
    purchaseProcessReply ||
    mixedInterestReply ||
    knowledgeAnswer ||
    directProjectFeatureReply ||
    commercialLocationPreferenceReply
      ? undefined
      : buildCommercialUseCaseReply(request.message, deterministicState);
  const mediaOrBrochureReply =
    requestedHumanContact ||
    contactRefusalReply ||
    complaintReply ||
    greetingReply ||
    confusionRepairReply ||
    juanaKoslayOptionsReply ||
    projectScopeReply ||
    residentialRentalReply ||
    contactCapturedReply ||
    locationReply ||
    projectPageReply ||
    purchaseProcessReply ||
    mixedInterestReply ||
    knowledgeAnswer ||
    directProjectFeatureReply ||
    commercialLocationPreferenceReply ||
    commercialUseCaseReply
      ? undefined
      : buildMediaOrBrochureReply(request.message, deterministicState);
  const projectFeatureReply =
    directProjectFeatureReply ||
    (requestedHumanContact || contactRefusalReply || complaintReply || greetingReply || confusionRepairReply || juanaKoslayOptionsReply || projectScopeReply || residentialRentalReply || contactCapturedReply || locationReply || projectPageReply || purchaseProcessReply || mixedInterestReply || knowledgeAnswer
      ? undefined
      : buildProjectFeatureReply(request.message, deterministicState));
  const projectIntroReply =
    requestedHumanContact ||
    contactRefusalReply ||
    complaintReply ||
    greetingReply ||
    confusionRepairReply ||
    juanaKoslayOptionsReply ||
    projectScopeReply ||
    residentialRentalReply ||
    contactCapturedReply ||
    locationReply ||
    projectPageReply ||
    purchaseProcessReply ||
    mixedInterestReply ||
    knowledgeAnswer ||
    projectFeatureReply ||
    commercialLocationPreferenceReply ||
    commercialUseCaseReply ||
    mediaOrBrochureReply
      ? undefined
      : buildProjectIntroReply(request.message, deterministicState);
  const humanContactReply = requestedHumanContact ? buildHumanContactReply(deterministicState) : undefined;

  // Mejor respuesta determinista disponible: referencia obligatoria para el LLM y fallback si el LLM falla.
  const canonicalReply =
    contactRefusalReply ||
    complaintReply ||
    greetingReply ||
    confusionRepairReply ||
    juanaKoslayOptionsReply ||
    projectScopeReply ||
    residentialRentalReply ||
    humanContactReply ||
    locationReply ||
    contactCapturedReply ||
    projectPageReply ||
    purchaseProcessReply ||
    directKnowledgeAnswer?.reply ||
    knowledgeAnswer?.reply ||
    projectFeatureReply ||
    commercialLocationPreferenceReply ||
    commercialUseCaseReply ||
    mediaOrBrochureReply ||
    projectIntroReply;

  // LLM primero: siempre redacta el modelo, con el retrieval y la canonica como contexto y el historial como memoria.
  const aiKnowledgeContext = getKnowledgeContextForPrompt(request.message, deterministicState);
  const aiResult = await generateAILeadBotReply(request.message, deterministicState, {
    canonicalAnswer: canonicalReply,
    knowledgeContext: directKnowledgeAnswer
      ? buildGroundedKnowledgeContext(directKnowledgeAnswer, aiKnowledgeContext)
      : aiKnowledgeContext,
    navigatedToProject: navigatedThisTurn ? deterministicState.project : undefined,
  });
  const acceptedAiReply =
    aiResult && (!canonicalReply || isGroundedReplyAcceptable(aiResult.reply, canonicalReply))
      ? aiResult.reply
      : undefined;
  let parsedState = aiResult ? mergeAILeadData(deterministicState, aiResult.fields) : deterministicState;
  // La extraccion del LLM suele arrastrar el proyecto del historial, asi que no
  // puede pisar el cambio de pagina; una mencion explicita en el mensaje ya quedo
  // resuelta en deterministicState.project.
  if (navigatedThisTurn && deterministicState.project && parsedState.project !== deterministicState.project) {
    parsedState = { ...parsedState, project: deterministicState.project };
  }
  const qualification = scoreLead(parsedState);
  const qualifiedState: LeadBotState = {
    ...parsedState,
    wantsHumanHandoff: requestedHumanContact || complaintFlow || parsedState.wantsHumanHandoff,
    wantsComplaintFollowup: complaintFlow || parsedState.wantsComplaintFollowup,
    declinedContact: contactRefusal || parsedState.declinedContact,
    score: qualification.score,
    classification: qualification.classification,
    missingFields: qualification.missingFields,
  };
  const nextAction = locationReply && !hasLeadContact(qualifiedState) ? buildContactGateAction() : getConversionAction(qualifiedState);
  const wantsProjectOverview = shouldShowProjectOverview(request.message, qualifiedState);
  const projectDetailReply = buildProjectDetailReply(request.message, qualifiedState);
  const specificInterestReply = buildSpecificInterestReply(request.message, qualifiedState);
  let reply = buildAssistantReply(qualifiedState, nextAction);

  if (acceptedAiReply) {
    reply = acceptedAiReply;
  } else if (canonicalReply) {
    reply = canonicalReply;
  } else if (requestedHumanContact) {
    reply = buildHumanContactReply(qualifiedState);
  } else if (isBenefitsQuestion(request.message)) {
    reply = buildBenefitsReply(qualifiedState);
  } else if (isFinancingQuestion(request.message)) {
    reply = buildFinancingReply(qualifiedState);
  } else if (isOtherProjectsQuestion(request.message)) {
    reply = buildOtherProjectsReply();
  } else if (isPriceQuestion(request.message)) {
    reply = buildPriceReply(qualifiedState.project);
  } else if (mixedInterestReply) {
    reply = mixedInterestReply;
  } else if (projectDetailReply) {
    reply = projectDetailReply;
  } else if (specificInterestReply) {
    reply = specificInterestReply;
  } else if (wantsProjectOverview) {
    reply = buildProjectOverviewReply();
  }

  if (!acceptedAiReply && !canonicalReply && !mixedInterestReply && shouldAppendContactPrompt(reply, nextAction)) {
    reply = `${reply}\n\n${nextAction.message}`;
  }

  reply = scrubVisibleInternalTerms(reply);

  let finalState = appendMessage(qualifiedState, {
    role: "assistant",
    content: reply,
    timestamp: new Date().toISOString(),
  });

  const shouldSubmitToCrm =
    (nextAction.shouldSubmitToCrm || hasLeadContact(finalState)) &&
    hasLeadContact(finalState) &&
    !finalState.crmSubmittedAt;

  if (shouldSubmitToCrm) {
    crmAttempted = true;
    const advisorSummary =
      finalState.advisorSummary ||
      (await generateAILeadBotSummary(finalState)) ||
      buildFallbackAdvisorSummary(finalState);

    finalState = {
      ...finalState,
      advisorSummary,
      advisorSummaryGeneratedAt: finalState.advisorSummaryGeneratedAt || new Date().toISOString(),
    };

    const sinkResult = await submitLeadToConfiguredSink({
      state: finalState,
      qualification,
      conversion: nextAction,
      tracking: request.tracking,
    }).catch((error): Awaited<ReturnType<typeof submitLeadToConfiguredSink>> => {
      console.error("Lead bot sink error:", error);
      return {
        ok: false,
        skipped: false,
        error: "No se pudo enviar el lead al sink configurado.",
      };
    });

    crmFailed = !sinkResult.ok && !sinkResult.skipped;
    crmSucceeded = sinkResult.ok;

    if (sinkResult.ok || sinkResult.skipped) {
      finalState = {
        ...finalState,
        crmSubmittedAt: sinkResult.ok ? new Date().toISOString() : finalState.crmSubmittedAt,
        crmLeadId: sinkResult.leadId || finalState.crmLeadId,
      };
    }
  }

  const events = [
    {
      event: `lead_bot_${qualification.classification.toLowerCase()}`,
      classification: qualification.classification,
      score: qualification.score,
      project: finalState.project,
      intent: finalState.intent,
      action: nextAction.type,
    },
  ];

  const persistenceEvents: Array<{ type: BotEventType; payload?: Record<string, unknown> }> = [
    { type: "user_message", payload: { message: request.message } },
    { type: "bot_reply", payload: { reply, action: nextAction.type } },
  ];
  if (nextAction.type === "request_contact") persistenceEvents.push({ type: "contact_requested" });
  if (!hadContactBeforeMessage && hasLeadContact(finalState)) persistenceEvents.push({ type: "contact_provided" });
  if (contactRefusal) persistenceEvents.push({ type: "contact_declined" });
  if (nextAction.type === "whatsapp_handoff") persistenceEvents.push({ type: "whatsapp_cta_shown" });
  if (crmSucceeded) persistenceEvents.push({ type: "crm_submitted" });
  else if (crmAttempted && crmFailed) persistenceEvents.push({ type: "crm_submit_failed" });
  await persistConversation({ state: finalState, tracking: request.tracking, events: persistenceEvents }).catch((error) => {
    console.error("Lead bot persistence error:", error);
  });

  return {
    reply,
    state: finalState,
    classification: qualification.classification,
    score: qualification.score,
    nextAction,
    events,
    knowledgeSources: directKnowledgeAnswer?.sources || knowledgeAnswer?.sources || (aiResult ? aiKnowledgeContext?.sources : undefined),
  };
}
