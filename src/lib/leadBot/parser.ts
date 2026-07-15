import type { BudgetStatus, DecisionRole, LeadBotState, LeadIntent, LeadTimeline } from "./types";

const PROJECT_PATTERNS: Array<[string, RegExp]> = [
  ["villa-mercedes", /villa\s*mercedes|riobamba/i],
  ["juana-64", /juana\s*64|juana|juana\s*koslay|jkoslay|inocencio\s*guerrero|i\s*guerrero/i],
  ["locales-comerciales", /complejo|local(?:es)?|comercial|ruta\s*3/i],
  ["la-torre-ii", /torre\s*ii|la\s*torre/i],
  ["san-luis", /san\s*luis/i],
  ["terrenos", /terreno|lote/i],
  ["inversiones", /inversion|invertir|rentabilidad/i],
];

const IMPLIED_PROJECT_PATTERNS: Array<[string, RegExp]> = [
  ["juana-64", /departamento|departamentos|depto|deptos|vivienda|vivir|habitar|casa|hogar|para vivir/i],
  ["locales-comerciales", /local|locales|comercial|comercio|negocio|oficina|ruta\s*3/i],
  ["inversiones", /invertir|inversion|rentabilidad|resguardo|capital|inversor/i],
  ["terrenos", /terreno|terrenos|lote|lotes/i],
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type ProjectMentionState = {
  affirmed: Set<string>;
  negated: Set<string>;
};

const NEGATION_TERMS = /\b(no|tampoco|nada de|en vez de|en lugar de|descarto|descartar|descartemos|olvidate de)\b/;

function isMentionNegated(text: string, start: number, length: number) {
  const before = text.slice(0, start);

  // La clausula relevante arranca despues del ultimo conector o signo de puntuacion.
  // "sino" afirma lo que sigue ("no quiero X sino Y" => Y afirmado).
  const boundaryPattern = /sino(?:\s+en)?|pero|aunque|[,;.!?]/g;
  let boundaryEnd = 0;
  let boundaryWasSino = false;
  let match: RegExpExecArray | null;
  while ((match = boundaryPattern.exec(before)) !== null) {
    boundaryEnd = match.index + match[0].length;
    boundaryWasSino = match[0].startsWith("sino");
  }

  if (boundaryWasSino) return false;
  if (NEGATION_TERMS.test(before.slice(boundaryEnd))) return true;

  // Negacion pospuesta inmediata: "villa mercedes no", "villa mercedes no me interesa".
  const after = text.slice(start + length, start + length + 20);
  return /^\s+no\b/.test(after);
}

export function getProjectMentionState(message: string): ProjectMentionState {
  const text = normalizeText(message);
  const affirmed = new Set<string>();
  const negated = new Set<string>();

  for (const [project, pattern] of PROJECT_PATTERNS) {
    const match = new RegExp(pattern.source, "i").exec(text);
    if (!match) continue;
    if (isMentionNegated(text, match.index, match[0].length)) {
      negated.add(project);
    } else {
      affirmed.add(project);
    }
  }

  return { affirmed, negated };
}

export function projectFromPath(pathname?: string) {
  const path = pathname || "";
  if (path.includes("/locales-comerciales") || path.includes("/complejo-coradir")) return "locales-comerciales";
  if (path.includes("/juana-64")) return "juana-64";
  if (path.includes("/la-torre-ii")) return "la-torre-ii";
  if (path.includes("/villa-mercedes")) return "villa-mercedes";
  if (path.includes("/san-luis")) return "san-luis";
  if (path.includes("/terrenos")) return "terrenos";
  if (path.includes("/inversiones")) return "inversiones";
  return undefined;
}

export function parseIntent(message: string): LeadIntent | undefined {
  const text = normalizeText(message);
  if (/\b(comprar|compra|adquirir|reservar|venta)\b/.test(text)) return "comprar";
  if (/\b(alquilar|alquiler|rentar)\b/.test(text)) return "alquilar";
  if (/\b(invertir|inversion|inversiones|rentabilidad|inversor)\b/.test(text)) return "invertir";
  if (/\b(vivir|vivienda|departamento|depto|casa|hogar)\b/.test(text)) return "comprar";
  if (/\b(consultar|consulta|informacion|info|saber|duda|interesa|interesado|interesada)\b/.test(text)) return "consultar";
  return undefined;
}

export function parseProject(message: string): string | undefined {
  const text = normalizeText(message);
  const mentions = getProjectMentionState(message);

  if (
    /local|locales|comercial|comercio|negocio|oficina/.test(text) &&
    /juana\s*64|juana|juana\s*koslay|jkoslay|inocencio\s*guerrero|i\s*guerrero/.test(text) &&
    !mentions.negated.has("locales-comerciales") &&
    !mentions.negated.has("juana-64")
  ) {
    return "locales-comerciales";
  }

  for (const [project] of PROJECT_PATTERNS) {
    if (mentions.affirmed.has(project)) return project;
  }

  // Si el usuario solo nombro proyectos para descartarlos, no hay proyecto explicito.
  if (mentions.negated.size > 0) return undefined;

  for (const [project, pattern] of IMPLIED_PROJECT_PATTERNS) {
    if (pattern.test(message)) return project;
  }

  return undefined;
}

function resolveProject(current: LeadBotState, message: string, pathname?: string) {
  const parsedProject = parseProject(message);
  const text = normalizeText(message);
  const mentionsResidential = /departamento|departamentos|depto|deptos|vivienda|vivir|habitar|casa|hogar/.test(text);
  const pageProject = projectFromPath(pathname);
  // Navegacion detectada: el usuario escribio desde la pagina de un proyecto
  // distinto al de su ultimo mensaje. La pagina actual pasa a mandar sobre el
  // proyecto conversado, salvo que el mensaje mencione otro proyecto explicito.
  // Sin navegacion, la conversacion sigue mandando sobre la pagina.
  const navigatedToNewProject = Boolean(pageProject && pageProject !== current.lastPageProject);
  const currentOrPathProject = navigatedToNewProject ? pageProject : current.project || pageProject;
  const explicitlyMentionsJuana = /juana\s*64|juana|juana\s*koslay|jkoslay|inocencio\s*guerrero|i\s*guerrero|koslay/.test(text);
  const explicitlyMentionsSanLuis = /san\s*luis|jose\s*hernandez|calle\s*chile/.test(text);

  if (current.project === "locales-comerciales" && parsedProject === "juana-64" && !mentionsResidential) {
    return current.project;
  }

  // "departamento/vivienda" implica juana-64 solo como default sin contexto: si ya
  // hay otro proyecto residencial en juego (conversado o por pagina), se mantiene.
  if (
    (currentOrPathProject === "san-luis" ||
      currentOrPathProject === "villa-mercedes" ||
      currentOrPathProject === "la-torre-ii") &&
    parsedProject === "juana-64" &&
    mentionsResidential &&
    !explicitlyMentionsJuana
  ) {
    return currentOrPathProject;
  }

  if (
    currentOrPathProject === "san-luis" &&
    parsedProject === "locales-comerciales" &&
    !/ruta\s*3|juana\s*64|juana|koslay/.test(text) &&
    (explicitlyMentionsSanLuis || current.project === "san-luis")
  ) {
    return "san-luis";
  }

  // Si el usuario descarto explicitamente el proyecto actual o el de la pagina
  // ("no quiero en Villa Mercedes...") y no afirmo otro, el proyecto queda abierto.
  if (!parsedProject && currentOrPathProject && getProjectMentionState(message).negated.has(currentOrPathProject)) {
    return undefined;
  }

  return parsedProject || currentOrPathProject;
}

export function parseTimeline(message: string): LeadTimeline | undefined {
  const text = normalizeText(message);
  if (/no\s+estoy\s+mirando\s+(san\s*luis|villa\s*mercedes|juana|juana\s*koslay|juana\s*64|ruta\s*3|locales|terrenos|inversiones)/.test(text)) {
    return undefined;
  }
  if (/(?<!por )ahora|ya mismo|para ya|urgente|este mes|inmediato|cuanto antes|lo antes posible/.test(text)) return "inmediato";
  if (/([0-3]|uno|dos|tres)\s*mes/.test(text) || /proxim[oa]s?\s*(mes|seman)/.test(text)) return "0-3_meses";
  if (/([4-6]|cuatro|cinco|seis)\s*mes|medio ano/.test(text)) return "3-6_meses";
  if (/mas adelante|ano que viene|proximo ano|6 meses|sin apuro|mirando/.test(text)) return "mas_6_meses";
  return undefined;
}

export function parseDecisionRole(message: string): DecisionRole | undefined {
  const text = normalizeText(message);
  if (/^(yo|vos|si,?\s*yo|sí,?\s*yo)$/i.test(text) || /yo decido|soy quien decide|decido yo|soy el titular|soy titular|decision la tomo yo|la tomo yo|lo decido yo/.test(text)) {
    return "decisor";
  }
  if (
    /con mi pareja|familia|socio|socios|lo vemos|decidimos|mi marido|mi esposa|mi esposo|mi mujer|mi pareja|yo y mi|mi .* y yo/.test(
      text
    )
  ) {
    return "influenciador";
  }
  if (/para mi hijo|para mi hija|para otra persona|averiguo para|consulta para/.test(text)) return "tercero";
  return undefined;
}

export function parseBudgetStatus(message: string): BudgetStatus | undefined {
  const text = normalizeText(message);
  if (/no\s+estoy\s+mirando\s+(san\s*luis|villa\s*mercedes|juana|juana\s*koslay|juana\s*64|ruta\s*3|locales|terrenos|inversiones)/.test(text)) {
    return undefined;
  }
  if (/no tengo|sin presupuesto|no cuento|todavia no|aun no|estoy mirando|estoy viendo/.test(text)) {
    return "sin_capacidad";
  }
  if (/credito|prestamo|financiacion|financiar|banco/.test(text)) return "credito";
  if (
    /presupuesto|mi capital|un capital|capital (?:disponible|para|ahorrado)|ahorros|contado|dispongo|cuento con|tengo (?:un )?(?:rango|presupuesto|capital|ahorro)|usd|dolar|\$/.test(text) ||
    hasNumericBudget(message)
  ) {
    return "definido";
  }
  return undefined;
}

export function parseBudgetCurrency(message: string): "ARS" | "USD" | undefined {
  const text = normalizeText(message);
  if (/usd|dolar|dolares|u\$s/.test(text)) return "USD";
  if (/peso|pesos|ars|\$/.test(text)) return "ARS";
  return undefined;
}

export function hasNumericBudget(message: string) {
  const text = normalizeText(message)
    .replace(/juana\s*64/g, " ")
    .replace(/ruta\s*3/g, " ")
    .replace(/km\s*\d+(?:[.,]\d+)?/g, " ");

  return (
    /\b\d+\s*k\b/i.test(text) ||
    /\b\d{4,}\b/.test(text) ||
    /\b\d{1,3}\s*(?:a|-|y|hasta)\s*\d{1,3}\s*k?\b/i.test(text) ||
    /\b\d{1,3}\s*(?:mil|millones|millon)\b/i.test(text)
  );
}

export function isRejectedContactText(value: string) {
  const text = normalizeText(value);
  return /puta|puto|trolo|orto|mierda|pelotud|forro|concha|botdelorto/.test(text);
}

export function parseEmail(message: string) {
  const email = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]?.toLowerCase();
  if (!email || isRejectedContactText(email)) return undefined;
  return email;
}

