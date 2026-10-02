import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "../MaterialIcon";
import WhatsAppLink from "../WhatsAppLink";
import EstadoBadge from "./EstadoBadge";
import GaleriaUnidad from "./GaleriaUnidad";
import UnidadCard from "./UnidadCard";
import {
  ETIQUETA_CATEGORIA,
  ETIQUETA_CONSERVACION,
  ETIQUETA_TIPO,
  ETIQUETA_TIPO_LOCAL,
  RUTA_OPERACION,
  formatMesAnio,
  formatPrecio,
  rutaUnidad,
  ubicacionCorta,
  type Operacion,
  type UnidadFicha,
  type UnidadListado,
} from "@/lib/catalogo";
import { SITIO_URL, mensajeUnidad, whatsappHref } from "@/lib/catalogo/contacto";

const ICONOS_CATEGORIA: Record<string, string> = {
  ambientes: "meeting_room",
  instalaciones: "electrical_services",
  servicios: "wifi",
  seguridad: "shield",
  complejo: "apartment",
  otros: "check_circle",
};

const ETIQUETA_CONDICION: Record<string, string> = {
  garantia: "Garantía",
  ajuste: "Ajuste",
  plazoMinimoMeses: "Plazo mínimo",
  deposito: "Depósito",
  requisitos: "Requisitos",
};

function youtubeId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{6,})/);
  return match?.[1] ?? null;
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border-subtle bg-white p-6 md:p-8">
      <h2 className="mb-5 text-[22px] font-bold leading-[30px] text-blue">{titulo}</h2>
      {children}
    </section>
  );
}

function Dato({ icono, etiqueta, valor }: { icono: string; etiqueta: string; valor: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-crisp text-blue">
        <MaterialIcon name={icono} className="!text-[20px]" />
      </span>
      <div>
        <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">{etiqueta}</dt>
        <dd className="text-[15px] font-semibold text-text-primary">{valor}</dd>
      </div>
    </div>
  );
}

function datosPrincipales(unidad: UnidadFicha) {
  const datos: { icono: string; etiqueta: string; valor: string }[] = [];
  if (unidad.superficie.total) datos.push({ icono: "square_foot", etiqueta: "Superficie total", valor: `${unidad.superficie.total} m²` });
  if (unidad.superficie.cubierta && unidad.superficie.cubierta !== unidad.superficie.total)
    datos.push({ icono: "roofing", etiqueta: "Cubierta", valor: `${unidad.superficie.cubierta} m²` });
  if (unidad.ambientes) datos.push({ icono: "grid_view", etiqueta: "Ambientes", valor: String(unidad.ambientes) });
  if (unidad.dormitorios) datos.push({ icono: "bed", etiqueta: "Dormitorios", valor: String(unidad.dormitorios) });
  if (unidad.banos) datos.push({ icono: "shower", etiqueta: "Baños", valor: String(unidad.banos) });
  if (unidad.frenteMetros) datos.push({ icono: "storefront", etiqueta: "Frente", valor: `${unidad.frenteMetros} m` });
  if (unidad.detalles.alturaLibre) datos.push({ icono: "height", etiqueta: "Altura libre", valor: `${unidad.detalles.alturaLibre} m` });
  if (unidad.detalles.potenciaElectrica) datos.push({ icono: "bolt", etiqueta: "Potencia", valor: unidad.detalles.potenciaElectrica });
  if (unidad.tipoLocal) datos.push({ icono: "store", etiqueta: "Ubicación", valor: ETIQUETA_TIPO_LOCAL[unidad.tipoLocal] ?? unidad.tipoLocal });
  if (unidad.techada !== null && unidad.tipo === "cochera") datos.push({ icono: "garage", etiqueta: "Cochera", valor: unidad.techada ? "Techada" : "Descubierta" });
  if (unidad.detalles.piso) datos.push({ icono: "stairs", etiqueta: "Piso", valor: unidad.detalles.piso });
  if (unidad.detalles.orientacion) datos.push({ icono: "explore", etiqueta: "Orientación", valor: unidad.detalles.orientacion });
  if (unidad.detalles.estadoConservacion)
    datos.push({ icono: "verified", etiqueta: "Estado", valor: ETIQUETA_CONSERVACION[unidad.detalles.estadoConservacion] ?? unidad.detalles.estadoConservacion });
  if (unidad.detalles.antiguedadAnios !== null && unidad.detalles.antiguedadAnios !== undefined)
    datos.push({ icono: "history", etiqueta: "Antigüedad", valor: unidad.detalles.antiguedadAnios === 0 ? "A estrenar" : `${unidad.detalles.antiguedadAnios} años` });
  return datos;
}

