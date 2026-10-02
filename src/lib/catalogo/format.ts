// Textos y formatos compartidos por las vistas del catalogo.

import type { EstadoWeb, Moneda, Operacion, Precio, TipoUnidad, UnidadListado } from "./types";

export const RUTA_OPERACION: Record<Operacion, string> = {
  alquiler: "/alquileres",
  venta: "/venta",
};

export const ETIQUETA_TIPO: Record<TipoUnidad, string> = {
  departamento: "Departamento",
  local: "Local comercial",
  cochera: "Cochera",
};

export const ETIQUETA_TIPO_PLURAL: Record<TipoUnidad, string> = {
  departamento: "Departamentos",
  local: "Locales",
  cochera: "Cocheras",
};

export const ETIQUETA_CATEGORIA: Record<string, string> = {
  ambientes: "Ambientes",
  instalaciones: "Instalaciones",
  servicios: "Servicios",
  seguridad: "Seguridad",
  complejo: "Complejo",
  otros: "Otros",
};

export const ETIQUETA_CONSERVACION: Record<string, string> = {
  a_estrenar: "A estrenar",
  excelente: "Excelente",
  muy_bueno: "Muy bueno",
  bueno: "Bueno",
  a_reciclar: "A reciclar",
};

export const ETIQUETA_TIPO_LOCAL: Record<string, string> = {
  via_publica: "En vía pública",
  galeria: "En galería",
  shopping: "En shopping",
  complejo: "En complejo",
};

export function rutaUnidad(operacion: Operacion, slug: string) {
  return `${RUTA_OPERACION[operacion]}/${slug}`;
}

export function formatMonto(monto: number, moneda: Moneda) {
  const valor = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(monto);
  return moneda === "USD" ? `USD ${valor}` : `$ ${valor}`;
}

/** "Consultar precio" cuando la unidad oculta el precio o no lo tiene cargado. */
export function formatPrecio(precio: Precio | null, operacion: Operacion) {
  if (!precio) return { principal: "Consultar precio", sufijo: null as string | null, anterior: null as string | null };
  const conPromo = operacion === "venta" && precio.promocional != null && precio.promocional < precio.monto;
  return {
    principal: formatMonto(conPromo ? precio.promocional! : precio.monto, precio.moneda),
    sufijo: operacion === "alquiler" ? "/ mes" : null,
    anterior: conPromo ? formatMonto(precio.monto, precio.moneda) : null,
  };
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "dic 2027" (las fechas de la API vienen a las 00:00 UTC). */
export function formatMesAnio(iso: string | null) {
  if (!iso) return "";
  const fecha = new Date(iso);
  return `${MESES[fecha.getUTCMonth()]} ${fecha.getUTCFullYear()}`;
}

export function etiquetaEstado(estado: EstadoWeb, disponibleDesde: string | null) {
  if (estado === "disponible") return "Disponible";
  if (estado === "disponible_desde") return `Disponible desde ${formatMesAnio(disponibleDesde)}`;
  if (estado === "proximamente") return "Próximamente";
  return "Reservado";
}

/** "Juana Koslay, San Luis" */
export function ubicacionCorta(unidad: Pick<UnidadListado, "edificio">) {
  if (!unidad.edificio) return "San Luis";
  return [unidad.edificio.ciudad, unidad.edificio.provincia].filter(Boolean).join(", ");
}
