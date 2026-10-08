import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import MaterialIcon from "../components/MaterialIcon";
import ProjectForm from "../components/projectForm";
import ReCaptcha from "../components/reCaptcha";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import GalleryCarousel from "./components/GalleryCarousel";
import UnidadesDestacadas from "../components/catalogo/UnidadesDestacadas";
import {
  ACCESS_MODELS,
  COMMERCIAL_HERO,
  COMMERCIAL_INTRO,
  COMMERCIAL_PROJECTS,
  CONTACT_COPY,
  GALLERY_IMAGES,
  LEASING_BY_PROJECT,
  RENT_CONDITIONS,
  WHATSAPP_LOCALES_LABEL,
  whatsappLocales,
} from "./data";
import type { CommercialProject } from "./types";

// Muestra los locales publicados en Inmobiliario (datos en vivo, sin ISR).
export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return createMetadata({ pathname: "/locales-comerciales" }).metadata;
}

const WHATSAPP_GENERAL = whatsappLocales("Hola, quiero información sobre los locales comerciales de CORADIR Homes.");

// Juana 64 (el de menor precio) primero, como en el diseño.
const ORDEN: CommercialProject["id"][] = ["juana-64", "ruta-3"];
const PROJECTS = ORDEN.map((id) => COMMERCIAL_PROJECTS.find((project) => project.id === id)).filter(
  (project): project is CommercialProject => Boolean(project),
);

function SectionHeading({
  eyebrow,
  title,
  text,
  center = false,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={center ? "mx-auto mb-12 max-w-2xl text-center" : "mb-8 max-w-3xl"}>
      <p className={`font-raleway text-xs font-bold uppercase tracking-[0.22em] ${dark ? "text-blue-light" : "text-blue-gray"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 font-playfair text-3xl uppercase leading-tight md:text-4xl ${dark ? "text-white" : "text-blue"}`}>
        {title}
      </h2>
      {text && (
        <p className={`mt-4 font-raleway text-base leading-7 md:text-lg ${dark ? "text-white/80" : "text-text-muted"}`}>{text}</p>
      )}
    </div>
  );
}

function WhatsAppLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp font-raleway font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:brightness-105 ${className}`}
    >
      <MaterialIcon name="chat" className="!text-[20px]" />
      {children}
    </a>
  );
}

/* 1. Hero con modulo de precios de referencia */
function Hero() {
  return (
    <header className="relative overflow-hidden bg-navy-deep">
      <div className="absolute inset-0">
        <Image src={COMMERCIAL_HERO.image} alt="Locales comerciales CORADIR Homes" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/95 via-navy-deep/85 to-navy-deep/60 lg:bg-gradient-to-r lg:from-navy-deep/95 lg:via-navy-deep/80 lg:to-navy-deep/30" />
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-between gap-12 px-5 pb-16 pt-28 lg:flex-row lg:py-28">
        <div className="flex w-full flex-col items-start lg:max-w-[580px]">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-status-available" />
            <span className="font-raleway text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">
              {COMMERCIAL_HERO.eyebrow}
            </span>
          </span>
          <h1 className="font-playfair text-4xl font-extrabold uppercase leading-tight text-white md:text-5xl">{COMMERCIAL_HERO.title}</h1>
          <p className="mt-6 max-w-xl font-raleway text-xl leading-8 text-white/85 md:text-[32px] md:leading-[42px]">
            {COMMERCIAL_HERO.subtitle}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href="#locales"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 font-raleway text-sm font-bold text-blue shadow-md transition hover:-translate-y-0.5 hover:bg-surface-crisp"
            >
              <MaterialIcon name="search" className="!text-[20px]" />
              Explorar locales
            </Link>
            <WhatsAppLink href={WHATSAPP_GENERAL} className="px-6 py-3.5 text-sm">
              Consultar por WhatsApp
            </WhatsAppLink>
          </div>
        </div>

        <div className="w-full rounded-xl border border-white/40 bg-white/95 p-6 shadow-2xl backdrop-blur-md lg:w-[500px] lg:p-7">
          <div className="mb-5 flex flex-col gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-raleway text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">Transparencia total</p>
              <p className="font-raleway text-lg font-extrabold uppercase leading-tight text-blue">Valores de referencia de alquiler</p>
            </div>
            <span className="w-fit rounded bg-status-available/10 px-2.5 py-1 font-raleway text-[11px] font-bold uppercase tracking-wider text-status-available">
              En pesos
            </span>
          </div>

          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2">
            {PROJECTS.map((project) => (
              <a key={project.id} href={`#${project.id}`} className="group flex flex-col gap-2">
                <span className="flex items-center gap-1.5 text-blue">
                  <MaterialIcon name="location_on" className="!text-[18px]" />
                  <span className="font-raleway text-sm font-bold uppercase">{project.reference.shortName}</span>
                </span>
                <span className="rounded-lg bg-surface-crisp p-3.5 transition group-hover:bg-[#e9f2ff]">
                  <span className="block font-raleway text-[11px] font-bold uppercase tracking-wider text-text-muted">Alquiler mensual</span>
                  <span className="block font-raleway text-[26px] font-extrabold leading-tight tracking-tight text-blue">
                    {project.reference.rent} <span className="text-sm font-semibold text-text-muted">/ mes</span>
                  </span>
                </span>
                <span className="inline-flex w-fit items-center gap-1.5 rounded bg-[#e9f2ff] px-2.5 py-1 font-raleway text-xs font-semibold text-blue">
                  <MaterialIcon name={project.reference.icon} className="!text-[16px]" />
                  {project.reference.units} locales · {project.reference.surface} c/u
                </span>
              </a>
            ))}
            <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-border-subtle sm:block" />
          </div>

          <p className="mt-4 border-t border-border-subtle pt-3 font-raleway text-xs text-text-muted">
            *Valores de alquiler directo en pesos argentinos, sujetos a disponibilidad.
          </p>
        </div>
      </div>
    </header>
  );
}

