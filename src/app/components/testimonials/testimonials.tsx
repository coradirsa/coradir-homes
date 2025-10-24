"use client";

import Script from "next/script";
import { TESTIMONIALS_COPY } from "@/content/seo/copy";
import { siteConfig } from "@/lib/seo";

export default function TestimonialsSection() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: TESTIMONIALS_COPY.organizationName,
    url: siteConfig.url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: TESTIMONIALS_COPY.aggregateRating.ratingValue,
      reviewCount: TESTIMONIALS_COPY.aggregateRating.reviewCount,
      bestRating: TESTIMONIALS_COPY.aggregateRating.bestRating,
      worstRating: TESTIMONIALS_COPY.aggregateRating.worstRating,
    },
    review: TESTIMONIALS_COPY.testimonials.map((testimonial) => ({
      "@type": "Review",
      reviewBody: testimonial.quote,
      author: {
        "@type": "Person",
        name: testimonial.author,
      },
      itemReviewed: {
        "@type": "Organization",
        name: TESTIMONIALS_COPY.organizationName,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: testimonial.ratingValue,
        bestRating: TESTIMONIALS_COPY.aggregateRating.bestRating,
        worstRating: TESTIMONIALS_COPY.aggregateRating.worstRating,
      },
    })),
  };

  return (
    <section className="bg-blue/5 py-16">
      <Script
        id="testimonials-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container mx-auto flex flex-col gap-10 px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-playfair text-blue">Historias que nos eligen</h2>
            <p className="mt-4 max-w-xl text-base md:text-lg font-raleway text-black/70">
              Inversores, empresas y familias comparten su experiencia con los desarrollos y servicios de Coradir Homes.
            </p>
          </div>
          <div className="flex flex-col items-start rounded-3xl border border-blue/10 bg-white px-6 py-5 shadow-[0_25px_60px_-40px_rgba(0,36,82,0.6)]">
            <span className="text-5xl font-playfair text-blue">
              {TESTIMONIALS_COPY.aggregateRating.ratingValue}
              <span className="text-2xl align-top">/5</span>
            </span>
            <span className="text-sm font-raleway uppercase tracking-widest text-black/60">
              Promedio con {TESTIMONIALS_COPY.aggregateRating.reviewCount}+ resenas
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS_COPY.testimonials.map((testimonial, index) => (
            <article
              key={`testimonial-${index}`}
              className="flex h-full flex-col gap-4 rounded-3xl border border-blue/10 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,36,82,0.7)]"
            >
              <div className="flex items-center gap-1 font-semibold text-blue">
                {Array.from({ length: Math.round(testimonial.ratingValue) }).map((_, starIndex) => (
                  <span key={`star-${index}-${starIndex}`} aria-hidden="true">
                    *
                  </span>
                ))}
              </div>
              <p className="text-base md:text-lg font-raleway leading-relaxed text-black/80">
                <span aria-hidden="true">{'"'}</span>
                {testimonial.quote}
                <span aria-hidden="true">{'"'}</span>
              </p>
              <div className="mt-auto">
                <span className="block text-lg font-playfair text-blue">{testimonial.author}</span>
                <span className="text-sm font-raleway text-black/60">{testimonial.role}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
