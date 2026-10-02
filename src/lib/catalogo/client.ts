// Cliente server-side del catalogo de unidades de Inmobiliario.
//
// El contenedor de produccion es read-only, asi que no usamos ISR ni el cache
// en disco de Next: guardamos las respuestas en memoria con un TTL corto y, si
// Inmobiliario no responde, devolvemos la ultima respuesta buena (hasta 24 h).
// /api/revalidate limpia este cache cuando Inmobiliario avisa un cambio.

import type { FiltrosCatalogo, ListadoUnidades, Media, Operacion, UnidadFicha } from "./types";
import { construirQuery } from "./filtros";

const RUTA_UNIDADES = "/api/propiedades/catalogo/homes-public/unidades";
const STALE_MAX_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRADAS = 300;

export class CatalogoNoDisponibleError extends Error {
  constructor(causa?: unknown) {
    super("El catalogo de Inmobiliario no esta disponible");
    this.name = "CatalogoNoDisponibleError";
    this.cause = causa;
  }
}

function apiBase() {
  // Red interna Docker en produccion (http://backend_inmobiliario_prod:3076);
  // HOMES_CRM_BASE_URL ya apunta al mismo backend para el lead bot.
  const base = process.env.HOMES_CATALOG_API_URL || process.env.HOMES_CRM_BASE_URL || "http://localhost:3076";
  return base.replace(/\/+$/, "");
}

function origenPublico() {
  return (process.env.INMOBILIARIO_PUBLIC_ORIGIN || "https://inmobiliario.coradir.com.ar").replace(/\/+$/, "");
}

function ttlMs() {
  const segundos = Number(process.env.HOMES_CATALOG_CACHE_SECONDS);
  return (Number.isFinite(segundos) && segundos >= 0 ? segundos : 60) * 1000;
}

function timeoutMs() {
  const ms = Number(process.env.HOMES_CATALOG_TIMEOUT_MS);
  return Number.isFinite(ms) && ms > 0 ? ms : 4000;
}

/** Convierte /uploads/... en URL absoluta del origen publico de Inmobiliario. */
export function assetUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${origenPublico()}${url.startsWith("/") ? "" : "/"}${url}`;
}

function conUrlAbsoluta(media: Media | null): Media | null {
  return media ? { ...media, url: assetUrl(media.url) ?? media.url } : null;
}

// ---------------------------------------------------------------------------
// Cache en memoria
// ---------------------------------------------------------------------------

type Entrada = { valor: unknown; guardadoEn: number };

// En globalThis y no a nivel de modulo: Next puede cargar este archivo en bundles
// distintos (paginas y route handlers) y /api/revalidate tiene que limpiar el
// mismo cache que leen las paginas.
const almacen = globalThis as typeof globalThis & {
  __catalogoHomes?: { cache: Map<string, Entrada>; enCurso: Map<string, Promise<unknown>> };
};
almacen.__catalogoHomes ??= { cache: new Map(), enCurso: new Map() };
const { cache, enCurso } = almacen.__catalogoHomes;

function guardar(clave: string, valor: unknown) {
  cache.delete(clave);
  cache.set(clave, { valor, guardadoEn: Date.now() });
  // Map conserva el orden de insercion: el primero es el mas viejo.
  while (cache.size > MAX_ENTRADAS) cache.delete(cache.keys().next().value as string);
}

async function conCache<T>(clave: string, cargar: () => Promise<T>): Promise<T> {
  const entrada = cache.get(clave);
  const edad = entrada ? Date.now() - entrada.guardadoEn : Infinity;
  if (entrada && edad < ttlMs()) return entrada.valor as T;

  const pendiente = enCurso.get(clave);
  if (pendiente) return pendiente as Promise<T>;

  const promesa = cargar()
    .then((valor) => {
      guardar(clave, valor);
      return valor;
    })
    .catch((error) => {
      if (entrada && edad < STALE_MAX_MS) {
        console.warn(`[catalogo] Inmobiliario no respondio, uso datos de hace ${Math.round(edad / 1000)}s:`, (error as Error)?.message);
        return entrada.valor as T;
      }
      throw error;
    })
    .finally(() => enCurso.delete(clave));

  enCurso.set(clave, promesa);
  return promesa;
}

/** Limpia el cache del catalogo (lo usa /api/revalidate). */
export function invalidarCatalogo() {
  const entradas = cache.size;
  cache.clear();
  return entradas;
}

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

const NO_ENCONTRADO = Symbol("no-encontrado");

async function pedirJson<T>(ruta: string): Promise<T | typeof NO_ENCONTRADO> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  try {
    const respuesta = await fetch(`${apiBase()}${ruta}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (respuesta.status === 404) return NO_ENCONTRADO;
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const cuerpo = await respuesta.json();
    if (!cuerpo?.success) throw new Error("Respuesta invalida del catalogo");
    return cuerpo as T;
  } catch (error) {
    throw new CatalogoNoDisponibleError(error);
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// API publica del modulo
// ---------------------------------------------------------------------------

const LISTADO_VACIO: ListadoUnidades = {
  data: [],
  total: 0,
  page: 1,
  limit: 24,
  facets: { tipos: [], estados: [], ciudades: [], edificios: [], dormitorios: [], precio: {}, superficie: null },
};

/**
 * Listado de unidades publicadas para una operacion.
 * Nunca lanza: si el catalogo no esta disponible y no hay datos previos,
 * devuelve un listado vacio con `sinConexion: true` para que la pagina lo avise.
 */
export async function listarUnidades(filtros: FiltrosCatalogo): Promise<ListadoUnidades & { sinConexion?: boolean }> {
  const ruta = `${RUTA_UNIDADES}?${construirQuery(filtros)}`;
  try {
    const resultado = await conCache(ruta, async () => {
      const cuerpo = await pedirJson<ListadoUnidades>(ruta);
      if (cuerpo === NO_ENCONTRADO) return LISTADO_VACIO;
      return {
        data: cuerpo.data.map((u) => ({ ...u, portada: conUrlAbsoluta(u.portada) })),
        total: cuerpo.total,
        page: cuerpo.page,
        limit: cuerpo.limit,
        facets: cuerpo.facets,
      } satisfies ListadoUnidades;
    });
    return resultado;
  } catch (error) {
    console.error("[catalogo] No se pudo obtener el listado:", (error as Error)?.cause ?? error);
    return { ...LISTADO_VACIO, limit: filtros.limit ?? LISTADO_VACIO.limit, sinConexion: true };
  }
}

/**
 * Ficha de una unidad. Devuelve null si no existe o ya no se publica.
 * Lanza CatalogoNoDisponibleError si Inmobiliario no responde y no hay cache.
 */
export async function obtenerUnidad(slug: string, operacion?: Operacion): Promise<UnidadFicha | null> {
  if (!/^[a-z0-9-]{1,200}$/.test(slug)) return null;
  const ruta = `${RUTA_UNIDADES}/${slug}${operacion ? `?operacion=${operacion}` : ""}`;
  return conCache(ruta, async () => {
    const cuerpo = await pedirJson<{ data: UnidadFicha }>(ruta);
    if (cuerpo === NO_ENCONTRADO) return null;
    const unidad = cuerpo.data;
    return {
      ...unidad,
      portada: conUrlAbsoluta(unidad.portada),
      galeria: unidad.galeria.map((m) => conUrlAbsoluta(m)!),
      videos: unidad.videos.map((m) => conUrlAbsoluta(m)!),
      planos: unidad.planos.map((m) => conUrlAbsoluta(m)!),
    };
  });
}
