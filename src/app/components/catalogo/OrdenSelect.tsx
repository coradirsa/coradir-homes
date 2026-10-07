"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { queryDelSitio } from "@/lib/catalogo/filtros";
import type { FiltrosCatalogo, OrdenCatalogo } from "@/lib/catalogo/types";

const OPCIONES: { value: OrdenCatalogo; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio_asc", label: "Menor precio" },
  { value: "precio_desc", label: "Mayor precio" },
  { value: "m2_desc", label: "Mayor superficie" },
];

export default function OrdenSelect({ filtros }: { filtros: FiltrosCatalogo }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pendiente, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-3">
      <span className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.04em] text-text-muted">Ordenar por</span>
      <select
        value={filtros.orden ?? "recientes"}
        disabled={pendiente}
        onChange={(e) => {
          const orden = e.target.value as OrdenCatalogo;
          startTransition(() => router.push(`${pathname}${queryDelSitio({ ...filtros, orden, page: undefined })}`, { scroll: false }));
        }}
        className="cursor-pointer rounded-lg border border-border-strong bg-white px-3 py-2 text-[13px] text-text-primary focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
      >
        {OPCIONES.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