export function parsePhone(message: string) {
  const match = message.match(/\+?\d[\d\s().-]{7,}\d/);
  if (!match) return undefined;

  const text = normalizeText(message);
  const hasPhoneContext = /\b(tel|telefono|cel|celular|whatsapp|wsp|numero|contacto|llamar|llamame|llamenme)/.test(text);
  const looksLikeMoneyFormat = /^\d{1,3}(?:[.,]\d{3})+$/.test(match[0].trim());
  const hasMoneyContext = /\b(presupuesto|precio|valor|cuesta|sale|peso|pesos|dolar|dolares|usd|ars|millon|millones|mil)\b/.test(text) || /u\$s|\$/.test(message);

  if (!hasPhoneContext && (looksLikeMoneyFormat || hasMoneyContext)) return undefined;

  return match[0].replace(/[^\d+]/g, "");
}

export function parseName(message: string) {
  const match = message.match(/\b(?:soy|me llamo|mi nombre es)\s+([A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,60})/i);
  return match?.[1]?.trim().replace(/\s+/g, " ");
}

function previousAssistantAskedForName(current: LeadBotState) {
  const previousAssistant = [...current.messages].reverse().find((entry) => entry.role === "assistant");
  if (!previousAssistant) return false;
  const text = normalizeText(previousAssistant.content);
  return /(?:falta(?:ria)?|necesito|dejas|decime|dime|cual es|nombre)/.test(text) && /nombre/.test(text);
}

