"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import MaterialIcon from "@/app/components/MaterialIcon";
import type { GalleryImage } from "../types";

type GalleryCarouselProps = {
  images: GalleryImage[];
};

export default function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleImages = useMemo(() => {
    const lastIndex = images.length - 1;
    const previousIndex = activeIndex === 0 ? lastIndex : activeIndex - 1;
    const nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1;

    return [
      { image: images[previousIndex], position: "previous" },
      { image: images[activeIndex], position: "active" },
      { image: images[nextIndex], position: "next" },
    ] as const;
  }, [activeIndex, images]);

  useEffect(() => {
    if (images.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex === 0 ? images.length - 1 : currentIndex - 1));
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
  };

  return (
    <div className="relative">
      <div className="grid min-h-[340px] grid-cols-[42px_minmax(0,1fr)_42px] items-center gap-2 sm:grid-cols-[minmax(96px,0.34fr)_minmax(0,1fr)_minmax(96px,0.34fr)] md:min-h-[460px] md:gap-5">
        {visibleImages.map(({ image, position }) => {
          const isActive = position === "active";

          return (
            <article
              key={`${image.src}-${position}`}
              className={`relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-700 ease-out ${
                isActive
                  ? "z-10 h-[340px] border-blue/20 shadow-xl md:h-[460px]"
                  : "h-[230px] border-blue/10 opacity-55 shadow-none blur-[0.2px] md:h-[320px]"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={isActive ? "(max-width: 768px) 84vw, 720px" : "(max-width: 768px) 42px, 260px"}
                className={`object-cover transition-transform duration-700 ${isActive ? "scale-100" : "scale-105"}`}
                priority={isActive}
              />
              <div
                className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue/90 to-transparent p-4 text-white transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "opacity-0 sm:opacity-100"
                }`}
              >
                <p className="font-raleway text-sm font-bold md:text-base">{image.label}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Ver imagen anterior"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue/15 bg-white text-blue shadow-sm transition hover:bg-blue hover:text-white"
        >
          <MaterialIcon name="chevron_left" className="text-[24px]" />
        </button>

        <div className="flex min-w-0 flex-1 justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver ${image.label}`}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-8 bg-blue" : "w-2.5 bg-blue/25 hover:bg-blue/50"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Ver imagen siguiente"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue/15 bg-white text-blue shadow-sm transition hover:bg-blue hover:text-white"
        >
          <MaterialIcon name="chevron_right" className="text-[24px]" />
        </button>
      </div>
    </div>
  );
}
