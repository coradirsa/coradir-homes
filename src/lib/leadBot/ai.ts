import { createLLMProvider } from "./providers/factory";
import { isRejectedContactText } from "./parser";
import { buildLeadBotSystemPrompt } from "./systemPrompt";
import type { LLMMessage } from "./providers/types";
import type { KnowledgePromptContext } from "./retrieval";
import type { BudgetStatus, DecisionRole, LeadBotState, LeadIntent, LeadTimeline } from "./types";

type AILeadBotFields = {
  intent?: LeadIntent;
  project?: string;
  budgetStatus?: BudgetStatus;
  budgetText?: string;
  budgetCurrency?: "ARS" | "USD";
  needsBudgetCurrency?: boolean;
  timeline?: LeadTimeline;
  decisionRole?: DecisionRole;
  name?: string;
  email?: string;
  phone?: string;
};

type AILeadBotResult = {
  reply?: string;
  fields?: AILeadBotFields;
};

type AILeadBotSummaryResult = {
  summary?: string;
};

type AILeadBotOptions = {
  knowledgeContext?: KnowledgePromptContext;
  canonicalAnswer?: string;
  // Proyecto de la pagina que el usuario acaba de abrir, cuando difiere de la
  // pagina de su mensaje anterior. Señal para enfocar la respuesta ahi.
  navigatedToProject?: string;
};

const VALID_INTENTS = new Set(["comprar", "alquilar", "invertir", "consultar", "indefinido"]);
const VALID_PROJECTS = new Set(["locales-comerciales", "juana-64", "la-torre-ii", "san-luis", "villa-mercedes", "terrenos", "inversiones"]);
const VALID_BUDGET = new Set(["definido", "credito", "indefinido", "sin_capacidad"]);
const VALID_TIMELINES = new Set(["inmediato", "0-3_meses", "3-6_meses", "mas_6_meses", "indefinido"]);
const VALID_ROLES = new Set(["decisor", "influenciador", "tercero", "indefinido"]);

function cleanJson(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

function parseAIResult(text: string): AILeadBotResult | null {
  const cleaned = cleanJson(text);
  const candidates = [cleaned];
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) candidates.push(cleaned.slice(start, end + 1));

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as AILeadBotResult;
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      // Algunos modelos envuelven el JSON con texto; se prueba el siguiente candidato.
    }
  }

  return null;
}

function parseAISummaryResult(text: string): AILeadBotSummaryResult | null {
  const cleaned = cleanJson(text);

  try {
    const parsed = JSON.parse(cleaned) as AILeadBotSummaryResult;
    if (parsed && typeof parsed === "object" && typeof parsed.summary === "string") {
      return { summary: parsed.summary };
    }
  } catch {
    // Some providers return plain text even when JSON is requested.
  }

  return cleaned ? { summary: cleaned } : null;
}

