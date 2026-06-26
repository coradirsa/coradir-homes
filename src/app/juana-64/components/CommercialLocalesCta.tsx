import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "@/app/components/MaterialIcon";

export default function CommercialLocalesCta() {
  return (
    <section className="bg-[#f5f8fc] px-5 py-16">
      <div className="container grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="font-raleway text-sm font-bold uppercase tracking-[0.22em] text-blue-light">
            Oportunidad comercial
          </p>
          <h2 className="mt-3 font-playfair text-4xl leading-tight text-blue md:text-5xl">
            Locales comerciales en Juana 64
          </h2>
          <p className="mt-5 max-w-3xl font-raleway text-lg leading-8 text-gray">
            Juana 64 también incorpora locales comerciales dentro del desarrollo, pensados para servicios, comercios de
            cercanía y negocios con demanda diaria del entorno residencial.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {["Precio pozo desde USD 53.000 + IVA", "Leasing hasta 96 meses", "Reserva del 3%", "Entrega primera etapa estimada fin de julio 2026"].map((item) => (
              <div key={item} className="flex items-start gap-3 font-raleway text-base font-semibold text-blue">
                <MaterialIcon name="check_circle" className="mt-0.5 text-[22px] text-blue-light" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/locales-comerciales#juana-64"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-blue px-7 py-3 font-raleway text-sm font-bold uppercase tracking-wide text-white transition hover:bg-blue/90"
          >
            Ver locales Juana 64
            <MaterialIcon name="arrow_forward" className="text-[20px]" />
          </Link>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-blue/15 bg-white shadow-sm md:min-h-[420px]">
          <Image
            src="/img/vivienda-joven/hero.webp"
            alt="Juana 64"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