/* 2. Introduccion y diferenciales */
function Intro() {
  return (
    <section className="border-y border-border-subtle bg-white px-5 py-14">
      <div className="container flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-12">
        <div className="max-w-2xl">
          <p className="font-raleway text-xs font-bold uppercase tracking-[0.22em] text-blue-gray">{COMMERCIAL_INTRO.eyebrow}</p>
          <h2 className="mt-2 font-playfair text-3xl uppercase leading-tight text-blue md:text-4xl">{COMMERCIAL_INTRO.title}</h2>
          <p className="mt-4 font-raleway text-base leading-7 text-text-muted md:text-lg">{COMMERCIAL_INTRO.text}</p>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:w-auto lg:max-w-[640px]">
          {COMMERCIAL_INTRO.items.map((item) => (
            <div key={item.title} className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface-crisp p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e9f2ff] text-blue">
                <MaterialIcon name={item.icon} className="!text-[24px]" />
              </span>
              <h3 className="font-raleway text-base font-bold uppercase leading-tight text-blue">{item.title}</h3>
              <p className="font-raleway text-sm leading-5 text-text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4. Comparador entre desarrollos */
// Datos que ya muestran la cabecera (cantidad, zona) o la etiqueta de estado de la foto.
const SPECS_EN_CABECERA = ["Ubicación", "Tipo", "Unidades", "Cantidad", "Entrega locales"];
function ProjectCompareCard({ project }: { project: CommercialProject }) {
  const { reference } = project;
  const atributos = [
    ...project.specs.filter((spec) => !SPECS_EN_CABECERA.includes(spec.label)).map((spec) => `${spec.label}: ${spec.value}`),
    ...project.iconFeatures.map((feature) => feature.title),
  ];

  return (
    <article id={project.id} className="flex scroll-mt-24 flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-52 md:h-60">
        <Image src={project.image} alt={project.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 font-raleway text-[11px] font-bold uppercase tracking-wider text-blue">
          {project.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-border-subtle pb-6">
            <div>
              <p className="font-raleway text-[11px] font-bold uppercase tracking-wider text-blue-gray">{reference.zone}</p>
              <h3 className="font-playfair text-3xl uppercase leading-tight text-blue">{reference.shortName}</h3>
            </div>
            <span className="shrink-0 rounded bg-[#e9f2ff] px-3 py-1 font-raleway text-[11px] font-bold uppercase tracking-wider text-blue">
              {reference.units} locales
            </span>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl bg-surface-crisp p-3 sm:gap-4 sm:p-4">
            <div>
              <p className="font-raleway text-xs font-bold uppercase text-text-muted">Alquiler</p>
              <p className="font-raleway text-lg font-extrabold leading-tight text-blue sm:text-[22px]">
                {reference.rent} <span className="text-sm font-semibold text-text-muted">/mes</span>
              </p>
            </div>
            <div className="border-l border-border-subtle pl-3 sm:pl-4">
              <p className="font-raleway text-xs font-bold uppercase text-text-muted">Precio de lista</p>
              <p className="font-raleway text-lg font-extrabold leading-tight text-blue sm:text-[22px]">{reference.sale}</p>
              <p className="mt-1 font-raleway text-xs font-semibold text-text-muted">
                {reference.saleAdvance.label}: <span className="text-blue">{reference.saleAdvance.value}</span>
              </p>
            </div>
          </div>

          <p className="mb-6 font-raleway text-[15px] leading-6 text-text-muted">
            <strong className="text-text-primary">Perfil comercial:</strong> {reference.profile}
          </p>

          <ul className="mb-6 space-y-3 font-raleway text-sm text-text-primary">
            {atributos.map((atributo) => (
              <li key={atributo} className="flex items-start gap-2.5">
                <MaterialIcon name="check_circle" className="!text-[20px] text-status-available" />
                <span className="pt-0.5">{atributo}</span>
              </li>
            ))}
          </ul>

          <div className="mb-8">
            <p className="font-raleway text-[11px] font-bold uppercase tracking-wider text-text-muted">Ideal para</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.suitableFor.map((item) => (
                <span key={item} className="rounded-lg border border-border-subtle bg-white px-3 py-1.5 font-raleway text-xs font-semibold text-blue">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <WhatsAppLink
            href={whatsappLocales(`Hola, quiero conocer los locales de ${project.name}.`)}
            className="px-5 py-3.5 text-sm"
          >
            Consultar por este local
          </WhatsAppLink>
          <Link
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-[1.5px] border-blue px-5 py-3.5 font-raleway text-sm font-bold text-blue transition hover:bg-blue/5"
          >
            Pedir información
            <MaterialIcon name="arrow_forward" className="!text-[18px]" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Comparador() {
  return (
    <section id="comparativa" className="border-y border-border-subtle bg-surface-crisp px-5 py-16 md:py-20">
      <div className="container">
        <SectionHeading
          center
          eyebrow="Compará los desarrollos"
          title="¿Cuál se ajusta a tu negocio?"
          text="Las dos propuestas comerciales de CORADIR Homes en San Luis, lado a lado."
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCompareCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* 5. Mapa de ubicaciones */
function Ubicaciones() {
  return (
    <section className="px-5 py-16">
      <div className="container">
        <SectionHeading
          eyebrow="Ubicación estratégica"
          title="Dónde están los locales"
          text="Sobre dos ejes comerciales consolidados: el corredor de Ruta 3 en San Luis y el desarrollo Juana 64 en Juana Koslay."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {PROJECTS.map((project) => (
            <div key={project.id} className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
              <iframe
                title={`Mapa de ${project.name}`}
                src={project.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0 md:h-80"
              />
              <div className="flex items-center gap-3 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue text-white">
                  <MaterialIcon name={project.reference.icon} className="!text-[22px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-raleway text-sm font-bold uppercase text-blue">{project.reference.shortName}</p>
                  <p className="truncate font-raleway text-sm text-text-muted">{project.address}</p>
                </div>
                <a
                  href={project.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border-subtle px-3 py-2 font-raleway text-xs font-bold text-blue transition hover:border-blue"
                >
                  Cómo llegar
                  <MaterialIcon name="open_in_new" className="!text-[16px]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Galeria() {
  return (
    <section id="gallery" className="bg-surface-crisp px-5 py-14 md:py-20">
      <div className="container">
        <SectionHeading eyebrow="Galería" title="Vistas, vidrieras y accesos" />
        <GalleryCarousel images={GALLERY_IMAGES} />
      </div>
    </section>
  );
}

/* 6. Financiacion: modalidades y planes de leasing */
function Financiacion() {
  return (
    <section id="leasing" className="border-t border-border-subtle bg-white px-5 py-16 md:py-20">
      <div className="container">
        <SectionHeading
          center
          eyebrow="Financiación y leasing"
          title="Más formas de acceder a tu local."
          text="Comprá, alquilá o ingresá con leasing inmobiliario. Valores sujetos a disponibilidad y validación comercial."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ACCESS_MODELS.map((model, index) => (
            <article
              key={model.title}
              className="flex flex-col justify-between rounded-2xl border border-border-subtle bg-surface-crisp p-7 transition-all hover:border-border-strong hover:shadow-lg"
            >
              <div>
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue text-white shadow-sm">
                  <MaterialIcon name={model.icon} className="!text-[28px]" />
                </span>
                <p className="font-raleway text-[11px] font-bold uppercase tracking-wider text-blue-gray">
                  Modalidad {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mb-3 mt-1 font-raleway text-xl font-bold uppercase text-blue">{model.title}</h3>
                <p className="font-raleway text-[15px] leading-6 text-text-muted">{model.description}</p>
                <dl className="mt-5 space-y-3">
                  {model.items.map((item) => (
                    <div key={item.label} className="rounded-lg border border-border-subtle bg-white p-3">
                      <dt className="font-raleway text-[11px] font-bold uppercase tracking-wider text-blue-gray">{item.label}</dt>
                      <dd className="mt-1 font-raleway text-sm leading-5 text-text-primary">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="mt-6 flex items-center gap-2 border-t border-border-subtle pt-5 font-raleway text-xs font-bold text-blue">
                <MaterialIcon name="verified" className="!text-[18px]" />
                {model.footnote}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {LEASING_BY_PROJECT.map((leasing) => {
            const conResidual = leasing.plans.some((plan) => plan.residualValue);
            return (
              <div key={leasing.project}>
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-raleway text-lg font-bold uppercase text-blue">Leasing · {leasing.project}</h3>
                  <p className="font-raleway text-sm text-text-muted">
                    Adelanto 35%: <strong className="text-blue">{leasing.downPayment}</strong>
                  </p>
                </div>
                <div className="overflow-x-auto rounded-xl border border-border-subtle">
                  <table className="w-full min-w-[420px] font-raleway text-sm">
                    <thead className="bg-navy-deep text-left text-xs uppercase tracking-wider text-white">
                      <tr>
                        <th className="px-4 py-3 font-bold">Plazo</th>
                        <th className="px-4 py-3 font-bold">Interés</th>
                        <th className="px-4 py-3 font-bold">Cuota</th>
                        {conResidual && <th className="px-4 py-3 font-bold">Valor residual</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {leasing.plans.map((plan, index) => (
                        <tr key={plan.term} className={index % 2 ? "bg-surface-crisp" : "bg-white"}>
                          <td className="border-t border-border-subtle px-4 py-3 font-bold text-blue">{plan.term}</td>
                          <td className="border-l border-t border-border-subtle px-4 py-3 text-text-primary">{plan.interest}</td>
                          <td className="border-l border-t border-border-subtle px-4 py-3 font-bold text-blue">{plan.monthlyPayment}</td>
                          {conResidual && (
                            <td className="border-l border-t border-border-subtle px-4 py-3 text-text-primary">{plan.residualValue}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 font-raleway text-xs text-text-muted">Valores en dólares + IVA 21%, sujetos a disponibilidad y aprobación comercial.</p>

        <div className="mt-10 rounded-2xl border border-border-subtle bg-surface-crisp p-6 md:p-8">
          <h3 className="flex items-center gap-2 font-raleway text-lg font-bold uppercase text-blue">
            <MaterialIcon name="key" className="!text-[22px]" />
            {RENT_CONDITIONS.title}
          </h3>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {RENT_CONDITIONS.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 font-raleway text-sm leading-6 text-text-primary">
                <MaterialIcon name="check_circle" className="!text-[20px] text-status-available" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 7. CTA de WhatsApp */
function CtaWhatsApp() {
  return (
    <section className="relative overflow-hidden bg-blue px-5 py-16 text-white">
      <div className="container relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="max-w-2xl text-center lg:text-left">
          <h2 className="font-playfair text-3xl uppercase leading-tight md:text-4xl">¿Querés saber qué local se ajusta a tu presupuesto?</h2>
          <p className="mt-3 font-raleway text-base leading-7 text-white/80 md:text-lg">
            Contanos qué buscás y te mostramos las opciones disponibles para alquilar o comprar, con atención personalizada.
          </p>
        </div>
        <WhatsAppLink href={WHATSAPP_GENERAL} className="shrink-0 rounded-xl px-8 py-4 text-base shadow-2xl">
          Hablar por WhatsApp ({WHATSAPP_LOCALES_LABEL})
        </WhatsAppLink>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-5 [background-size:16px_16px]" />
    </section>
  );
}

export default function LocalesComercialesPage() {
  return (
    <ReCaptcha>
      <>
        <StructuredDataScripts pathname="/locales-comerciales" />

        <Hero />
        <Intro />

        <div id="locales" className="scroll-mt-20">
          <UnidadesDestacadas
            tipo="local"
            cantidad={4}
            titulo="Locales disponibles"
            bajada="Unidades publicadas en tiempo real, con fotos, superficie y precio actualizados."
          />
        </div>

        <Comparador />
        <Ubicaciones />
        <Galeria />
        <Financiacion />
        <CtaWhatsApp />

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