function scrubPhoneRequest(reply: string) {
  return reply
    .replace(/pasame\s+(?:tu\s+)?telefono(?!\s+o\s+(?:mail|email|correo))/gi, "pasame tu email o número de contacto")
    .replace(/dame\s+(?:tu\s+)?telefono(?!\s+o\s+(?:mail|email|correo))/gi, "pasame tu email o número de contacto")
    .replace(/me das\s+(?:tu\s+)?telefono(?!\s+o\s+(?:mail|email|correo))/gi, "me dejás tu email o número de contacto")
    .replace(/dejame\s+(?:tu\s+)?telefono(?!\s+o\s+(?:mail|email|correo))/gi, "dejame tu email o número de contacto");
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function scrubCustomerVisibleInternalTerms(reply: string) {
  return reply
    .replace(/lo que\s+s[ií]\s+est[aá]\s+cargado(?:\s+es|:)?/gi, "Del proyecto te puedo contar")
    .replace(/informaci[oó]n\s+(?:cargada|publicada)/gi, "informacion del proyecto")
    .replace(/fuente\s+cargada/gi, "informacion del proyecto")
    .replace(/dato\s+publicado/gi, "dato")
    .replace(/\b(?:en\s+el\s+|del\s+)?corpus\b/gi, "en la informacion del proyecto")
    .replace(/no\s+tengo\s+publicado/gi, "esa informacion todavia no la tengo")
    .replace(/no\s+est[aá]\s+publicado/gi, "esa informacion todavia no la tengo");
}

function enforceAdvisorForUnconfirmedHousingDetails(reply: string, message: string) {
  const messageText = normalizeText(message);
  const replyText = normalizeText(reply);
  const asksUnitSpecificDetail =
    /pet\s*friendly|perro|perros|mascota|mascotas|terraza|patio|buena luz|luminos|orientacion|material|materiales|expensa|expensas/.test(
      messageText
    );
  const saysNeedsValidation = /no esta confirmado|no confirma|no tengo|validar|validarlo|validarla|depende/.test(replyText);
  const additions: string[] = [];

  if (!asksUnitSpecificDetail || !saysNeedsValidation) {
    return reply;
  }

  if (/material|materiales/.test(messageText) && !/material|materiales|construccion|constructivo/.test(replyText)) {
    additions.push("Tambien hay que validar materiales o sistema constructivo exacto.");
  }

  if (/buena luz|luminos|orientacion/.test(messageText) && !/luz|luminos|orientacion/.test(replyText)) {
    additions.push("La luz y orientacion dependen de la unidad concreta.");
  }

  if (/pet\s*friendly|perro|perros|mascota|mascotas/.test(messageText) && !/pet\s*friendly|perro|perros|mascota|mascotas/.test(replyText)) {
    additions.push("Para mascotas, falta confirmar reglamento y cantidad permitida.");
  }

  if (!/asesor/.test(replyText)) {
    additions.push("Eso lo valida un asesor sobre la unidad concreta.");
  }

  return additions.length ? `${reply}\n\n${additions.join(" ")}` : reply;
}

function sanitizeFields(fields?: AILeadBotFields): AILeadBotFields {
  if (!fields) return {};

  return {
    intent: fields.intent && VALID_INTENTS.has(fields.intent) ? fields.intent : undefined,
    project: fields.project && VALID_PROJECTS.has(fields.project) ? fields.project : undefined,
    budgetStatus:
      fields.budgetStatus && VALID_BUDGET.has(fields.budgetStatus) ? fields.budgetStatus : undefined,
    budgetText: typeof fields.budgetText === "string" ? fields.budgetText.slice(0, 240) : undefined,
    budgetCurrency: fields.budgetCurrency === "ARS" || fields.budgetCurrency === "USD" ? fields.budgetCurrency : undefined,
    needsBudgetCurrency: typeof fields.needsBudgetCurrency === "boolean" ? fields.needsBudgetCurrency : undefined,
    timeline: fields.timeline && VALID_TIMELINES.has(fields.timeline) ? fields.timeline : undefined,
    decisionRole: fields.decisionRole && VALID_ROLES.has(fields.decisionRole) ? fields.decisionRole : undefined,
    name:
      typeof fields.name === "string" && !isRejectedContactText(fields.name)
        ? fields.name.slice(0, 80)
        : undefined,
    email:
      typeof fields.email === "string" && !isRejectedContactText(fields.email)
        ? fields.email.slice(0, 120)
        : undefined,
    phone: typeof fields.phone === "string" ? fields.phone.slice(0, 40) : undefined,
  };
}

export function mergeAILeadData(state: LeadBotState, fields?: AILeadBotFields): LeadBotState {
  const cleanFields = sanitizeFields(fields);

  return {
    ...state,
    intent: cleanFields.intent || state.intent,
    project: cleanFields.project || state.project,
    budgetStatus: cleanFields.budgetStatus || state.budgetStatus,
    budgetText: cleanFields.budgetText || state.budgetText,
    budgetCurrency: cleanFields.budgetCurrency || state.budgetCurrency,
    needsBudgetCurrency:
      cleanFields.needsBudgetCurrency ??
      (cleanFields.budgetCurrency ? false : state.needsBudgetCurrency),
    timeline: cleanFields.timeline || state.timeline,
    decisionRole: cleanFields.decisionRole || state.decisionRole,
    name: cleanFields.name || state.name,
    email: cleanFields.email || state.email,
    phone: cleanFields.phone || state.phone,
  };
}

function formatAIError(error: unknown) {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function buildKnowledgePrompt(context?: KnowledgePromptContext, canonicalAnswer?: string) {
  const canonicalBlock = canonicalAnswer
    ? [
        "Respuesta canonica de referencia interna:",
        canonicalAnswer,
        "Redacta la respuesta visible usando estos datos. Podes hacerla mas natural, pero no omitas numeros, precios, cantidades, direcciones, links ni advertencias de validacion comercial.",
        "Adaptala al hilo de la conversacion: no repitas saludos ni informacion ya dicha, y si la referencia no responde exactamente lo que el usuario pregunto, responde primero al usuario sin inventar datos fuera del contexto.",
      ].join("\n")
    : undefined;

  if (!context?.snippets.length) {
    return [
      canonicalBlock,
      "Contexto de conocimiento recuperado: (sin fragmentos relevantes).",
      "Si falta un dato especifico, no lo inventes: deci 'Esa informacion todavia no la tengo' y ofrece ponerlo en contacto con un asesor.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    canonicalBlock,
    "Contexto de conocimiento recuperado. Usalo como fuente, integralo con el historial y no inventes fuera de estos datos:",
    ...context.snippets.map((snippet) => `- ${snippet.title} (${snippet.id}): ${snippet.content}`),
    "",
    "Datos que NO estan confirmados si no aparecen arriba: terraza, patio privado, luminosidad/orientacion por unidad, cantidad exacta de mascotas permitidas, reglamento de convivencia, materiales exactos, expensas y disponibilidad actualizada por unidad. Si el contexto dice pet friendly para Juana 64, ese dato si esta confirmado; lo pendiente es el reglamento/cantidad exacta.",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildUserPrompt(message: string, state: LeadBotState, options: AILeadBotOptions = {}) {
  const history = state.messages.slice(-10).map((entry) => `${entry.role}: ${entry.content}`).join("\n");
  const navigationNote = options.navigatedToProject
    ? `Contexto de navegacion: el usuario acaba de abrir la pagina del proyecto ${options.navigatedToProject}. Si su mensaje dice "este proyecto", "aca" o pregunta sin nombrar proyecto, se refiere a ${options.navigatedToProject}: enfoca la respuesta en ese proyecto. Lo conversado antes sobre otros proyectos sigue valiendo como contexto, no lo repitas como si fuera el proyecto actual.`
    : undefined;

  return [
    navigationNote,
    `Estado actual: ${JSON.stringify({
      intent: state.intent,
      project: state.project,
      paginaActual: state.lastPageProject,
      budgetStatus: state.budgetStatus,
      budgetText: state.budgetText,
      budgetCurrency: state.budgetCurrency,
      needsBudgetCurrency: state.needsBudgetCurrency,
      timeline: state.timeline,
      decisionRole: state.decisionRole,
      hasName: Boolean(state.name),
      hasEmail: Boolean(state.email),
      hasPhone: Boolean(state.phone),
      wantsHumanHandoff: Boolean(state.wantsHumanHandoff),
      missingFields: state.missingFields,
    })}`,
    buildKnowledgePrompt(options.knowledgeContext, options.canonicalAnswer),
    `Historial reciente:\n${history || "(sin historial)"}`,
    `Mensaje nuevo del usuario: ${message}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export async function generateAILeadBotReply(message: string, state: LeadBotState, options: AILeadBotOptions = {}) {
  const provider = createLLMProvider();
  if (!provider) return null;

  const messages: LLMMessage[] = [
    { role: "system", content: buildLeadBotSystemPrompt() },
    { role: "user", content: buildUserPrompt(message, state, options) },
  ];

  try {
    const text = await provider.generateText(messages);
    const result = parseAIResult(text);
    if (!result?.reply || typeof result.reply !== "string") return null;

    const reply = scrubCustomerVisibleInternalTerms(
      enforceAdvisorForUnconfirmedHousingDetails(scrubPhoneRequest(result.reply.trim()), message)
    );

    return {
      reply: reply.slice(0, 1400),
      fields: sanitizeFields(result.fields),
    };
  } catch (error) {
    console.warn("Lead bot IA fallback:", formatAIError(error));
    return null;
  }
}

function buildSummaryPrompt(state: LeadBotState) {
  const history = state.messages.slice(-14).map((entry) => `${entry.role}: ${entry.content}`).join("\n");

  return [
    "Arma un resumen interno para que un asesor humano retome esta conversacion sin hacer repetir al cliente.",
    "No inventes datos. Si algo falta, escribilo como pendiente de confirmar.",
    "Inclui: interes principal, proyecto o zona, preferencias/requisitos, dudas sin responder, datos de contacto disponibles y proximo paso sugerido.",
    "No incluyas clasificaciones internas como MQL/SQL salvo que el estado comercial sea importante.",
    "Maximo 900 caracteres.",
    "",
    `Estado: ${JSON.stringify({
      intent: state.intent,
      project: state.project,
      budgetStatus: state.budgetStatus,
      budgetText: state.budgetText,
      budgetCurrency: state.budgetCurrency,
      timeline: state.timeline,
      decisionRole: state.decisionRole,
      name: state.name,
      email: state.email,
      phone: state.phone,
      wantsHumanHandoff: state.wantsHumanHandoff,
      wantsComplaintFollowup: state.wantsComplaintFollowup,
      declinedContact: state.declinedContact,
    })}`,
    `Historial reciente:\n${history || "(sin historial)"}`,
    "",
    'Devolve SOLO JSON valido con esta forma: {"summary":"texto para asesor"}',
  ].join("\n");
}

export async function generateAILeadBotSummary(state: LeadBotState) {
  const provider = createLLMProvider();
  if (!provider) return null;

  const messages: LLMMessage[] = [
    {
      role: "system",
      content:
        "Sos un asistente interno de ventas. Generas resumenes breves para asesores humanos, en espanol claro y accionable. No respondas al cliente.",
    },
    { role: "user", content: buildSummaryPrompt(state) },
  ];

  try {
    const text = await provider.generateText(messages);
    const result = parseAISummaryResult(text);
    const summary = result?.summary?.trim();
    return summary ? summary.slice(0, 1200) : null;
  } catch (error) {
    console.warn("Lead bot resumen IA fallback:", formatAIError(error));
    return null;
  }
}
