"use client";

import type { SiteData } from "../types";
import Image from "next/image";

interface AmbientesProps {
  data: SiteData;
}

export default function Ambientes({ data }: AmbientesProps) {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <h2 className="font-playfair text-4xl md:text-5xl text-blue mb-12 relative inline-block">
        {data.ambientes.title}
      </h2>
      <div className="container px-5 flex flex-col md:flex-row justify-center gap-8">
        {data.ambientes.cards.map((card, idx: number) => (
          <div key={idx} className="flex-1 group cursor-pointer max-w-lg">
            <div className="overflow-hidden rounded-2xl shadow-lg mb-4 h-64 md:h-80 relative">
              <Image
                src={card.img}
                alt={`${card.label} - Local comercial CORADIR`}
                fill
                className="object-cover transform group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="bg-blue text-white py-3 px-6 rounded-full inline-block font-raleway font-bold text-lg shadow-md">
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}