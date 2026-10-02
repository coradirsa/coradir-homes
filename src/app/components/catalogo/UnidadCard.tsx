import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "../MaterialIcon";
import EstadoBadge from "./EstadoBadge";
import {
  ETIQUETA_TIPO,
  formatPrecio,
  rutaUnidad,
  ubicacionCorta,
  type UnidadListado,
} from "@/lib/catalogo";

function Spec({ icono, children }: { icono: string; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <MaterialIcon name={icono} className="!text-[16px] text-blue" />
      <span>{children}</span>
    </span>
  );
}

/** Specs segun el tipo de unidad: m2 siempre, y dormitorios/banos o frente o techada. */
function specsDe(unidad: UnidadListado) {
  const specs: { icono: string; texto: string }[] = [];
  if (unidad.superficie.total) specs.push({ icono: "square_foot", texto: `${unidad.superficie.total} m²` });
  if (unidad.tipo === "departamento") {
    if (unidad.dormitorios) specs.push({ icono: "bed", texto: unidad.dormitorios === 1 ? "1 dormitorio" : `${unidad.dormitorios} dormitorios` });
    if (unidad.banos) specs.push({ icono: "shower", texto: unidad.banos === 1 ? "1 baño" : `${unidad.banos} baños` });
  }
  if (unidad.tipo === "local") {
    if (unidad.frenteMetros) specs.push({ icono: "storefront", texto: `${unidad.frenteMetros} m de frente` });
    if (unidad.banos) specs.push({ icono: "shower", texto: unidad.banos === 1 ? "1 baño" : `${unidad.banos} baños` });
  }
  if (unidad.tipo === "cochera") specs.push({ icono: "garage", texto: unidad.techada ? "Techada" : "Descubierta" });
  return specs.slice(0, 4);
}

export default function UnidadCard({ unidad, prioridad = false }: { unidad: UnidadListado; prioridad?: boolean }) {
  const precio = formatPrecio(unidad.precio, unidad.operacion);
  const otraOperacion = unidad.operaciones.find((op) => op !== unidad.operacion);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-white shadow-[0_2px_8px_-2px_rgba(26,53,85,0.06),0_1px_3px_0_rgba(26,53,85,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_12px_24px_-4px_rgba(26,53,85,0.10),0_4px_8px_-2px_rgba(26,53,85,0.04)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-crisp">
        {unidad.portada ? (
          <Image
            src={unidad.portada.url}
            alt={unidad.portada.altText || unidad.titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={prioridad}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            <MaterialIcon name="image" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <EstadoBadge estado={unidad.estado} disponibleDesde={unidad.disponibleDesde} />
        </div>
        {unidad.superficie.total ? (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-text-primary backdrop-blur-sm">
            {unidad.superficie.total} m²
          </span>
        ) : null}
        {unidad.cantidadFotos > 1 && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded bg-navy-deep/75 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            <MaterialIcon name="photo_library" className="!text-[13px]" /> {unidad.cantidadFotos}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
          {ETIQUETA_TIPO[unidad.tipo]} · {unidad.operacion === "alquiler" ? "Alquiler" : "Venta"}
        </span>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[24px] font-extrabold leading-[30px] tracking-[-0.01em] text-blue">{precio.principal}</span>
          {precio.sufijo && <span className="text-[13px] font-semibold text-text-muted">{precio.sufijo}</span>}
        </div>
        {precio.anterior && <span className="text-[13px] text-text-muted line-through">{precio.anterior}</span>}
        {unidad.expensas ? (
          <span className="text-[13px] text-text-muted">+ $ {new Intl.NumberFormat("es-AR").format(unidad.expensas)} expensas</span>
        ) : null}
        {otraOperacion && (
          <span className="text-[12px] font-semibold text-blue-gray">También en {otraOperacion === "venta" ? "venta" : "alquiler"}</span>
        )}

        <h3 className="mt-3 text-[18px] font-bold leading-[26px] text-blue">
          <Link href={rutaUnidad(unidad.operacion, unidad.slug)} className="after:absolute after:inset-0 focus:outline-none">
            {unidad.titulo}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1 text-[13px] text-text-muted">
          <MaterialIcon name="location_on" className="!text-[16px] text-blue" />
          {unidad.edificio?.nombre ? `${unidad.edificio.nombre} · ` : ""}
          {ubicacionCorta(unidad)}
        </p>

        <div className="my-4 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-border-subtle py-3 text-[13px] text-text-muted">
          {specsDe(unidad).map((spec) => (
            <Spec key={spec.icono + spec.texto} icono={spec.icono}>{spec.texto}</Spec>
          ))}
        </div>

        {unidad.amenitiesDestacados.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-1.5" aria-label="Destacados">
            {unidad.amenitiesDestacados.slice(0, 3).map((amenity) => (
              <li key={amenity} className="rounded bg-[#e2efff] px-2 py-0.5 text-[11px] font-semibold tracking-[0.02em] text-blue">
                {amenity}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-border-subtle bg-surface-crisp py-2.5 text-[14px] font-bold text-blue transition-colors group-hover:border-blue group-hover:bg-blue group-hover:text-white">
          Ver detalle
          <MaterialIcon name="arrow_forward" className="!text-[18px]" />
        </span>
      </div>
    </article>
  );
}
