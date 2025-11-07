export default function HeroSection() {
  const whatsAppUrl = "https://wa.me/5492664649967?text=" + encodeURIComponent("Hola, vi el proyecto en la web y quiero saber más...");

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden text-white">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/torre2.webm" type="video/webm" />
        Tu navegador no soporta video HTML5.
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-transparent" />
      <div className="relative z-10 h-full flex flex-col items-start justify-center gap-6 px-6 md:px-12 lg:px-24">
        <h1 className="text-4xl md:text-6xl xl:text-7xl font-playfair leading-tight">
          La Torre II
          <span className="block text-2xl md:text-3xl font-raleway font-semibold mt-4">
            Tu hogar a tu gusto y elección
          </span>
        </h1>
        <p className="max-w-2xl text-lg md:text-2xl font-raleway">
          Elegí tu nuevo hogar y viví la vida que merecés. Departamentos inteligentes con amenities pensados para tu comodidad.
        </p>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-white text-blue font-raleway font-semibold uppercase px-10 py-3 rounded-full hover:bg-white/80 transition"
        >
          Solicitá una visita
        </a>
      </div>
    </section>
  );
}
