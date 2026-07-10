import knowledgeBase from "./knowledgeBase.json";
import { getProjectMentionState } from "./parser";
import type { KnowledgeSource, LeadBotState } from "./types";

type RetrievalDocument = {
  id: string;
  section: string;
  title: string;
  content: string;
  source_path: string;
  source_file_path: string;
  pages: number[];
  project_slug: string;
  customer_visible: boolean;
};

type KnowledgeAnswer = {
  reply: string;
  sources: KnowledgeSource[];
};

export type KnowledgePromptContext = {
  snippets: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  sources: KnowledgeSource[];
};

const DOCUMENTS = knowledgeBase.retrieval_documents as RetrievalDocument[];
const CONDITION_DATE = knowledgeBase.source_documents.condiciones_venta_juana_64_r.document_date;
const RUTA3_PRICE_DATE = knowledgeBase.source_documents.precios_locales_ruta_3.document_date;
const STOP_WORDS = new Set([
  "a",
  "al",
  "algo",
  "como",
  "con",
  "de",
  "del",
  "el",
  "en",
  "es",
  "la",
  "las",
  "lo",
  "los",
  "me",
  "mi",
  "mis",
  "para",
  "pero",
  "por",
  "que",
  "si",
  "son",
  "te",
  "tema",
  "tenes",
  "tienen",
  "un",
  "una",
  "y",
]);

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includesAny(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text));
}

function sourceFromDocument(document: RetrievalDocument): KnowledgeSource {
  return {
    id: document.id,
    title: document.title,
    sourcePath: document.source_path,
    sourceFilePath: document.source_file_path,
    pages: document.pages,
  };
}

function findDocument(id: string) {
  return DOCUMENTS.find((document) => document.id === id);
}

function sourcesFor(ids: string[]) {
  return ids.map(findDocument).filter(Boolean).map((document) => sourceFromDocument(document as RetrievalDocument));
}

