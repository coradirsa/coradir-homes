import Image from "next/image";

export default function OverviewSection() {
  const whatsAppUrl = "https://wa.me/5492664649967?text=" + encodeURIComponent("Hola, vi el proyecto en la web y quiero saber más...");

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-10 px-6">
        <div className="flex-1 flex flex-col items-start gap-6">
          <h2 className="text-3xl md:text-5xl font-playfair text-blue">La Torre II</h2>
          <p className="text-lg md:text-xl font-raleway text-black/80">
            Departamentos modernos ubicados en Mitre 526, San Luis. Disfrutá de espacios luminosos, seguridad las 24 horas y un entorno pensado para que vivas mejor.
          </p>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-blue text-white font-raleway uppercase px-8 py-3 rounded-full hover:bg-blue/80 transition"
          >
            Solicitar visita
          </a>
        </div>
        <div className="flex-1 w-full">
          <Image
            src="/img/la-torre-ii/overview.webp"
            alt="Edificio La Torre II"
            width={1024}
            height={576}
            className="w-full h-full object-cover rounded-2xl shadow-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
}
