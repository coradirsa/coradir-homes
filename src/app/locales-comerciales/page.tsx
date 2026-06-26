import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import MaterialIcon from "../components/MaterialIcon";
import ProjectForm from "../components/projectForm";
import ReCaptcha from "../components/reCaptcha";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import GalleryCarousel from "./components/GalleryCarousel";
import {
  COMMERCIAL_CONDITIONS,
  COMMERCIAL_HERO,
  COMMERCIAL_PROJECTS,
  CONTACT_COPY,
  GALLERY_IMAGES,
  JUANA_64_LEASING_PLANS,
} from "./data";
import type { CommercialProject } from "./types";

export function generateMetadata(): Metadata {
  return createMetadata({ pathname: "/locales-comerciales" }).metadata;
}

export const revalidate = 3600;

function ProjectCard({ project }: { project: CommercialProject }) {
  const monthlyRent = project.prices.find((price) => price.label.toLowerCase().includes("alquiler"));
  const mainPrices = project.prices.filter((price) => !price.label.toLowerCase().includes("alquiler"));

  return (
    <article
      id={project.id}
      className="scroll-mt-24 overflow-hidden rounded-lg border border-blue/15 bg-white shadow-sm"
    >
      <div className="relative min-h-[220px]">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue/90 to-transparent p-5 text-white">
          <p className="font-raleway text-xs font-bold uppercase tracking-[0.18em] text-white/75">
            {project.eyebrow}
          </p>
          <h2 className="mt-1 font-playfair text-3xl leading-tight">{project.name}</h2>
        </div>
      </div>

      <div className="space-y-6 p-5 md:p-7">
        <p className="font-raleway text-base leading-7 text-gray">{project.summary}</p>

        <div className="overflow-hidden rounded-lg border border-blue/15 bg-[#f5f8fc]">
          <div className="flex items-start gap-3 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue shadow-sm">
              <MaterialIcon name="location_on" className="text-[24px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-raleway text-[11px] font-bold uppercase tracking-wide text-gray">Ubicación</p>
              <p className="mt-1 font-raleway text-sm font-bold leading-5 text-blue">{project.address}</p>
            </div>
            <a
              href={project.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir ubicación de ${project.name} en Google Maps`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue shadow-sm transition hover:bg-blue hover:text-white"
            >
              <MaterialIcon name="open_in_new" className="text-[18px]" />
            </a>
          </div>
          <iframe
            title={`Mapa de ${project.name}`}
            src={project.mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-48 w-full border-0 md:h-56"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {mainPrices.map((price) => (
            <div
              key={price.label}
              className={`rounded-lg border p-4 ${
                price.featured ? "border-blue bg-blue text-white" : "border-blue/15 bg-[#f5f8fc] text-blue"
              }`}
            >
              <p className={`font-raleway text-[11px] font-bold uppercase tracking-wide ${price.featured ? "text-white/75" : "text-gray"}`}>
                {price.label}
              </p>
              <p className="mt-2 font-raleway text-xl font-bold leading-tight">{price.value}</p>
            </div>
          ))}
        </div>

        {monthlyRent && (
          <div className="flex items-center gap-4 rounded-lg border border-blue/15 bg-white p-4 shadow-sm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9f2ff] text-blue">
              <MaterialIcon name="storefront" className="text-[26px]" />
            </span>
            <div>
              <p className="font-raleway text-xs font-bold uppercase tracking-wide text-gray">{monthlyRent.label}</p>
              <p className="mt-1 font-raleway text-2xl font-bold text-blue">{monthlyRent.value}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {project.specs.map((spec) => (
            <div key={spec.label} className="rounded-lg bg-[#f5f8fc] p-4">
              <p className="font-raleway text-[11px] font-bold uppercase tracking-wide text-gray">{spec.label}</p>
              <p className="mt-1 font-raleway text-sm font-bold leading-5 text-blue">{spec.value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="font-raleway text-xs font-bold uppercase tracking-[0.18em] text-gray">Diferenciales</p>
          <div className="mt-4 grid gap-3">
            {project.iconFeatures.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3 rounded-lg border border-blue/10 bg-white p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9f2ff] text-blue">
                  <MaterialIcon name={feature.icon} className="text-[22px]" />
                </span>
                <p className="font-raleway text-sm font-bold leading-5 text-blue">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-raleway text-xs font-bold uppercase tracking-[0.18em] text-gray">Ideal para</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.suitableFor.map((item) => (
              <span key={item} className="rounded-full bg-[#f5f8fc] px-3 py-2 font-raleway text-xs font-bold text-blue">
                {item}
              </span>
            ))}
          </div>
        </div>

        {project.validationNote && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 font-raleway text-sm leading-6 text-amber-900">
            {project.validationNote}
          </div>
        )}

        <Link
          href="#contact"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blue px-6 py-3 font-raleway text-sm font-bold uppercase tracking-wide text-white transition hover:bg-blue/90"
        >
          Contactar
          <MaterialIcon name="arrow_forward" className="text-[20px]" />
        </Link>
      </div>
    </article>
  );
}

function GallerySlider() {
  return (
    <section id="gallery" className="bg-[#f5f8fc] px-5 py-14 md:py-20">
      <div className="container">
        <div className="mb-8">
          <p className="font-raleway text-sm font-bold uppercase tracking-[0.22em] text-blue-light">Galería</p>
          <h2 className="mt-3 font-playfair text-3xl leading-tight text-blue md:text-5xl">
            Vistas, interiores y accesos comerciales
          </h2>
        </div>

        <GalleryCarousel images={GALLERY_IMAGES} />
      </div>
    </section>
  );
}

function LeasingSection() {
  return (
    <section id="leasing" className="px-5 py-14 md:py-20">
      <div className="container">
        <div className="mb-8">
          <p className="font-raleway text-sm font-bold uppercase tracking-[0.22em] text-blue-light">Financiación</p>
          <h2 className="mt-3 font-playfair text-3xl leading-tight text-blue md:text-5xl">
            Leasing inmobiliario Juana 64
          </h2>
          <p className="mt-4 font-raleway text-base leading-7 text-gray md:max-w-3xl md:text-lg">
            Planes para locales comerciales con adelanto, cuota y valor residual. Valores sujetos a disponibilidad y
            validación comercial.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {JUANA_64_LEASING_PLANS.map((plan) => (
            <article key={plan.term} className="rounded-lg border border-blue/15 bg-white p-5 shadow-sm">
              <p className="font-raleway text-sm font-bold uppercase tracking-wide text-blue-light">{plan.term}</p>
              <p className="mt-2 font-raleway text-xl font-bold text-blue">{plan.interest}</p>
              <dl className="mt-5 space-y-3 font-raleway text-sm">
                <div className="flex justify-between gap-4 border-t border-blue/10 pt-3">
                  <dt className="text-gray">Adelanto</dt>
                  <dd className="font-bold text-blue">{plan.downPayment}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-blue/10 pt-3">
                  <dt className="text-gray">Cuota</dt>
                  <dd className="font-bold text-blue">{plan.monthlyPayment}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-blue/10 pt-3">
                  <dt className="text-gray">Valor residual</dt>
                  <dd className="font-bold text-blue">{plan.residualValue}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConditionsSection() {
  return (
    <section className="bg-blue px-5 py-14 text-white md:py-20">
      <div className="container">
        <div className="mb-8">
          <p className="font-raleway text-sm font-bold uppercase tracking-[0.22em] text-white/60">Condiciones</p>
          <h2 className="mt-3 font-playfair text-3xl leading-tight md:text-5xl">
            Compra, alquiler y leasing con información clara
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COMMERCIAL_CONDITIONS.map((condition) => (
            <article key={condition.title} className="rounded-lg border border-white/15 bg-white/10 p-5">
              <MaterialIcon name="verified" className="text-[32px] text-blue-light" />
              <h3 className="mt-4 font-raleway text-lg font-bold">{condition.title}</h3>
              <p className="mt-3 font-raleway text-sm leading-6 text-white/75">{condition.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LocalesComercialesPage() {
  return (
    <ReCaptcha>
      <>
        <StructuredDataScripts pathname="/locales-comerciales" />

        <header className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={COMMERCIAL_HERO.image}
              alt="Locales comerciales CORADIR Homes"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-blue/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-blue/75 via-blue/55 to-blue/20 md:bg-gradient-to-r md:from-blue/75 md:via-blue/45 md:to-transparent" />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="container relative z-10 flex min-h-[72vh] items-end px-5 pb-12 pt-24 text-white md:min-h-[78vh] md:items-center md:py-24">
            <div className="max-w-4xl">
              <p className="font-raleway text-xs font-bold uppercase tracking-[0.22em] text-white/70 md:text-sm">
                {COMMERCIAL_HERO.eyebrow}
              </p>
              <h1 className="mt-4 max-w-4xl font-playfair text-4xl leading-tight md:text-5xl xl:text-6xl">
                {COMMERCIAL_HERO.title}
              </h1>
              <p className="mt-5 max-w-3xl font-raleway text-base leading-7 text-white/90 md:text-xl md:leading-8">
                {COMMERCIAL_HERO.subtitle}
              </p>

              <div className="mt-6 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
                {COMMERCIAL_HERO.highlights.map((item) => (
                  <span
                    key={item}
                    className="shrink-0 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-raleway text-xs font-bold backdrop-blur-md md:text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <Link
                href="#contact"
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-8 py-4 font-raleway text-sm font-bold uppercase tracking-wide text-blue transition hover:bg-white/90 sm:w-auto"
              >
                Contactar asesor
              </Link>
            </div>
          </div>
        </header>

        <section className="container px-5 py-14 md:py-20">
          <div className="mb-8">
            <p className="font-raleway text-sm font-bold uppercase tracking-[0.22em] text-blue-light">
              Proyectos disponibles
            </p>
            <h2 className="mt-3 font-playfair text-3xl leading-tight text-blue md:text-5xl">
              Encontrá locales comerciales para invertir, alquilar o abrir tu negocio
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {COMMERCIAL_PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <GallerySlider />
        <LeasingSection />
        <ConditionsSection />

        <ProjectForm
          id="contact"
          interest="locales-comerciales"
          heading={CONTACT_COPY.title}
          subtitle={CONTACT_COPY.subtitle}
          backgroundImage={CONTACT_COPY.backgroundImage}
          transactionTypes={["comprar", "alquilar", "leasing"]}
          submitLabel="Solicitar información"
        />
      </>
    </ReCaptcha>
  );
}