function tokensFrom(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function documentMatchesProject(document: RetrievalDocument, state: LeadBotState, text: string) {
  if (state.project === "juana-64") {
    return document.project_slug === "juana-64" || document.id.startsWith("juana64_");
  }

  if (state.project === "san-luis") {
    return document.project_slug === "san-luis";
  }

  if (state.project === "villa-mercedes") {
    return document.project_slug === "villa-mercedes";
  }

  if (state.project === "locales-comerciales") {
    return document.project_slug === "locales-comerciales" || /ruta\s*3|local|locales|comercial/.test(text);
  }

  if (/villa\s*mercedes|riobamba/.test(text)) {
    return document.project_slug === "villa-mercedes";
  }

  if (/juana\s*64|juana|koslay|depto|deptos|departamento|departamentos/.test(text)) {
    return document.project_slug === "juana-64" || document.id.startsWith("juana64_");
  }

  if (/san\s*luis|jose\s*hernandez|chile/.test(text)) {
    return document.project_slug === "san-luis";
  }

  if (/ruta\s*3|local|locales|comercial|comercio|negocio/.test(text)) {
    return document.project_slug === "locales-comerciales" || document.id.startsWith("juana64_commercial");
  }

  return true;
}

function scoreDocument(document: RetrievalDocument, queryTokens: string[], text: string, state: LeadBotState) {
  const haystack = normalizeText(`${document.title} ${document.content}`);
  let score = 0;

  for (const token of queryTokens) {
    if (haystack.includes(token)) score += 1;
  }

  if (documentMatchesProject(document, state, text)) score += 3;
  if (state.project && !documentMatchesProject(document, state, text)) score -= 4;

  if (/cuantos|cuantas|cantidad|grande|tamano|tama.o|reservad|disponib|familias|modulos/.test(text)) {
    if (document.id === "juana64_public_residential_scale") score += 10;
    if (document.id === "juana64_delivery") score += 4;
  }

  if (/pet\s*friendly|perro|perros|mascota|mascotas|animal|animales|luz|luminos|\bsol\b|solead|terraza|patio|material|materiales|construccion|comodidad|comoda/.test(text)) {
    if (document.id === "juana64_public_residential_features") score += 10;
  }

  if (/precio|cuanto sale|valor|costo|financiacion|financiar|cuota|cuotas|leasing|reserva|entrega|plazo/.test(text)) {
    if (/price|precio|financi|leasing|reserva|entrega|delivery|prices/.test(document.id + " " + document.section)) {
      score += 8;
    }
  }

  if (/ubicacion|direccion|donde queda|mapa|maps/.test(text) && /location|ubicacion/.test(document.id + " " + document.section)) {
    score += 8;
  }

  return score;
}

export function getKnowledgeContextForPrompt(message: string, state: LeadBotState, limit = 6): KnowledgePromptContext | undefined {
  const text = normalizeText(`${message} ${state.messages.slice(-6).map((entry) => entry.content).join(" ")}`);
  const queryTokens = tokensFrom(text);
  if (queryTokens.length === 0 && !state.project) return undefined;

  const ranked = DOCUMENTS.filter((document) => document.customer_visible)
    .map((document) => ({
      document,
      score: scoreDocument(document, queryTokens, text, state),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((entry) => entry.document);

  if (ranked.length === 0) return undefined;

  return {
    snippets: ranked.map((document) => ({
      id: document.id,
      title: document.title,
      content: document.content,
    })),
    sources: ranked.map(sourceFromDocument),
  };
}

function isJuanaContext(message: string, state: LeadBotState) {
  const text = normalizeText(message);
  const recent = normalizeText(state.messages.slice(-6).map((entry) => entry.content).join(" "));
  return state.project === "juana-64" || /juana\s*64|juana|departamento|departamentos|depto|deptos/.test(text) || /juana\s*64|juana/.test(recent);
}

function isCommercialContext(message: string, state: LeadBotState) {
  const text = normalizeText(message);
  return state.project === "locales-comerciales" || /local|locales|comercial|comercio|negocio|ruta\s*3|km\s*0/.test(text);
}

function isRuta3SpecificContext(message: string) {
  const text = normalizeText(message);
  return /ruta\s*3|km\s*0|complejo|coradir/.test(text) && !/juana\s*64|juana/.test(text);
}

function isSanLuisContext(message: string, state: LeadBotState) {
  const mentions = getProjectMentionState(message);
  if (mentions.negated.has("san-luis")) return false;
  if (mentions.affirmed.has("villa-mercedes")) return false;

  const text = normalizeText(message);
  const recent = normalizeText(state.messages.slice(-6).map((entry) => entry.content).join(" "));
  if (mentions.affirmed.has("san-luis")) return true;
  if (state.project === "san-luis") return true;
  if (state.project && state.project !== "san-luis") return false;
  if (/ruta\s*3|juana\s*64|juana|koslay|villa\s*mercedes|riobamba/.test(text)) return false;
  return /san\s*luis|jose\s*hernandez|calle\s*chile/.test(text + " " + recent);
}

function isVillaMercedesContext(message: string, state: LeadBotState) {
  const mentions = getProjectMentionState(message);
  if (mentions.negated.has("villa-mercedes")) return false;
  if (mentions.affirmed.has("san-luis") && !mentions.affirmed.has("villa-mercedes")) return false;

  const text = normalizeText(message);
  const recent = normalizeText(state.messages.slice(-6).map((entry) => entry.content).join(" "));
  if (/villa\s*mercedes|riobamba/.test(text)) return true;
  if (state.project === "villa-mercedes") return true;
  if (state.project && state.project !== "villa-mercedes") return false;
  if (/ruta\s*3|juana\s*64|juana|koslay/.test(text)) return false;
  return /villa\s*mercedes|riobamba/.test(recent);
}

function hasSensitiveCommercialQuestion(message: string) {
  const text = normalizeText(message);
  return includesAny(text, [
    /precio|cuanto\s*sale|cuanto\s*salen|cuantosale|cuantosalen|valor|costo|lista|pozo contado/,
    /financiacion|financiar|leasing|cuotas|cuota|adelanto|interes|uva|hipoteca|alquiler|vr\b/,
    /entrega|entregan|plazo|julio|fin de 2026|cuando.*(listo|lista|entreg|obra|posesion|departamento|depto|local|unidad|proyecto)/,
    /reserva|reservar|boleto|saldo|forma de pago|pago/,
    /garantia|caucion|poliza|inversor|inversores/,
  ]);
}

function wantsDepartment(message: string) {
  return /departamento|departamentos|depto|deptos|dpto|dptos|vivienda|vivir|casa/.test(normalizeText(message));
}

function wantsPets(message: string, state?: LeadBotState) {
  const text = normalizeText(message);
  if (/pet\s*friendly|mascota|mascotas|perro|perros|animal|animales/.test(text)) return true;

  const recent = normalizeText(state?.messages.slice(-4).map((entry) => entry.content).join(" ") || "");
  const hasNewTopic =
    /como|que|cual|donde|solo|otro lado|otra zona|hay|tenes|tienen|son|caracteristica|caracteristicas|incluye|ubicacion|precio|financiacion/.test(
      text
    );
  const looksLikePetFollowup =
    /pet\s*friendly|mascota|mascotas|perro|perros|animal|animales/.test(recent) &&
    !hasNewTopic &&
    /^(?:si\s+)?(?:(?:me refiero a\s+)?(?:los|las|esos|esas)(?:\s+de)?\s+)?(?:juana\s*64|juana|juana\s+koslay|koslay|dptos?|deptos?|departamentos?)$/.test(
      text.trim()
    );

  return looksLikePetFollowup;
}

function wantsDirectPetAnswer(message: string, state?: LeadBotState) {
  const text = normalizeText(message);
  const asksOtherUnitSpecificDetails = /terraza|patio|buena luz|luminos|orientacion|material|materiales|construccion|expensa|expensas/.test(text);
  return wantsPets(message, state) && !asksOtherUnitSpecificDetails;
}

function wantsCommercialUnit(message: string) {
  return /local|locales|comercial|comercio|negocio/.test(normalizeText(message));
}

function wantsFinancing(message: string) {
  return /financiacion|financiar|leasing|cuotas|cuota|adelanto|interes|uva|hipoteca|alquiler|vr\b/.test(
    normalizeText(message)
  );
}

function wantsBenefits(message: string) {
  return /beneficio|beneficios|ventaja|ventajas|diferencial|diferenciales|que tiene de bueno/.test(normalizeText(message));
}

function wantsEquipment(message: string) {
  return /equipad|equipamiento|amoblad|incluye|incluyen|electrodomestic|heladera|anafe|horno|lavarropas|tender|calefon|termotanque|aire acondicionado/.test(
    normalizeText(message)
  );
}

function wantsRental(message: string) {
  return /alquiler|alquilar|renta|rentar|mensual/.test(normalizeText(message));
}

function wantsDelivery(message: string) {
  return /entrega|entregan|plazo|julio|fin de 2026|cuando.*(listo|lista|entreg|obra|posesion|departamento|depto|local|unidad|proyecto)/.test(
    normalizeText(message)
  );
}

function wantsReservation(message: string) {
  return /reserva|reservar|boleto|saldo|forma de pago|pago/.test(normalizeText(message));
}

function wantsInvestorGuarantee(message: string) {
  return /garantia|caucion|poliza|inversor|inversores/.test(normalizeText(message));
}

function wantsPrice(message: string) {
  return /precio|cuanto\s*sale|cuanto\s*salen|cuantosale|cuantosalen|valor|costo|lista|pozo contado|alquiler|mensual/.test(normalizeText(message));
}

function wantsPlan(message: string) {
  return /plano|estacionamiento|cochera|cocheras|acceso|vereda|frente|medida|medidas|superficie|m2|metros/.test(
    normalizeText(message)
  );
}

function wantsBathroom(message: string) {
  return /bano|banos|ba.o|toilette|sanitario|sanitarios/.test(normalizeText(message));
}

function wantsEnergyBackup(message: string) {
  return /backup|energia|energetico|luz|corte|cortes|electrico|electricidad|grupo electrogeno|continuidad/.test(
    normalizeText(message)
  );
}

function wantsLocation(message: string) {
  return /ubicaci.n|ubicaciones|direccion|direcciones|donde queda|donde estan|mapa|maps|google maps|como llegar|ver ubicaci.n/.test(
    normalizeText(message)
  );
}

function wantsAvailability(message: string) {
  return /tenes algo|tienen algo|hay algo|que tienen|que tenes|opciones|alternativas|disponib|stock|queda|quedan|unidad|unidades|proyecto/.test(
    normalizeText(message)
  );
}

function wantsMediaOrBrochure(message: string) {
  return /foto|fotos|imagen|imagenes|render|renders|folleto|pdf|brochure|plano|croquis|ver como es|verlo por dentro/.test(
    normalizeText(message)
  );
}

function wantsProjectScale(message: string) {
  return /cuantos|cuantas|cantidad|grande|tamano|tama.o|chico|reservad|disponib|familias|modulos|modulo|unidades/.test(
    normalizeText(message)
  );
}

function wantsSanLuisProjectInfo(message: string) {
  const text = normalizeText(message);
  const mentionsSanLuis = /san\s*luis|jose\s*hernandez|calle\s*chile/.test(text);
  const asksProjectInfo =
    /que tiene|que tienen|que incluye|como es|caracteristica|caracteristicas|beneficio|beneficios|vi.*pagina|pagina|info|informacion|proyecto/.test(
      text
    );

  return (
    mentionsSanLuis ||
    asksProjectInfo ||
    hasSensitiveCommercialQuestion(message) ||
    wantsLocation(message) ||
    wantsAvailability(message) ||
    wantsMediaOrBrochure(message)
  );
}

function wantsVillaMercedesProjectInfo(message: string) {
  const text = normalizeText(message);
  const mentionsVillaMercedes = /villa\s*mercedes|riobamba/.test(text);
  const asksProjectInfo =
    /que tiene|que tienen|que incluye|como es|caracteristica|caracteristicas|beneficio|beneficios|vi.*pagina|pagina|info|informacion|proyecto|monoambiente|monoambientes/.test(
      text
    );

  return (
    mentionsVillaMercedes ||
    asksProjectInfo ||
    hasSensitiveCommercialQuestion(message) ||
    wantsLocation(message) ||
    wantsAvailability(message) ||
    wantsMediaOrBrochure(message)
  );
}

function buildVillaMercedesOverviewAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Si, en la web esta el **Complejo Villa Mercedes**: complejo cerrado para compra en la Ciudad de Villa Mercedes, con 16 departamentos de 2 dormitorios, parking individual, cocina equipada, seguridad con IA y respaldo CORADIR.",
      "Tiene pagina propia: [Ver Villa Mercedes](/villa-mercedes).",
      "Para orientarte mejor: lo estas mirando para vivir o para invertir?",
    ].join("\n\n"),
    sources: sourcesFor(["villa_mercedes_project_summary", "villa_mercedes_features_units"]),
  };
}

function buildVillaMercedesLocationAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "El **Complejo Villa Mercedes** esta ubicado en Riobamba 477, Ciudad de Villa Mercedes, San Luis. La web comunica zona urbana, cerca del centro y de puntos de alto transito.",
      "Podes verlo aca: [Ver Villa Mercedes](/villa-mercedes).",
    ].join("\n\n"),
    sources: sourcesFor(["villa_mercedes_public_location"]),
  };
}

function buildVillaMercedesFeaturesAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Villa Mercedes comunica 16 departamentos de 2 dormitorios.",
      "Incluye parking individual con posibilidad de techado, cocina equipada, WiFi, vigilancia inteligente con IA las 24 hs, complejo cerrado y ubicacion a minutos del centro.",
      "Las unidades vienen equipadas con cocina con artefactos electricos, calefon electrico, aire acondicionado, iluminacion LED y bano con lavarropas y tender rebatible. El detalle final por unidad lo confirma un asesor.",
    ].join("\n\n"),
    sources: sourcesFor(["villa_mercedes_project_summary", "villa_mercedes_features_units"]),
  };
}

function buildVillaMercedesBrochureAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Podes ver la pagina de Villa Mercedes aca: [Ver Villa Mercedes](/villa-mercedes).",
      "Tambien esta el folleto publico: [Descargar folleto Villa Mercedes](/img/villa-mercedes/Folleto-vertical-Villa-Mercedes.pdf).",
    ].join("\n\n"),
    sources: sourcesFor(["villa_mercedes_brochure_link"]),
  };
}

function buildVillaMercedesCommercialDataLimitsAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Para Villa Mercedes, la web confirma el complejo cerrado con 16 departamentos de 2 dormitorios, parking individual, cocina equipada y seguridad con IA.",
      "Esa informacion todavia no la tengo: precio, cuotas, financiacion exacta, entrega cerrada y disponibilidad por unidad se confirman con asesor.",
      "¿Queres que te ponga en contacto con un asesor para consultarlo directamente?",
    ].join("\n\n"),
    sources: sourcesFor(["villa_mercedes_project_summary", "villa_mercedes_commercial_data_limits"]),
  };
}

function buildSanLuisOverviewAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Si, en la web esta el proyecto **San Luis**: compra en pozo en la Ciudad de San Luis, con 26 departamentos de 2 dormitorios, estacionamiento individual, cocina equipada, seguridad con IA y respaldo CORADIR.",
      "Tambien contempla 2 locales comerciales y tiene pagina propia: [Ver San Luis](/san-luis).",
      "Para orientarte mejor: lo estas mirando para vivir o para invertir?",
    ].join("\n\n"),
    sources: sourcesFor(["san_luis_project_summary", "san_luis_features_units", "san_luis_commercial_units"]),
  };
}

function buildSanLuisLocationAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "El proyecto **San Luis** esta ubicado en Jose Hernandez y Chile, Ciudad de San Luis.",
      "Podes verlo aca: [Ver San Luis](/san-luis).",
    ].join("\n\n"),
    sources: sourcesFor(["san_luis_public_location"]),
  };
}

function buildSanLuisFeaturesAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "San Luis comunica 26 departamentos de 2 dormitorios, con estacionamiento individual, cocina equipada, WiFi, vigilancia inteligente con IA las 24 hs y respaldo CORADIR.",
      "La web tambien menciona zona consolidada, accesos rapidos y cercania a servicios claves para la vida diaria.",
    ].join("\n\n"),
    sources: sourcesFor(["san_luis_project_summary", "san_luis_features_units"]),
  };
}

function buildSanLuisCommercialUnitsAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Si, el proyecto **San Luis** incluye 2 locales comerciales.",
      "La web los presenta para proyectos comerciales en crecimiento, con arquitectura moderna, infraestructura eficiente y seguridad gestionada con IA.",
      "Para medidas, precio o disponibilidad de cada local, conviene validarlo con un asesor.",
    ].join("\n\n"),
    sources: sourcesFor(["san_luis_commercial_units", "san_luis_commercial_data_limits"]),
  };
}

function buildSanLuisPurchaseProcessAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Para San Luis, la web comunica este proceso:",
      "- Lista de interes con prioridad comercial y eleccion de unidad.",
      "- Pre-reserva con sena para congelar condiciones y avanzar con asesoria personalizada.",
      "- Boleto y posesion con respaldo juridico y entrega planificada.",
      "",
      "Los valores, cuotas y disponibilidad se validan con un asesor.",
    ].join("\n"),
    sources: sourcesFor(["san_luis_purchase_process", "san_luis_commercial_data_limits"]),
  };
}

function buildSanLuisBrochureAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Podes ver la pagina de San Luis aca: [Ver San Luis](/san-luis).",
      "Tambien esta el folleto publico: [Descargar folleto San Luis](/img/san-luis/Folleto%20vertical%20-%20San%20Luis.pdf).",
    ].join("\n\n"),
    sources: sourcesFor(["san_luis_brochure_link"]),
  };
}

function buildSanLuisCommercialDataLimitsAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Para San Luis, la web confirma el proyecto de compra en pozo con 26 departamentos de 2 dormitorios, estacionamiento individual, cocina equipada y seguridad con IA.",
      "Esa informacion todavia no la tengo: precio, cuotas, financiacion exacta, entrega cerrada y disponibilidad por unidad se confirman con asesor.",
      "¿Queres que te ponga en contacto con un asesor para consultarlo directamente?",
    ].join("\n\n"),
    sources: sourcesFor(["san_luis_project_summary", "san_luis_commercial_data_limits"]),
  };
}

function buildCommercialLocationAnswer(message: string): KnowledgeAnswer {
  const text = normalizeText(message);
  const showRuta3 = /ruta\s*3|km\s*0|coradir|san\s*luis/.test(text) || !/juana\s*64|juana|koslay/.test(text);
  const showJuana64 = /juana\s*64|juana|koslay/.test(text) || !/ruta\s*3|km\s*0|coradir/.test(text);
  const lines = ["Las ubicaciones están cargadas en la web:"];
  const sourceIds: string[] = [];

  if (showRuta3) {
    lines.push("- **Locales CORADIR Ruta 3:** Ruta 3 km 0.6, Parque Industrial Sur, San Luis. [Ver en la web](/locales-comerciales#ruta-3).");
    sourceIds.push("ruta3_public_location");
  }

  if (showJuana64) {
    lines.push("- **Locales comerciales Juana 64:** Inocencio Guerrero 517, Juana Koslay, San Luis. [Ver en la web](/locales-comerciales#juana-64).");
    sourceIds.push("juana64_public_location");
  }

  return {
    reply: lines.join("\n"),
    sources: sourcesFor(sourceIds),
  };
}

function withCommercialValidation(reply: string) {
  return [
    reply,
    `Estos valores son orientativos segun las condiciones comerciales de referencia con fecha ${CONDITION_DATE}. Antes de tomar una decision, conviene validarlos con un asesor porque pueden cambiar segun unidad y disponibilidad.`,
  ].join("\n\n");
}

function buildPriceAnswer(message: string): KnowledgeAnswer {
  const ids = ["juana64_price_policy"];
  const showDepartments = wantsDepartment(message) || !wantsCommercialUnit(message);
  const showCommercial = wantsCommercialUnit(message) || !wantsDepartment(message);
  const lines = ["Para Juana 64, las condiciones comerciales de referencia indican:"];

  if (showDepartments) {
    ids.push("juana64_prices_departments");
    lines.push("- Departamentos: precio de lista 59.000,00 USD; precio pozo contado 47.000,00 USD.");
  }

  if (showCommercial) {
    ids.push("juana64_prices_commercial_units");
    lines.push("- Locales comerciales: precio de lista 70.000,00 USD; precio pozo contado 53.000,00 USD + IVA.");
  }

  return {
    reply: withCommercialValidation(lines.join("\n")),
    sources: sourcesFor(ids),
  };
}

function buildRuta3PriceAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Para los locales comerciales Ruta 3 de 180 m2 + IVA, los precios de referencia son:",
      "- Precio de lista: 107.000,00 USD.",
      "- Precio pozo: 85.000,00 USD.",
      "- Alquiler mensual: 690,00 USD.",
      "",
      `Estos valores son de referencia comercial al ${RUTA3_PRICE_DATE}. Antes de avanzar, conviene validarlos con un asesor porque pueden cambiar segun unidad y disponibilidad.`,
    ].join("\n"),
    sources: sourcesFor(["ruta3_commercial_prices"]),
  };
}

function buildCommercialPriceComparisonAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Para locales comerciales, hoy tengo estos valores de referencia:",
      "- Ruta 3, 180 m2 + IVA: precio de lista 107.000,00 USD; precio pozo 85.000,00 USD; alquiler mensual 690,00 USD.",
      "- Juana 64 + IVA: precio de lista 70.000,00 USD; precio pozo contado 53.000,00 USD; alquiler mensual 391,00 USD + IVA.",
      "",
      "Antes de avanzar, conviene validarlo con un asesor porque precios y disponibilidad pueden cambiar.",
    ].join("\n"),
    sources: sourcesFor(["ruta3_commercial_prices", "juana64_prices_commercial_units", "juana64_commercial_units_web_rent"]),
  };
}

function buildJuana64CommercialDetailsAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Para los locales comerciales Juana 64, la ficha comercial indica 6 locales dentro del desarrollo residencial, con 84 m2 por local y medidas de 6 m x 14 m.",
      "Estan pensados para comercio de cercania, servicios profesionales, gastronomia liviana y atencion diaria.",
      "La primera etapa figura estimada para fin de julio de 2026. Validalo con un asesor antes de avanzar porque disponibilidad y condiciones pueden cambiar.",
    ].join("\n\n"),
    sources: sourcesFor(["juana64_commercial_units_web_details"]),
  };
}

