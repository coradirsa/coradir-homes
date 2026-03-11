"use client";

import Image from "next/image";

export default function AlquilarEnPozo() {
  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-5">
        <div className="relative bg-blue rounded-3xl shadow-xl overflow-visible mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-3/5 p-8 md:p-12 lg:pr-0 z-10">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase font-playfair">
                Tu hogar en Juana Koslay
              </h3>
              <p className="text-blue-100 text-xl md:text-2xl leading-relaxed mb-6 font-raleway">
                Viví en la zona de mayor crecimiento de Juana Koslay, con la tranquilidad de que <span className="font-bold text-white">te espera una vivienda nueva, cómoda y bien ubicada, rodeada de naturaleza, servicios y excelente conectividad.</span>
              </p>

              <div className="text-white font-medium">
                <p className="mb-2 uppercase text-lg tracking-wider opacity-90 font-raleway">Accedé a comodidades como:</p>
                <ul className="flex flex-wrap gap-4 text-lg md:text-xl font-bold font-raleway">
                  <li className="flex items-center"><span className="mr-2">-</span> COCINA EQUIPADA</li>
                  <li className="flex items-center"><span className="mr-2">-</span> 2 DORMITORIOS</li>
                  <li className="flex items-center"><span className="mr-2">-</span> ESTACIONAMIENTO</li>
                </ul>
              </div>
            </div>

            <div className="w-full lg:w-2/5 relative lg:-mr-12 mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <Image
                src="/img/vivienda-joven/croquis.webp"
                alt="Plano 3D Departamento"
                width={600}
                height={400}
                className="w-full max-w-md lg:max-w-full h-auto object-contain transform lg:scale-110 lg:translate-x-6 origin-center rounded-lg lg:rounded-none drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
