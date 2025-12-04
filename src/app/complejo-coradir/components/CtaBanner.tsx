"use client";

import type { SiteData } from "../types";
interface CtaBannerProps {
  data: SiteData;
}

export default function CtaBanner({ data }: CtaBannerProps) {
  return (
    <section className="bg-white py-24 text-center px-4 border-t border-slate-100">
      <h2 className="font-serif text-6xl md:text-8xl text-slate-900 mb-8 tracking-tight font-black opacity-90">
        {data.cta_banner.title}
      </h2>
      <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
        {data.cta_banner.subtitle}
      </p>
      <button
        className={`${data.theme.colors.primary} text-white px-12 py-5 rounded-full font-bold text-lg uppercase tracking-wider hover:bg-slate-800 transition shadow-2xl transform hover:-translate-y-1`}
        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
      >
        {data.cta_banner.button}
      </button>
    </section>
  );
}