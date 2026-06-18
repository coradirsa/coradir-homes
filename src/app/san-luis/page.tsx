import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import ReCaptcha from "../components/reCaptcha";
import ProjectForm from "../components/projectForm";
import MaterialIcon from "../components/MaterialIcon";

const HERO_FEATURES = [
  "Departamentos inteligentes",
  "Construcción rápida",
  "Seguridad con IA",
  "Estacionamiento",
];

const SAN_LUIS_MAPS_URL = "https://maps.app.goo.gl/PDRfuXWDYKb8iRJr6";

const MAIN_BENEFITS = [
  {
    title: "Conectividad y seguridad",
    description: "Conexión WiFi y vigilancia inteligente con IA las 24 hs para tu tranquilidad.",
  },
  {
    title: "Todo resuelto",
    description: "Departamentos equipados, estacionamiento propio y a solo minutos del centro.",
  },
  {
    title: "Locales comerciales",
    description: "Espacios en venta en pozo para proyectos comerciales en crecimiento.",
  },
];

const PURCHASE_STEPS = [
  {
    title: "Lista de interés",
    description:
      "Reserva tu lugar con prioridad comercial y elegí la unidad que mejor se adapte a tu objetivo.",
    icon: "shield",
  },
  {
    title: "Pre-reserva",
    description: "Abona una seña para congelar condiciones y avanzar con asesoría personalizada.",
    icon: "monetization_on",
  },
  {
    title: "Boleto y posesión",
    description: "Finaliza la operación con respaldo jurídico y proyecta tu unidad con entrega planificada.",
    icon: "fact_check",
  },
];

export function generateMetadata(): Metadata {
  return createMetadata({ pathname: "/san-luis" }).metadata;
}

export const revalidate = 3600;

