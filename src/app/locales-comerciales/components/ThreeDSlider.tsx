"use client";

import type { SiteData } from "../types";
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ThreeDSliderProps {
  data: SiteData;
}

export default function ThreeDSlider({ data }: ThreeDSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = data.carousel.images;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const getSlideStyle = (index: number) => {
    const total = images.length;
    const prevIndex = (activeIndex - 1 + total) % total;
    const nextIndex = (activeIndex + 1) % total;

    if (index === activeIndex) {
      return "opacity-100 scale-100 z-20 translate-x-0 shadow-2xl grayscale-0";
    } else if (index === prevIndex) {
      return "opacity-60 scale-75 z-10 -translate-x-[60%] grayscale";
    } else if (index === nextIndex) {
      return "opacity-60 scale-75 z-10 translate-x-[60%] grayscale";
    } else {
      return "opacity-0 scale-50 z-0 translate-x-0";
    }
  };

  return (
    <section className="relative w-full h-[500px] bg-slate-200 overflow-hidden flex items-center justify-center py-10">
      <div className="absolute inset-0 bg-slate-100"></div>

      <div className="relative w-full max-w-4xl h-full flex items-center justify-center perspective-1000">
        {images.map((img: string, idx) => (
          <div
            key={idx}
            className={`absolute w-[60%] md:w-[50%] aspect-video rounded-xl transition-all duration-700 ease-in-out shadow-xl border-4 border-white ${getSlideStyle(idx)}`}
          >
            <Image
              src={img}
              alt={`Vista ${idx + 1} del complejo comercial CORADIR`}
              fill
              className={`object-cover rounded-lg transition-all duration-700 ${idx === activeIndex ? '' : 'grayscale'}`}
            />
            <div className={`absolute inset-0 bg-slate-900 transition-opacity duration-700 ${idx === activeIndex ? 'opacity-0' : 'opacity-20'}`}></div>
          </div>
        ))}
      </div>

      <div className='flex justify-center gap-3 absolute bottom-8 w-full z-30'>
        {images.map((card, idx: number) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === idx ? 'bg-slate-900 w-8' : 'bg-slate-400 hover:bg-slate-600'}`}
            aria-label={`Ir a imagen ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}