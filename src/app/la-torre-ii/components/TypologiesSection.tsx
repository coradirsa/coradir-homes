"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Variant = {
  title: string;
  image: string;
  images?: string[]; // Galería de fotos adicionales
  highlights: string[];
  area: string;
  balcony?: string;
  balcony2?: string;
  garden?: string;
  bathrooms: number;
};

type Typology = {
  key: string;
  title: string;
  description: string;
  cover: string;
  variants: Variant[];
};

const TYPOLOGIES: Typology[] = [
  {
    key: "monoambiente",
    title: "Monoambiente",
    description:
      "Departamentos integrados con espacios eficientes y luminosos. Opciones con patio interior en planta baja o balcón corrido del primer al sexto piso.",
    cover: "/img/la-torre-ii/typologies/monoambiente.webp",
    variants: [
      {
        title: "Dpto D - Patio interior",
        image: "/img/la-torre-ii/typologies/monoambientes/01.webp",
        highlights: ["Planta baja", "Patio interior", "Ingreso independiente"],
        area: "31,18 m²",
        balcony: "7,5 m²",
        garden: "14 m²",
        bathrooms: 1,
      },
      {
        title: "Dpto A - Patio interior",
        image: "/img/la-torre-ii/typologies/monoambientes/02.webp",
        highlights: ["Planta baja", "Patio interior", "Orientación norte"],
        area: "38,06 m²",
        balcony: "10,57 m²",
        garden: "21,73 m²",
        bathrooms: 1,
      },
      {
        title: "Dpto F - Balcón",
        image: "/img/la-torre-ii/typologies/monoambientes/03.webp",
        highlights: ["1º al 6º piso", "Balcón corrido", "Vista panorámica"],
        area: "31,18 m²",
        balcony: "7,5 m²",
        bathrooms: 1,
      },
      {
        title: "Dpto B - Balcón",
        image: "/img/la-torre-ii/typologies/monoambientes/04.webp",
        highlights: ["1º al 6º piso", "Balcón al frente", "Gran iluminación natural"],
        area: "31,18 m²",
        balcony: "7,5 m²",
        bathrooms: 1,
      },
    ],
  },
  {
    key: "un-dormitorio",
    title: "Un dormitorio",
    description:
      "Distribución pensada para sumar privacidad y confort. Versiones con patio verde o balcón corrido según el nivel del edificio.",
    cover: "/img/la-torre-ii/typologies/un-dormitorio.webp",
    variants: [
      {
        title: "Dpto E - Patio interior",
        image: "/img/la-torre-ii/typologies/un-dormitorio/01.webp",
        highlights: ["Planta baja", "Placard incorporado", "Patio verde privado"],
        area: "50,12 m²",
        balcony: "7,2 m²",
        garden: "77,2 m²",
        bathrooms: 1,
      },
      {
        title: "Dpto C - Patio interior",
        image: "/img/la-torre-ii/typologies/un-dormitorio/02.webp",
        highlights: ["Planta baja", "Placard incorporado", "Patio interior"],
        area: "50,12 m²",
        balcony: "7,2 m²",
        garden: "60,3 m²",
        bathrooms: 1,
      },
      {
        title: "Dpto B - Patio interior",
        image: "/img/la-torre-ii/typologies/un-dormitorio/03.webp",
        highlights: ["Planta baja", "Placard incorporado", "Patio semicubierto"],
        area: "46,84 m²",
        balcony: "10,63 m²",
        garden: "23,67 m²",
        bathrooms: 1,
      },
      {
        title: "Dpto E - Balcón",
        image: "/img/la-torre-ii/typologies/un-dormitorio/04.webp",
        highlights: ["1º al 6º piso", "Placard incorporado", "Cocina integrada"],
        area: "50,12 m²",
        balcony: "7,2 m²",
        bathrooms: 1,
      },
      {
        title: "Dpto D - Balcón",
        image: "/img/la-torre-ii/typologies/un-dormitorio/05.webp",
        highlights: ["1º al 6º piso", "Placard incorporado", "Balcón al frente"],
        area: "46,2 m²",
        balcony: "10,43 m²",
        bathrooms: 1,
      },
      {
        title: "Dpto C - Balcón",
        image: "/img/la-torre-ii/typologies/un-dormitorio/06.webp",
        highlights: ["1º al 6º piso", "Placard incorporado", "Vista panorámica"],
        area: "50,11 m²",
        balcony: "7,2 m²",
        bathrooms: 1,
      },
    ],
  },
  {
    key: "dos-dormitorios",
    title: "Dos dormitorios",
    description:
      "Alternativas familiares con dos dormitorios definidos, balcón aterrazado y circulaciones optimizadas para sumar espacios de guardado.",
    cover: "/img/la-torre-ii/typologies/dos-dormitorios.webp",
    variants: [
      {
        title: "Dpto G - Balcón panorámico",
        image: "/img/la-torre-ii/typologies/dos-dormitorios/01.webp",
        highlights: ["1º al 6º piso", "Baño en suite", "Placards incorporados"],
        area: "70,25 m²",
        balcony: "7,2 m²",
        balcony2: "5,18 m²",
        bathrooms: 2,
      },
      {
        title: "Dpto A - Balcón al frente",
        image: "/img/la-torre-ii/typologies/dos-dormitorios/02.webp",
        highlights: ["1º al 6º piso", "Baño en suite", "Placards incorporados"],
        area: "70,25 m²",
        balcony: "7,2 m²",
        balcony2: "5,18 m²",
        bathrooms: 2,
      },
    ],
  },
  {
    key: "cocheras",
    title: "Cocheras",
    description:
      "Opciones cubiertas en planta baja y subsuelo con circulaciones seguras, acceso controlado y puntos de carga preparados para movilidad eléctrica.",
    cover: "/img/la-torre-ii/typologies/cocheras.webp",
    variants: [
      {
        title: "Cocheras subsuelo",
        image: "/img/la-torre-ii/typologies/cocheras/variant-01.webp",
        highlights: ["Acceso portón automatizado", "Conectividad directa al lobby", "Vigilancia 24 hs"],
        area: "12,5 m²",
        bathrooms: 0,
      },
      {
        title: "Cocheras planta baja",
        image: "/img/la-torre-ii/typologies/cocheras/variant-02.webp",
        highlights: ["Ingreso ágil", "Circulación perimetral", "Listas para cargadores EV"],
        area: "12,5 m²",
        bathrooms: 0,
      },
    ],
  },
];

