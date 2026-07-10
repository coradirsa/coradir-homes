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

const VILLA_MERCEDES_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Riobamba+477%2C+Villa+Mercedes%2C+San+Luis";

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
    title: "Departamentos de 2 dormitorios",
    description: "16 unidades con distribución funcional y espacios optimizados.",
  },
];

export function generateMetadata(): Metadata {
  return createMetadata({ pathname: "/villa-mercedes" }).metadata;
}

export const revalidate = 3600;

export default function VillaMercedesPage() {
  return (
    <ReCaptcha>
      <>
        <StructuredDataScripts pathname="/villa-mercedes" />

        <section className="w-full bg-blue text-white">
          <div className="relative h-[68vh] min-h-[500px] w-full overflow-hidden">
            <Image
              src="/img/villa-mercedes/hero-atardecer.webp"
              alt="Complejo Villa Mercedes al atardecer, con acceso cerrado y estacionamiento individual"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-blue/55" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-blue to-transparent" />

            <div className="relative z-10 container mx-auto flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
              <h1 className="font-playfair text-4xl font-bold tracking-wide md:text-6xl xl:text-7xl">
                COMPLEJO
                <br />
                VILLA MERCEDES
              </h1>
              <p className="max-w-4xl font-raleway text-2xl italic md:text-4xl">
                Viví como querés, cerca de todo.
              </p>
              <p className="max-w-5xl font-raleway text-base font-semibold md:text-2xl">
                {HERO_FEATURES.join(" · ")}
              </p>
              <Link
                href="#formulario"
                className="rounded-full bg-white px-8 py-3 font-raleway text-sm font-bold uppercase tracking-wide text-blue transition hover:bg-blue hover:text-white hover:outline hover:outline-2 hover:outline-white md:px-14 md:text-base"
              >
                Quiero mi vivienda propia
              </Link>
            </div>
          </div>

          <div className="container mx-auto px-6 py-16 text-center">
            <h2 className="font-playfair text-4xl font-bold md:text-5xl">
              Un proyecto pensado para vos y con respaldo.
            </h2>
            <p className="mx-auto mt-6 max-w-4xl font-raleway text-lg md:text-xl">
              Ubicado en una zona consolidada en Villa Mercedes, nuestro complejo cerrado de
              departamentos redefine tu experiencia de vida. Diseñamos espacios pensando en la
              funcionalidad y tranquilidad, respaldado por la experiencia de CORADIR en proyectos de
              infraestructura de gran escala.
            </p>
            <Link
              href="#formulario"
              className="mt-10 inline-flex rounded-full border-2 border-white px-10 py-2 font-raleway text-base font-bold uppercase tracking-wide transition hover:bg-white hover:text-blue md:px-16"
            >
              Quiero información
            </Link>
          </div>
        </section>

        <section id="beneficios" className="container mx-auto flex flex-col gap-16 px-6 py-20">
          <article className="grid overflow-hidden rounded-[2rem] bg-[#d9e8f5] lg:grid-cols-2">
            <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
              <h3 className="font-playfair text-4xl font-bold text-blue md:text-5xl">
                Tu próximo hogar empieza acá. Mudate a una vida más simple.
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
                src="/img/villa-mercedes/complejo-frente-dia.webp"
                alt="Frente del Complejo Villa Mercedes de día, con estacionamiento individual"
                width={1600}
                height={949}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full rounded-[1.7rem] object-cover"
              />
            </div>
          </article>

          <article className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              <h3 className="font-playfair text-5xl font-bold leading-tight text-blue md:text-6xl">
                Tu próximo paso, más simple de lo que imaginás.
              </h3>
              <p className="mt-6 max-w-3xl font-raleway text-lg text-black md:text-xl">
                En Complejo Villa Mercedes, te brindamos una experiencia ágil y profesional a la hora
                de adquirir tu vivienda con soluciones a tu medida. Contamos con póliza de caución y
                el respaldo de CORADIR, una empresa con amplia experiencia en el desarrollo de
                infraestructura y proyectos de gran escala.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.7rem] bg-blue">
              <Image
                src="/img/villa-mercedes/complejo-aereo.webp"
                alt="Vista aérea del Complejo Villa Mercedes sobre calle Riobamba"
                width={1122}
                height={1402}
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

        <section className="container mx-auto px-6 py-20">
          <h2 className="text-center font-playfair text-5xl font-bold leading-tight text-blue md:text-6xl">
            Tu lugar, pensado
            <br />
            para vivir mejor
          </h2>

          <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h3 className="font-playfair text-4xl font-bold uppercase tracking-wide text-blue md:text-5xl">
                Departamentos de 2 dormitorios
              </h3>
              <p className="mt-6 max-w-2xl font-raleway text-lg text-black md:text-xl">
                Con una tipología unificada para todos los departamentos de planta alta y baja,
                ofrecemos distribuciones funcionales, buena iluminación y espacios optimizados,
                adaptándose a distintas formas de habitar y priorizando comodidad, diseño y
                eficiencia en cada unidad.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Image
                src="/img/villa-mercedes/dormitorio-secundario.webp"
                alt="Dormitorio secundario con dos camas en departamento del Complejo Villa Mercedes"
                width={1179}
                height={1179}
                sizes="(max-width: 640px) 100vw, 330px"
                className="h-auto w-full rounded-[1.7rem]"
              />
              <Image
                src="/img/villa-mercedes/bano-tender.webp"
                alt="Baño con lavarropas y tender rebatible en departamento del Complejo Villa Mercedes"
                width={1400}
                height={1400}
                sizes="(max-width: 640px) 100vw, 330px"
                className="h-auto w-full rounded-[1.7rem]"
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-20">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <h2 className="font-playfair text-4xl font-bold leading-tight text-blue md:text-5xl">
              Accedé a nuestro folleto comercial con más información
            </h2>
            <a
              href="/img/villa-mercedes/Folleto-vertical-Villa-Mercedes.pdf"
              download
              className="inline-flex w-fit rounded-full bg-blue px-10 py-3 font-raleway text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#163253] md:px-14 md:text-base"
            >
              Descargar folleto
            </a>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
            <a
              href={VILLA_MERCEDES_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-[1.7rem] border border-blue/15 bg-white shadow-[0_18px_35px_-22px_rgba(17,49,87,0.55)]"
            >
              <Image
                src="/img/villa-mercedes/mapa-ubicacion.webp"
                alt="Ubicación del Complejo Villa Mercedes en Riobamba 477 (abrir en Google Maps)"
                width={929}
                height={485}
                className="h-auto w-full rounded-[1.7rem]"
                sizes="(max-width: 1024px) 100vw, 700px"
              />
            </a>

            <div className="space-y-6">
              <h3 className="font-playfair text-5xl font-bold leading-tight text-blue md:text-6xl">
                Ubicación estratégica en Villa Mercedes
              </h3>
              <p className="font-raleway text-lg text-black md:text-xl">
                El proyecto se desarrolla en una zona urbana, cerca del centro de la ciudad y cercanía
                a puntos de alto tránsito, combinando tranquilidad y conectividad para la vida diaria.
              </p>
              <p className="font-raleway text-xl font-bold text-blue md:text-2xl">
                16 departamentos de 2 dormitorios
                <br />
                Parking individual
              </p>
              <span className="flex items-center gap-2 font-raleway text-lg font-semibold text-black md:text-xl">
                <MaterialIcon name="location_on" className="text-[22px] text-blue" />
                Riobamba 477, Ciudad de Villa Mercedes
              </span>
              <Link
                href="#formulario"
                className="inline-flex rounded-full bg-blue px-10 py-3 font-raleway text-base font-bold uppercase tracking-wide text-white transition hover:bg-[#163253]"
              >
                Saber más
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full bg-[#f5f6f7]">
          <div className="bg-blue px-6 py-6 text-center text-white">
            <p className="font-raleway text-xl md:text-2xl">Asegurá las mejores condiciones para tu mudanza.</p>
            <h2 className="font-playfair text-4xl font-bold uppercase md:text-5xl">Comprá hoy en Villa Mercedes</h2>
          </div>

          <div className="container mx-auto px-6 py-16">
            <p className="mx-auto max-w-4xl text-center font-raleway text-lg text-black md:text-xl">
              Fijá las condiciones hoy y asegurate el acceso a un hogar moderno, nuevo y bien ubicado.
            </p>

            <article className="mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-[2rem] bg-[#d9e8f5] lg:grid-cols-[1fr_320px]">
              <div className="p-8 md:p-10">
                <p className="font-raleway text-lg text-black md:text-xl">
                  Accedé a un proyecto pensado para vivir con comodidad, rodeado de naturaleza,
                  servicios y buena conectividad.
                </p>
                <p className="mt-5 font-raleway text-xl font-bold text-blue">Accedé a comodidades como:</p>
                <ul className="mt-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2 font-raleway text-lg text-black md:text-xl">
                    <MaterialIcon name="check_circle" className="text-[22px] text-[#24a5de]" />
                    Estacionamiento individual con posibilidad de techado
                  </li>
                  <li className="flex items-center gap-2 font-raleway text-lg text-black md:text-xl">
                    <MaterialIcon name="check_circle" className="text-[22px] text-[#24a5de]" />
                    Cocina equipada
                  </li>
                  <li className="flex items-center gap-2 font-raleway text-lg text-black md:text-xl">
                    <MaterialIcon name="check_circle" className="text-[22px] text-[#24a5de]" />
                    Departamentos de 2 dormitorios
                  </li>
                </ul>
              </div>

              <div className="flex flex-col bg-blue">
                <Image
                  src="/img/villa-mercedes/dormitorio-principal.webp"
                  alt="Dormitorio principal de departamento del Complejo Villa Mercedes"
                  width={1333}
                  height={1180}
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="h-full w-full object-cover"
                />
                <Link
                  href="#formulario"
                  className="block bg-blue py-3 text-center font-raleway text-xl font-bold text-white transition hover:bg-[#163253]"
                >
                  Quiero saber más
                </Link>
              </div>
            </article>
          </div>
        </section>

        <ProjectForm
          interest="villa-mercedes"
          layout="split"
          splitImageSide="left"
          heading="Tu futura casa te espera."
          subtitle="El lugar soñado existe, configura la opción que mejor se adapte a vos."
          backgroundImage="/img/villa-mercedes/cocina-comedor.webp"
          id="formulario"
          transactionTypes={["comprar"]}
        />
      </>
    </ReCaptcha>
  );
}
