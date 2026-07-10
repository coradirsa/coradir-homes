import { getProjectMentionState } from "./parser";
import type { LeadBotState } from "./types";

const PROJECT_SUMMARIES: Record<string, string> = {
  "locales-comerciales":
    "Locales Comerciales agrupa oportunidades en Ruta 3 km 0.6 y Juana 64, con opciones de compra, alquiler o leasing. Ruta 3 suma backup energetico como diferencial operativo; Juana 64 suma locales dentro de un desarrollo residencial.",
  "juana-64":
    "Juana 64 es un proyecto en Juana Koslay con departamentos de 2 dormitorios y locales comerciales, pensado para vivienda, inversion urbana o comercio de cercania.",
  "la-torre-ii":
    "La Torre II es una propuesta residencial con unidades modernas, amenities y foco en quienes buscan comprar o invertir en San Luis.",
  "san-luis":
    "San Luis es un proyecto residencial en la Ciudad de San Luis, de compra en pozo, con 26 departamentos de 2 dormitorios, estacionamiento individual, cocina equipada, seguridad con IA y 2 locales comerciales.",
  "villa-mercedes":
    "Villa Mercedes es un complejo cerrado de departamentos para compra en la Ciudad de Villa Mercedes, con 16 departamentos de 2 dormitorios, parking individual, cocina equipada, seguridad con IA y respaldo CORADIR.",
  terrenos:
    "Terrenos esta orientado a quienes buscan lote o tierra para desarrollar, invertir o proyectar a mediano plazo.",
  inversiones:
    "Inversiones esta pensado para perfiles que comparan rentabilidad, resguardo de capital y oportunidades inmobiliarias administradas por Coradir Homes.",
};

const PROJECT_LABELS: Record<string, string> = {
  "locales-comerciales": "Locales Comerciales",
  "juana-64": "Juana 64",
  "la-torre-ii": "La Torre II",
  "san-luis": "San Luis",
  "villa-mercedes": "Villa Mercedes",
  terrenos: "Terrenos",
  inversiones: "Inversiones",
};

const PROJECT_LOCATIONS = {
  juana64: {
    address: "Inocencio Guerrero 517, Juana Koslay, San Luis",
    pageUrl: "/juana-64#ubicacion",
  },
  localesRuta3: {
    label: "Locales CORADIR Ruta 3",
    address: "Ruta 3 km 0.6, Parque Industrial Sur, San Luis",
    pageUrl: "/locales-comerciales#ruta-3",
  },
  localesJuana64: {
    label: "Locales comerciales Juana 64",
    address: "Inocencio Guerrero 517, Juana Koslay, San Luis",
    pageUrl: "/locales-comerciales#juana-64",
  },
  sanLuis: {
    address: "Jose Hernandez y Chile, Ciudad de San Luis",
    pageUrl: "/san-luis",
    brochureUrl: "/img/san-luis/Folleto%20vertical%20-%20San%20Luis.pdf",
  },
  villaMercedes: {
    address: "Riobamba 477, Ciudad de Villa Mercedes, San Luis",
    pageUrl: "/villa-mercedes",
    brochureUrl: "/img/villa-mercedes/Folleto-vertical-Villa-Mercedes.pdf",
  },
};

