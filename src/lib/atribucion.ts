// Atribucion de leads: de que campaña y pagina viene cada consulta.
// Se guarda al entrar con UTM/gclid/fbclid y viaja con los formularios y los clics de WhatsApp.
// - Ultimo toque: la ultima visita con parametros de campaña (90 dias).
// - Primer toque: la primera visita registrada (no se pisa).

export type Atribucion = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  landingUrl?: string;
  referrer?: string;
  capturadoEn?: string;
};

const CLAVE_ULTIMA = "homes_atribucion_ultima";
const CLAVE_PRIMERA = "homes_atribucion_primera";
const VIGENCIA_MS = 90 * 24 * 60 * 60 * 1000;

const PARAMETROS: Record<string, keyof Atribucion> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
  gclid: "gclid",
  fbclid: "fbclid",
};

function leer(clave: string): Atribucion | null {
  try {
    const crudo = window.localStorage.getItem(clave);
    if (!crudo) return null;
    const valor = JSON.parse(crudo) as Atribucion;
    if (valor.capturadoEn && Date.now() - new Date(valor.capturadoEn).getTime() > VIGENCIA_MS) return null;
    return valor;
  } catch {
    return null;
  }
}

function guardar(clave: string, valor: Atribucion) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Navegacion privada o storage bloqueado: la atribucion es opcional.
  }
}

/** Referente externo (otro dominio) o vacio. */
function referenteExterno(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    return new URL(document.referrer).hostname === window.location.hostname ? undefined : document.referrer;
  } catch {
    return undefined;
  }
}

/** Se llama en cada navegacion: registra la campaña si la URL trae parametros. */
export function capturarAtribucion() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const actual: Atribucion = {};
  for (const [param, campo] of Object.entries(PARAMETROS)) {
    const valor = params.get(param)?.trim();
    if (valor) actual[campo] = valor.slice(0, 300);
  }

  const tieneCampania = Object.keys(actual).length > 0;
  const base: Atribucion = {
    landingUrl: window.location.href.slice(0, 1000),
    referrer: referenteExterno(),
    capturadoEn: new Date().toISOString(),
  };

  if (tieneCampania) guardar(CLAVE_ULTIMA, { ...actual, ...base });
  if (!leer(CLAVE_PRIMERA)) guardar(CLAVE_PRIMERA, { ...actual, ...base });
}

/** Campos planos para el payload de un formulario o de un clic (ultimo toque, si no el primero). */
export function datosAtribucion(): Atribucion & { primerToque?: Atribucion; pagePath?: string } {
  if (typeof window === "undefined") return {};
  const ultima = leer(CLAVE_ULTIMA);
  const primera = leer(CLAVE_PRIMERA);
  const vigente = ultima || primera || {};
  const { capturadoEn: _omitido, ...campos } = vigente;
  void _omitido;
  return {
    ...campos,
    pagePath: window.location.pathname,
    ...(primera && primera.capturadoEn !== ultima?.capturadoEn ? { primerToque: primera } : {}),
  };
}

/** Evento para GTM (dataLayer) con el proyecto y donde ocurrio. */
export function eventoDataLayer(evento: string, datos: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const ventana = window as Window & { dataLayer?: Record<string, unknown>[] };
  ventana.dataLayer = ventana.dataLayer || [];
  ventana.dataLayer.push({ event: evento, ...datos });
}

/** Proyecto y prefijo del codigo de WhatsApp segun la pagina. */
const PAGINAS: { prefijo: string; ruta: RegExp; proyecto: string }[] = [
  { prefijo: "J64", ruta: /^\/juana-64/, proyecto: "juana-64" },
  { prefijo: "VM", ruta: /^\/villa-mercedes/, proyecto: "villa-mercedes" },
  { prefijo: "A26", ruta: /^\/san-luis/, proyecto: "aero26" },
  { prefijo: "LOC", ruta: /^\/locales-comerciales/, proyecto: "locales-comerciales" },
  { prefijo: "T2", ruta: /^\/la-torre-ii/, proyecto: "la-torre-ii" },
  { prefijo: "UNI", ruta: /^\/unidades/, proyecto: "catalogo" },
];

export function proyectoDePagina(pathname: string): { prefijo: string; proyecto: string } {
  const pagina = PAGINAS.find((p) => p.ruta.test(pathname));
  return pagina ? { prefijo: pagina.prefijo, proyecto: pagina.proyecto } : { prefijo: "WEB", proyecto: "general" };
}

/** Codigo corto para el mensaje de WhatsApp: "J64-K7Q2" (sin caracteres ambiguos). */
export function generarRefCode(prefijo: string): string {
  const alfabeto = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const valores = new Uint32Array(4);
  window.crypto.getRandomValues(valores);
  return `${prefijo}-${Array.from(valores, (v) => alfabeto[v % alfabeto.length]).join("")}`;
}
