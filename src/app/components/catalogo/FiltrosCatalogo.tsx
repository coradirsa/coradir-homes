"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import MaterialIcon from "../MaterialIcon";
import { contarFiltrosActivos, queryDelSitio, TIPOS } from "@/lib/catalogo/filtros";
import { ETIQUETA_TIPO_PLURAL } from "@/lib/catalogo/format";
import type { Facetas, FiltrosCatalogo, Moneda, Operacion, TipoUnidad } from "@/lib/catalogo/types";

type Props = {
  filtros: FiltrosCatalogo;
  facets: Facetas;
};

const chipBase = "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-colors";
const chip = (activo: boolean) =>
  `${chipBase} ${activo ? "border-blue bg-blue text-white" : "border-border-subtle bg-white text-text-muted hover:border-border-strong hover:text-blue"}`;
const inputBase =
  "w-full rounded-lg border border-border-strong bg-white px-3 py-2.5 text-[14px] text-text-primary placeholder:text-text-muted/70 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20";

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-border-subtle py-5 first:pt-0 last:border-b-0">
      <legend className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">{titulo}</legend>
      {children}
    </fieldset>
  );
}

function toggle<T>(lista: T[] | undefined, valor: T) {
  const actual = lista ?? [];
  const nueva = actual.includes(valor) ? actual.filter((v) => v !== valor) : [...actual, valor];
  return nueva.length ? nueva : undefined;
}