export default function SanLuisPage() {
  return (
    <ReCaptcha>
      <>
        <StructuredDataScripts pathname="/san-luis" />

        <section className="w-full bg-blue text-white">
          <div className="relative h-[68vh] min-h-[500px] w-full overflow-hidden">
            <Image
              src="/img/san-luis/complejo5.webp"
              alt="Complejo San Luis de Coradir Homes"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-blue/55" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-blue to-transparent" />

            <div className="relative z-10 container mx-auto flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
              <h1 className="font-playfair text-5xl font-bold tracking-wide md:text-7xl xl:text-8xl">
                SAN LUIS
              </h1>
              <p className="max-w-4xl font-raleway text-2xl italic md:text-4xl">
                ¿Querés vivir donde todo sucede? Este es tu lugar.
              </p>
              <p className="max-w-5xl font-raleway text-base font-semibold md:text-2xl">
                {HERO_FEATURES.join(" · ")}
              </p>
              <Link
                href="#formulario"
                className="rounded-full bg-white px-8 py-3 font-raleway text-sm font-bold uppercase tracking-wide text-blue transition hover:bg-blue hover:text-white hover:outline hover:outline-2 hover:outline-white md:px-14 md:text-base"
              >
                + INFORMACIÓN
              </Link>
            </div>
          </div>

          <div className="container mx-auto px-6 py-16 text-center">
            <h2 className="font-playfair text-4xl font-bold md:text-5xl">Un proyecto con versatilidad y respaldo</h2>
            <p className="mx-auto mt-6 max-w-4xl font-raleway text-lg md:text-xl">
              Ubicado en una zona consolidada con flujo constante, nuestro complejo de departamentos
              redefine la experiencia urbana. Diseñamos espacios pensando en la funcionalidad y tecnología,
              respaldados por la experiencia de CORADIR en proyectos de infraestructura de gran escala.
            </p>
            <Link
              href="#beneficios"
              className="mt-10 inline-flex rounded-full border-2 border-white px-10 py-2 font-raleway text-base font-bold uppercase tracking-wide transition hover:bg-white hover:text-blue md:px-16"
            >
              + Información
            </Link>
          </div>
        </section>

        <section id="beneficios" className="container mx-auto flex flex-col gap-16 px-6 py-20">
          <article className="grid overflow-hidden rounded-[2rem] bg-[#d9e8f5] lg:grid-cols-2">
            <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
              <h3 className="font-playfair text-4xl font-bold text-blue md:text-5xl">
                Un proyecto pensado para vivir con comodidad real
              </h3>
              <ul className="flex flex-col gap-4">
                {MAIN_BENEFITS.map((item) => (
                  <li key={item.title} className="flex items-start gap-3 font-raleway text-base text-black md:text-xl">
                    <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[24px] text-[#24a5de]" />
                    <span>
                      <b>{item.title}:</b> {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="self-center overflow-hidden rounded-[1.7rem] lg:self-stretch">
              <Image
                src="/img/san-luis/complejo1.webp"
                alt="Vista interior del complejo San Luis"
                width={1536}
                height={1024}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full rounded-[1.7rem]"
              />
            </div>
          </article>

          <article className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              <h3 className="font-playfair text-5xl font-bold leading-tight text-blue md:text-6xl">
                Tu próximo paso, más simple de lo que imaginas
              </h3>
              <p className="mt-6 max-w-3xl font-raleway text-lg text-black md:text-xl">
                En Complejo San Luis, el acceso a tu nueva vivienda se resuelve con acompañamiento
                profesional de principio a fin. Tu compra cuenta con póliza de caución y respaldo de CORADIR
                para brindarte previsibilidad desde el inicio.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.7rem] bg-blue">
              <Image
                src="/img/san-luis/complejo5.webp"
                alt="Vista aérea del complejo San Luis"
                width={1536}
                height={1024}
                sizes="(max-width: 1024px) 100vw, 420px"
                className="h-auto w-full rounded-t-[1.7rem]"
              />
              <Link
                href="#formulario"
                className="block w-full bg-blue py-3 text-center font-raleway text-xl font-bold text-white transition hover:bg-[#163253]"
              >
                Quiero comunicarme
              </Link>
            </div>
          </article>
        </section>

        <section className="w-full bg-[#f5f6f7] py-16">
          <div className="container mx-auto px-6">
            <h2 className="mb-8 text-center font-playfair text-5xl font-bold text-blue md:text-6xl">
              Plan Maestro
            </h2>
            <div className="mx-auto max-w-4xl">
              <Image
                src="/img/san-luis/plano-IA.webp"
                alt="Plan Maestro de departamentos y locales en San Luis"
                width={1024}
                height={741}
                className="h-auto w-full rounded-[2rem]"
              />
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <p className="font-raleway text-xl text-black md:text-2xl">
                26 departamentos - 2 dormitorios
                <br />
                Estacionamiento individual
                <br />2 locales comerciales
              </p>
              <div className="flex flex-col items-start gap-4 md:items-end">
                <span className="flex items-center gap-2 font-raleway text-lg font-semibold text-black md:text-xl">
                  <MaterialIcon name="location_on" className="text-[22px] text-blue" />
                  José Hernández y Chile, Ciudad de San Luis
                </span>
                <Link
                  href="#formulario"
                  className="rounded-full bg-blue px-12 py-2 font-raleway text-base font-bold uppercase tracking-wide text-white transition hover:bg-[#163253]"
                >
                  Saber más
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <h2 className="text-center font-playfair text-5xl font-bold leading-tight text-blue md:text-6xl">
            Tu lugar,
            <br />
            para vivir mejor
          </h2>
          <p className="mt-4 text-center font-raleway text-2xl font-semibold text-blue md:text-3xl">
            Tipologia: 2 dormitorios.
          </p>

          <div className="mx-auto mt-10 max-w-[980px] overflow-hidden rounded-[2rem]">
            <Image
              src="/img/san-luis/dptos-croquis.webp"
              alt="Croquis de departamentos de dos dormitorios"
              width={1600}
              height={900}
              className="h-auto w-full rounded-[2rem]"
              sizes="(max-width: 1024px) 100vw, 980px"
            />
          </div>

          <p className="mx-auto mt-8 max-w-5xl text-center font-raleway text-lg text-black md:text-xl">
            Con un diseño unificado para todos los departamentos de planta alta y baja, ofrecemos
            distribuciones funcionales, buena iluminación y espacios optimizados, adaptándose a distintas
            formas de habitar y priorizando comodidad y eficiencia en cada unidad.
          </p>
        </section>

        <section className="w-full bg-[#f5f6f7] py-16">
          <div className="container mx-auto px-6">
            <h2 className="mb-8 text-center font-playfair text-5xl font-bold uppercase tracking-wide text-blue md:text-6xl">
              Locales comerciales
            </h2>
            <div className="mx-auto max-w-6xl space-y-7">
              <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem]">
                <Image
                  src="/img/san-luis/local-comercial.webp"
                  alt="Vista del local comercial"
                  width={1536}
                  height={1024}
                  className="h-auto w-full rounded-[2rem]"
                  sizes="(max-width: 768px) 100vw, 980px"
                />
              </div>

              <div className="mx-auto max-w-4xl">
                <p className="font-raleway text-lg text-black md:pt-3 md:text-xl">
                  Locales comerciales diseñados para crecer con vos. Arquitectura moderna, infraestructura
                  eficiente y seguridad gestionada con inteligencia artificial. Un local que combina
                  ubicación, tecnología y previsibilidad. Un paso adelante para tu proyecto comercial.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <h2 className="font-playfair text-4xl font-bold leading-tight text-blue md:text-5xl">
              Accede a nuestro folleto comercial con más información
            </h2>
            <a
              href="/img/san-luis/Folleto%20vertical%20-%20San%20Luis.pdf"
              download
              className="inline-flex w-fit rounded-full bg-blue px-10 py-3 font-raleway text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#163253] md:px-14 md:text-base"
            >
              Descargar folleto
            </a>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
            <a
              href={SAN_LUIS_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-[1.7rem] border border-blue/15 bg-white shadow-[0_18px_35px_-22px_rgba(17,49,87,0.55)]"
            >
              <Image
                src="/img/san-luis/mapa-referencias.webp"
                alt="Ubicación estratégica del complejo San Luis (abrir en Google Maps)"
                width={4000}
                height={2022}
                className="h-auto w-full rounded-[1.7rem]"
              />
            </a>

            <div className="space-y-6">
              <h3 className="font-playfair text-5xl font-bold leading-tight text-blue md:text-6xl">
                Ubicación estratégica en San Luis
              </h3>
              <p className="font-raleway text-lg text-black md:text-xl">
                El proyecto se desarrolla en una zona consolidada de San Luis, con accesos rápidos y
                cercanía a servicios claves para la vida diaria.
              </p>
              <Link
                href="#formulario"
                className="inline-flex rounded-full bg-blue px-10 py-3 font-raleway text-base font-bold uppercase tracking-wide text-white transition hover:bg-[#163253]"
              >
                Quiero mi propio hogar
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full bg-[#f5f6f7]">
          <div className="bg-blue px-6 py-6 text-center text-white">
            <p className="font-raleway text-xl md:text-2xl">Asegura las mejores condiciones para tu mudanza.</p>
            <h2 className="font-playfair text-4xl font-bold uppercase md:text-5xl">Compra hoy en San Luis</h2>
          </div>

          <div className="container mx-auto px-6 py-16">
            <p className="mx-auto max-w-4xl text-center font-raleway text-lg text-black md:text-xl">
              Fija condiciones hoy y asegura el acceso a un hogar moderno, nuevo y bien ubicado.
            </p>

            <article className="mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-[2rem] bg-[#d9e8f5] lg:grid-cols-[1fr_320px]">
              <div className="p-8 md:p-10">
                <p className="font-raleway text-lg text-black md:text-xl">
                  Accede a un proyecto pensado para vivir con comodidad, rodeado de naturaleza, servicios y
                  buena conectividad.
                </p>
                <p className="mt-5 font-raleway text-xl font-bold text-blue">Accede a comodidades como:</p>
                <ul className="mt-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2 font-raleway text-lg text-black md:text-xl">
                    <MaterialIcon name="check_circle" className="text-[22px] text-[#24a5de]" />
                    Estacionamiento individual
                  </li>
                  <li className="flex items-center gap-2 font-raleway text-lg text-black md:text-xl">
                    <MaterialIcon name="check_circle" className="text-[22px] text-[#24a5de]" />
                    Cocina equipada
                  </li>
                  <li className="flex items-center gap-2 font-raleway text-lg text-black md:text-xl">
                    <MaterialIcon name="check_circle" className="text-[22px] text-[#24a5de]" />2 dormitorios
                  </li>
                </ul>
              </div>

              <div className="flex flex-col bg-blue">
                <Image
                  src="/img/san-luis/complejo2.webp"
                  alt="Vista del complejo San Luis"
                  width={1536}
                  height={1024}
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="h-auto w-full"
                />
                <Link
                  href="#formulario"
                  className="block bg-blue py-3 text-center font-raleway text-xl font-bold text-white transition hover:bg-[#163253]"
                >
                  Quiero saber más
                </Link>
              </div>
            </article>

            <h3 className="mt-16 text-center font-playfair text-5xl font-bold text-blue md:text-6xl">
              ¿Cómo realizo la compra?
            </h3>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {PURCHASE_STEPS.map((step) => {
                return (
                  <article key={step.title} className="rounded-3xl bg-white p-8 shadow-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue text-white">
                      <MaterialIcon name={step.icon} className="text-[36px]" />
                    </div>
                    <h4 className="mt-5 font-playfair text-3xl font-bold uppercase text-blue">{step.title}</h4>
                    <p className="mt-3 font-raleway text-lg text-black">{step.description}</p>
                  </article>
                );
              })}
            </div>

          </div>
        </section>

        <ProjectForm
          interest="san-luis"
          layout="split"
          splitImageSide="left"
          heading="Tu futura casa te espera."
          subtitle="El lugar soñado existe, configura la opción que mejor se adapte a vos."
          backgroundImage="/img/san-luis/4.webp"
          id="formulario"
          transactionTypes={["comprar"]}
        />
      </>
    </ReCaptcha>
  );
}
