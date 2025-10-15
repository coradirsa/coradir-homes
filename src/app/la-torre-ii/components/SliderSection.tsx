"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const SLIDE_INTERVAL = 4000;

export default function SliderSection() {
  const slides = useMemo(
    () =>
      Array.from({ length: 13 }, (_, index) => {
        const suffix = index.toString().padStart(2, "0");
        const extension = index === 6 ? "jpg" : "webp";
        return {
          src: `/img/la-torre-ii/slider/slide-${suffix}.${extension}`,
          alt: `Vista ${index + 1} de La Torre II`,
        };
      }),
    []
  );

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto flex flex-col gap-8 px-6">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-playfair text-blue">La Torre</h2>
          <p className="mt-4 text-lg md:text-xl font-raleway text-black/70">
            Espacios modernos y luminosos con amenities premium.
          </p>
        </div>
        <div className="relative w-full h-[320px] md:h-[480px] lg:h-[560px] overflow-hidden rounded-2xl shadow-lg">
          {slides.map((slide, index) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              width={1920}
              height={1080}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
              priority={index === 0}
            />
          ))}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Mostrar imagen ${index + 1}`}
                onClick={() => setCurrent(index)}
                className={`h-2 w-8 rounded-full transition ${
                  index === current ? "bg-white" : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