/** Tarjeta de precio + contacto (columna derecha en desktop, arriba en mobile). */
function TarjetaPrecio({ unidad, operacion }: { unidad: UnidadFicha; operacion: Operacion }) {
  const oferta = unidad.ofertas.find((o) => o.operacion === operacion) ?? unidad.ofertas[0];
  const otra = unidad.ofertas.find((o) => o.operacion !== oferta.operacion);
  const precio = formatPrecio(oferta.precio, oferta.operacion);
  const url = `${SITIO_URL}${rutaUnidad(oferta.operacion, unidad.slug)}`;
  const mensaje = mensajeUnidad({ titulo: unidad.titulo, codigo: unidad.codigo, operacion: oferta.operacion, url });

  return (
    <div className="rounded-xl border border-border-subtle bg-white p-6 shadow-[0_2px_8px_-2px_rgba(26,53,85,0.06)]">
      {unidad.ofertas.length > 1 && (
        <div className="mb-5 inline-flex w-full rounded-lg bg-surface-crisp p-1" role="group" aria-label="Operación">
          {unidad.ofertas.map((o) => (
            <Link
              key={o.operacion}
              href={rutaUnidad(o.operacion, unidad.slug)}
              aria-current={o.operacion === oferta.operacion ? "page" : undefined}
              className={`flex-1 rounded-md py-2 text-center text-[14px] font-bold ${o.operacion === oferta.operacion ? "bg-white text-blue shadow-sm" : "text-text-muted hover:text-blue"}`}
            >
              {o.operacion === "alquiler" ? "Alquiler" : "Venta"}
            </Link>
          ))}
        </div>
      )}
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
        {oferta.operacion === "alquiler" ? "Alquiler mensual" : "Precio de venta"}
      </span>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-[32px] font-extrabold leading-[38px] tracking-[-0.02em] text-blue">{precio.principal}</span>
        {precio.sufijo && <span className="text-[14px] font-semibold text-text-muted">{precio.sufijo}</span>}
      </div>
      {precio.anterior && <p className="text-[14px] text-text-muted line-through">{precio.anterior}</p>}
      {unidad.expensas ? <p className="mt-1 text-[14px] text-text-muted">+ $ {new Intl.NumberFormat("es-AR").format(unidad.expensas)} de expensas</p> : null}
      {otra && unidad.ofertas.length > 1 && otra.precio && (
        <p className="mt-2 text-[13px] text-text-muted">
          {otra.operacion === "venta" ? "También en venta: " : "También en alquiler: "}
          <span className="font-semibold text-blue">{formatPrecio(otra.precio, otra.operacion).principal}</span>
        </p>
      )}
      <div className="mt-4">
        <EstadoBadge estado={oferta.estado} disponibleDesde={oferta.disponibleDesde} />
      </div>
      {(unidad.detalles.aptoCredito || unidad.detalles.aceptaPermuta) && oferta.operacion === "venta" && (
        <ul className="mt-4 flex flex-wrap gap-2 text-[12px] font-semibold text-blue">
          {unidad.detalles.aptoCredito && <li className="rounded bg-[#e2efff] px-2 py-1">Apto crédito</li>}
          {unidad.detalles.aceptaPermuta && <li className="rounded bg-[#e2efff] px-2 py-1">Acepta permuta</li>}
        </ul>
      )}
      <div className="mt-6 space-y-3">
        <WhatsAppLink
          href={whatsappHref(mensaje)}
          target="_blank"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp py-3 text-[15px] font-bold text-white transition hover:brightness-95"
        >
          <MaterialIcon name="chat" className="!text-[20px]" />
          Consultar por WhatsApp
        </WhatsAppLink>
        <a
          href="#consulta"
          className="flex w-full items-center justify-center gap-2 rounded-lg border-[1.5px] border-blue py-3 text-[15px] font-bold text-blue transition hover:bg-blue/5"
        >
          <MaterialIcon name="mail" className="!text-[20px]" />
          Dejar una consulta
        </a>
      </div>
      {unidad.codigo && <p className="mt-4 text-center text-[12px] text-text-muted">Código de referencia: {unidad.codigo}</p>}
    </div>
  );
}

