// Contacto comercial de las vistas del catalogo.

import type { Operacion } from "./types";

export const WHATSAPP_COMERCIAL = process.env.NEXT_PUBLIC_LEAD_BOT_WHATSAPP_NUMBER || "5492664649967";
export const SITIO_URL = "https://homes.coradir.com.ar";

export function whatsappHref(mensaje: string) {
  return `https://wa.me/${WHATSAPP_COMERCIAL}?text=${encodeURIComponent(mensaje)}`;
}

/** Mensaje prellenado con la unidad, para que el asesor sepa de que se trata. */
export function mensajeUnidad({ titulo, codigo, operacion, url }: { titulo: string; codigo: string | null; operacion: Operacion; url: string }) {
  const que = operacion === "alquiler" ? "alquilar" : "comprar";
  const ref = codigo ? ` (ref. ${codigo})` : "";
  return `Hola, me interesa ${que} ${titulo}${ref}. ${url}`;
}

export function mensajeBusqueda(operacion: Operacion) {
  return operacion === "alquiler"
    ? "Hola, estoy buscando una propiedad en alquiler. ¿Me avisan cuando haya algo disponible?"
    : "Hola, estoy buscando una propiedad para comprar. ¿Me avisan cuando haya algo disponible?";
}
