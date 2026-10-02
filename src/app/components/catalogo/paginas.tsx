// Logica compartida de las rutas /alquileres, /venta y sus fichas.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MaterialIcon from "../MaterialIcon";
import ProjectForm from "../projectForm";
import ReCaptcha from "../reCaptcha";
import WhatsAppLink from "../WhatsAppLink";
import CatalogoListado from "./CatalogoListado";
import FichaUnidad from "./FichaUnidad";
import { createMetadata } from "@/lib/seo";
import {
  CatalogoNoDisponibleError,
  ETIQUETA_TIPO,
  filtrosDesdeSearchParams,
  operacionDesde,
  RUTA_CATALOGO,
  formatPrecio,
  listarUnidades,
  obtenerUnidad,
  rutaUnidad,
  ubicacionCorta,
  type Operacion,
  type UnidadFicha,
} from "@/lib/catalogo";
import { SITIO_URL, mensajeBusqueda, whatsappHref } from "@/lib/catalogo/contacto";
import { Interests, type Interests as Interes } from "@/schemas/formSchema";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export function metadataListado(): Metadata {
  return createMetadata({
    pathname: RUTA_CATALOGO,
    overrides: {
      title: "Unidades disponibles en alquiler y venta en San Luis | Coradir Homes",
      description:
        "Departamentos, locales comerciales y cocheras de Coradir Homes en alquiler y en venta en San Luis y Juana Koslay. Fotos, precios y disponibilidad actualizados.",
    },
  }).metadata;
}

export async function PaginaListado({ searchParams }: { searchParams: SearchParams }) {
  const filtros = filtrosDesdeSearchParams(await searchParams);
  return <CatalogoListado filtros={filtros} />;
}

async function cargarFicha(slug: string) {
  try {
    return { unidad: await obtenerUnidad(slug), error: false };
  } catch (error) {
    if (error instanceof CatalogoNoDisponibleError) return { unidad: null, error: true };
    throw error;
  }
}

/** Operacion que se muestra primero: la pedida si la unidad la ofrece; si no, alquiler y despues venta. */
function operacionPrincipal(unidad: UnidadFicha, pedida?: Operacion): Operacion {
  if (pedida && unidad.ofertas.some((o) => o.operacion === pedida)) return pedida;
  return unidad.ofertas.find((o) => o.operacion === "alquiler")?.operacion ?? unidad.ofertas[0].operacion;
}

export async function metadataFicha(slug: string): Promise<Metadata> {
  const { unidad } = await cargarFicha(slug);
  if (!unidad || !unidad.ofertas.length) {
    return { title: "Unidad no disponible | Coradir Homes", robots: { index: false } };
  }
  const que = unidad.ofertas.map((o) => (o.operacion === "alquiler" ? "alquiler" : "venta")).join(" y ");
  const precios = unidad.ofertas
    .map((o) => {
      const p = formatPrecio(o.precio, o.operacion);
      return `${o.operacion === "alquiler" ? "Alquiler" : "Venta"}: ${p.principal}${p.sufijo ? ` ${p.sufijo}` : ""}`;
    })
    .join(" · ");
  const description = [
    `${ETIQUETA_TIPO[unidad.tipo]} en ${que} en ${ubicacionCorta(unidad)}.`,
    unidad.superficie.total ? `${unidad.superficie.total} m².` : "",
    `${precios}.`,
  ].filter(Boolean).join(" ");
  return createMetadata({
    pathname: rutaUnidad(unidad.slug),
    image: unidad.portada?.url,
    overrides: { title: `${unidad.titulo} en ${que} | Coradir Homes`, description },
  }).metadata;
}

/** Interes del formulario (para el mail de n8n); la unidad viaja aparte en `unidad`. */
function interesPara(unidad: UnidadFicha): Interes {
  const slug = unidad.edificio?.slug;
  if (slug && (Interests.options as readonly string[]).includes(slug)) return slug as Interes;
  if (unidad.tipo === "local") return "locales-comerciales";
  return "contacto-general";
}

function CatalogoCaido() {
  return (
    <div className="bg-surface-crisp px-6 pb-20 pt-16 text-center">
      <MaterialIcon name="cloud_off" className="!text-[48px] text-blue-gray" />
      <h1 className="mt-4 text-[26px] font-bold text-blue">No pudimos cargar esta unidad</h1>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-text-muted">Probá de nuevo en unos minutos o consultanos directamente.</p>
      <WhatsAppLink href={whatsappHref(mensajeBusqueda())} target="_blank"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-whatsapp px-5 py-3 text-[15px] font-bold text-white">
        <MaterialIcon name="chat" className="!text-[18px]" /> Consultanos por WhatsApp
      </WhatsAppLink>
    </div>
  );
}

export async function PaginaFicha({ slug, searchParams }: { slug: string; searchParams: SearchParams }) {
  const { unidad, error } = await cargarFicha(slug);
  if (error) return <CatalogoCaido />;
  if (!unidad || !unidad.ofertas.length) notFound();

  const operacion = operacionPrincipal(unidad, operacionDesde((await searchParams).operacion));
  const relacionadas = await listarUnidades({ tipo: [unidad.tipo], limit: 4, page: 1 });
  const similares = relacionadas.data.filter((u) => u.id !== unidad.id).slice(0, 3);

  const formulario = (
    <ReCaptcha>
      <ProjectForm
        interest={interesPara(unidad)}
        layout="split"
        heading="¿Te interesa esta unidad?"
        subtitle={`Dejanos tus datos y un asesor te contacta por ${unidad.codigo ? `la unidad ${unidad.codigo}` : "esta unidad"}.`}
        submitLabel="Enviar consulta"
        id="formulario-unidad"
        transactionTypes={unidad.ofertas.length > 1 ? ["alquilar", "comprar"] : [operacion === "alquiler" ? "alquilar" : "comprar"]}
        backgroundImage={unidad.portada?.url}
        unidad={{
          id: unidad.id,
          slug: unidad.slug,
          tipo: unidad.tipo,
          operacion,
          titulo: unidad.titulo,
          codigo: unidad.codigo,
          url: `${SITIO_URL}${rutaUnidad(unidad.slug, operacion)}`,
        }}
      />
    </ReCaptcha>
  );

  return <FichaUnidad unidad={unidad} operacion={operacion} similares={similares} formulario={formulario} />;
}
