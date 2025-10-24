"use client";

import Script from "next/script";
import type { FaqItem } from "@/content/seo/copy";

type Props = {
  title: string;
  items: FaqItem[];
  schemaId: string;
};

export default function FaqSection({ title, items, schemaId }: Props) {
  if (!items.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="bg-white py-16">
      <Script
        id={`faq-schema-${schemaId}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container mx-auto flex flex-col gap-8 px-6">
        <h2 className="text-4xl md:text-5xl font-playfair text-blue text-center">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <article
              key={`faq-${schemaId}-${index}`}
              className="flex flex-col gap-3 rounded-3xl border border-blue/10 bg-blue/5 p-6 shadow-[0_15px_40px_-35px_rgba(0,36,82,0.7)]"
            >
              <h3 className="text-xl font-playfair text-blue">{item.question}</h3>
              <p className="text-base font-raleway text-black/80 leading-relaxed">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
