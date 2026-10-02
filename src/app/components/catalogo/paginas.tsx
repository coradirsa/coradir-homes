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
  formatPrecio,
  listarUnidades,
  obtenerUnidad,
  rutaUnidad,
  ubicacionCorta,
  type Operacion,
  type UnidadFicha,
} from "@/lib/catalogo";
import { mensajeBusqueda, whatsappHref } from "@/lib/catalogo/contacto";
import { Interests, type Interests as Interes } from "@/schemas/formSchema";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const METADATA_LISTADO: Record<Operacion, { pathname: string; title: string; description: string }> = {
  alquiler: {
    pathname: "/alquileres",
    title: "Alquileres en San Luis | Departamentos, locales y cocheras | Coradir Homes",
    description:
      "Departamentos, locales comerciales y cocheras en alquiler en San Luis y Juana Koslay, publicados directo por Coradir Homes. Fotos, precios y disponibilidad actualizados.",
  },
  venta: {
    pathname: "/venta",
    title: "Propiedades en venta en San Luis | Coradir Homes",
    description:
      "Departamentos, locales y cocheras en venta en San Luis: unidades terminadas y en desarrollo de Coradir Homes, con financiación y leasing inmobiliario.",
  },
};

export function metadataListado(operacion: Operacion): Metadata {
  const meta = METADATA_LISTADO[operacion];
  return createMetadata({ pathname: meta.pathname, overrides: { title: meta.title, description: meta.description } }).metadata;
}

export async function PaginaListado({ operacion, searchParams }: { operacion: Operacion; searchParams: SearchParams }) {
  const filtros = filtrosDesdeSearchParams(await searchParams, operacion);
  return <CatalogoListado filtros={filtros} />;
}

async function cargarFicha(slug: string, operacion: Operacion) {
  try {
    return { unidad: await obtenerUnidad(slug, operacion), error: false };
  } catch (error) {
    if (error instanceof CatalogoNoDisponibleError) return { unidad: null, error: true };
    throw error;
  }
}

export async function metadataFicha(slug: string, operacion: Operacion): Promise<Metadata> {
  const { unidad } = await cargarFicha(slug, operacion);
  if (!unidad || !unidad.ofertas.some((o) => o.operacion === operacion)) {
    return { title: "Propiedad no disponible | Coradir Homes", robots: { index: false } };
  }
  const oferta = unidad.ofertas.find((o) => o.operacion === operacion)!;
  const precio = formatPrecio(oferta.precio, operacion);
  const que = operacion === "alquiler" ? "en alquiler" : "en venta";
  const description = [
    `${ETIQUETA_TIPO[unidad.tipo]} ${que} en ${ubicacionCorta(unidad)}.`,
    unidad.superficie.total ? `${unidad.superficie.total} m².` : "",
    `${precio.principal}${precio.sufijo ? ` ${precio.sufijo}` : ""}.`,
  ].filter(Boolean).join(" ");
  return createMetadata({
    pathname: rutaUnidad(operacion, unidad.slug),
    image: unidad.portada?.url,
    overrides: { title: `${unidad.titulo} ${que} | Coradir Homes`, description },
  }).metadata;
}

/** Interes del formulario actual del sitio (Fase 6 lo reemplaza por un lead ligado a la unidad). */
function interesPara(unidad: UnidadFicha): Interes {
  const slug = unidad.edificio?.slug;
  if (slug && (Interests.options as readonly string[]).includes(slug)) return slug as Interes;
  if (unidad.tipo === "local") return "locales-comerciales";
  return "contacto-general";
}

function CatalogoCaido({ operacion }: { operacion: Operacion }) {
  return (
    <div className="bg-surface-crisp px-6 pb-20 pt-16 text-center font-[family-name:var(--font-raleway-sans)]">
      <MaterialIcon name="cloud_off" className="!text-[48px] text-blue-gray" />
      <h1 className="mt-4 text-[26px] font-bold text-blue">No pudimos cargar esta propiedad</h1>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-text-muted">Probá de nuevo en unos minutos o consultanos directamente.</p>
      <WhatsAppLink href={whatsappHref(mensajeBusqueda(operacion))} target="_blank"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-whatsapp px-5 py-3 text-[15px] font-bold text-white">
        <MaterialIcon name="chat" className="!text-[18px]" /> Escribinos por WhatsApp
      </WhatsAppLink>
    </div>
  );
}

export async function PaginaFicha({ slug, operacion }: { slug: string; operacion: Operacion }) {
  const { unidad, error } = await cargarFicha(slug, operacion);
  if (error) return <CatalogoCaido operacion={operacion} />;
  // La unidad existe pero no en esta operacion (ej. /venta/x de una unidad solo en alquiler).
  if (!unidad || !unidad.ofertas.some((o) => o.operacion === operacion)) notFound();

  const relacionadas = await listarUnidades({ operacion, tipo: [unidad.tipo], limit: 4, page: 1 });
  const similares = relacionadas.data.filter((u) => u.id !== unidad.id).slice(0, 3);

  const formulario = (
    <ReCaptcha>
      <ProjectForm
        interest={interesPara(unidad)}
        layout="split"
        heading="¿Te interesa esta propiedad?"
        subtitle={`Dejanos tus datos y un asesor te contacta por ${unidad.codigo ? `la unidad ${unidad.codigo}` : "esta unidad"}.`}
        submitLabel="Enviar consulta"
        id="formulario-unidad"
        transactionTypes={[operacion === "alquiler" ? "alquilar" : "comprar"]}
      />
    </ReCaptcha>
  );

  return <FichaUnidad unidad={unidad} operacion={operacion} similares={similares} formulario={formulario} />;
}
