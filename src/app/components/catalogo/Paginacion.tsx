import Link from "next/link";
import MaterialIcon from "../MaterialIcon";
import { queryDelSitio, RUTA_CATALOGO, type FiltrosCatalogo } from "@/lib/catalogo";

export default function Paginacion({ filtros, total }: { filtros: FiltrosCatalogo; total: number }) {
  const porPagina = filtros.limit ?? 24;
  const paginas = Math.ceil(total / porPagina);
  const actual = filtros.page ?? 1;
  if (paginas <= 1) return null;

  const href = (page: number) => `${RUTA_CATALOGO}${queryDelSitio({ ...filtros, page })}`;
  const numeros = Array.from({ length: paginas }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === paginas || Math.abs(n - actual) <= 1
  );

  const base = "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-[14px] font-semibold transition-colors";

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Paginación">
      {actual > 1 && (
        <Link href={href(actual - 1)} className={`${base} border-border-subtle bg-white text-blue hover:border-blue`} aria-label="Página anterior">
          <MaterialIcon name="chevron_left" className="!text-[20px]" />
        </Link>
      )}
      {numeros.map((n, i) => (
        <span key={n} className="flex items-center gap-1.5">
          {i > 0 && n - numeros[i - 1] > 1 && <span className="px-1 text-text-muted">…</span>}
          <Link
            href={href(n)}
            aria-current={n === actual ? "page" : undefined}
            className={`${base} ${n === actual ? "border-blue bg-blue text-white" : "border-border-subtle bg-white text-blue hover:border-blue"}`}
          >
            {n}
          </Link>
        </span>
      ))}
      {actual < paginas && (
        <Link href={href(actual + 1)} className={`${base} border-border-subtle bg-white text-blue hover:border-blue`} aria-label="Página siguiente">
          <MaterialIcon name="chevron_right" className="!text-[20px]" />
        </Link>
      )}
    </nav>
  );
}