export default function FichaUnidad({
  unidad,
  operacion,
  similares,
  formulario,
}: {
  unidad: UnidadFicha;
  operacion: Operacion;
  similares: UnidadListado[];
  formulario: React.ReactNode;
}) {
  const datos = datosPrincipales(unidad);
  const ubicacion = unidad.edificio?.ubicacion;
  const mapaEmbed =
    ubicacion?.latitud != null && ubicacion?.longitud != null
      ? `https://www.google.com/maps?q=${ubicacion.latitud},${ubicacion.longitud}&z=16&output=embed`
      : unidad.edificio
        ? `https://www.google.com/maps?q=${encodeURIComponent(`${unidad.edificio.direccion}, ${unidad.edificio.ciudad}, ${unidad.edificio.provincia}`)}&output=embed`
        : null;
  const condiciones = operacion === "alquiler" && unidad.condicionesAlquiler ? Object.entries(unidad.condicionesAlquiler) : [];
  const videos = unidad.videosYoutube.map(youtubeId).filter((id): id is string => Boolean(id));

  return (
    <div className="bg-surface-crisp pb-16 pt-8 font-[family-name:var(--font-raleway-sans)] text-text-primary md:pt-10">
      <div className="mx-auto max-w-[1360px] px-6 md:px-10 lg:px-16">
        <nav aria-label="Migas de pan" className="mb-5 text-[13px] text-text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-blue">Inicio</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={RUTA_OPERACION[operacion]} className="hover:text-blue">{operacion === "alquiler" ? "Alquileres" : "Venta"}</Link></li>
            <li aria-hidden>/</li>
            <li className="font-semibold text-text-primary" aria-current="page">{unidad.titulo}</li>
          </ol>
        </nav>

        <header className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">{ETIQUETA_TIPO[unidad.tipo]}</span>
          <h1 className="mt-1 text-[26px] font-bold leading-[34px] text-blue md:text-[36px] md:font-extrabold md:leading-[44px] md:tracking-[-0.015em]">
            {unidad.titulo}
          </h1>
          <p className="mt-2 flex items-center gap-1 text-[15px] text-text-muted">
            <MaterialIcon name="location_on" className="!text-[18px] text-blue" />
            {unidad.edificio ? `${unidad.edificio.direccion} · ` : ""}{ubicacionCorta(unidad)}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <GaleriaUnidad fotos={unidad.galeria} titulo={unidad.titulo} />

            <div className="lg:hidden">
              <TarjetaPrecio unidad={unidad} operacion={operacion} />
            </div>

            {datos.length > 0 && (
              <Seccion titulo="Características">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {datos.map((d) => <Dato key={d.etiqueta} {...d} />)}
                </dl>
              </Seccion>
            )}

            {unidad.descripcion && (
              <Seccion titulo="Descripción">
                <div className="whitespace-pre-line text-[15px] leading-[26px] text-text-primary/90">{unidad.descripcion}</div>
              </Seccion>
            )}

            {unidad.amenities.length > 0 && (
              <Seccion titulo="Comodidades y servicios">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {unidad.amenities.map((grupo) => (
                    <div key={grupo.categoria}>
                      <h3 className="mb-3 flex items-center gap-2 text-[14px] font-bold text-blue">
                        <MaterialIcon name={ICONOS_CATEGORIA[grupo.categoria] ?? "check_circle"} className="!text-[18px]" />
                        {ETIQUETA_CATEGORIA[grupo.categoria] ?? grupo.categoria}
                      </h3>
                      <ul className="space-y-2">
                        {grupo.items.map((item) => (
                          <li key={item.codigo} className="flex items-center gap-2 text-[14px] text-text-primary">
                            <MaterialIcon name="check" className="!text-[16px] text-status-available" />
                            {item.nombre}
                            {item.origen === "edificio" && <span className="text-[11px] text-text-muted">· del complejo</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Seccion>
            )}

            {unidad.medidasAmbientes.length > 0 && (
              <Seccion titulo="Medidas">
                <table className="w-full text-[14px]">
                  <tbody>
                    {unidad.medidasAmbientes.map((m, i) => (
                      <tr key={m.ambiente + i} className={i % 2 ? "bg-surface-crisp" : ""}>
                        <th scope="row" className="px-4 py-2.5 text-left font-medium text-text-muted">{m.ambiente}</th>
                        <td className="px-4 py-2.5 text-right font-semibold text-text-primary">{m.medida} m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Seccion>
            )}

            {(unidad.planos.length > 0 || videos.length > 0 || unidad.videos.length > 0 || unidad.tours360.length > 0) && (
              <Seccion titulo="Planos, videos y recorridos">
                <div className="space-y-6">
                  {unidad.planos.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {unidad.planos.map((plano, i) => (
                        <a key={plano.id} href={plano.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-[4/3] overflow-hidden rounded-lg border border-border-subtle bg-surface-crisp">
                          <Image src={plano.url} alt={plano.altText || `Plano ${i + 1} de ${unidad.titulo}`} fill sizes="(max-width: 640px) 100vw, 400px" className="object-contain p-2" />
                        </a>
                      ))}
                    </div>
                  )}
                  {videos.map((id) => (
                    <div key={id} className="relative aspect-video overflow-hidden rounded-lg">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${id}`}
                        title={`Video de ${unidad.titulo}`}
                        loading="lazy"
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  ))}
                  {unidad.videos.map((video) => (
                    <video key={video.id} src={video.url} controls preload="metadata" className="w-full rounded-lg bg-black" />
                  ))}
                  {unidad.tours360.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {unidad.tours360.map((tour, i) => (
                        <a key={tour.url + i} href={tour.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-blue px-4 py-2.5 text-[14px] font-semibold text-blue hover:bg-blue/5">
                          <MaterialIcon name="360" className="!text-[20px]" />
                          {tour.tipo === "video360" ? "Video 360°" : tour.tipo === "foto360" ? "Foto 360°" : "Recorrido virtual"}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </Seccion>
            )}

            {condiciones.length > 0 && (
              <Seccion titulo="Condiciones de alquiler">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {condiciones.map(([clave, valor]) => (
                    <div key={clave} className={clave === "requisitos" ? "sm:col-span-2" : ""}>
                      <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">{ETIQUETA_CONDICION[clave] ?? clave}</dt>
                      <dd className="mt-1 whitespace-pre-line text-[15px] text-text-primary">
                        {clave === "plazoMinimoMeses" ? `${valor} meses` : String(valor)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Seccion>
            )}

            {unidad.edificio && (
              <Seccion titulo="Ubicación">
                <p className="mb-4 text-[15px] text-text-primary">
                  <strong>{unidad.edificio.nombre}</strong> · {unidad.edificio.direccion}, {unidad.edificio.ciudad}
                  {unidad.edificio.estadoDesarrollo !== "entregado" && unidad.edificio.fechaEntregaEstimada && (
                    <span className="block text-[13px] text-text-muted">Entrega estimada del desarrollo: {formatMesAnio(unidad.edificio.fechaEntregaEstimada)}</span>
                  )}
                </p>
                {mapaEmbed && (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border-subtle">
                    <iframe src={mapaEmbed} title={`Mapa de ${unidad.edificio.nombre}`} loading="lazy" className="absolute inset-0 h-full w-full" referrerPolicy="no-referrer-when-downgrade" />
                  </div>
                )}
                {ubicacion?.googleMapsUrl && (
                  <a href={ubicacion.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-blue hover:underline">
                    Abrir en Google Maps <MaterialIcon name="open_in_new" className="!text-[16px]" />
                  </a>
                )}
              </Seccion>
            )}

            <div id="consulta" className="scroll-mt-6">{formulario}</div>
          </div>

          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-6">
              <TarjetaPrecio unidad={unidad} operacion={operacion} />
            </div>
          </aside>
        </div>

        {similares.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-[22px] font-bold text-blue md:text-[28px]">También te puede interesar</h2>
              <Link href={RUTA_OPERACION[operacion]} className="text-[14px] font-semibold text-blue hover:underline">Ver todas</Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {similares.map((u) => <UnidadCard key={u.id} unidad={u} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
