import Image from "next/image";
import WhatsAppLink from "../../components/WhatsAppLink";

export default function InvestmentHero() {
  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Respaldo Real",
      description: "Tu inversión se garantiza con una Hipoteca de Primer Grado sobre departamentos escriturados.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Rentabilidad Pactada",
      description: "Tasas competitivas y plazos definidos.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Seguridad Total",
      description: "Operado por Coradir S.A., 30 años de trayectoria tecnológica y financiera.",
    },
  ];

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue via-blue-gray to-gray">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/inversiones_inteligentes.webp"
          alt="Edificio moderno Coradir"
          fill
          className="object-cover object-center opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue/90 via-blue/80 to-blue/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-6 md:px-16 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="font-playfair text-white text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Inversión de Capital con Garantía Hipotecaria
            </h1>
            <p className="font-raleway text-white/95 text-xl md:text-2xl lg:text-3xl font-light leading-relaxed max-w-4xl mx-auto">
              Hacé rendir tu capital con la seguridad de activos inmobiliarios 100% terminados.{" "}
              <span className="font-semibold text-white">Sin riesgo de construcción.</span>
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl text-white group-hover:bg-white group-hover:text-blue transition-all duration-300">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-raleway text-white font-bold text-xl md:text-2xl mb-2">
                      {benefit.title}
                    </h3>
                    <p className="font-raleway text-white/90 text-base md:text-lg leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <WhatsAppLink
              href="https://wa.me/5492664649967?text=Hola!%20Quiero%20solicitar%20una%20propuesta%20de%20inversi%C3%B3n%20con%20garant%C3%ADa%20hipotecaria."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-blue font-raleway font-bold text-lg md:text-xl px-10 md:px-14 py-4 md:py-5 rounded-full hover:bg-blue-gray hover:text-white border-2 border-white hover:border-white transition-all duration-300 shadow-2xl hover:shadow-white/50 uppercase tracking-wide group"
            >
              <span>Solicitar Propuesta de Inversión</span>
              <svg
                className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </WhatsAppLink>
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-10">
            <p className="font-raleway text-white/80 text-sm md:text-base">
              💼 Inversiones desde USD 50.000 | 📊 Rentabilidad anual competitiva | 📄 100% Legal y Transparente
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