function projectLabel(project?: string) {
  return project ? PROJECT_LABELS[project] || project : undefined;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokensFrom(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function hasAnyToken(tokens: string[], roots: string[]) {
  return tokens.some((token) => roots.some((root) => token.startsWith(root)));
}

function hasAnyPhrase(text: string, phrases: string[]) {
  return phrases.some((phrase) => text.includes(phrase));
}

function hasToken(tokens: string[], value: string) {
  return tokens.includes(value);
}

function hasQuestionAboutAvailability(text: string) {
  return (
    /\bque\s+(tenes|tienen|hay|ofrecen|manejan)\b/.test(text) ||
    /\bque\s+(opciones|alternativas|proyectos|propiedades|casas|viviendas|departamentos|deptos|locales|inversiones)\s+(tenes|tienen|hay|ofrecen|manejan)\b/.test(text) ||
    /\b(hay|tienen|tenes)\s+(algo|opciones|alternativas|proyectos|propiedades|casas|viviendas|locales)\b/.test(text)
  );
}

function isProjectQuestionFromAssistant(content: string) {
  const text = normalizeText(content);
  return (
    text.includes("tenes algo en mente") ||
    text.includes("compare rapido las opciones") ||
    text.includes("opciones principales")
  );
}

function looksLikeSpecificAnswer(message: string) {
  const text = normalizeText(message);
  return (
    /@/.test(message) ||
    /\+?\d[\d\s().-]{7,}\d/.test(message) ||
    /\d+\s*k|\d{2,}/i.test(message) ||
    /credito|prestamo|financiacion|financiar|dolar|dolares|pesos|usd|ars/.test(text) ||
    /ahora|urgente|mes|meses|ano|años|sin apuro|mas adelante/.test(text) ||
    /yo decido|decido|pareja|familia|socio|socios|otra persona|para mi hijo|para mi hija/.test(text)
  );
}

export function isProjectOverviewRequest(message: string) {
  const text = normalizeText(message);
  const tokens = tokensFrom(message);

  const requestRoots = [
    "cont",
    "explic",
    "mostr",
    "ofrec",
    "ver",
    "compar",
    "recomend",
    "orient",
    "decime",
    "decir",
    "pasame",
    "inform",
    "detalle",
  ];
  const objectRoots = [
    "opcion",
    "alternativ",
    "proyect",
    "propiedad",
    "casa",
    "viviend",
    "departament",
    "depto",
    "local",
    "inversion",
    "terreno",
    "disponib",
  ];
  const uncertaintyPhrases = [
    "no se",
    "nose",
    "ni idea",
    "no tengo idea",
    "no conozco",
    "estoy viendo",
    "estoy mirando",
    "todavia estoy mirando",
  ];
  const uncertaintyRoots = ["duda", "uhm", "mmm", "mirando"];

  const hasRequestVerb = hasAnyToken(tokens, requestRoots);
  const hasObject = hasAnyToken(tokens, objectRoots);
  const asksForOneOrMany =
    hasToken(tokens, "cada") ||
    hasToken(tokens, "todos") ||
    hasToken(tokens, "todas") ||
    hasToken(tokens, "cuales") ||
    text.includes("un poco") ||
    hasPhraseForRecommendation(text);
  const isUncertain = hasAnyPhrase(text, uncertaintyPhrases) || hasAnyToken(tokens, uncertaintyRoots);

  return (
    hasQuestionAboutAvailability(text) ||
    (hasRequestVerb && hasObject) ||
    (hasRequestVerb && asksForOneOrMany) ||
    (isUncertain && (hasObject || asksForOneOrMany))
  );
}

function hasPhraseForRecommendation(text: string) {
  return (
    text.includes("que me conviene") ||
    text.includes("cual me conviene") ||
    text.includes("por donde empiezo") ||
    text.includes("por donde arrancar") ||
    text.includes("recomendame")
  );
}

function isLowInformationUncertainty(message: string) {
  const text = normalizeText(message);
  const tokens = tokensFrom(message);

  if (
    hasAnyPhrase(text, [
      "no se",
      "nose",
      "ni idea",
      "no tengo idea",
      "no conozco",
      "decime vos",
      "recomendame",
      "orientame",
    ])
  ) {
    return true;
  }

  return tokens.length <= 5 && hasAnyToken(tokens, ["mmm", "uhm", "uhmm", "nose", "duda"]);
}

export function shouldShowProjectOverview(message: string, state: LeadBotState) {
  if (isProjectOverviewRequest(message)) return true;

  if (!state.missingFields.includes("project")) return false;
  if (looksLikeSpecificAnswer(message)) return false;

  const previousAssistant = [...state.messages].reverse().find((entry) => entry.role === "assistant");
  if (!previousAssistant || !isProjectQuestionFromAssistant(previousAssistant.content)) return false;

  const tokens = tokensFrom(message);
  const hasUsefulSpecificToken = hasAnyToken(tokens, [
    "complejo",
    "juana",
    "inversion",
    "terreno",
    "local",
    "viviend",
    "casa",
    "departament",
    "compr",
    "alquil",
  ]);

  return (isLowInformationUncertainty(message) || tokens.length <= 10) && !hasUsefulSpecificToken;
}

export function buildProjectOverviewReply() {
  return [
    "Claro. Te resumo las opciones principales:",
    "",
    `- **Locales Comerciales:** ${PROJECT_SUMMARIES["locales-comerciales"]}`,
    "",
    `- **Juana 64:** ${PROJECT_SUMMARIES["juana-64"]}`,
    "",
    `- **San Luis:** ${PROJECT_SUMMARIES["san-luis"]}`,
    "",
    `- **Villa Mercedes:** ${PROJECT_SUMMARIES["villa-mercedes"]}`,
    "",
    `- **Inversiones:** ${PROJECT_SUMMARIES.inversiones}`,
    "",
    "Para orientarte mejor: buscas vivienda, local comercial o inversion?",
  ].join("\n");
}

export function isGreetingOnlyRequest(message: string) {
  const text = normalizeText(message).replace(/[¿?¡!.,;:]/g, " ").replace(/\s+/g, " ").trim();
  const hasBusinessIntent =
    /comprar|alquilar|invertir|departamento|depto|dpto|casa|local|precio|financiacion|ubicacion|proyecto|san luis|villa mercedes|riobamba|juana|koslay|terreno/.test(
      text
    );

  if (!hasBusinessIntent && /^hola\b/.test(text) && /todo bien|como estas/.test(text)) {
    return true;
  }

  return /^(hola|buen dia|buenas|buenas tardes|buenas noches|hola todo bien|hola como estas|como estas|todo bien)[?!. ]*$/.test(
    text
  );
}

export function buildGreetingReply(state: LeadBotState) {
  if (state.project === "juana-64") {
    return "Hola, todo bien. Si queres, te cuento sobre Juana 64 en Juana Koslay: departamentos, locales, ubicacion o formas de avanzar.";
  }

  if (state.project === "san-luis") {
    return "Hola, todo bien. Si queres, te cuento sobre el proyecto San Luis: departamentos, ubicacion, folleto o formas de avanzar.";
  }

  if (state.project === "villa-mercedes") {
    return "Hola, todo bien. Si queres, te cuento sobre el Complejo Villa Mercedes: departamentos de 2 dormitorios, ubicacion, folleto o formas de avanzar.";
  }

  if (state.project === "locales-comerciales") {
    return "Hola, todo bien. Si queres, te cuento sobre los locales comerciales de Ruta 3 y Juana 64.";
  }

  return "Hola, todo bien. Decime si estas buscando vivienda, local comercial, inversion o informacion de algun proyecto puntual.";
}

export function isConfusionAboutPreviousReply(message: string) {
  const text = normalizeText(message).trim();
  return (
    /^(eh+|eh+\?|que\?|que decis|de que hablas|de que estas hablando|por que decis eso|porque decis eso|no entiendo|me perdi)[?!. ]*$/.test(
      text
    ) || /que te pasa|de que te reis|por que te reis|porque te reis|por que.*ofrec|porque.*ofrec|si no sabes|si no tenes ese dato/.test(text)
  );
}

export function buildConfusionRepairReply(state: LeadBotState) {
  if (state.project === "juana-64") {
    return "Perdon, me adelante con un dato que no tenia confirmado. De Juana 64 puedo contarte lo confirmado: departamentos de 2 dormitorios, cocina equipada, estacionamiento, conectividad, seguridad con IA y espacios comunes. Terraza, patio o detalles por unidad los tiene que validar un asesor.";
  }

  if (state.project === "san-luis") {
    return "Perdon, me adelante con el contexto. Si estas mirando San Luis, puedo contarte del proyecto, ubicacion, folleto o formas de avanzar.";
  }

  return "Perdon, me adelante con el contexto. Decime que estas buscando y te oriento desde ahi.";
}

function hasSpecificFactIntent(message: string) {
  const text = normalizeText(message);

  return (
    isPriceQuestion(message) ||
    isFinancingQuestion(message) ||
    isPurchaseProcessQuestion(message) ||
    isProjectPageQuestion(message) ||
    isHumanContactRequest(message) ||
    /ubicaci.n|direccion|donde queda|donde estan|mapa|maps|google maps|como llegar/.test(text) ||
    /entrega|entregan|plazo|obra|avance|cuando estaria|cuando esta|posesion/.test(text) ||
    /reserva|reservar|boleto|saldo|forma de pago|pago/.test(text) ||
    /garantia|caucion|poliza/.test(text) ||
    /disponib|stock|queda|quedan|unidad libre|unidades libres/.test(text)
  );
}

function isGenericInterestRequest(message: string, state: LeadBotState) {
  const text = normalizeText(message);

  const genericInterest =
    /me interesa|estoy interesado|estoy interesada|quiero saber mas|quisiera saber mas|quiero mas info|quisiera mas info|quiero informacion|quisiera informacion|podrias informarme|podrian informarme|me pueden informar|vengo del pop|vi el proyecto|vi su anuncio|quiero que me contacten|consulta.*info|info sobre/.test(
      text
    );
  const greetingOnProjectPage =
    Boolean(state.project) && /^(hola|buen dia|buenas|buenas tardes|buenas noches)[!. ]*$/.test(text.trim());

  return (genericInterest || greetingOnProjectPage) && !hasSpecificFactIntent(message);
}

export function buildProjectIntroReply(message: string, state: LeadBotState) {
  if (!isGenericInterestRequest(message, state)) return undefined;

  if (state.project === "juana-64") {
    return [
      "Te cuento rapido: Juana 64 es el proyecto en Juana Koslay con departamentos de 2 dormitorios y locales comerciales dentro del desarrollo.",
      "Para vivienda, la idea es mirar unidad, forma de pago y plazo. Para inversion, conviene revisar si buscas renta futura, resguardo de capital o local comercial.",
      "Para orientarte sin mezclar opciones: estas mirando departamento para vivir, inversion o local comercial?",
    ].join("\n\n");
  }

  if (state.project === "locales-comerciales") {
    return [
      "Te cuento rapido: hoy Locales Comerciales agrupa Ruta 3 km 0.6 y locales Juana 64.",
      "Ruta 3 apunta a locales de mayor superficie con backup energetico; Juana 64 apunta a locales dentro de un desarrollo residencial en Juana Koslay.",
      "Queres que compare precios, ubicacion o forma de pago?",
    ].join("\n\n");
  }

  if (state.project === "san-luis") {
    return [
      "Te cuento rapido: San Luis es un proyecto de compra en pozo en la Ciudad de San Luis, con 26 departamentos de 2 dormitorios, estacionamiento individual, cocina equipada y seguridad con IA.",
      "Tambien incluye 2 locales comerciales y tiene folleto en la web.",
      "Estas mirando para vivir, invertir o queres que te pase el link del proyecto?",
    ].join("\n\n");
  }

  if (state.project === "villa-mercedes") {
    return [
      "Te cuento rapido: Villa Mercedes es un complejo cerrado para compra en la Ciudad de Villa Mercedes, con 16 departamentos de 2 dormitorios.",
      "Incluye parking individual con posibilidad de techado, cocina equipada, WiFi y seguridad con IA, y tiene folleto en la web.",
      "Estas mirando para vivir, invertir o queres que te pase el link del proyecto?",
    ].join("\n\n");
  }

  if (state.project === "inversiones") {
    return [
      "Para inversion conviene separar objetivo y ticket: renta, resguardo de capital o compra para reventa/alquiler.",
      "Podemos mirar Juana 64, Locales Comerciales o una alternativa puntual segun plazo y presupuesto.",
      "Estas pensando en vivienda, local comercial o comparar ambas?",
    ].join("\n\n");
  }

  return buildProjectOverviewReply();
}

export function isProjectScopeQuestion(message: string) {
  const text = normalizeText(message);
  return (
    /solo\s+(?:en\s+)?(juana|juana\s*koslay|juana\s*kolay|koslay|kolay)|nada mas.*(juana|koslay|kolay)|unicamente.*(juana|koslay|kolay)/.test(
      text
    ) || (/otro lado|otra zona|otro lugar/.test(text) && /departamento|departamentos|depto|deptos|dpto|dptos|casa|casas/.test(text))
  );
}

export function buildProjectScopeReply() {
  return [
    "No solo Juana Koslay.",
    "Para vivienda, en la web estan **Juana 64** en Juana Koslay y **San Luis** en la Ciudad de San Luis.",
    "Juana 64 comunica departamentos de 2 dormitorios, cocina equipada, estacionamiento individual, seguridad/conectividad, pileta y espacios verdes. San Luis comunica departamentos de 2 dormitorios con estacionamiento individual, cocina equipada y seguridad con IA.",
    "Tambien tenemos proyectos terminados, como **La Torre II**. Si queres consultar disponibilidad, te puedo poner en contacto con un asesor.",
    "Estas buscando comprar o alquilar?",
  ].join("\n\n");
}

export function isJuanaKoslayOptionsRequest(message: string) {
  const text = normalizeText(message);
  return (
    /juana\s*koslay|juana\s*64|juana/.test(text) &&
    /que\s+(tenes|tienen|hay|ofrecen)|queria saber|quiero saber|contame|opciones|informacion|info/.test(text)
  );
}

export function buildJuanaKoslayOptionsReply() {
  return [
    "En Juana Koslay esta **Juana 64**.",
    "Tiene departamentos de 2 dormitorios y locales comerciales dentro del desarrollo.",
    "Para vivienda, inversion o local comercial conviene separar el objetivo para no mezclar opciones.",
    "Puedo contarte ubicacion, caracteristicas, precios/condiciones comerciales o el link del proyecto. Que queres ver primero?",
  ].join("\n\n");
}

export function buildCommercialUseCaseReply(message: string, state: LeadBotState) {
  const text = normalizeText(message);
  const asksCommercial = state.project === "locales-comerciales" || /local|locales|comercial|negocio|comercio/.test(text);
  const hasBusinessUse = /panaderia|cafeteria|gastro|gastronomia|almacen|kiosco|farmacia|oficina|showroom|servicio|servicios/.test(text);

  if (!asksCommercial || !hasBusinessUse) return undefined;

  if (/panaderia|cafeteria|gastro|gastronomia/.test(text)) {
    return [
      "Para una panaderia conviene mirar dos cosas: flujo de gente y zona de consumo diario.",
      "Juana 64 puede servir para comercio de cercania dentro de un desarrollo residencial en Juana Koslay. Ruta 3 tiene otro perfil: corredor comercial con mas paso vehicular.",
      "Si buscas algo mas de cercania/barrio, miraria primero Juana 64. Queres que te compare ubicacion, medidas y forma de pago?",
    ].join("\n\n");
  }

  return [
    "Para ese rubro conviene comparar ubicacion, flujo esperado y forma de ingreso.",
    "Locales Comerciales tiene dos perfiles: Ruta 3 para corredor comercial y Juana 64 para comercio de cercania dentro del desarrollo residencial.",
    "Queres priorizar zona residencial/cercania o paso vehicular?",
  ].join("\n\n");
}

export function buildCommercialLocationPreferenceReply(message: string, state: LeadBotState) {
  const text = normalizeText(message);
  const recent = normalizeText(state.messages.slice(-6).map((entry) => entry.content).join(" "));
  const isCommercialConversation =
    state.project === "locales-comerciales" || /local|locales|comercial|negocio|panaderia/.test(text + " " + recent);
  const asksCentral =
    /centrica|centrico|centro|zona centrica|zona comercial|mas cerca|cerca del centro|mejor ubicacion/.test(text);

  if (!isCommercialConversation || !asksCentral) return undefined;

  if (/juana\s*64|ruta\s*3/.test(text) && /mas centr/.test(text)) {
    return [
      "No lo afirmaria como 'mas centrico' de forma absoluta.",
      "Son ubicaciones distintas: **Juana 64** esta en Inocencio Guerrero 517, Juana Koslay, dentro de un desarrollo residencial; **Ruta 3** esta en Ruta 3 km 0.6, Parque Industrial Sur, con perfil de corredor comercial.",
      "Para una panaderia, Juana 64 puede tener mas sentido si buscas cercania residencial; Ruta 3 puede servir mas si priorizas paso vehicular.",
    ].join("\n\n");
  }

  return [
    "Si buscas una zona mas de cercania/residencial, miraria primero los locales de **Juana 64**.",
    "Si priorizas paso vehicular y perfil de corredor comercial, miraria **Ruta 3 km 0.6**.",
    "No lo definiria solo como 'centrico': conviene elegir segun el tipo de publico que queres para la panaderia.",
  ].join("\n\n");
}

function isFeatureQuestion(message: string) {
  const text = normalizeText(message);

  return /como son|departamento|departamentos|depto|deptos|dpto|dptos|caracteristica|caracteristicas|que incluye|incluye|equipamiento|equipado|ambiente|ambientes|dormitorio|dormitorios|cocina|placard|termotanque|anafe|cochera|estacionamiento|pileta|piscina|pet\s*friendly|mascota|mascotas|perro|perros|animal|animales|expensa|expensas|seguridad|internet|conectividad|panel|paneles|energia|luz|luminos|solead|\bsol\b|terraza|patio|material|materiales|construccion|bateria|baterias|amenity|amenities|servicios|comodidad|comodidades/.test(
    text
  );
}

export function buildProjectFeatureReply(message: string, state: LeadBotState) {
  if (!isFeatureQuestion(message)) return undefined;

  const text = normalizeText(message);
  const asksExpenses = /expensa|expensas/.test(text);
  const asksPets = /pet\s*friendly|mascota|mascotas|perro|perros|animal|animales/.test(text);
  const asksTerraceOrPatio = /terraza|patio/.test(text);
  const asksLight = /buena luz|luminos|solead|\bsol\b|luz natural/.test(text);
  const asksMaterials = /material|materiales|construccion|constructivo|ladrillo|hormigon/.test(text);
  const asksCommercial =
    state.project === "locales-comerciales" || /local|locales|comercial|comercio|negocio|ruta\s*3/.test(text);
  const asksResidential =
    state.project === "juana-64" ||
    state.project === "san-luis" ||
    /departamento|departamentos|depto|deptos|vivienda|dormitorio|dormitorios|cocina|pileta|pet\s*friendly|mascota|perro|perros|expensa|terraza|patio|luz|material/.test(text);

  if (state.project === "san-luis") {
    if (asksExpenses || asksPets) {
      return [
        "Para San Luis esa informacion todavia no la tengo.",
        "Del proyecto te puedo contar que tiene 26 departamentos de 2 dormitorios, estacionamiento individual, cocina equipada, WiFi, seguridad con IA y 2 locales comerciales.",
        "Para reglamento, expensas o condiciones por unidad, queres que te ponga en contacto con un asesor para consultarlo directamente?",
      ].join("\n\n");
    }

    if (asksCommercial && !/departamento|departamentos|depto|deptos|vivienda|vivir|hogar/.test(text)) {
      return [
        "San Luis incluye 2 locales comerciales dentro del proyecto.",
        "La web los comunica para proyectos comerciales en crecimiento, con arquitectura moderna, infraestructura eficiente y seguridad gestionada con IA.",
        "Medidas, precio y disponibilidad de cada local los valida un asesor.",
      ].join("\n\n");
    }

    return [
      "San Luis comunica departamentos de 2 dormitorios para compra en pozo, con estacionamiento individual, cocina equipada, WiFi y vigilancia inteligente con IA las 24 hs.",
      "Tambien incluye 2 locales comerciales y respaldo CORADIR.",
      "Podes verlo aca: [Ver San Luis](/san-luis).",
    ].join("\n\n");
  }

  if (state.project === "villa-mercedes") {
    if (asksExpenses || asksPets) {
      return [
        "Para Villa Mercedes esa informacion todavia no la tengo.",
        "Del proyecto te puedo contar que es un complejo cerrado con 16 departamentos de 2 dormitorios, parking individual, cocina equipada, WiFi y seguridad con IA.",
        "Para reglamento, expensas o condiciones por unidad, queres que te ponga en contacto con un asesor para consultarlo directamente?",
      ].join("\n\n");
    }

    return [
      "Villa Mercedes comunica 16 departamentos de 2 dormitorios para compra, con parking individual con posibilidad de techado, cocina equipada, WiFi y vigilancia inteligente con IA las 24 hs.",
      "Es un complejo cerrado con poliza de caucion y respaldo CORADIR.",
      "Podes verlo aca: [Ver Villa Mercedes](/villa-mercedes).",
    ].join("\n\n");
  }

  if (asksCommercial && !asksResidential) {
    return [
      "En locales comerciales hay dos perfiles:",
      "- Ruta 3: locales de 180 m2 + IVA, cocheras/accesos definidos y backup energetico durante el primer ano.",
      "- Juana 64: locales dentro del desarrollo residencial, de 84 m2 por local, pensados para servicios, comercio de cercania y atencion diaria.",
      "Disponibilidad y condiciones finales las valida un asesor.",
    ].join("\n");
  }

  if (asksExpenses) {
    return [
      "Esa informacion todavia no la tengo: el monto de expensas, alcance exacto y reglamento vigente se confirman con asesor.",
      "De Juana 64 puedo contarte que tiene departamentos de 2 dormitorios, cocina equipada, estacionamiento individual y diferenciales de seguridad/conectividad.",
      "Queres que te ponga en contacto con un asesor para consultarlo directamente?",
    ].join("\n\n");
  }

  if (asksPets || asksTerraceOrPatio || asksLight || asksMaterials) {
    const details = [
      "De Juana 64 te puedo contar que tiene departamentos de 2 dormitorios, cocina equipada, estacionamiento individual, conectividad, seguridad con IA, pileta y espacios verdes.",
    ];

    if (asksPets) {
      details.push("Juana 64 figura como pet friendly. Esa informacion todavia no la tengo para reglamento o cantidad exacta de mascotas/perros por unidad.");
    }

    if (asksTerraceOrPatio) {
      details.push("Esa informacion todavia no la tengo para terraza o patio privado por unidad.");
    }

    if (asksLight) {
      details.push("La buena luz depende de la unidad y orientacion, asi que conviene validarlo sobre disponibilidad real.");
    }

    if (asksMaterials) {
      details.push("La web habla de construccion moderna/rapida y eficiente, pero esa informacion todavia no la tengo para la ficha tecnica de materiales exactos.");
    }

    return [
      "Te respondo separado para no prometer algo que no esta confirmado.",
      ...details,
      "Si esos puntos son condicion para decidir, ¿queres que te ponga en contacto con un asesor para consultarlo directamente?",
    ].join("\n\n");
  }

  if (asksResidential) {
    return [
      "Juana 64 esta pensado como vivienda inteligente en Juana Koslay: departamentos de 2 dormitorios, cocina equipada, dormitorios con placard, estacionamiento individual y espacios comunes.",
      "Como diferenciales se comunican seguridad, conectividad y soluciones energeticas para sostener luces ante cortes.",
      "Para disponibilidad o detalle final de unidad, lo valida un asesor.",
    ].join("\n\n");
  }

  return undefined;
}

function isMediaQuestion(message: string) {
  return /foto|fotos|imagen|imagenes|render|renders|folleto|pdf|brochure|plano|video|recorrido|ver como es|verlo por dentro|ver la unidad/.test(
    normalizeText(message)
  );
}

export function buildMediaOrBrochureReply(message: string, state: LeadBotState) {
  if (!isMediaQuestion(message)) return undefined;

  if (state.project === "locales-comerciales" || /local|locales|ruta\s*3/.test(normalizeText(message))) {
    return [
      "Podes ver imagenes, renders y datos de locales aca: [Ver Locales Comerciales](/locales-comerciales).",
      "Si necesitas folleto o condiciones vigentes, dejame nombre y email o numero y el equipo te lo puede enviar con la informacion actualizada.",
    ].join("\n\n");
  }

  const mediaMentions = getProjectMentionState(message);
  const wantsVillaMercedesMedia =
    !mediaMentions.negated.has("villa-mercedes") &&
    (mediaMentions.affirmed.has("villa-mercedes") ||
      (state.project === "villa-mercedes" && !mediaMentions.affirmed.has("san-luis")));
  const wantsSanLuisMedia =
    !mediaMentions.negated.has("san-luis") &&
    (mediaMentions.affirmed.has("san-luis") ||
      (state.project === "san-luis" && !mediaMentions.affirmed.has("villa-mercedes")));

  if (wantsVillaMercedesMedia) {
    return [
      "Podes ver imagenes y fotos de interiores de Villa Mercedes aca: [Ver Villa Mercedes](/villa-mercedes).",
      `Tambien esta el folleto publico: [Descargar folleto Villa Mercedes](${PROJECT_LOCATIONS.villaMercedes.brochureUrl}).`,
    ].join("\n\n");
  }

  if (wantsSanLuisMedia) {
    return [
      "Podes ver imagenes, plan maestro y croquis de San Luis aca: [Ver San Luis](/san-luis).",
      `Tambien esta el folleto publico: [Descargar folleto San Luis](${PROJECT_LOCATIONS.sanLuis.brochureUrl}).`,
    ].join("\n\n");
  }

  return [
    "Podes ver fotos, ambientes y videos de Juana 64 aca: [Ver Juana 64](/juana-64).",
    "Si necesitas folleto o condiciones vigentes, dejame nombre y email o numero y el equipo te lo puede enviar con la informacion actualizada.",
  ].join("\n\n");
}

export function isOtherProjectsQuestion(message: string) {
  const text = message
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return /otro proyecto|otros proyectos|alguno mas|hay mas|que mas tienen|otra opcion|otras opciones/.test(text);
}

export function buildOtherProjectsReply() {
  return [
    "Hoy las opciones comerciales que conviene mirar son:",
    "",
    "- **Locales Comerciales:** locales Ruta 3 y Juana 64 para compra, alquiler o leasing.",
    "",
    "- **Juana 64:** proyecto residencial para vivienda o inversion.",
    "",
    "- **San Luis:** proyecto de compra en pozo en la Ciudad de San Luis, con departamentos de 2 dormitorios.",
    "",
    "- **Villa Mercedes:** complejo cerrado en la Ciudad de Villa Mercedes, con departamentos de 2 dormitorios.",
    "",
    "- **Inversiones:** alternativas para evaluar rentabilidad y resguardo de capital.",
    "",
    "Tambien tenemos proyectos terminados, como **La Torre II**. Si queres consultar si hay departamentos disponibles, te puedo poner en contacto con un asesor.",
  ].join("\n");
}

function isAvailabilityQuestion(message: string) {
  const text = normalizeText(message);
  return /disponib|stock|queda|quedan|unidad|unidades|libre|libres/.test(text);
}

function detectInterestArea(message: string): "residential" | "commercial" | "investment" | "land" | undefined {
  const text = normalizeText(message);

  if (/departamento|departamentos|depto|deptos|vivienda|vivir|habitar|casa|hogar/.test(text)) {
    return "residential";
  }

  if (/local|locales|comercial|comercio|negocio|oficina|ruta\s*3/.test(text)) {
    return "commercial";
  }

  if (/invertir|inversion|rentabilidad|resguardo|capital|inversor/.test(text)) {
    return "investment";
  }

  if (/terreno|terrenos|lote|lotes/.test(text)) {
    return "land";
  }

  return undefined;
}

function detectInterestAreas(message: string) {
  const text = normalizeText(message);
  const areas = new Set<"residential" | "commercial" | "investment" | "land">();

  if (/departamento|departamentos|depto|deptos|apto|aptos|dorm|dormitorio|dormitorios|vivienda|vivir|habitar|casa|hogar/.test(text)) {
    areas.add("residential");
  }

  if (/local|locales|comercial|comercio|negocio|oficina|ruta\s*3/.test(text)) {
    areas.add("commercial");
  }

  if (/invertir|inversion|rentabilidad|resguardo|capital|inversor/.test(text)) {
    areas.add("investment");
  }

  if (/terreno|terrenos|lote|lotes/.test(text)) {
    areas.add("land");
  }

  return [...areas];
}

export function buildMixedInterestReply(message: string, state: LeadBotState) {
  const areas = detectInterestAreas(message);
  if (areas.length < 2) return undefined;

  const options = areas.map((area) => {
    if (area === "residential") {
      return state.project === "san-luis"
        ? "- **Vivienda/departamento:** miramos **San Luis**."
        : "- **Vivienda/departamento:** miramos **Juana 64**.";
    }
    if (area === "commercial") {
      return state.project === "san-luis"
        ? "- **Local comercial:** San Luis incluye 2 locales comerciales dentro del proyecto."
        : "- **Local comercial:** miramos **Locales Comerciales**.";
    }
    if (area === "investment") return "- **Inversion:** comparamos alternativas segun ticket, plazo y objetivo.";
    return "- **Terreno:** lo revisamos como interes especifico con el equipo.";
  });

  return [
    "Te tomo los dos intereses, porque son busquedas distintas y conviene separarlas:",
    "",
    ...options,
    "",
    state.intent === "indefinido"
      ? "Para no mezclarte opciones: ¿querés priorizar vivienda, local comercial o evaluar ambas?"
      : "Para no mezclarte opciones: ¿querés priorizar una de las dos o evaluamos ambas en paralelo?",
  ].join("\n");
}

function buildNextCommercialStep(state: LeadBotState) {
  if (state.intent === "indefinido") {
    return "Para orientarte bien: ¿estás pensando en comprar, alquilar, invertir o todavía estás mirando opciones?";
  }

  if (!state.project) {
    return "Primero conviene definir si buscas vivienda, local comercial, inversion o terreno.";
  }

  if (state.needsBudgetCurrency && !state.budgetCurrency) {
    return "Cuando decís ese rango, ¿hablás de pesos o de dólares?";
  }

  if (!state.budgetStatus) {
    return "Para avanzar bien, decime un presupuesto aproximado o si querés evaluar financiación.";
  }

  if (!state.timeline) {
    return "Y en cuanto a tiempos, ¿estás pensando en avanzar ahora, en los próximos meses o solo estás investigando?";
  }

  if (!state.decisionRole) {
    return "¿La decisión la tomás vos o la van a ver con alguien más?";
  }

  if (!state.name || (!state.email && !state.phone)) {
    if (state.declinedContact) {
      return "No te voy a insistir con tus datos. Puedo seguir orientandote por aca y, si queres hablar con una persona, usa el boton de WhatsApp.";
    }

    return "Para guardar la consulta, ¿me dejás tu nombre y un email o número de contacto? Con eso el equipo puede retomar el caso sin que repitas todo.";
  }

  return "Con eso ya puedo dejar preparado el resumen para que un asesor continue con datos concretos.";
}

function isProjectDetailQuestion(message: string, project?: string) {
  if (!project) return false;

  const text = normalizeText(message);
  const asksForDetail =
    /contame|explicame|detalle|detalles|mas info|informacion|saber mas|como es|que incluye|caracteristicas|ubicacion|amenities|disponib/.test(
      text
    );

  if (!asksForDetail) return false;

  if (project === "juana-64") return /juana\s*64|juana|departamento|depto|vivienda|vivir|casa/.test(text);
  if (project === "locales-comerciales") return /complejo|coradir|local|comercial|ruta\s*3|negocio/.test(text);
  if (project === "san-luis") return /san\s*luis|departamento|depto|vivienda|vivir|casa|hogar|local|comercial/.test(text);
  if (project === "villa-mercedes") return /villa\s*mercedes|departamento|depto|monoambiente|vivienda|vivir|casa|hogar/.test(text);
  if (project === "inversiones") return /inversion|invertir|rentabilidad|capital/.test(text);
  if (project === "terrenos") return /terreno|lote/.test(text);

  return false;
}

export function buildProjectDetailReply(message: string, state: LeadBotState) {
  if (!isProjectDetailQuestion(message, state.project)) return undefined;

  const nextStep = buildNextCommercialStep(state);

  if (state.project === "juana-64") {
    return [
      "**Juana 64:** es el proyecto en Juana Koslay con departamentos de 2 dormitorios y locales comerciales dentro del desarrollo.",
      "Para vivienda, se trabaja como compra en pozo o leasing segun unidad, forma de pago y plazo. Tambien puede analizarse como inversion urbana.",
      "La informacion comercial sensible, como precio y disponibilidad, conviene validarla con un asesor antes de avanzar.",
      "Tambien tenemos proyectos terminados, como **La Torre II**. Si queres consultar si hay departamentos disponibles, te puedo poner en contacto con un asesor.",
      nextStep,
    ].join("\n\n");
  }

  if (state.project === "locales-comerciales") {
    return [
      "**Locales Comerciales:** agrupa las opciones comerciales de CORADIR Homes: Ruta 3 km 0.6 y locales Juana 64.",
      "Segun el caso se puede evaluar compra, alquiler o leasing, siempre confirmando disponibilidad y condiciones vigentes.",
      nextStep,
    ].join("\n\n");
  }

  if (state.project === "san-luis") {
    return [
      "**San Luis:** es un proyecto de compra en pozo en la Ciudad de San Luis, con 26 departamentos de 2 dormitorios, estacionamiento individual, cocina equipada, WiFi y seguridad con IA.",
      "Tambien incluye 2 locales comerciales y se comunica con respaldo CORADIR, poliza de caucion y entrega planificada.",
      "Esa informacion todavia no la tengo para precios, cuotas, disponibilidad y fecha exacta de entrega. Queres que te ponga en contacto con un asesor para consultarlo directamente?",
      nextStep,
    ].join("\n\n");
  }

  if (state.project === "villa-mercedes") {
    return [
      "**Villa Mercedes:** es un complejo cerrado para compra en la Ciudad de Villa Mercedes, con 16 departamentos de 2 dormitorios, parking individual, cocina equipada, WiFi y seguridad con IA.",
      "Se comunica con poliza de caucion y respaldo CORADIR.",
      "Esa informacion todavia no la tengo para precios, cuotas, disponibilidad y fecha exacta de entrega. Queres que te ponga en contacto con un asesor para consultarlo directamente?",
      nextStep,
    ].join("\n\n");
  }

  if (state.project === "inversiones") {
    return [
      "**Inversiones:** se trabaja comparando ticket, plazo y objetivo: renta, resguardo de capital o crecimiento patrimonial.",
      "Segun tu perfil, podemos mirar Juana 64, Locales Comerciales u oportunidades puntuales administradas por Coradir Homes.",
      nextStep,
    ].join("\n\n");
  }

  if (state.project === "terrenos") {
    return [
      "**Terrenos:** lo revisamos como interes especifico, segun ubicacion, objetivo y plazo de desarrollo.",
      nextStep,
    ].join("\n\n");
  }

  return undefined;
}

export function buildSpecificInterestReply(message: string, state: LeadBotState) {
  const area = detectInterestArea(message);
  if (!area) return undefined;

  const availabilityNote = isAvailabilityQuestion(message)
    ? "Sobre disponibilidad exacta, prefiero no inventarte stock desde el chat: eso lo confirma el equipo con la unidad vigente."
    : undefined;
  const nextStep = buildNextCommercialStep(state);

  const interestMentions = getProjectMentionState(message);

  if (area === "residential") {
    const wantsVillaMercedesInterest =
      !interestMentions.negated.has("villa-mercedes") &&
      (interestMentions.affirmed.has("villa-mercedes") ||
        (state.project === "villa-mercedes" && !interestMentions.affirmed.has("san-luis")));

    if (wantsVillaMercedesInterest) {
      return [
        "**Vivienda:** en Villa Mercedes tenemos el **Complejo Villa Mercedes**, para compra, con 16 departamentos de 2 dormitorios, parking individual, cocina equipada y seguridad con IA.",
        availabilityNote,
        "Podes verlo aca: [Ver Villa Mercedes](/villa-mercedes).",
        "¿Queres que te ponga en contacto con un asesor para revisar opciones disponibles?",
      ]
        .filter(Boolean)
        .join("\n\n");
    }

    const wantsSanLuisInterest =
      !interestMentions.negated.has("san-luis") &&
      (interestMentions.affirmed.has("san-luis") ||
        (state.project === "san-luis" && !interestMentions.affirmed.has("villa-mercedes")));

    if (wantsSanLuisInterest) {
      return [
        "**Vivienda:** en San Luis tenemos el proyecto **San Luis**, con compra en pozo, 26 departamentos de 2 dormitorios, estacionamiento individual, cocina equipada y seguridad con IA.",
        availabilityNote,
        "Tambien podemos mirar **Juana 64** en Juana Koslay, con departamentos de 2 dormitorios, y proyectos terminados como **La Torre II** si queres consultar disponibilidad.",
        "Podes verlo aca: [Ver San Luis](/san-luis).",
        "¿Queres que te ponga en contacto con un asesor para revisar opciones disponibles?",
      ]
        .filter(Boolean)
        .join("\n\n");
    }

    return [
      "**Vivienda:** para vivir o comprar departamento, hoy podemos mirar **Juana 64** en Juana Koslay, **San Luis** en la Ciudad de San Luis y **Villa Mercedes** en la Ciudad de Villa Mercedes.",
      "Juana 64 tiene departamentos de 2 dormitorios y figura como pet friendly. San Luis comunica departamentos de 2 dormitorios con estacionamiento individual y seguridad con IA. Villa Mercedes suma departamentos de 2 dormitorios en complejo cerrado.",
      availabilityNote,
      "Tambien tenemos proyectos terminados, como **La Torre II**. Si queres consultar si hay departamentos disponibles, te puedo poner en contacto con un asesor.",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (area === "commercial") {
    if (state.project === "san-luis") {
      return [
        "**Local comercial:** San Luis incluye 2 locales comerciales dentro del proyecto.",
        "Para medidas, precio o disponibilidad por unidad, conviene validarlo con un asesor.",
        nextStep,
      ].join("\n\n");
    }

    return [
      "**Local comercial:** para comercio o negocio, la opcion activa es **Locales Comerciales**.",
      "Ahi se pueden comparar locales Ruta 3 y locales Juana 64, segun ubicacion, presupuesto y forma de ingreso.",
      availabilityNote,
      nextStep,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (area === "investment") {
    return [
      "**Inversion:** podemos mirar alternativas segun objetivo: renta, resguardo de capital o compra para reventa/alquiler.",
      "Para eso conviene comparar **Juana 64**, **Locales Comerciales** y oportunidades de inversion segun ticket y plazo.",
      nextStep,
    ].join("\n\n");
  }

  return [
    "**Terrenos:** si estas buscando lote o tierra, lo revisamos como interes especifico y lo derivamos con el equipo.",
    nextStep,
  ].join("\n\n");
}

export function isResidentialRentalRequest(message: string, state: LeadBotState) {
  const text = normalizeText(message);
  const recent = normalizeText(state.messages.slice(-6).map((entry) => entry.content).join(" "));
  const context = `${text} ${recent}`;

  if (/local|locales|comercial|comercio|negocio|oficina|ruta\s*3/.test(text)) return false;

  return (
    /alquil|alquiler|rentar|renta/.test(text) &&
    /casa|casas|departamento|departamentos|depto|deptos|dormitorio|dormitorios|vivienda|vivir|otro lado|publicacion|publicaci/.test(
      context
    )
  );
}

export function buildResidentialRentalReply(message: string, state: LeadBotState) {
  const text = normalizeText(message);
  const mentionsPublication = /publicacion|publicaci|vi.*alquil/.test(text);
  const wantsOtherPlace = /otro lado|otra zona|otro lugar|solo alquiler/.test(text);
  const wantsHouses = /casa|casas/.test(text);
  const nextHumanStep = state.declinedContact
    ? "Si queres hablar con una persona, usa el boton de WhatsApp; no te voy a insistir con dejar datos."
    : "Si queres confirmar una publicacion puntual, puedo pedirte nombre y email o numero para que un asesor lo revise.";

  if (mentionsPublication) {
    return [
      "Puede ser que hayas visto una publicacion anterior o de otro canal.",
      "Para no confundirte: no tengo alquiler residencial confirmado para ofrecer desde este chat. Juana 64 figura principalmente para compra en pozo/leasing, no como alquiler de casas.",
      nextHumanStep,
    ].join("\n\n");
  }

  if (wantsOtherPlace || wantsHouses) {
    return [
      wantsHouses
        ? "No tengo casas en alquiler para ofrecerte desde este chat."
        : "No tengo opciones de alquiler residencial en otro lado para ofrecerte desde este chat.",
      "No tengo alquiler residencial confirmado; Juana 64 figura principalmente para compra en pozo/leasing.",
      "Prefiero no pasarte precios de venta si vos estas buscando alquiler.",
      nextHumanStep,
    ].join("\n\n");
  }

  return [
    "No tengo alquiler residencial confirmado para esos departamentos desde este chat.",
    "Juana 64 figura principalmente para compra en pozo/leasing. Si viste una publicacion de alquiler, conviene validarla con un asesor.",
    nextHumanStep,
  ].join("\n\n");
}

export function isHumanContactRequest(message: string) {
  const text = normalizeText(message);
  return /asesor|vendedor|humano|persona|florencia|alberto|llamada|llamar|contactar|contactarme|contactame|contacten|contacto|whatsapp|celular|telefono|\bcel\b|visita|reunion|agendar/.test(text);
}

function hasComplaintTerms(text: string) {
  return /queja|quejar|quejarme|reclamo|reclamar|maltrato|tratan mal|trataron mal|atienden mal|atendieron mal|me trataron mal|me tratan mal/.test(
    text
  );
}

function hasComplaintStatusTerms(text: string) {
  return /a quien|deriv|derib|que paso|que paso|que te dijo|cuando.*respond|me van a responder|respuesta|supervisor|responsable|encargado|me mentis|mentis|no me das respuestas|no me derivas|no me derivan|de que estas hablando|corpus/.test(
    text
  );
}

export function hasAbusiveLanguage(message: string) {
  return /puta|puto|trolo|orto|mierda|porqueria|forro|pelotud|concha|imbecil|idiota/.test(normalizeText(message));
}

export function isComplaintFlowRequest(message: string, state: LeadBotState) {
  const text = normalizeText(message);
  const recent = normalizeText(state.messages.slice(-8).map((entry) => entry.content).join(" "));
  const hasComplaintContext = Boolean(state.wantsComplaintFollowup) || hasComplaintTerms(recent);
  const hasContactAttempt = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+?\d[\d\s().-]{7,}\d/.test(message);

  return (
    hasComplaintTerms(text) ||
    (hasComplaintContext &&
      (hasComplaintStatusTerms(text) ||
        hasAbusiveLanguage(message) ||
        hasContactAttempt ||
        isHumanContactRequest(message) ||
        /asesor|persona|whatsapp|humano/.test(text)))
  );
}

export function buildComplaintReply(
  message: string,
  state: LeadBotState,
  options: { invalidContactAttempt?: boolean } = {}
) {
  const text = normalizeText(message);
  const hasContact = Boolean(state.name && (state.email || state.phone));
  const hasPartialContact = Boolean(state.name || state.email || state.phone);
  const isStatusQuestion = hasComplaintStatusTerms(text);
  const isAbusive = hasAbusiveLanguage(message);
  const missingContactText = (() => {
    if (!state.name && !(state.email || state.phone)) return "pasame tu nombre y un email o numero de contacto.";
    if (!state.name) return "me falta tu nombre.";
    if (!(state.email || state.phone)) return "me falta un email o numero de contacto.";
    return "ya tengo los datos necesarios para seguimiento.";
  })();

  if (options.invalidContactAttempt) {
    return [
      "Ese email no parece un contacto valido para seguimiento.",
      "Para registrar el reclamo, pasame tu nombre y un email o numero real. Desde este chat no puedo ver derivaciones internas ni inventar un estado.",
    ].join("\n\n");
  }

  if (/corpus|de que estas hablando/.test(text)) {
    return [
      "Perdon: esa fue una palabra tecnica interna. Quise decir informacion del proyecto, no era una respuesta clara para vos.",
      hasContact
        ? "Sobre tu reclamo, desde este chat no puedo ver asignaciones internas ni estado de respuesta. Con los datos que dejaste, queda listo para seguimiento y podes usar el boton de WhatsApp para hablar con una persona."
        : `Sobre tu reclamo, desde este chat no puedo ver asignaciones internas ni estado de respuesta. Para dejarlo registrado, ${missingContactText}`,
    ].join("\n\n");
  }

  if (isAbusive && !isStatusQuestion) {
    return [
      "Puedo ayudarte con el reclamo, pero necesito que sigamos sin insultos.",
      hasContact
        ? "Desde este chat no puedo ver asignaciones internas ni tiempos de respuesta. Con los datos que dejaste, queda listo para seguimiento y podes usar el boton de WhatsApp para hablar con una persona."
        : `Para que el equipo pueda revisarlo, ${missingContactText}`,
    ].join("\n\n");
  }

  if (isStatusQuestion) {
    return [
      "No puedo ver desde este chat a quien fue asignado el reclamo, si alguien respondio o en que estado interno esta.",
      hasContact
        ? "Con los datos que dejaste, queda listo para seguimiento. Si queres hablar con una persona, usa el boton de WhatsApp."
        : hasPartialContact
          ? `Para dejarlo bien registrado ${missingContactText}`
          : "Para dejar el reclamo registrado, pasame tu nombre y un email o numero de contacto.",
    ].join("\n\n");
  }

  return [
    "Lamento la mala experiencia.",
    hasContact
      ? "Con los datos que dejaste, dejo el reclamo preparado para que el equipo lo revise. Desde este chat no puedo prometer tiempos ni confirmar asignacion interna; si queres hablar con una persona, usa el boton de WhatsApp."
      : `Para que el equipo pueda revisar el reclamo, ${missingContactText} Desde este chat no puedo confirmar derivaciones internas.`,
  ].join("\n\n");
}

export function buildLocationReply(message: string, state: LeadBotState) {
  const text = normalizeText(message);
  const asksLocation =
    /ubicaci.n|ubicaciones|direccion|direcciones|donde queda|donde estan|mapa|maps|google maps|como llegar|ver ubicaci.n/.test(
      text
    );

  if (!asksLocation) return undefined;

  const mentions = getProjectMentionState(message);
  const wantsVillaMercedesLocation =
    !mentions.negated.has("villa-mercedes") &&
    (mentions.affirmed.has("villa-mercedes") ||
      /riobamba/.test(text) ||
      (state.project === "villa-mercedes" && !mentions.affirmed.has("san-luis")));
  const wantsSanLuisLocation =
    !mentions.negated.has("san-luis") &&
    (mentions.affirmed.has("san-luis") ||
      /jose\s*hernandez|calle\s*chile/.test(text) ||
      (state.project === "san-luis" && !mentions.affirmed.has("villa-mercedes")));

  if (wantsVillaMercedesLocation) {
    return [
      `Villa Mercedes queda en ${PROJECT_LOCATIONS.villaMercedes.address}.`,
      `Podes verlo aca: [Ver Villa Mercedes](${PROJECT_LOCATIONS.villaMercedes.pageUrl}).`,
    ].join("\n\n");
  }

  if (wantsSanLuisLocation) {
    return [
      `San Luis queda en ${PROJECT_LOCATIONS.sanLuis.address}.`,
      `Podes verlo aca: [Ver San Luis](${PROJECT_LOCATIONS.sanLuis.pageUrl}).`,
    ].join("\n\n");
  }

  const asksForResidentialJuana64 =
    state.project === "juana-64" &&
    (/departamento|departamentos|depto|deptos|vivienda|vivir|casa|hogar/.test(text) ||
      !/local|locales|comercial|comercio|negocio|ruta\s*3/.test(text));

  if (asksForResidentialJuana64) {
    return [
      `Juana 64 queda en ${PROJECT_LOCATIONS.juana64.address}.`,
      `Podes verla aca: [Ver ubicacion de Juana 64](${PROJECT_LOCATIONS.juana64.pageUrl}).`,
    ].join("\n\n");
  }

  const isCommercialOrJuana =
    state.project === "locales-comerciales" ||
    state.project === "juana-64" ||
    /local|locales|comercial|juana\s*64|juana|koslay|ruta\s*3|coradir/.test(text);

  if (!isCommercialOrJuana) return undefined;

  const showRuta3 = /ruta\s*3|km\s*0|coradir|san\s*luis/.test(text) || !/juana\s*64|juana|koslay/.test(text);
  const showJuana64 = /juana\s*64|juana|koslay/.test(text) || !/ruta\s*3|km\s*0|coradir/.test(text);
  const lines = ["Las ubicaciones son:"];

  if (showRuta3) {
    lines.push("- **Locales CORADIR Ruta 3:** Ruta 3 km 0.6, Parque Industrial Sur, San Luis. [Ver en la web](/locales-comerciales#ruta-3).");
  }

  if (showJuana64) {
    lines.push(`- **Locales comerciales Juana 64:** ${PROJECT_LOCATIONS.localesJuana64.address}. [Ver en la web](${PROJECT_LOCATIONS.localesJuana64.pageUrl}).`);
  }

  return lines.join("\n");
}

export function buildHumanContactReply(state: LeadBotState) {
  if (!state.declinedContact || (state.name && (state.email || state.phone))) {
    if (state.name && (state.email || state.phone)) {
      return [
        "Gracias, ya tengo tus datos. Preparo un resumen de la conversacion y lo envio al equipo.",
        "Con los datos que dejaste, un asesor puede contactarte con el contexto de lo que estas buscando.",
      ].join("\n\n");
    }

    return [
      "Dale, te puedo poner en contacto con un asesor.",
      "Para enviarle el resumen, me dejas tu nombre y un email o numero de contacto? Asi el equipo puede retomar el caso sin que repitas todo.",
    ].join("\n\n");
  }

  if (state.declinedContact && !(state.name && (state.email || state.phone))) {
    return [
      "Entendido, no te voy a insistir con tus datos.",
      "Si queres hablar con una persona, usa el boton de WhatsApp de la web. Tambien puedo seguir respondiendo por aca sin guardar contacto.",
    ].join("\n\n");
  }

  if (state.name && (state.email || state.phone)) {
    return [
      "Dale, te paso con un asesor por WhatsApp.",
      "Ya tengo contexto suficiente para que el equipo entienda qué estás buscando.",
    ].join("\n\n");
  }

  return [
    "Dale, te puedo pasar con un asesor.",
    "Antes, para guardar la consulta, ¿me dejás tu nombre y un email o número de contacto? Así el equipo puede retomar el caso sin que repitas todo.",
  ].join("\n\n");
}

export function isBenefitsQuestion(message: string) {
  const text = normalizeText(message);
  return /beneficio|beneficios|ventaja|ventajas|por que conviene|porque conviene|diferencial|diferenciales|que tiene de bueno/.test(text);
}

export function isProjectPageQuestion(message: string) {
  const text = normalizeText(message);
  if (/pet\s*friendly|mascota|mascotas|perro|perros|animal|animales/.test(text)) return false;
  return /donde puedo ver|donde veo|pasame.*link|tenes.*link|pasame.*pagina|tenes.*pagina|pagina|web de|sitio|info completa|ver lo de|ver informacion/.test(text);
}

export function buildProjectPageReply(state: LeadBotState) {
  if (state.project === "san-luis") {
    return [
      "Podes ver el proyecto San Luis aca: [Ver San Luis](/san-luis).",
      `Direccion: ${PROJECT_LOCATIONS.sanLuis.address}. Tambien esta el folleto: [Descargar folleto San Luis](${PROJECT_LOCATIONS.sanLuis.brochureUrl}).`,
    ].join("\n\n");
  }

  if (state.project === "villa-mercedes") {
    return [
      "Podes ver el proyecto Villa Mercedes aca: [Ver Villa Mercedes](/villa-mercedes).",
      `Direccion: ${PROJECT_LOCATIONS.villaMercedes.address}. Tambien esta el folleto: [Descargar folleto Villa Mercedes](${PROJECT_LOCATIONS.villaMercedes.brochureUrl}).`,
    ].join("\n\n");
  }

  if (state.project === "juana-64") {
    return [
      "Podés ver toda la info de Juana 64 acá: [Ver Juana 64](/juana-64).",
      `La dirección es ${PROJECT_LOCATIONS.juana64.address}. También podés ir directo al mapa: [Ver ubicación](${PROJECT_LOCATIONS.juana64.pageUrl}).`,
    ].join("\n\n");
  }

  if (state.project === "locales-comerciales") {
    return "Podés ver los locales comerciales acá: [Ver Locales Comerciales](/locales-comerciales).";
  }

  return "Podés ver los proyectos disponibles acá: [Ver proyectos](/proyectos).";
}

export function isPurchaseProcessQuestion(message: string) {
  const text = normalizeText(message);
  return /proceso de compra|como es.*compra|como comprar|pasos.*compra|pasos.*comprar|que pasos|forma de compra|comprar.*proceso/.test(text);
}

export function buildPurchaseProcessReply(state: LeadBotState) {
  if (state.project === "san-luis") {
    return [
      "Para San Luis, la web comunica este proceso:",
      "",
      "- **Lista de interes:** prioridad comercial y eleccion de unidad.",
      "- **Pre-reserva:** sena para congelar condiciones y avanzar con asesoria personalizada.",
      "- **Boleto y posesion:** respaldo juridico y entrega planificada.",
      "",
      "Los valores, cuotas y disponibilidad se validan con un asesor.",
    ].join("\n");
  }

  if (state.project === "villa-mercedes") {
    return [
      "Para Villa Mercedes, la web comunica la compra fijando condiciones al avanzar, con poliza de caucion y respaldo CORADIR.",
      "Los pasos exactos, valores, cuotas y disponibilidad se validan con un asesor.",
    ].join("\n\n");
  }

  if (state.project === "juana-64") {
    return [
      "Para Juana 64, el proceso general es:",
      "",
      "- **Reserva:** 3% para iniciar la operación.",
      "- **Compra en pozo adelantada:** el saldo se completa a los 30 días.",
      "- **Compra terminado:** 10% al boleto a los 30 días y saldo contra entrega.",
      "- **Leasing:** 3% a la reserva, 10% a los 60 días, 22% contra entrega y el saldo en cuotas pactadas.",
      "",
      "Estos pasos pueden variar según unidad y modalidad, así que conviene validarlo con un asesor antes de avanzar.",
    ].join("\n");
  }

  return [
    "El proceso depende del proyecto y de si querés comprar, alquilar o hacer leasing.",
    "Primero se define unidad y modalidad; después se validan reserva, boleto o contrato y condiciones vigentes.",
  ].join("\n\n");
}

export function buildBenefitsReply(state: LeadBotState) {
  if (state.project === "san-luis") {
    return [
      "**Beneficios de San Luis:**",
      "",
      "- **Vivienda:** 26 departamentos de 2 dormitorios para compra en pozo.",
      "- **Comodidad:** estacionamiento individual y cocina equipada.",
      "- **Tecnologia:** WiFi, seguridad con IA y vigilancia inteligente 24 hs.",
      "- **Ubicacion:** Jose Hernandez y Chile, Ciudad de San Luis, con accesos rapidos y cercania a servicios.",
      "- **Locales comerciales:** incluye 2 locales dentro del proyecto.",
      "",
      buildNextCommercialStep(state),
    ].join("\n");
  }

  if (state.project === "villa-mercedes") {
    return [
      "**Beneficios de Villa Mercedes:**",
      "",
      "- **Vivienda:** 16 departamentos de 2 dormitorios para compra.",
      "- **Comodidad:** parking individual con posibilidad de techado y cocina equipada.",
      "- **Tecnologia:** WiFi, seguridad con IA y vigilancia inteligente 24 hs.",
      "- **Ubicacion:** Riobamba 477, Ciudad de Villa Mercedes, cerca del centro y de puntos de alto transito.",
      "- **Respaldo:** complejo cerrado con poliza de caucion y respaldo CORADIR.",
      "",
      buildNextCommercialStep(state),
    ].join("\n");
  }

  if (state.project === "juana-64") {
    return [
      "**Beneficios de Juana 64:**",
      "",
      "- **Vivienda:** departamentos de 2 dormitorios en Juana Koslay.",
      "- **Inversion urbana:** permite evaluar compra en pozo, leasing o renta futura con asesor.",
      "- **Diferenciales:** cocina equipada, estacionamiento individual, seguridad/conectividad y espacios comunes.",
      "- **Locales comerciales:** tambien existen locales dentro del desarrollo para comercio de cercania.",
      "",
      buildNextCommercialStep(state),
    ].join("\n");
  }

  if (state.project === "locales-comerciales") {
    return [
      "**Beneficios de Locales Comerciales:**",
      "",
      "- **Ubicaciones comerciales:** Ruta 3 km 0.6 y Juana 64.",
      "- **Backup energetico:** Ruta 3 incorpora respaldo durante el primer ano para reducir interrupciones operativas.",
      "- **Comparacion por objetivo:** negocio propio, renta comercial o expansion.",
      "- **Flexibilidad comercial:** se puede evaluar compra, alquiler o leasing segun perfil.",
      "",
      buildNextCommercialStep(state),
    ].join("\n");
  }

  if (state.project === "inversiones") {
    return [
      "**Beneficios para inversion:**",
      "",
      "- **Comparacion por objetivo:** renta, resguardo de capital o crecimiento.",
      "- **Alternativas segun ticket:** se filtra por presupuesto y plazo.",
      "- **Acompanamiento:** el equipo puede orientar opciones sin que arranques de cero.",
      "",
      buildNextCommercialStep(state),
    ].join("\n");
  }

  return [
    "**Beneficios principales:**",
    "",
    "- **Juana 64:** opcion residencial para vivienda o inversion urbana.",
    "- **Locales Comerciales:** locales comerciales en Ruta 3 y Juana 64.",
    "- **Inversiones:** comparacion de alternativas segun ticket y plazo.",
    "",
    "Para decirte beneficios concretos, primero decime si estas mirando vivienda, local comercial o inversion.",
  ].join("\n");
}

export function isFinancingQuestion(message: string) {
  const text = normalizeText(message);
  return /financiacion|financiar|credito|prestamo|cuotas|anticipo|entrega|banco|apto credito/.test(text);
}

export function buildFinancingReply(state: LeadBotState) {
  if (state.project === "san-luis") {
    return [
      "**San Luis:** se comunica como compra en pozo, con lista de interes, pre-reserva y boleto/posesion.",
      "Esa informacion todavia no la tengo para cuotas o financiacion exacta. Queres que te ponga en contacto con un asesor para consultarlo directamente?",
    ].join("\n\n");
  }

  if (state.project === "villa-mercedes") {
    return [
      "**Villa Mercedes:** se comunica como compra con poliza de caucion y respaldo CORADIR.",
      "Esa informacion todavia no la tengo para cuotas o financiacion exacta. Queres que te ponga en contacto con un asesor para consultarlo directamente?",
    ].join("\n\n");
  }

  return [
    "**Financiacion:** puede variar segun proyecto, unidad y forma de pago, asi que no conviene darte una condicion generica.",
    state.project
      ? `Para ${projectLabel(state.project)}, lo mejor es revisar tu rango y plazo para filtrar alternativas reales.`
      : undefined,
    buildNextCommercialStep(state),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function isPriceQuestion(message: string) {
  const text = message
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return /precio|cuanto\s*sale|cuanto\s*salen|cuantosale|cuantosalen|valor|valen|costo|cuota|financiacion/.test(text);
}

export function buildPriceReply(project?: string) {
  if (project === "san-luis") {
    return [
      "Para San Luis la web confirma el proyecto de compra en pozo, pero esa informacion todavia no la tengo: precio, cuotas y financiacion exacta se confirman con asesor segun unidad y condiciones vigentes.",
      "¿Queres que te ponga en contacto con un asesor para consultarlo directamente?",
    ].join("\n\n");
  }

  if (project === "villa-mercedes") {
    return [
      "Para Villa Mercedes la web confirma el complejo de 16 departamentos de 2 dormitorios, pero esa informacion todavia no la tengo: precio, cuotas y financiacion exacta se confirman con asesor segun unidad y condiciones vigentes.",
      "¿Queres que te ponga en contacto con un asesor para consultarlo directamente?",
    ].join("\n\n");
  }

  const projectText = project && PROJECT_SUMMARIES[project] ? ` para ${projectLabel(project)}` : "";
  return `Los valores${projectText} dependen de la unidad, forma de pago y si estas pensando en compra, alquiler o inversion. Para no tirarte un dato suelto que despues no aplique, decime que operacion te interesa y si ya tenes un presupuesto aproximado o queres ver opciones de financiacion.`;
}
