"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import MaterialIcon from "../MaterialIcon";
import type { Media } from "@/lib/catalogo/types";

export default function GaleriaUnidad({ fotos, titulo }: { fotos: Media[]; titulo: string }) {
  const [abierta, setAbierta] = useState<number | null>(null);

  const mover = useCallback(
    (delta: number) => setAbierta((i) => (i === null ? i : (i + delta + fotos.length) % fotos.length)),
    [fotos.length]
  );

  useEffect(() => {
    if (abierta === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierta(null);
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierta, mover]);

  if (!fotos.length) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-xl bg-white text-text-muted">
        <MaterialIcon name="image" className="!text-[40px]" />
      </div>
    );
  }

  const alt = (foto: Media, i: number) => foto.altText || `${titulo} - foto ${i + 1}${foto.origen === "edificio" ? " (complejo)" : ""}`;
  // 2x2 miniaturas al costado si hay al menos 4 fotos extra; si hay menos, una columna.
  const miniaturas = fotos.length >= 5 ? fotos.slice(1, 5) : fotos.slice(1, 3);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl md:h-[460px]">
        <button
          type="button"
          onClick={() => setAbierta(0)}
          className={`relative col-span-4 aspect-[16/10] overflow-hidden bg-white md:aspect-auto ${miniaturas.length >= 3 ? "md:col-span-2" : miniaturas.length ? "md:col-span-3" : ""} row-span-2`}
          aria-label="Ver fotos en grande"
        >
          <Image src={fotos[0].url} alt={alt(fotos[0], 0)} fill priority sizes="(max-width: 768px) 100vw, 900px" className="object-cover" />
        </button>
        {miniaturas.map((foto, i) => (
          <button
            key={foto.id}
            type="button"
            onClick={() => setAbierta(i + 1)}
            className="relative hidden overflow-hidden bg-white md:block"
            aria-label={`Ver foto ${i + 2}`}
          >
            <Image src={foto.url} alt={alt(foto, i + 1)} fill sizes="300px" className="object-cover transition-transform duration-300 hover:scale-105" />
            {i === miniaturas.length - 1 && fotos.length > miniaturas.length + 1 && (
              <span className="absolute inset-0 flex items-center justify-center bg-navy-deep/55 text-[15px] font-bold text-white">
                +{fotos.length - miniaturas.length - 1} fotos
              </span>
            )}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setAbierta(0)}
        className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-blue hover:underline"
      >
        <MaterialIcon name="photo_library" className="!text-[18px]" /> Ver las {fotos.length} fotos
      </button>

      {abierta !== null && (
        <div className="fixed inset-0 z-80 flex flex-col bg-navy-deep/95 font-[family-name:var(--font-raleway-sans)]" role="dialog" aria-modal="true" aria-label="Galería de fotos">
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-[14px]">
              {abierta + 1} / {fotos.length}
              {fotos[abierta].origen === "edificio" && <span className="ml-3 rounded bg-white/15 px-2 py-0.5 text-[12px]">Foto del complejo</span>}
            </span>
            <button type="button" onClick={() => setAbierta(null)} aria-label="Cerrar galería" className="rounded-full p-2 hover:bg-white/10">
              <MaterialIcon name="close" />
            </button>
          </div>
          <div className="relative flex-1">
            <Image src={fotos[abierta].url} alt={alt(fotos[abierta], abierta)} fill sizes="100vw" className="object-contain" />
            {fotos.length > 1 && (
              <>
                <button type="button" onClick={() => mover(-1)} aria-label="Foto anterior" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-white/25">
                  <MaterialIcon name="chevron_left" />
                </button>
                <button type="button" onClick={() => mover(1)} aria-label="Foto siguiente" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-white/25">
                  <MaterialIcon name="chevron_right" />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto p-4">
            {fotos.map((foto, i) => (
              <button
                key={foto.id}
                type="button"
                onClick={() => setAbierta(i)}
                aria-label={`Ir a la foto ${i + 1}`}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded ${i === abierta ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"}`}
              >
                <Image src={foto.url} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