function buildJuana64CommercialBathroomAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Esa informacion todavia no la tengo para el bano de los locales de Juana 64.",
      "Si el bano es condicion necesaria para la panaderia, queres que te ponga en contacto con un asesor para validarlo sobre la unidad exacta?",
    ].join("\n\n"),
    sources: sourcesFor(["juana64_commercial_units_web_details"]),
  };
}

function buildJuana64CommercialFinancingAnswer(): KnowledgeAnswer {
  return {
    reply: withCommercialValidation(
      [
        "Para locales comerciales Juana 64, la financiacion de referencia es leasing inmobiliario hasta 96 meses, en dolares o UVA, sin costo de hipoteca, con 35% de adelanto.",
        "- 24 meses: 0% anual, alquiler 1.552,11 USD, VR 1.552,11 USD.",
        "- 48 meses: 4% anual, alquiler 841,08 USD, VR 929,40 USD.",
        "- 96 meses: 8% anual, alquiler 526,60 USD, VR 526,60 USD.",
      ].join("\n")
    ),
    sources: sourcesFor(["juana64_financing_summary", "juana64_leasing_commercial_units"]),
  };
}

function buildJuana64CommercialSummaryAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Para locales comerciales Juana 64, hoy tengo esta referencia comercial:",
      "- Precio de lista: 70.000,00 USD + IVA.",
      "- Precio pozo contado: 53.000,00 USD + IVA.",
      "- Alquiler mensual: 391,00 USD + IVA.",
      "- Medidas: 84 m2 por local, 6 m x 14 m.",
      "- Financiacion: leasing inmobiliario hasta 96 meses, en dolares o UVA, con 35% de adelanto.",
      "- Beneficio comercial: esta dentro del desarrollo residencial Juana 64, por eso puede servir para comercio de cercania, servicios y atencion diaria.",
      "",
      "Antes de avanzar, conviene validarlo con un asesor porque precios, disponibilidad y condiciones pueden cambiar segun unidad.",
    ].join("\n"),
    sources: sourcesFor([
      "juana64_prices_commercial_units",
      "juana64_commercial_units_web_rent",
      "juana64_commercial_units_web_details",
      "juana64_financing_summary",
      "juana64_leasing_commercial_units",
    ]),
  };
}

function buildJuana64CommercialRentAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Para locales comerciales Juana 64, el alquiler mensual de referencia es 391,00 USD + IVA.",
      "Tambien figuran precio pozo 53.000,00 USD + IVA y precio de lista 70.000,00 USD + IVA.",
      "Es informacion comercial orientativa: disponibilidad, alquiler final y condiciones se validan con un asesor.",
    ].join("\n\n"),
    sources: sourcesFor(["juana64_commercial_units_web_rent", "juana64_prices_commercial_units"]),
  };
}

function buildJuanaResidentialRentAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Esa informacion todavia no la tengo para alquiler mensual residencial de departamentos Juana 64.",
      "Juana 64 se trabaja principalmente como compra en pozo/leasing. Si lo miras como inversion para alquilar, queres que te ponga en contacto con un asesor para validar renta estimada, expensas y disponibilidad?",
    ].join("\n\n"),
    sources: sourcesFor(["juana64_public_page_link"]),
  };
}

function buildJuana64PetsAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Si, los departamentos de Juana 64 figuran como pet friendly.",
      "Esa informacion todavia no la tengo para el reglamento de convivencia ni la cantidad exacta de mascotas o perros por unidad.",
      "¿Queres que te ponga en contacto con un asesor para consultarlo directamente?",
    ].join("\n\n"),
    sources: sourcesFor(["juana64_public_residential_features"]),
  };
}

function buildPetFriendlyHousingOptionsAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Para vivir con perros, la opcion que tengo confirmada como pet friendly es **Juana 64**, en Juana Koslay, con departamentos de 2 dormitorios.",
      "Tambien esta **San Luis**, en la Ciudad de San Luis, con departamentos de 2 dormitorios, estacionamiento individual, cocina equipada y seguridad con IA.",
      "Esa informacion todavia no la tengo para reglamento o cantidad exacta de mascotas por unidad. ¿Queres que te ponga en contacto con un asesor para consultarlo directamente?",
    ].join("\n\n"),
    sources: sourcesFor(["juana64_public_residential_features", "san_luis_project_summary"]),
  };
}

function buildJuana64ScaleAnswer(message: string): KnowledgeAnswer {
  const showCommercialUnits = wantsCommercialUnit(message) || /local|locales/.test(normalizeText(message));
  const showDepartments = wantsDepartment(message) || !showCommercialUnits;
  const lines: string[] = [];
  const sourceIds: string[] = [];

  if (showDepartments) {
    lines.push("Juana 64 muestra 64 departamentos en total: 44 disponibles y 20 reservados, segun la pagina.");
    sourceIds.push("juana64_public_residential_scale");
  }

  if (showCommercialUnits) {
    lines.push("La landing de locales comerciales informa 6 locales en Juana 64, de 84 m2 por local y medidas de 6 m x 14 m.");
    sourceIds.push("juana64_commercial_units_web_details");
  }

  lines.push("La disponibilidad real por unidad conviene validarla con un asesor porque puede cambiar.");

  return {
    reply: lines.join("\n\n"),
    sources: sourcesFor(sourceIds),
  };
}

