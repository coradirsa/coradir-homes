"use client";
 
import ButtonContact from "@/app/components/buttonContact";
import Image from "next/image";
import   Counter  from "./components/counter";
 
export default function SectionStats() {
  const stats = [
    {
      count: 18,
      text: <>Departamentos <b>Disponibles</b></>,
    },
    {
      count: 20,
      text: <>Departamentos <b>Reservados</b></>,
    },
    {
      count: 26,
      text: <>Departamentos <b>Vendidos</b></>,
    },
  ];

  return (
    <section className="w-full bg-white">
      <section className="container py-10 px-5 gap-5 flex flex-col items-center justify-center bg-white">
        <article className="w-full flex items-center justify-center gap-5">
          {stats.map((s, idx) => (
            <div
              className="flex flex-col items-center justify-center gap-5"
              key={idx}
            >
              <Counter end={Number(s.count)} duration={1.0} />
              <span className="text-xl text-center text-black flex flex-col items-center justify-center font-playfail">
                {s.text}
              </span>
            </div>
          ))}
        </article>
        <ButtonContact
          href="#formulario"
          className="bg-blue text-white hover:opacity-100 opacity-95"
          label="¡SUMATE A ESTE GRAN PROYECTO!"
        />
        <Image
          loading="lazy"
          src="/img/vivienda-joven/PLANO.png"
          alt="Slider"
          width={2000}
          height={2000}
          className="w-[70%] h-full object-cover"
        />
        <h1 className="text-4xl md:text-6xl xl:text-7xl 2xl:text-9xl text-blue w-full  font-playfair   text-center leading-tight font-bold pt-10">
          Accedé a planes de pago
        </h1>
        <Image
          loading="lazy"
          src="/img/vivienda-joven/TABLA DE PRECIOS.jpg"
          alt="Slider"
          width={2000}
          height={2000}
          className="w-full h-full object-cover"
        />
      </section>
    </section>
  );
}
