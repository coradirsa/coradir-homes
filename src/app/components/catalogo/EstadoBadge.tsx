import { etiquetaEstado, type EstadoWeb } from "@/lib/catalogo";

const ESTILOS: Record<EstadoWeb, string> = {
  disponible: "bg-status-available text-white",
  disponible_desde: "bg-status-reserved text-white",
  proximamente: "bg-status-reserved text-white",
  reservado: "bg-blue-gray text-white",
};

export default function EstadoBadge({
  estado,
  disponibleDesde,
  className = "",
}: {
  estado: EstadoWeb;
  disponibleDesde: string | null;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase leading-none tracking-[0.06em] ${ESTILOS[estado]} ${className}`}
    >
      {etiquetaEstado(estado, disponibleDesde)}
    </span>
  );
}
