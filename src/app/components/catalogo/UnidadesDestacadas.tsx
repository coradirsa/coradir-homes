import Link from "next/link";
import MaterialIcon from "../MaterialIcon";
import UnidadCard from "./UnidadCard";
import { listarUnidades, queryDelSitio, RUTA_CATALOGO, type Operacion, type TipoUnidad } from "@/lib/catalogo";

/**
 * Bloque con unidades reales del catalogo para paginas de marketing
 * (ej. /locales-comerciales). Si no hay nada publicado no renderiza nada.
 */
export default async function UnidadesDestacadas({
  tipo,
  operacion = "alquiler",
  titulo,
  bajada,
  cantidad = 3,
}: {
  tipo: TipoUnidad;
  operacion?: Operacion;
  titulo: string;
  bajada?: string;
  cantidad?: number;
}) {
  const resultado = await listarUnidades({ operacion, tipo: [tipo], orden: "recientes", limit: cantidad, page: 1 });
  if (!resultado.data.length) return null;

  const verTodas = `${RUTA_CATALOGO}${queryDelSitio({ tipo: [tipo], operacion })}`;

  return (
    <section className="bg-surface-crisp px-5 py-14 md:py-20">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-raleway text-sm font-bold uppercase tracking-[0.22em] text-blue-light">
              {operacion === "alquiler" ? "Disponibles para alquilar" : "Disponibles para comprar"}
            </p>
            <h2 className="mt-3 font-playfair text-3xl leading-tight text-blue md:text-5xl">{titulo}</h2>
            {bajada && <p className="mt-4 font-raleway text-base leading-7 text-gray md:max-w-3xl md:text-lg">{bajada}</p>}
          </div>
          <Link href={verTodas} className="inline-flex shrink-0 items-center gap-2 font-raleway text-sm font-bold uppercase tracking-wide text-blue hover:underline">
            Ver {resultado.total > cantidad ? `las ${resultado.total}` : "todas"}
            <MaterialIcon name="arrow_forward" className="!text-[20px]" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resultado.data.map((unidad) => <UnidadCard key={unidad.id} unidad={unidad} />)}
        </div>
      </div>
    </section>
  );
}
