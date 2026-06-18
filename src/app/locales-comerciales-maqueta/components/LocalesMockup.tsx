"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "@/app/components/MaterialIcon";
import type { SiteData } from "../../locales-comerciales/types";

type ModeId = "comprar" | "alquilar" | "leasing";

const commercialModes: Array<{
  id: ModeId;
  title: string;
  description: string;
  headline: string;
  body: string;
  points: string[];
}> = [
  {
    id: "comprar",
    title: "Comprar",
    description: "Inversión patrimonial a largo plazo.",
    headline: "Adquisición directa",
    body: "Asegura el futuro de tu marca con propiedad del inmueble y planes de pago personalizados hasta la entrega.",
    points: ["Alta revalorización", "Personalización del local", "Respaldo CORADIR", "Uso comercial inmediato"],
  },
  {
    id: "alquilar",
    title: "Alquilar",
    description: "Ubicación premium sin inmovilizar capital.",
    headline: "Contrato de alquiler",
    body: "Accedé a una ubicación estratégica con backup energético y condiciones pensadas para sostener la apertura de tu negocio.",
    points: ["Primer año con respaldo energético", "Póliza de caución", "Expensas controladas", "Ingreso planificado"],
  },
  {
    id: "leasing",
    title: "Leasing",
    description: "Financiación propia con opción de compra.",
    headline: "Leasing inmobiliario",
    body: "Una alternativa flexible para empresas en crecimiento: operar hoy y convertir cuotas en una opción de compra futura.",
    points: ["Financiación propia", "Opción de compra", "Flexibilidad contractual", "Sin bancos intermediarios"],
  },
];

const unitCards = [
  { title: "Local 01", status: "Disponible", image: "/img/complejo-coradir/6.webp", icon: "battery_android_shield", label: "Backup" },
  { title: "Local 02", status: "Disponible", image: "/img/complejo-coradir/2.webp", icon: "videocam", label: "IA Security" },
  { title: "Local 03", status: "Disponible", image: "/img/complejo-coradir/7.webp", icon: "verified_user", label: "Caución" },
  { title: "Local 04", status: "Pre-reserva", image: "/img/complejo-coradir/8.2.webp", icon: "electric_bolt", label: "Energía" },
];

const benefits = [
  {
    icon: "shield_with_heart",
    title: "Seguridad con IA",
    description: "Vigilancia inteligente para proteger operación, clientes y mercadería.",
  },
  {
    icon: "policy",
    title: "Póliza de caución",
    description: "Un esquema administrativo pensado para agilizar el ingreso.",
  },
  {
    icon: "savings",
    title: "Pago adelantado",
    description: "Descuentos y condiciones especiales por planificación anticipada.",
  },
  {
    icon: "trending_down",
    title: "Gracia inicial",
    description: "Beneficios de alquiler durante el arranque comercial del negocio.",
  },
];

const useCases = [
  { icon: "storefront", title: "Showroom" },
  { icon: "hub", title: "Franquicias" },
  { icon: "corporate_fare", title: "Oficinas" },
  { icon: "engineering", title: "Servicios" },
];