function buildRuta3PlanAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Del plano de Ruta 3 se extrae que el proyecto muestra 4 locales comerciales, frente indicado de 6,00 m por local, banos, cocheras/estacionamientos, acceso vehicular, acceso peatonal, sector de seguridad, jardin y vereda.",
      "El plano rotula superficies aproximadas de 168,63 m2 por unidad, mientras que la comunicacion comercial mantiene 180 m2 por local.",
    ].join("\n\n"),
    sources: sourcesFor(["ruta3_commercial_plan"]),
  };
}

function buildRuta3EnergyBackupAnswer(): KnowledgeAnswer {
  return {
    reply: [
      "Si, los locales Ruta 3 incorporan backup energetico durante el primer ano.",
      "El argumento comercial es fuerte: ayuda a reducir el impacto de cortes de luz y sostener operacion, medios de pago, iluminacion, climatizacion, seguridad y atencion al cliente.",
      "Lo ideal es validarlo con un asesor junto con la unidad disponible y las condiciones vigentes.",
    ].join("\n\n"),
    sources: sourcesFor(["ruta3_energy_backup"]),
  };
}

function buildFinancingAnswer(message: string): KnowledgeAnswer {
  const ids = ["juana64_financing_summary"];
  const showDepartments = wantsDepartment(message) || !wantsCommercialUnit(message);
  const showCommercial = wantsCommercialUnit(message) || !wantsDepartment(message);
  const lines = [
    "Para Juana 64, la financiacion de referencia es leasing inmobiliario hasta 96 meses, en dolares o UVA, sin costo de hipoteca, con 35% de adelanto.",
  ];

  if (showDepartments) {
    ids.push("juana64_leasing_departments");
    lines.push("- Departamentos: 24 meses 0% con alquiler 1.597,92 USD; 48 meses 4% anual con alquiler 865,91 USD; 96 meses 8% anual con alquiler 542,14 USD.");
  }

  if (showCommercial) {
    ids.push("juana64_leasing_commercial_units");
    lines.push("- Locales comerciales + IVA 21%: 24 meses 0% con alquiler 1.552,11 USD; 48 meses 4% anual con alquiler 841,08 USD; 96 meses 8% anual con alquiler 526,60 USD.");
  }

  return {
    reply: withCommercialValidation(lines.join("\n")),
    sources: sourcesFor(ids),
  };
}

function buildDeliveryAnswer(): KnowledgeAnswer {
  return {
    reply: withCommercialValidation(
      "Para Juana 64, el plazo de entrega estimado es de 10 meses para la primera etapa: dos modulos de 16 departamentos y todos los locales, a fin de julio de 2026. Los demas modulos se entregarian antes de fin de 2026 segun el orden de fecha de compra."
    ),
    sources: sourcesFor(["juana64_delivery"]),
  };
}

function buildReservationAnswer(): KnowledgeAnswer {
  return {
    reply: withCommercialValidation(
      "Para Juana 64, todas las compras requieren 3% de reserva. En compra en pozo adelantada, el saldo se abona en 30 dias. En compra terminado, se abona 10% al boleto a los 30 dias y saldo contra entrega. En leasing: 3% a la reserva, 10% a los 60 dias, 22% contra entrega y el saldo en cuotas pactadas."
    ),
    sources: sourcesFor(["juana64_reservation_payment"]),
  };
}

function buildInvestorGuaranteeAnswer(): KnowledgeAnswer {
  return {
    reply: withCommercialValidation(
      "Para inversores que compran en pozo en Juana 64, las condiciones comerciales indican garantia de poliza de caucion por el total del dinero aportado, con un 3% de incremento."
    ),
    sources: sourcesFor(["juana64_investor_guarantee"]),
  };
}

export function shouldUseDirectKnowledgeAnswer(message: string, state: LeadBotState) {
  const hasSanLuisAnswerIntent = isSanLuisContext(message, state) && wantsSanLuisProjectInfo(message);
  const hasVillaMercedesAnswerIntent = isVillaMercedesContext(message, state) && wantsVillaMercedesProjectInfo(message);

  return (
    wantsDirectPetAnswer(message, state) ||
    hasSensitiveCommercialQuestion(message) ||
    wantsPlan(message) ||
    wantsProjectScale(message) ||
    wantsBathroom(message) ||
    wantsEnergyBackup(message) ||
    wantsLocation(message) ||
    hasSanLuisAnswerIntent ||
    hasVillaMercedesAnswerIntent
  );
}

