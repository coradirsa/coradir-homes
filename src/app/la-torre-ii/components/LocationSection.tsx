const MAP_EMBED = "https://www.google.com/maps?q=-33.3058746,-66.3395246&z=17&output=embed";

export default function LocationSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src={MAP_EMBED}
            title="Ubicación La Torre II"
            loading="lazy"
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl font-playfair text-blue">Ubicación</h2>
          <p className="text-lg md:text-xl font-raleway text-black/70">
            Elegí donde querés vivir. Visitános en Mitre 526, San Luis, Argentina.
          </p>
          <a
            href="https://www.google.com/maps/place/Mitre+526,+San+Luis,+Argentina"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-blue text-white font-raleway uppercase px-8 py-3 rounded-full hover:bg-blue/80 transition w-fit"
          >
            Cómo llegar
          </a>
        </div>
      </div>
    </section>
  );
}
