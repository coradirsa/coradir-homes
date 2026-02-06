"use client";

import type { SiteData } from "../types";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  data: SiteData;
}

export default function Hero({ data }: HeroProps) {
  return (
    <header className="relative w-full h-[75vh] min-h-[500px] max-h-[700px] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={data.hero.bgImage}
          alt="Locales comerciales CORADIR - Vista exterior del complejo"
          fill
          className="object-cover"
          priority
        />
        {/* Capa con color azul del proyecto para mejor legibilidad */}
        <div className="absolute inset-0" style={{background: "linear-gradient(to bottom, rgba(26, 52, 85, 0.7), rgba(26, 52, 85, 0.5), rgba(26, 52, 85, 0.8))"}}></div>
        {/* Capa adicional oscura sutil para garantizar contraste */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="relative z-10 px-4 max-w-4xl mx-auto text-white flex flex-col items-center">
        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl mb-3 drop-shadow-2xl">{data.hero.title}</h1>
        <h2 className="font-raleway text-xl md:text-2xl lg:text-3xl font-light italic mb-6 opacity-95 drop-shadow-lg">{data.hero.subtitle}</h2>

        <div className="border-2 border-white/40 backdrop-blur-md bg-white/15 px-6 py-2 rounded-full mb-8 shadow-2xl">
          <span className="font-raleway text-2xl md:text-3xl font-bold drop-shadow">{data.hero.specs}</span>
        </div>

        <p className="font-raleway text-lg md:text-xl mb-10 max-w-2xl font-light drop-shadow-lg leading-relaxed">
          {data.hero.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          {data.hero.buttons.map((btn, idx) => {
            const className = `px-10 py-3 rounded-full font-raleway font-bold uppercase tracking-widest text-sm md:text-base transition-all transform hover:scale-105 shadow-xl ${
              btn.style === "solid"
                ? "bg-white text-blue hover:bg-gray-100 hover:shadow-white/30"
                : "bg-transparent border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm"
            }`;

            if (btn.download || btn.href.endsWith(".pdf")) {
              return (
                <a
                  key={idx}
                  href={btn.href}
                  className={className}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  id={btn.id}
                >
                  {btn.label}
                </a>
              );
            }

            return (
              <Link key={idx} href={btn.href} className={className} id={btn.id}>
                {btn.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
