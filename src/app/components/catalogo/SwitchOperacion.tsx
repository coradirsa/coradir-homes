import Link from "next/link";
import { RUTA_OPERACION, type Operacion } from "@/lib/catalogo";

/** Switch segmentado Alquilar / Comprar (DESIGN.md: "Commercial Segmented Switch"). */
export default function SwitchOperacion({ actual }: { actual: Operacion }) {
  const opciones: { operacion: Operacion; label: string }[] = [
    { operacion: "alquiler", label: "Alquilar" },
    { operacion: "venta", label: "Comprar" },
  ];
  return (
    <nav className="inline-flex rounded-lg bg-white/10 p-1 backdrop-blur-sm" aria-label="Tipo de operación">
      {opciones.map(({ operacion, label }) => (
        <Link
          key={operacion}
          href={RUTA_OPERACION[operacion]}
          aria-current={actual === operacion ? "page" : undefined}
          className={`rounded-md px-5 py-2 text-[14px] font-bold transition-colors ${
            actual === operacion ? "bg-white text-blue shadow-[0_2px_8px_-2px_rgba(26,53,85,0.2)]" : "text-white/80 hover:text-white"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