export default function TypologiesSection() {
  const [activeKey, setActiveKey] = useState<string>(TYPOLOGIES[0]?.key ?? "");

  const activeTypology = useMemo(() => TYPOLOGIES.find((item) => item.key === activeKey) ?? TYPOLOGIES[0], [activeKey]);

  return (
    <>
      <section className="bg-white py-16" id="tipologias">
        <div className="container mx-auto px-6 flex flex-col gap-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-playfair text-blue mb-6">Explorá Torre II</h2>
          <p className="text-lg md:text-xl font-raleway text-black/70 mb-8">
            Descubrí todas las tipologías, amenities, planos detallados y la ubicación privilegiada de Torre II en nuestro sitio exclusivo del proyecto.
          </p>

          {/* CTA Principal */}
          <a
            href="https://torre2.coradir.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-blue text-white px-10 py-5 rounded-xl font-raleway font-bold text-lg hover:bg-blue/90 transition-all shadow-[0_10px_30px_-10px_rgba(0,36,82,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(0,36,82,0.7)] hover:scale-105 transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            Ver Proyecto Completo
          </a>

          <p className="mt-6 text-sm text-black/50 font-raleway">
            Galerías de fotos, renders 3D, planos interactivos y más
          </p>
        </div>

        {/* Preview rápido de tipologías */}
        <div className="text-center mt-8">
          <h3 className="text-2xl md:text-3xl font-playfair text-blue mb-4">Tipologías disponibles</h3>
          <p className="text-base md:text-lg font-raleway text-black/70 mb-6">
            Elegí la distribución que mejor se adapta a tu estilo de vida
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {TYPOLOGIES.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveKey(item.key)}
                className={`group relative overflow-hidden rounded-2xl transition-all ${
                  isActive ? "ring-2 ring-blue shadow-xl" : "ring-1 ring-transparent shadow-md hover:shadow-xl"
                }`}
              >
                <Image
                  src={item.cover}
                  alt={item.title}
                  width={720}
                  height={480}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={item.key === TYPOLOGIES[0].key}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-6 py-6 flex flex-col gap-3">
                  <h3 className="text-2xl font-raleway text-white font-semibold">{item.title}</h3>
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-raleway font-semibold uppercase tracking-wide ${
                      isActive ? "bg-white text-blue" : "bg-white/80 text-blue group-hover:bg-white group-hover:text-blue"
                    }`}
                  >
                    {isActive ? "Seleccionado" : "Conocer más"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {activeTypology && (
          <div className="rounded-3xl border border-blue/15 bg-blue/5 p-8 shadow-[0_20px_45px_-30px_rgba(0,36,82,0.7)]">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-playfair text-blue">{activeTypology.title}</h3>
              <p className="mt-3 text-base md:text-lg font-raleway text-black/80">
                {activeTypology.description}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {activeTypology.variants.map((variant) => (
                <article
                  key={variant.title}
                  className="flex flex-col gap-3 rounded-2xl bg-white shadow-[0_15px_30px_-25px_rgba(0,36,82,0.75)] overflow-hidden border border-blue/10"
                >
                  <Image
                    src={variant.image}
                    alt={variant.title}
                    width={720}
                    height={480}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-col gap-2 px-4 pb-4">
                    <h4 className="text-lg font-raleway text-blue font-semibold">{variant.title}</h4>

                    {/* Detalles esenciales */}
                    <div className="flex flex-wrap gap-2 text-sm font-raleway text-black/70">
                      <span className="flex items-center gap-1">
                        <span className="font-semibold text-blue">📐</span>
                        {variant.area}
                      </span>
                      {variant.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="font-semibold text-blue">🚿</span>
                          {variant.bathrooms} baño{variant.bathrooms > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Características destacadas */}
                    <ul className="flex flex-wrap gap-1.5">
                      {variant.highlights.slice(0, 2).map((item) => (
                        <li
                          key={item}
                          className="rounded-full bg-blue/10 px-3 py-0.5 text-xs font-raleway text-blue"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

          </div>
        )}
      </div>
    </section>
    </>
  );
}
