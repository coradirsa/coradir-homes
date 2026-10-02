import Link from "next/link";
import MaterialIcon from "../MaterialIcon";
import WhatsAppLink from "../WhatsAppLink";
import FiltrosCatalogo from "./FiltrosCatalogo";
import OrdenSelect from "./OrdenSelect";
import Paginacion from "./Paginacion";
import UnidadCard from "./UnidadCard";
import { contarFiltrosActivos, formatMonto, listarUnidades, queryDelSitio, RUTA_OPERACION, type Facetas, type FiltrosCatalogo as Filtros, type Moneda, type Operacion } from "@/lib/catalogo";
import { mensajeBusqueda, whatsappHref } from "@/lib/catalogo/contacto";

const TEXTOS = {
  alquiler: {
    bajada: "Departamentos, locales comerciales y cocheras publicados directo por Coradir Homes, con precio, fotos y disponibilidad reales. Sin intermediarios.",
    resultados: "en alquiler",
    desde: "Alquileres desde",
  },
  venta: {
    bajada: "Unidades terminadas y en desarrollo de Coradir Homes, con precio publicado, financiación y leasing inmobiliario.",
    resultados: "en venta",
    desde: "Unidades en venta desde",
  },
} as const;

/** Precio mas bajo publicado: en alquiler se prioriza pesos; en venta, dolares. */
function precioDesde(facets: Facetas, operacion: Operacion): { monto: number; moneda: Moneda } | null {
  const orden: Moneda[] = operacion === "alquiler" ? ["ARS", "USD"] : ["USD", "ARS"];
  for (const moneda of orden) {
    const rango = facets.precio?.[moneda];
    if (rango) return { monto: rango.min, moneda };
  }
  return null;
}

/** Pagina de listado compartida por /alquileres y /venta. */
export default async function CatalogoListado({ filtros }: { filtros: Filtros }) {
  const resultado = await listarUnidades(filtros);
  const textos = TEXTOS[filtros.operacion];
  const hayFiltros = contarFiltrosActivos(filtros) > 0;
  const desde = precioDesde(resultado.facets, filtros.operacion);
  const hrefMenorPrecio = `${RUTA_OPERACION[filtros.operacion]}${queryDelSitio({ ...filtros, orden: "precio_asc", page: undefined })}#resultados`;

  return (
    <div className="bg-surface-crisp text-text-primary">
      <section className="relative overflow-hidden bg-blue pb-12 pt-12 text-white md:pt-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto max-w-[1360px] px-6 md:px-10 lg:px-16">
          <h1 className="text-[32px] font-extrabold uppercase leading-[40px] tracking-[-0.01em] md:text-[48px] md:leading-[56px] md:tracking-[-0.02em]">
            Unidades disponibles
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-[26px] text-white/80 md:text-[18px] md:leading-[28px]">{textos.bajada}</p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {desde ? (
              <>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">{textos.desde}</span>
                  <span className="text-[32px] font-extrabold leading-[38px] tracking-[-0.02em]">
                    {formatMonto(desde.monto, desde.moneda)}
                    {filtros.operacion === "alquiler" && <span className="ml-1 text-[15px] font-semibold text-white/70">/ mes</span>}
                  </span>
                </div>
                <Link
                  href={hrefMenorPrecio}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-[14px] font-bold text-blue shadow-[0_2px_8px_-2px_rgba(26,53,85,0.12)] transition hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Ver de menor a mayor precio
                  <MaterialIcon name="arrow_downward" className="!text-[18px]" />
                </Link>
              </>
            ) : (
              <WhatsAppLink
                href={whatsappHref(mensajeBusqueda(filtros.operacion))}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-[14px] font-bold text-blue transition hover:bg-white/90"
              >
                Consultá precios y disponibilidad
                <MaterialIcon name="arrow_forward" className="!text-[18px]" />
              </WhatsAppLink>
            )}
          </div>
        </div>
      </section>

      <section id="resultados" className="mx-auto max-w-[1360px] scroll-mt-4 px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        {resultado.sinConexion && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-status-reserved/30 bg-status-reserved/10 p-4 text-[14px] text-text-primary" role="status">
            <MaterialIcon name="cloud_off" className="text-status-reserved" />
            <p>
              No pudimos cargar las propiedades en este momento. Probá de nuevo en unos minutos o{" "}
              <WhatsAppLink href={whatsappHref(mensajeBusqueda(filtros.operacion))} target="_blank" className="font-semibold text-blue underline">
                escribinos por WhatsApp
              </WhatsAppLink>
              .
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4 xl:col-span-3">
            <FiltrosCatalogo filtros={filtros} facets={resultado.facets} />
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-[22px] font-bold leading-[30px] text-blue md:text-[28px] md:leading-[36px]">
                  {resultado.total === 1 ? "1 propiedad" : `${resultado.total} propiedades`} {textos.resultados}
                </h2>
                {hayFiltros && <p className="mt-1 text-[13px] text-text-muted">Con los filtros aplicados</p>}
              </div>
              {resultado.total > 1 && <OrdenSelect filtros={filtros} />}
            </div>

            {resultado.data.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {resultado.data.map((unidad, i) => (
                  <UnidadCard key={unidad.id} unidad={unidad} prioridad={i < 3} />
                ))}
              </div>
            ) : (
              !resultado.sinConexion && (
                <div className="rounded-xl border border-dashed border-border-strong bg-white px-6 py-14 text-center">
                  <MaterialIcon name="search_off" className="!text-[40px] text-blue-gray" />
                  <h3 className="mt-3 text-[18px] font-bold text-blue">
                    {hayFiltros ? "No hay propiedades con esos filtros" : `Por ahora no hay propiedades ${textos.resultados}`}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-[14px] text-text-muted">
                    Dejanos tu consulta y te avisamos apenas se libere una unidad que encaje con lo que buscás.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {hayFiltros && (
                      <Link href={RUTA_OPERACION[filtros.operacion]} className="rounded-lg border border-blue px-5 py-2.5 text-[14px] font-semibold text-blue hover:bg-blue/5">
                        Quitar filtros
                      </Link>
                    )}
                    <WhatsAppLink
                      href={whatsappHref(mensajeBusqueda(filtros.operacion))}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-5 py-2.5 text-[14px] font-bold text-white hover:brightness-95"
                    >
                      <MaterialIcon name="chat" className="!text-[18px]" /> Avisame por WhatsApp
                    </WhatsAppLink>
                  </div>
                </div>
              )
            )}

            <Paginacion filtros={filtros} total={resultado.total} />
          </div>
        </div>
      </section>
    </div>
  );
}