function PanelFiltros({ filtros, facets, aplicar }: Props & { aplicar: (cambios: Partial<FiltrosCatalogo>) => void }) {
  const monedas = Object.keys(facets.precio || {}) as Moneda[];
  const [precio, setPrecio] = useState({ min: filtros.precioMin?.toString() ?? "", max: filtros.precioMax?.toString() ?? "" });
  const [m2, setM2] = useState({ min: filtros.m2Min?.toString() ?? "", max: filtros.m2Max?.toString() ?? "" });

  useEffect(() => {
    setPrecio({ min: filtros.precioMin?.toString() ?? "", max: filtros.precioMax?.toString() ?? "" });
    setM2({ min: filtros.m2Min?.toString() ?? "", max: filtros.m2Max?.toString() ?? "" });
  }, [filtros.precioMin, filtros.precioMax, filtros.m2Min, filtros.m2Max]);

  const conteoTipo = (tipo: TipoUnidad) => facets.tipos.find((t) => t.value === tipo)?.total ?? 0;
  const tiposDisponibles = TIPOS.filter((t) => conteoTipo(t) > 0 || filtros.tipo?.includes(t));
  const proximamente = facets.estados.filter((e) => e.value !== "disponible" && e.value !== "reservado").reduce((a, e) => a + e.total, 0);
  const disponibles = facets.estados.find((e) => e.value === "disponible")?.total ?? 0;
  const muestraDormitorios = facets.dormitorios.length > 0 && (!filtros.tipo || filtros.tipo.includes("departamento"));
  const rangoPrecio = filtros.moneda ? facets.precio[filtros.moneda] : monedas.length === 1 ? facets.precio[monedas[0]] : null;

  const numero = (v: string) => (v.trim() === "" ? undefined : Math.max(0, Number(v)) || undefined);

  // Ciudades y desarrollos de la provincia elegida (si hay una elegida).
  const ciudades = facets.ciudades.filter((c) => !filtros.provincia || !c.provincia || c.provincia === filtros.provincia);
  const edificios = facets.edificios.filter((e) =>
    (!filtros.provincia || !e.provincia || e.provincia === filtros.provincia) && (!filtros.ciudad || !e.ciudad || e.ciudad === filtros.ciudad));

  return (
    <div>
      <Grupo titulo="Operación">
        <div className="grid grid-cols-3 rounded-lg bg-surface-crisp p-1" role="group" aria-label="Operación">
          {([undefined, "alquiler", "venta"] as (Operacion | undefined)[]).map((op) => {
            const activo = filtros.operacion === op;
            const total = op ? facets.operaciones.find((o) => o.value === op)?.total ?? 0 : null;
            return (
              <button
                key={op ?? "todas"}
                type="button"
                aria-pressed={activo}
                // Al cambiar de operacion se descarta el precio (cambian moneda y escala).
                onClick={() => aplicar({ operacion: op, precioMin: undefined, precioMax: undefined, moneda: undefined })}
                className={`rounded-md py-2 text-center text-[13px] font-bold transition-colors ${
                  activo ? "bg-white text-blue shadow-[0_2px_8px_-2px_rgba(26,53,85,0.12)]" : "text-text-muted hover:text-blue"
                }`}
              >
                {op === "alquiler" ? "Alquiler" : op === "venta" ? "Venta" : "Todas"}
                {total !== null && <span className="ml-1 text-[11px] font-medium opacity-70">{total}</span>}
              </button>
            );
          })}
        </div>
      </Grupo>

      {tiposDisponibles.length > 1 && (
        <Grupo titulo="Tipo de propiedad">
          <div className="flex flex-wrap gap-2">
            {tiposDisponibles.map((tipo) => (
              <button
                key={tipo}
                type="button"
                aria-pressed={!!filtros.tipo?.includes(tipo)}
                onClick={() => aplicar({ tipo: toggle(filtros.tipo, tipo) })}
                className={chip(!!filtros.tipo?.includes(tipo))}
              >
                {ETIQUETA_TIPO_PLURAL[tipo]}
                <span className="text-[11px] opacity-70">{conteoTipo(tipo)}</span>
              </button>
            ))}
          </div>
        </Grupo>
      )}

      {proximamente > 0 && disponibles > 0 && (
        <Grupo titulo="Disponibilidad">
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={!!filtros.estado?.includes("disponible")} onClick={() => aplicar({ estado: toggle(filtros.estado, "disponible") })} className={chip(!!filtros.estado?.includes("disponible"))}>
              Disponible ya <span className="text-[11px] opacity-70">{disponibles}</span>
            </button>
            <button type="button" aria-pressed={!!filtros.estado?.includes("proximamente")} onClick={() => aplicar({ estado: toggle(filtros.estado, "proximamente") })} className={chip(!!filtros.estado?.includes("proximamente"))}>
              Próximamente <span className="text-[11px] opacity-70">{proximamente}</span>
            </button>
          </div>
        </Grupo>
      )}

      {facets.provincias.length > 0 && (
        <Grupo titulo="Ubicación">
          <div className="space-y-3">
            <select
              aria-label="Provincia"
              className={inputBase}
              value={filtros.provincia ?? ""}
              onChange={(e) => aplicar({ provincia: e.target.value || undefined, ciudad: undefined, edificio: undefined })}
            >
              <option value="">Todas las provincias</option>
              {facets.provincias.map((p) => (
                <option key={p.value} value={p.value}>{p.value} ({p.total})</option>
              ))}
            </select>
            {ciudades.length > 1 && (
              <select aria-label="Ciudad" className={inputBase} value={filtros.ciudad ?? ""} onChange={(e) => aplicar({ ciudad: e.target.value || undefined, edificio: undefined })}>
                <option value="">Todas las ciudades</option>
                {ciudades.map((c) => (
                  <option key={c.value} value={c.value}>{c.value} ({c.total})</option>
                ))}
              </select>
            )}
            {edificios.length > 1 && (
              <select aria-label="Desarrollo" className={inputBase} value={filtros.edificio ?? ""} onChange={(e) => aplicar({ edificio: e.target.value || undefined })}>
                <option value="">Todos los desarrollos</option>
                {edificios.map((e) => (
                  <option key={e.value} value={e.value}>{e.label} ({e.total})</option>
                ))}
              </select>
            )}
          </div>
        </Grupo>
      )}

      {muestraDormitorios && (
        <Grupo titulo="Dormitorios">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((n) => (
              <button key={n} type="button" aria-pressed={filtros.dormitorios === n} onClick={() => aplicar({ dormitorios: filtros.dormitorios === n ? undefined : n })} className={chip(filtros.dormitorios === n)}>
                {n}+
              </button>
            ))}
          </div>
        </Grupo>
      )}

      {monedas.length > 0 && !filtros.operacion && (
        <Grupo titulo="Precio">
          <p className="text-[13px] text-text-muted">Elegí <strong>Alquiler</strong> o <strong>Venta</strong> para filtrar por precio.</p>
        </Grupo>
      )}

      {monedas.length > 0 && filtros.operacion && (
        <Grupo titulo="Precio">
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              aplicar({ precioMin: numero(precio.min), precioMax: numero(precio.max), moneda: filtros.moneda ?? (monedas.length === 1 ? undefined : monedas[0]) });
            }}
          >
            {monedas.length > 1 && (
              <div className="inline-flex rounded-lg bg-surface-crisp p-1" role="group" aria-label="Moneda">
                {monedas.map((m) => (
                  <button key={m} type="button" onClick={() => aplicar({ moneda: m, precioMin: undefined, precioMax: undefined })}
                    className={`rounded-md px-3 py-1.5 text-[13px] font-semibold ${(filtros.moneda ?? monedas[0]) === m ? "bg-white text-blue shadow-sm" : "text-text-muted"}`}>
                    {m === "USD" ? "USD" : "$ ARS"}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input inputMode="numeric" aria-label="Precio mínimo" className={inputBase} placeholder={rangoPrecio ? `Desde ${new Intl.NumberFormat("es-AR").format(rangoPrecio.min)}` : "Desde"}
                value={precio.min} onChange={(e) => setPrecio({ ...precio, min: e.target.value.replace(/\D/g, "") })} />
              <span className="text-text-muted">–</span>
              <input inputMode="numeric" aria-label="Precio máximo" className={inputBase} placeholder={rangoPrecio ? `Hasta ${new Intl.NumberFormat("es-AR").format(rangoPrecio.max)}` : "Hasta"}
                value={precio.max} onChange={(e) => setPrecio({ ...precio, max: e.target.value.replace(/\D/g, "") })} />
            </div>
            <button type="submit" className="w-full rounded-lg border border-blue py-2 text-[13px] font-semibold text-blue hover:bg-blue/5">Aplicar precio</button>
          </form>
        </Grupo>
      )}

      {facets.superficie && (
        <Grupo titulo="Superficie (m²)">
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); aplicar({ m2Min: numero(m2.min), m2Max: numero(m2.max) }); }}>
            <div className="flex items-center gap-2">
              <input inputMode="numeric" aria-label="Superficie mínima" className={inputBase} placeholder={`Desde ${facets.superficie.min}`}
                value={m2.min} onChange={(e) => setM2({ ...m2, min: e.target.value.replace(/\D/g, "") })} />
              <span className="text-text-muted">–</span>
              <input inputMode="numeric" aria-label="Superficie máxima" className={inputBase} placeholder={`Hasta ${facets.superficie.max}`}
                value={m2.max} onChange={(e) => setM2({ ...m2, max: e.target.value.replace(/\D/g, "") })} />
            </div>
            <button type="submit" className="w-full rounded-lg border border-blue py-2 text-[13px] font-semibold text-blue hover:bg-blue/5">Aplicar superficie</button>
          </form>
        </Grupo>
      )}
    </div>
  );
}

