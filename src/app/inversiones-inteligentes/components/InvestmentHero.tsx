import Image from "next/image";
import WhatsAppLink from "../../components/WhatsAppLink";
import MaterialIcon from "@/app/components/MaterialIcon";

export default function InvestmentHero() {
  const benefits = [
    {
      icon: "verified_user",
      title: "Respaldo Real",
      description: "Tu inversión se garantiza con una Hipoteca de Primer Grado sobre departamentos escriturados.",
    },
    {
      icon: "trending_up",
      title: "Rentabilidad Pactada",
      description: "Tasas competitivas y plazos definidos.",
    },
    {
      icon: "lock",
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
                    <MaterialIcon name={benefit.icon} className="text-[32px]" />
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
              <MaterialIcon name="arrow_forward" className="ml-3 text-[24px] transition-transform duration-300 group-hover:translate-x-1" />
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
