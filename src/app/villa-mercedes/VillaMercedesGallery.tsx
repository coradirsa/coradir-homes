"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import MaterialIcon from "../components/MaterialIcon";

const GALLERY_IMAGES = [
  {
    src: "/img/villa-mercedes/vm07.webp",
    alt: "Dormitorio secundario con dos camas del Complejo Villa Mercedes",
    label: "Dormitorio secundario",
    position: "center 48%",
  },
  {
    src: "/img/villa-mercedes/vm10.webp",
    alt: "Dormitorio principal equipado del Complejo Villa Mercedes",
    label: "Dormitorio principal",
    position: "center",
  },
  {
    src: "/img/villa-mercedes/vm12.webp",
    alt: "Baño con lavarropas y tender rebatible del Complejo Villa Mercedes",
    label: "Baño y lavadero equipado",
    position: "center",
  },
  {
    src: "/img/villa-mercedes/vm06.webp",
    alt: "Vista exterior del Complejo Villa Mercedes con estacionamiento individual",
    label: "Vista exterior del complejo",
    position: "center",
  },
] as const;

export default function VillaMercedesGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const activeImage = GALLERY_IMAGES[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? GALLERY_IMAGES.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % GALLERY_IMAGES.length);
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;

    const distance = clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 50) return;
    if (distance > 0) showPrevious();
    else showNext();
  };

  return (
    <div
      className="w-full"
      role="group"
      aria-label="Galería de los departamentos de 2 dormitorios"
    >
      <div
        className="relative aspect-[4/3] touch-pan-y overflow-hidden rounded-[1.7rem] bg-[#e9eef3] shadow-[0_18px_35px_-22px_rgba(17,49,87,0.55)]"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          handleTouchEnd(event.changedTouches[0]?.clientX ?? 0);
        }}
      >
        {GALLERY_IMAGES.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={index === activeIndex ? image.alt : ""}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ objectPosition: image.position }}
            className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${
              index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue/90 via-blue/45 to-transparent px-5 pb-4 pt-16 text-white">
          <div className="flex items-end justify-between gap-4">
            <p className="font-raleway text-base font-bold md:text-lg" aria-live="polite">
              {activeImage.label}
            </p>
            <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 font-raleway text-sm font-semibold backdrop-blur-sm">
              {activeIndex + 1} / {GALLERY_IMAGES.length}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={showPrevious}
          aria-label="Ver imagen anterior"
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-blue shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <MaterialIcon name="chevron_left" className="text-[28px]" />
        </button>

        <button
          type="button"
          onClick={showNext}
          aria-label="Ver imagen siguiente"
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-blue shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <MaterialIcon name="chevron_right" className="text-[28px]" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3" aria-label="Seleccionar imagen">
        {GALLERY_IMAGES.map((image, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Mostrar ${image.label}`}
              aria-pressed={isActive}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition ${
                isActive
                  ? "border-blue shadow-sm"
                  : "border-transparent opacity-65 hover:opacity-100"
              }`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(max-width: 1024px) 25vw, 140px"
                style={{ objectPosition: image.position }}
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
