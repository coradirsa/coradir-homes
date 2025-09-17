"use client";
 
import ButtonContact from "@/app/components/buttonContact";
import Image from "next/image";
import   Counter  from "./components/counter";
 
export default function SectionStats() {
  const stats = [
    {
      count: 44,
      text: <>Departamentos <b>Disponibles</b></>,
    },
    {
      count: 20,
      text: <>Departamentos <b>Reservados</b></>,
    }, 
  ];

  return (
    <section className="w-full bg-white">
      <section className="container py-10 px-5 gap-5 flex flex-col items-center justify-center bg-white">
        <article className="gap-10 flex items-center justify-evenly">
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
          className="bg-blue text-white hover:opacity-100 opacity-95 my-10 text-[18px]"
          label="¡SUMATE A ESTE GRAN PROYECTO!"
        />
        <Image
          loading="lazy"
          src="/img/vivienda-joven/PLANO.webp"
          alt="Slider"
          width={2000}
          height={2000}
          className="md:w-[70%] h-full object-cover"
        />
        <h1 className="text-3xl md:text-4xl md:text-6xl xl:text-7xl 2xl:text-9xl text-blue w-full  font-playfair   text-center leading-tight font-bold pt-10">
          Accedé a planes de pago
        </h1>
       <div className="container">
            <div className="w-full rounded-xl border-3 border-blue grid grid-rows-4 font-raleway text-[8px] sm:text-sm md:text-lg xl:text-2xl">
                <div className="flex items-center justify-between w-full font-bold p-4 px-2 xl:px-8 border-b-3 border-blue text-center grid grid-cols-6">
                    <span className="text-left">Esquema</span>
                    <span>Precio ref.</span>
                    <span>Reserva</span> 
                    <span>A 30 dias</span>
                    <span>A 120-180 días</span>
                    <span>Contrata entrega /<br/>posesión</span>
                </div>
                <div className="flex items-center justify-between w-full p-4 px-2 xl:px-8 border-b-2 border-blue/60 text-center grid grid-cols-6">
                    <span className="font-bold text-left">LISTA</span>
                    <span>USD 63.000</span>
                    <span>3%</span> 
                    <span>Completar <br/> hasta 10% <br/> </span>
                    <span>-</span>
                    <span>90%<br/></span>
                </div>
                <div className="flex items-center justify-between w-full p-4 px-2 xl:px-8 border-b-2 border-blue/60 text-center grid grid-cols-6">
                    <span className="font-bold text-left">PREFERENCIAL</span>
                    <span>USD 55.000</span>
                    <span>3%</span> 
                    <span>40%</span>
                    <span>40%</span>
                    <span>20%</span>
                </div>
                <div className="flex items-center justify-between w-full p-4 px-2 xl:px-8 text-center grid grid-cols-6">
                    <span className="font-bold text-left">INVERSOR</span>
                    <span>USD 47.000</span>
                    <span>3%</span> 
                    <span>Boleto por <br/> 100% <br/> (saldo)</span>
                    <span>-</span>
                    <span>-</span>
                </div>

            </div>
        </div>
 


      </section>
    </section>
  );
}
