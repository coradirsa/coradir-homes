// Traduccion entre los filtros del catalogo, la query de la API de Inmobiliario
// y los searchParams de las paginas /alquileres y /venta.

import type { FiltrosCatalogo, Moneda, Operacion, OrdenCatalogo, TipoUnidad } from "./types";

export const TIPOS: TipoUnidad[] = ["departamento", "local", "cochera"];
export const ORDENES: OrdenCatalogo[] = ["recientes", "precio_asc", "precio_desc", "m2_desc"];
const ESTADOS = ["disponible", "proximamente", "reservado"] as const;
const MONEDAS: Moneda[] = ["ARS", "USD"];
export const POR_PAGINA = 24;

type SearchParams = Record<string, string | string[] | undefined>;

function primero(valor: string | string[] | undefined) {
  return Array.isArray(valor) ? valor[0] : valor;
}

function lista<T extends string>(valor: string | string[] | undefined, permitidos: readonly T[]): T[] | undefined {
  const crudo = Array.isArray(valor) ? valor.join(",") : valor;
  if (!crudo) return undefined;
  const items = crudo.split(",").map((v) => v.trim()).filter((v): v is T => (permitidos as readonly string[]).includes(v));
  return items.length ? [...new Set(items)] : undefined;
}

function numero(valor: string | string[] | undefined, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const crudo = primero(valor);
  if (crudo === undefined || crudo === "") return undefined;
  const n = Number(crudo);
  return Number.isFinite(n) && n >= min && n <= max ? n : undefined;
}

function texto(valor: string | string[] | undefined, maximo = 80) {
  const crudo = primero(valor)?.trim();
  return crudo ? crudo.slice(0, maximo) : undefined;
}

/** Lee y valida los searchParams de la pagina. Lo que no se entiende se ignora. */
export function filtrosDesdeSearchParams(searchParams: SearchParams, operacion: Operacion): FiltrosCatalogo {
  const orden = primero(searchParams.orden) as OrdenCatalogo | undefined;
  const moneda = primero(searchParams.moneda)?.toUpperCase() as Moneda | undefined;
  const edificio = texto(searchParams.edificio);
  return {
    operacion,
    tipo: lista(searchParams.tipo, TIPOS),
    estado: lista(searchParams.estado, ESTADOS),
    ciudad: texto(searchParams.ciudad),
    edificio: edificio && /^[a-z0-9-]+$/i.test(edificio) ? edificio : undefined,
    precioMin: numero(searchParams.precioMin),
    precioMax: numero(searchParams.precioMax),
    moneda: moneda && MONEDAS.includes(moneda) ? moneda : undefined,
    m2Min: numero(searchParams.m2Min),
    m2Max: numero(searchParams.m2Max),
    dormitorios: numero(searchParams.dormitorios, { min: 1, max: 10 }),
    orden: orden && ORDENES.includes(orden) ? orden : undefined,
    page: numero(searchParams.page, { min: 1, max: 500 }),
    limit: POR_PAGINA,
  };
}

/** Pares clave/valor de los filtros (sin vacios), en orden estable. */
function pares(filtros: Partial<FiltrosCatalogo>, { incluirOperacion }: { incluirOperacion: boolean }) {
  const salida: [string, string][] = [];
  const agregar = (clave: string, valor: unknown) => {
    if (valor === undefined || valor === null || valor === "") return;
    if (Array.isArray(valor)) {
      if (valor.length) salida.push([clave, valor.join(",")]);
      return;
    }
    salida.push([clave, String(valor)]);
  };
  if (incluirOperacion) agregar("operacion", filtros.operacion);
  agregar("tipo", filtros.tipo);
  agregar("estado", filtros.estado);
  agregar("ciudad", filtros.ciudad);
  agregar("edificio", filtros.edificio);
  agregar("precioMin", filtros.precioMin);
  agregar("precioMax", filtros.precioMax);
  agregar("moneda", filtros.moneda);
  agregar("m2Min", filtros.m2Min);
  agregar("m2Max", filtros.m2Max);
  agregar("dormitorios", filtros.dormitorios);
  if (filtros.orden && filtros.orden !== "recientes") agregar("orden", filtros.orden);
  if (filtros.page && filtros.page > 1) agregar("page", filtros.page);
  return salida;
}

/** Query string para la API de Inmobiliario. */
export function construirQuery(filtros: FiltrosCatalogo) {
  const params = new URLSearchParams(pares(filtros, { incluirOperacion: true }));
  params.set("limit", String(filtros.limit ?? POR_PAGINA));
  return params.toString();
}

/** Query string para los links del sitio (sin operacion: va en la ruta). */
export function queryDelSitio(filtros: Partial<FiltrosCatalogo>) {
  const params = new URLSearchParams(pares(filtros, { incluirOperacion: false }));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** Cantidad de filtros activos (para el badge del boton de filtros en mobile). */
export function contarFiltrosActivos(filtros: FiltrosCatalogo) {
  return [
    filtros.tipo?.length,
    filtros.estado?.length,
    filtros.ciudad,
    filtros.edificio,
    filtros.precioMin ?? filtros.precioMax,
    filtros.m2Min ?? filtros.m2Max,
    filtros.dormitorios,
  ].filter(Boolean).length;
}
