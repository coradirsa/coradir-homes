"use client";

import Image from 'next/image';

export default function AlquilarEnPozo() {
  return (
    <section id="alquilar-en-pozo" className="w-full bg-white py-16">
      <div className="container mx-auto px-5">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-lg md:text-xl font-medium text-gray-500 uppercase tracking-wide mb-4 font-raleway">
            Asegurá hoy las mejores condiciones para tu mudanza.
          </p>
          <h2 className="text-4xl md:text-6xl font-playfair font-bold uppercase leading-tight text-blue">
            Alquilá en pozo en Juana Koslay
          </h2>
          <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-raleway">
            Alquilar en pozo te permite <span className="font-bold text-gray-800">fijar el precio actual y garantizar la disponibilidad de un hogar moderno y a estrenar.</span>
          </p>
        </div>

        {/* Tarjeta Principal (Hero Card) */}
        <div className="relative bg-blue rounded-3xl shadow-xl overflow-visible mb-16 mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center">

            {/* Contenido Texto */}
            <div className="w-full lg:w-3/5 p-8 md:p-12 lg:pr-0 z-10">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase font-playfair">
                ¡Anticipate y ganá!
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

            {/* Imagen 3D (Posicionada para sobresalir en desktop) */}
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

        {/* Beneficios (3 Columnas) - Estilo mejorado para coincidir con el sitio */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-5 max-w-6xl mx-auto mb-16">

          {/* Item 1: Lista de Interés */}
          <div className="flex flex-col items-center justify-between text-center bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 flex-1 max-w-sm min-h-[400px]">
            <div className="mb-4">
              <Image
                src="/img/vivienda-joven/hands-stars.svg"
                alt="Lista de Interés"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
            <h4 className="text-2xl md:text-3xl font-bold uppercase mb-3 font-playfair text-blue">
              Lista de Interés
            </h4>
            <p className="text-base md:text-lg leading-relaxed text-gray-600 font-raleway">
              Pagá el primer mes congelado y asegurá precio final durante los primeros 12 meses. Además, <span className="font-bold text-gray-800">obtené un descuento adicional del 10%</span> del valor proyectado 2026-2027.
            </p>
          </div>

          {/* Item 2: Pre-Reserva */}
          <div className="flex flex-col items-center justify-between text-center bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 flex-1 max-w-sm min-h-[400px]">
            <div className="mb-4">
              <Image
                src="/img/vivienda-joven/paper-coin.svg"
                alt="Pre-Reserva"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
            <h4 className="text-2xl md:text-3xl font-bold uppercase mb-3 font-playfair text-blue">
              Pre-Reserva
            </h4>
            <p className="text-base md:text-lg leading-relaxed text-gray-600 font-raleway">
              Reservá tu lugar abonando una seña fija o un porcentaje del primer mes. <span className="font-bold text-gray-800">Accedés a prioridad para elegir unidad y se descuenta del alquiler final.</span>
            </p>
          </div>

          {/* Item 3: Alquiler Anticipado */}
          <div className="flex flex-col items-center justify-between text-center bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 flex-1 max-w-sm min-h-[400px]">
            <div className="mb-4">
              <Image
                src="/img/vivienda-joven/location.svg"
                alt="Alquiler Anticipado"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
            <h4 className="text-2xl md:text-3xl font-bold uppercase mb-3 font-playfair text-blue">
              Alquiler Anticipado
            </h4>
            <p className="text-base md:text-lg leading-relaxed text-gray-600 font-raleway">
              Pagá el primer mes congelado y <span className="font-bold text-gray-800">asegurá precio final durante los primeros 12 meses.</span> Además, <span className="font-bold text-gray-800">obtené un descuento adicional del 10%</span> del valor proyectado 2026-2027.
            </p>
          </div>

        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            id="btn-cta-alquilar-pozo"
            aria-label="Solicitar información sobre alquiler en pozo en Juana 64"
            className="text-lg md:text-xl uppercase bg-blue text-white hover:bg-blue/80 hover:text-white border-2 border-blue py-4 px-12 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105 tracking-wide font-raleway"
            onClick={() => {
              const contactSection = document.getElementById('contact');
              // Preseleccionar Alquilar cuando vienen desde esta sección
              const alquilarBtn = document.getElementById('btn-form-alquilar');
              if (alquilarBtn) alquilarBtn.click();
              contactSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Quiero alquilar en pozo
          </button>
        </div>

      </div>
    </section>
  );
}