/**
 * Filtros del catalogo. En desktop es una barra lateral; en mobile, un boton que
 * abre un cajon inferior. Los cambios actualizan la URL (compartible e indexable).
 */
export default function FiltrosCatalogo({ filtros, facets }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [pendiente, startTransition] = useTransition();
  const [abierto, setAbierto] = useState(false);
  const activos = contarFiltrosActivos(filtros);

  const aplicar = (cambios: Partial<FiltrosCatalogo>) => {
    const nuevos = { ...filtros, ...cambios, page: undefined };
    startTransition(() => router.push(`${pathname}${queryDelSitio(nuevos)}`, { scroll: false }));
  };
  const limpiar = () => {
    startTransition(() => router.push(`${pathname}${queryDelSitio({ orden: filtros.orden })}`, { scroll: false }));
  };

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [abierto]);

  const encabezado = (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-[18px] font-bold text-blue">
        <MaterialIcon name="tune" className="!text-[20px]" /> Filtros
        {pendiente && <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue/30 border-t-blue" aria-label="Actualizando" />}
      </h2>
      {activos > 0 && (
        <button type="button" onClick={limpiar} className="text-[13px] font-semibold text-blue-gray underline-offset-2 hover:underline">
          Limpiar ({activos})
        </button>
      )}
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block" aria-label="Filtros">
        <div className="sticky top-6 rounded-xl border border-border-subtle bg-white p-6 shadow-[0_2px_8px_-2px_rgba(26,53,85,0.06)]">
          {encabezado}
          <PanelFiltros filtros={filtros} facets={facets} aplicar={aplicar} />
        </div>
      </aside>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-strong bg-white py-3 text-[14px] font-semibold text-blue"
          aria-expanded={abierto}
        >
          <MaterialIcon name="tune" className="!text-[20px]" />
          Filtros{activos > 0 ? ` (${activos})` : ""}
        </button>
      </div>

      {abierto && (
        <div className="fixed inset-0 z-80 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <button type="button" aria-label="Cerrar filtros" className="absolute inset-0 bg-navy-deep/40 backdrop-blur-[8px]" onClick={() => setAbierto(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 pb-24 shadow-[0_20px_32px_-6px_rgba(13,30,49,0.16)]">
            {encabezado}
            <PanelFiltros filtros={filtros} facets={facets} aplicar={aplicar} />
          </div>
          <div className="fixed inset-x-0 bottom-0 border-t border-border-subtle bg-white p-4">
            <button type="button" onClick={() => setAbierto(false)} className="w-full rounded-lg bg-blue py-3 text-[14px] font-bold text-white">
              Ver resultados
            </button>
          </div>
        </div>
      )}
    </>
  );
}