function parseBareNameAnswer(message: string, current: LeadBotState) {
  if (!previousAssistantAskedForName(current)) return undefined;

  const candidate = message.replace(/[*_`]/g, "").trim().replace(/\s+/g, " ");
  // Solo se interpreta una respuesta libre como nombre cuando el turno anterior lo
  // pidio expresamente. Esto evita convertir consultas normales en nombres.
  if (!/^[\p{L}][\p{L}'’-]*(?:\s+[\p{L}][\p{L}'’-]*){0,4}$/u.test(candidate)) return undefined;
  if (/^(si|no|dale|bueno|gracias|hola|quiero|asesor|whatsapp)$/i.test(normalizeText(candidate))) return undefined;
  return candidate.slice(0, 80);
}

function parseLeadName(message: string, current: LeadBotState) {
  const structuredMatch = message.match(/nombre\s*:\s*\*?\s*([^\n\r,.;]{2,80})/i);
  const directMatch = message.match(/\b(?:soy|me llamo|mi nombre es)\s+([^\n\r,.]{2,80})/i);
  const rawName = structuredMatch?.[1] || directMatch?.[1];
  if (!rawName) return parseName(message) || parseBareNameAnswer(message, current);

  const cleanName = rawName
    .replace(/[*_`]/g, "")
    .replace(/^-+\s*/, "")
    .trim()
    .replace(/\s+/g, " ");

  if (!cleanName || /@|\d{4,}|email|mail|telefono|tel.fono|monto|consulta/i.test(cleanName)) {
    return undefined;
  }

  return cleanName.slice(0, 80);
}

