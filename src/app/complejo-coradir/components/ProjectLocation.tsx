"use client";

import type { SiteData } from "../types";
import Image from "next/image";

interface ProjectLocationProps {
  data: SiteData;
}

export default function ProjectLocation({ data }: ProjectLocationProps) {
  return (
    <section className="container py-20 px-5 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-6">
        <div className="w-16 h-1 bg-blue mb-6"></div>
        <h2 className="font-playfair text-3xl md:text-4xl text-blue leading-tight">
          {data.project_detail.title}
        </h2>
        <div className="flex items-center gap-2 text-blue font-raleway font-semibold">
          <div className="relative w-5 h-5">
            <Image
              src="/icons/complejo-coradir/icono comercio.svg"
              alt="Ubicación"
              fill
              className="object-contain"
            />
          </div>
          <span>{data.project_detail.location}</span>
        </div>

        <p className="text-lg text-gray font-raleway font-medium leading-relaxed border-l-4 border-blue-light pl-4">
          {data.project_detail.description}
        </p>
      </div>

      <div className="h-96 w-full bg-slate-200 rounded-xl overflow-hidden shadow-2xl border-4 border-white relative">
        <iframe
          src={data.project_detail.mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
          title="Ubicación del complejo comercial CORADIR en San Luis"
        ></iframe>
      </div>
    </section>
  );
}