"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Variant = {
  title: string;
  image: string;
  highlights: string[];
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
        image: "/img/la-torre-ii/typologies/monoambientes/variant-01.webp",
        highlights: ["Planta baja", "Patio interior", "Ingreso independiente"],
      },
      {
        title: "Dpto A - Patio interior",
        image: "/img/la-torre-ii/typologies/monoambientes/variant-02.webp",
        highlights: ["Planta baja", "Patio interior", "Orientación norte"],
      },
      {
        title: "Dpto F - Balcón",
        image: "/img/la-torre-ii/typologies/monoambientes/variant-03.webp",
        highlights: ["1º al 6º piso", "Balcón corrido", "Vista panorámica"],
      },
      {
        title: "Dpto B - Balcón",
        image: "/img/la-torre-ii/typologies/monoambientes/variant-04.webp",
        highlights: ["1º al 6º piso", "Balcón al frente", "Gran iluminación natural"],
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
        image: "/img/la-torre-ii/typologies/un-dormitorio/variant-01.webp",
        highlights: ["Planta baja", "Dormitorio independiente", "Patio verde privado"],
      },
      {
        title: "Dpto C - Patio interior",
        image: "/img/la-torre-ii/typologies/un-dormitorio/variant-02.webp",
        highlights: ["Planta baja", "Espacio flexible", "Patio interior"],
      },
      {
        title: "Dpto B - Patio interior",
        image: "/img/la-torre-ii/typologies/un-dormitorio/variant-03.webp",
        highlights: ["Planta baja", "Dormitorio suite", "Patio semicubierto"],
      },
      {
        title: "Dpto E - Balcón",
        image: "/img/la-torre-ii/typologies/un-dormitorio/variant-04.webp",
        highlights: ["1º al 6º piso", "Balcón corrido", "Cocina integrada"],
      },
      {
        title: "Dpto D - Balcón",
        image: "/img/la-torre-ii/typologies/un-dormitorio/variant-05.webp",
        highlights: ["1º al 6º piso", "Amplio estar comedor", "Balcón al frente"],
      },
      {
        title: "Dpto C - Balcón",
        image: "/img/la-torre-ii/typologies/un-dormitorio/variant-06.webp",
        highlights: ["1º al 6º piso", "Sector de trabajo", "Balcón con vista abierta"],
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
        image: "/img/la-torre-ii/typologies/dos-dormitorios/variant-01.webp",
        highlights: ["1º al 6º piso", "Suite principal", "Balcón aterrazado"],
      },
      {
        title: "Dpto A - Balcón al frente",
        image: "/img/la-torre-ii/typologies/dos-dormitorios/variant-02.webp",
        highlights: ["1º al 6º piso", "Living comedor amplio", "Lavadero integrado"],
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
      },
      {
        title: "Cocheras planta baja",
        image: "/img/la-torre-ii/typologies/cocheras/variant-02.webp",
        highlights: ["Ingreso ágil", "Circulación perimetral", "Listas para cargadores EV"],
      },
    ],
  },
];

export default function TypologiesSection() {
  const [activeKey, setActiveKey] = useState<string>(TYPOLOGIES[0]?.key ?? "");

  const activeTypology = useMemo(() => TYPOLOGIES.find((item) => item.key === activeKey) ?? TYPOLOGIES[0], [activeKey]);

  return (
    <section className="bg-white py-16" id="tipologias">
      <div className="container mx-auto px-6 flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-playfair text-blue">Tu depto</h2>
          <p className="mt-4 text-lg md:text-xl font-raleway text-black/70">
            Elegí la tipología que mejor se adapta a tu estilo de vida. Cada unidad se diseña para aprovechar la luz natural y optimizar cada metro cuadrado.
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
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-3xl font-playfair text-blue">{activeTypology.title}</h3>
                <p className="mt-3 text-base md:text-lg font-raleway text-black/80">
                  {activeTypology.description}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeTypology.variants.map((variant) => (
                <article
                  key={variant.title}
                  className="flex flex-col gap-4 rounded-2xl bg-white shadow-[0_15px_30px_-25px_rgba(0,36,82,0.75)] overflow-hidden border border-blue/10"
                >
                  <Image
                    src={variant.image}
                    alt={variant.title}
                    width={720}
                    height={480}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-col gap-3 px-6 pb-6">
                    <h4 className="text-xl font-raleway text-blue font-semibold">{variant.title}</h4>
                    <ul className="flex flex-wrap gap-2">
                      {variant.highlights.map((item) => (
                        <li
                          key={item}
                          className="rounded-full bg-blue/10 px-4 py-1 text-xs font-raleway uppercase tracking-wide text-blue"
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
  );
}
