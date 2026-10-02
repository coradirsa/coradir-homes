// Tipos del catalogo de unidades publicado por Inmobiliario.
// Contrato: API_HOMES_PUBLIC_CATALOG.md del repo inmobilario
// (GET /api/propiedades/catalogo/homes-public/unidades[/:slug]).

export type Operacion = "venta" | "alquiler";
export type TipoUnidad = "departamento" | "local" | "cochera";
export type EstadoWeb = "disponible" | "disponible_desde" | "proximamente" | "reservado";
export type Moneda = "ARS" | "USD";
export type OrdenCatalogo = "recientes" | "precio_asc" | "precio_desc" | "m2_desc";

export interface Precio {
  monto: number;
  moneda: Moneda;
  promocional: number | null;
}

export interface Media {
  id: string;
  url: string;
  mimeType: string | null;
  tipo: "imagen" | "video" | "plano" | "archivo";
  altText: string | null;
  origen: "unidad" | "edificio";
}

export interface EdificioWeb {
  id: string;
  nombre: string;
  slug: string | null;
  direccion: string;
  ciudad: string;
  provincia: string;
  tipoDesarrollo: string;
  estadoDesarrollo: "en_pozo" | "en_construccion" | "entregado";
  fechaEntregaEstimada: string | null;
  ubicacion: {
    latitud: number | null;
    longitud: number | null;
    googleMapsUrl: string | null;
  };
}

export interface UnidadListado {
  id: string;
  slug: string;
  tipo: TipoUnidad;
  titulo: string;
  codigo: string | null;
  operacion: Operacion;
  operaciones: Operacion[];
  precio: Precio | null;
  expensas: number | null;
  estado: EstadoWeb;
  disponibleDesde: string | null;
  edificio: EdificioWeb | null;
  superficie: { total: number | null; cubierta: number | null };
  ambientes: number | null;
  dormitorios: number | null;
  banos: number | null;
  frenteMetros: number | null;
  techada: boolean | null;
  tipoLocal: string | null;
  portada: Media | null;
  cantidadFotos: number;
  amenitiesDestacados: string[];
  actualizadoEn: string;
  /** Todas las ofertas publicadas de la unidad (venta y/o alquiler). */
  ofertas?: Oferta[];
}

export interface Faceta<T = string> {
  value: T;
  label?: string;
  total: number;
}

export interface Facetas {
  operaciones: Faceta<Operacion>[];
  tipos: Faceta<TipoUnidad>[];
  estados: Faceta<EstadoWeb>[];
  provincias: Faceta<string>[];
  ciudades: (Faceta<string> & { provincia?: string })[];
  edificios: (Faceta<string> & { label: string; provincia?: string; ciudad?: string })[];
  dormitorios: Faceta<number>[];
  precio: Partial<Record<Moneda, { min: number; max: number } | null>>;
  superficie: { min: number; max: number } | null;
}

export interface ListadoUnidades {
  data: UnidadListado[];
  total: number;
  page: number;
  limit: number;
  facets: Facetas;
}

export interface Oferta {
  operacion: Operacion;
  precio: Precio | null;
  estado: EstadoWeb;
  disponibleDesde: string | null;
}

export interface AmenityGrupo {
  categoria: string;
  items: { codigo: string; nombre: string; icono: string | null; origen: "edificio" | "unidad" }[];
}

export interface UnidadFicha extends Omit<UnidadListado, "edificio" | "ofertas"> {
  descripcion: string | null;
  ofertas: Oferta[];
  galeria: Media[];
  videos: Media[];
  planos: Media[];
  videosYoutube: string[];
  tours360: { tipo: "foto360" | "video360" | "tour"; url: string }[];
  medidasAmbientes: { ambiente: string; medida: string }[];
  amenities: AmenityGrupo[];
  detalles: {
    orientacion: string | null;
    tipologia: string | null;
    piso: string | null;
    alturaLibre: number | null;
    potenciaElectrica: string | null;
    antiguedadAnios: number | null;
    estadoConservacion: string | null;
    aptoCredito: boolean;
    aceptaPermuta: boolean;
  };
  condicionesAlquiler: Record<string, unknown> | null;
  edificio: (EdificioWeb & { resumen: string | null }) | null;
}

/** Filtros del listado tal como los entiende la API. */
export interface FiltrosCatalogo {
  /** Sin operacion se listan alquiler y venta juntos. */
  operacion?: Operacion;
  tipo?: TipoUnidad[];
  estado?: ("disponible" | "proximamente" | "reservado")[];
  provincia?: string;
  ciudad?: string;
  edificio?: string;
  precioMin?: number;
  precioMax?: number;
  moneda?: Moneda;
  m2Min?: number;
  m2Max?: number;
  dormitorios?: number;
  orden?: OrdenCatalogo;
  page?: number;
  limit?: number;
}