export function mergeParsedLeadData(
  current: LeadBotState,
  message: string,
  pathname?: string
): LeadBotState {
  const parsedName = parseLeadName(message, current);
  const parsedEmail = parseEmail(message);
  const parsedPhone = parsePhone(message);
  let messageWithoutContact = message;
  if (parsedEmail) {
    messageWithoutContact = messageWithoutContact.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, " ");
  }
  if (parsedPhone) {
    messageWithoutContact = messageWithoutContact.replace(/\+?\d[\d\s().-]{7,}\d/, " ");
  }
  const parsedBudgetStatus = parseBudgetStatus(messageWithoutContact);
  const parsedBudgetCurrency = parseBudgetCurrency(messageWithoutContact);
  const messageHasNumericBudget = hasNumericBudget(messageWithoutContact);

  return {
    ...current,
    intent: parseIntent(message) || current.intent,
    project: resolveProject(current, message, pathname),
    lastPageProject: projectFromPath(pathname) || current.lastPageProject,
    budgetStatus: parsedBudgetStatus || current.budgetStatus,
    budgetText: parsedBudgetStatus ? message : current.budgetText,
    budgetCurrency: parsedBudgetCurrency || current.budgetCurrency,
    needsBudgetCurrency:
      parsedBudgetStatus === "definido" && messageHasNumericBudget && !parsedBudgetCurrency
        ? true
        : parsedBudgetCurrency
          ? false
          : current.needsBudgetCurrency,
    timeline: parseTimeline(message) || current.timeline,
    decisionRole: parseDecisionRole(message) || current.decisionRole,
    name: parsedName || current.name,
    email: parsedEmail || current.email,
    phone: parsedPhone || current.phone,
  };
}
