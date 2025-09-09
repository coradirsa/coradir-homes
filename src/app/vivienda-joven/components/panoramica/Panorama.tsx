/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // ajustá esta ruta a donde tengas el hook

declare global {
  interface Window {
    pannellum: any;
    __pannellumLoaded?: boolean;
  }
}

async function loadPannellum(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.__pannellumLoaded) return;

  await new Promise<void>((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    script.onload = () => {
      window.__pannellumLoaded = true;
      resolve();
    };
    document.head.appendChild(script);
  });
}

function usePannellumViewer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);

  const init = async () => {
    await loadPannellum();
    if (!containerRef.current || !window.pannellum) return;

    // Limpiar por si quedó algo previo
    containerRef.current.innerHTML = "";

    viewerRef.current = window.pannellum.viewer(containerRef.current, {
      type: "equirectangular",
      panorama: "/img/vivienda-joven/panorama.png",
      autoLoad: true,
      pitch: 10,
      yaw: 180,
      hfov: 100,
    });
  };

  const destroy = () => {
    try {
      viewerRef.current?.destroy?.();
    } catch {}
    if (containerRef.current) containerRef.current.innerHTML = "";
    viewerRef.current = null;
  };

  return { containerRef, init, destroy };
}

export default function Panorama() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [open, setOpen] = useState(false);

  // Desktop: render inline
  const desktop = usePannellumViewer();
  // Mobile (modal): render on demand
  const modal = usePannellumViewer();

  // Inicializar en desktop al montar
  useEffect(() => {
    if (!isMobile) {
      desktop.init();
      return () => desktop.destroy();
    }
    // Cleanup si se cambia de viewport
    return () => desktop.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Inicializar cuando se abre el modal en mobile
  useEffect(() => {
    if (isMobile && open) {
      modal.init();
      return () => modal.destroy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, open]);

  return (
    <div className="w-full flex items-center justify-center">
      {isMobile ? (
        <>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-3 rounded-xl bg-blue text-white font-medium hover:opacity-90 transition cursor-pointer btn-pulse"
          >
            Visualizalo de forma real
          </button>

          {/* Modal */}
          {open && (
            <div
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60"
              role="dialog"
              aria-modal="true"
              onClick={() => {
                setOpen(false);
              }}
            >
              <div
                className="bg-white w-[95vw] h-[70vh] rounded-2xl overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-3 z-10 rounded-full px-3 py-1 bg-black/70 text-white text-sm cursor-pointer"
                >
                  X
                </button>
                <div ref={modal.containerRef} className="w-full h-full" />
              </div>
            </div>
          )}
        </>
      ) : (
        // Desktop inline
        <div className="h-[100vh] w-full">
          <div ref={desktop.containerRef} className="w-full h-full" />
        </div>
      )}
    </div>
  );
}