export function Hero({ data }: { data: SiteData }) {
  return (
    <header className="relative min-h-[82vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.hero.bgImage}
          alt="Locales comerciales CORADIR"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue via-blue/70 to-blue/20" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container relative z-10 flex min-h-[82vh] items-center px-5 py-24">
        <div className="max-w-3xl text-white">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 font-raleway text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-blue-light shadow-[0_0_0_6px_rgba(62,179,228,0.18)]" />
            Entrega 2026-2027
          </span>

          <h1 className="font-playfair text-4xl leading-tight drop-shadow-xl md:text-6xl">
            Locales comerciales para hacer crecer tu negocio
          </h1>

          <p className="mt-6 max-w-2xl font-raleway text-lg leading-8 text-white/90 md:text-xl">
            Un complejo comercial de 4 unidades con 180 m² por local, seguridad con IA, backup energético y ubicación estratégica sobre Ruta 3 km 0.6.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {["4 locales exclusivos", "180 m2 superficie", "Ruta 3 km 0.6", "Seguridad IA"].map((item) => (
              <span key={item} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-raleway text-sm font-semibold backdrop-blur-md">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="#contact"
              className="inline-flex justify-center rounded-full bg-white px-9 py-4 font-raleway text-sm font-bold uppercase tracking-widest text-blue shadow-xl transition hover:bg-white/90"
            >
              Consultar disponibilidad
            </Link>
            <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white backdrop-blur-md">
              <MaterialIcon name="battery_android_shield" className="text-[28px]" />
              <div className="font-raleway">
                <p className="text-xs uppercase tracking-[0.16em] text-white/70">Backup energético</p>
                <p className="font-bold">12 meses garantizados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function CommercialOptions() {
  const [activeMode, setActiveMode] = useState<ModeId>("comprar");
  const active = commercialModes.find((mode) => mode.id === activeMode) ?? commercialModes[0];

  return (
    <section id="venta" className="container px-5 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="font-raleway text-sm font-bold uppercase tracking-[0.22em] text-blue-light">Flexibilidad operativa</p>
        <h2 className="mt-3 font-playfair text-4xl text-blue md:text-5xl">Elegís cómo entrar al proyecto</h2>
        <p className="mt-4 font-raleway text-lg leading-8 text-gray">Tres modelos comerciales para adaptar la inversión a la madurez de tu negocio.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-1">
          {commercialModes.map((mode) => {
            const isActive = mode.id === activeMode;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                className={`min-h-28 rounded-xl border-2 p-5 text-left transition ${
                  isActive ? "border-blue bg-blue text-white shadow-xl" : "border-blue/15 bg-white text-blue hover:border-blue/50"
                }`}
              >
                <span className="block font-raleway text-xl font-bold">{mode.title}</span>
                <span className={`mt-2 block font-raleway text-sm leading-6 ${isActive ? "text-white/80" : "text-gray"}`}>
                  {mode.description}
                </span>
              </button>
            );
          })}
        </div>

        <article className="flex min-h-[340px] items-center rounded-2xl border border-blue/10 bg-white p-8 shadow-lg lg:col-span-2">
          <div>
            <h3 className="font-playfair text-3xl text-blue">{active.headline}</h3>
            <p className="mt-4 max-w-2xl font-raleway text-lg leading-8 text-gray">{active.body}</p>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {active.points.map((point) => (
                <li key={point} className="flex items-center gap-3 font-raleway font-semibold text-blue">
                  <MaterialIcon name="check_circle" className="text-[24px]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}

export function Units({ data }: { data: SiteData }) {
  return (
    <section id="alquiler" className="bg-[#f5f8fc] px-5 py-20">
      <div className="container">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-playfair text-4xl text-blue md:text-5xl">Unidades disponibles</h2>
            <p className="mt-3 font-raleway text-lg text-gray">Diseño modular de alta eficiencia para distintos rubros comerciales.</p>
          </div>
          <span className="font-raleway text-sm font-bold uppercase tracking-[0.18em] text-blue">Total: 4 unidades</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {unitCards.map((unit) => (
            <article key={unit.title} className="overflow-hidden rounded-2xl border border-blue/10 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative overflow-hidden" style={{ height: 190 }}>
                <Image
                  src={unit.image}
                  alt={`${unit.title} - ${data.ambientes.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-blue px-3 py-1 font-raleway text-xs font-bold uppercase tracking-widest text-white">
                  {unit.status}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-raleway text-xl font-bold text-blue">{unit.title}</h3>
                <div className="mt-4 flex justify-between gap-4 font-raleway text-sm text-gray">
                  <span className="flex items-center gap-1">
                    <MaterialIcon name="straighten" className="text-[18px] text-blue" />
                    180 m²
                  </span>
                  <span className="flex items-center gap-1">
                    <MaterialIcon name={unit.icon} className="text-[18px] text-blue" />
                    {unit.label}
                  </span>
                </div>
                <Link
                  href="#contact"
                  className="mt-6 inline-flex w-full justify-center rounded-full border border-blue px-4 py-2.5 font-raleway text-sm font-bold uppercase tracking-widest text-blue transition hover:bg-blue hover:text-white"
                >
                  Ver detalles
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Location({ data }: { data: SiteData }) {
  return (
    <section className="bg-blue px-5 py-20 text-white">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="font-raleway text-sm font-bold uppercase tracking-[0.22em] text-white/60">Ubicación estratégica</p>
          <h2 className="mt-4 font-playfair text-4xl leading-tight md:text-5xl">El epicentro comercial de San Luis</h2>
          <p className="mt-6 font-raleway text-lg leading-8 text-white/80">
            Situado en Ruta 3 km 0.6, el complejo ofrece conectividad directa con corredores residenciales y zonas de crecimiento comercial.
          </p>

          <div className="mt-8 grid gap-5">
            {[
              { icon: "location_on", title: "Acceso directo", text: data.project_detail.location },
              { icon: "trending_up", title: "Zona en crecimiento", text: "Alta plusvalía y flujo constante de clientes." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <MaterialIcon name={item.icon} className="text-[28px]" />
                </span>
                <div>
                  <h3 className="font-raleway text-xl font-bold">{item.title}</h3>
                  <p className="mt-1 font-raleway text-white/70">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl">
          <iframe
            src={data.project_detail.mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 grayscale transition duration-500 hover:grayscale-0"
            title="Mapa Locales Comerciales CORADIR"
          />
          <Link
            href="https://www.google.com.ar/maps/place/CORADIR+S.A./@-33.3188018,-66.3264503,18.5z/data=!4m6!3m5!1s0x95d43c093e9d1d53:0xb62c67d1cc1c0fbd!8m2!3d-33.3182069!4d-66.327227!16s%2Fg%2F11c5zqt6q1"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-raleway text-sm font-bold text-blue shadow-lg"
          >
            <MaterialIcon name="map" className="text-[22px]" />
            Abrir en Maps
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Benefits() {
  return (
    <section className="container px-5 py-20">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {benefits.map((benefit) => (
          <article key={benefit.title} className="rounded-2xl border border-blue/10 bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
            <MaterialIcon name={benefit.icon} className="text-[58px] text-blue" />
            <h3 className="mt-5 font-raleway text-xl font-bold text-blue">{benefit.title}</h3>
            <p className="mt-3 font-raleway text-sm leading-6 text-gray">{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function UseCases() {
  return (
    <section className="bg-[#e9f2ff] px-5 py-20 text-center">
      <div className="container">
        <h2 className="mx-auto max-w-3xl font-playfair text-4xl text-blue md:text-5xl">
          Diseñados para cualquier modelo de negocio
        </h2>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {useCases.map((item) => (
            <div key={item.title} className="flex min-h-36 flex-col items-center justify-start gap-4">
              <span
                className="flex shrink-0 items-center justify-center rounded-full bg-white text-blue shadow-md"
                style={{ width: 88, height: 88 }}
              >
                <MaterialIcon name={item.icon} className="text-[42px]" />
              </span>
              <span className="font-raleway text-lg font-bold text-blue">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