export function buildKnowledgeBaseAnswer(message: string, state: LeadBotState): KnowledgeAnswer | undefined {
  const hasSanLuisAnswerIntent = isSanLuisContext(message, state) && wantsSanLuisProjectInfo(message);
  const hasVillaMercedesAnswerIntent = isVillaMercedesContext(message, state) && wantsVillaMercedesProjectInfo(message);
  const wantsHousingPetOptions =
    wantsDirectPetAnswer(message, state) &&
    wantsDepartment(message) &&
    (state.project === "san-luis" || /que tenes|opciones|alternativas|otro lado|otra zona|casa|vivir|vivienda/.test(normalizeText(message)));

  if (
    !hasSensitiveCommercialQuestion(message) &&
    !wantsPlan(message) &&
    !wantsDirectPetAnswer(message, state) &&
    !wantsProjectScale(message) &&
    !wantsBathroom(message) &&
    !wantsEnergyBackup(message) &&
    !wantsLocation(message) &&
    !hasSanLuisAnswerIntent &&
    !hasVillaMercedesAnswerIntent
  ) {
    return undefined;
  }

  if (wantsHousingPetOptions) return buildPetFriendlyHousingOptionsAnswer();

  if (hasVillaMercedesAnswerIntent) {
    if (wantsLocation(message)) return buildVillaMercedesLocationAnswer();
    if (wantsMediaOrBrochure(message)) return buildVillaMercedesBrochureAnswer();
    if (wantsPrice(message) || wantsFinancing(message) || wantsDelivery(message) || wantsReservation(message)) {
      return buildVillaMercedesCommercialDataLimitsAnswer();
    }
    if (wantsPlan(message) || wantsBenefits(message) || wantsProjectScale(message) || wantsEquipment(message)) {
      return buildVillaMercedesFeaturesAnswer();
    }
    return buildVillaMercedesOverviewAnswer();
  }

  if (hasSanLuisAnswerIntent) {
    if (wantsLocation(message)) return buildSanLuisLocationAnswer();
    if (wantsMediaOrBrochure(message)) return buildSanLuisBrochureAnswer();
    if (wantsPrice(message) || wantsFinancing(message) || wantsDelivery(message)) {
      return buildSanLuisCommercialDataLimitsAnswer();
    }
    if (wantsReservation(message)) return buildSanLuisPurchaseProcessAnswer();
    if (wantsCommercialUnit(message) && !wantsDepartment(message)) return buildSanLuisCommercialUnitsAnswer();
    if (wantsPlan(message) || wantsBenefits(message) || wantsEquipment(message)) return buildSanLuisFeaturesAnswer();
    return buildSanLuisOverviewAnswer();
  }

  if ((isCommercialContext(message, state) || isJuanaContext(message, state)) && wantsLocation(message)) {
    return buildCommercialLocationAnswer(message);
  }

  if (isCommercialContext(message, state) && wantsEnergyBackup(message)) {
    return buildRuta3EnergyBackupAnswer();
  }

  if (isCommercialContext(message, state) && wantsPlan(message) && isRuta3SpecificContext(message)) {
    return buildRuta3PlanAnswer();
  }

  if (isCommercialContext(message, state) && isJuanaContext(message, state) && wantsCommercialUnit(message) && wantsBathroom(message)) {
    return buildJuana64CommercialBathroomAnswer();
  }

  if (isCommercialContext(message, state) && isJuanaContext(message, state) && wantsCommercialUnit(message) && wantsPlan(message)) {
    return buildJuana64CommercialDetailsAnswer();
  }

  if (isCommercialContext(message, state) && isJuanaContext(message, state) && wantsCommercialUnit(message) && wantsRental(message)) {
    return buildJuana64CommercialRentAnswer();
  }

  if (isCommercialContext(message, state) && wantsPrice(message) && isRuta3SpecificContext(message)) {
    return buildRuta3PriceAnswer();
  }

  if (isCommercialContext(message, state) && isJuanaContext(message, state) && (wantsPrice(message) || wantsBenefits(message)) && wantsFinancing(message)) {
    return buildJuana64CommercialSummaryAnswer();
  }

  if (isCommercialContext(message, state) && isJuanaContext(message, state) && wantsFinancing(message)) {
    return buildJuana64CommercialFinancingAnswer();
  }

  if (isCommercialContext(message, state) && isJuanaContext(message, state) && wantsPrice(message)) {
    return buildJuana64CommercialRentAnswer();
  }

  if (isCommercialContext(message, state) && wantsPrice(message) && !isJuanaContext(message, state)) {
    return buildCommercialPriceComparisonAnswer();
  }

  if (!isJuanaContext(message, state)) return undefined;

  if (wantsDirectPetAnswer(message, state)) return buildJuana64PetsAnswer();
  if (wantsProjectScale(message) && (wantsDepartment(message) || wantsCommercialUnit(message))) {
    return buildJuana64ScaleAnswer(message);
  }
  if (wantsRental(message) && wantsDepartment(message)) return buildJuanaResidentialRentAnswer();
  if (wantsPrice(message)) return buildPriceAnswer(message);
  if (wantsFinancing(message)) return buildFinancingAnswer(message);
  if (wantsDelivery(message)) return buildDeliveryAnswer();
  if (wantsReservation(message)) return buildReservationAnswer();
  if (wantsInvestorGuarantee(message)) return buildInvestorGuaranteeAnswer();

  return undefined;
}
