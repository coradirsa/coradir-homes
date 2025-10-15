import Image from "next/image";

const AMENITIES = [
  { title: "WIFI", icon: "/img/la-torre-ii/features/feature-00.png" },
  { title: "Cerradura smart", icon: "/img/la-torre-ii/features/feature-01.png" },
  { title: "Seguridad 24 hs", icon: "/img/la-torre-ii/features/feature-02.png" },
  { title: "Eficiencia energetica", icon: "/img/la-torre-ii/features/feature-03.png" },
  { title: "Doble vidrio hermetico", icon: "/img/la-torre-ii/features/feature-04.png" },
  { title: "Losa radiante", icon: "/img/la-torre-ii/features/feature-05.png" },
  { title: "Cocina equipada", icon: "/img/la-torre-ii/features/feature-06.png" },
  { title: "Pileta y solarium", icon: "/img/la-torre-ii/features/feature-07.png" },
  { title: "Amoblado", icon: "/img/la-torre-ii/features/feature-08.png" },
  { title: "Muy luminoso", icon: "/img/la-torre-ii/features/feature-09.png" },
  { title: "Cocheras", icon: "/img/la-torre-ii/features/feature-10.png" },
  { title: "Aire acondicionado", icon: "/img/la-torre-ii/features/feature-11.png" },
  { title: "Sistema constructivo sustentable", icon: "/img/la-torre-ii/features/feature-12.png" },
];

export default function AmenitiesSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-playfair text-blue text-center mb-12">Amenities destacados</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {AMENITIES.map((amenity) => (
            <div
              key={amenity.title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-blue/15 bg-white p-6 shadow-[0_10px_25px_-20px_rgba(0,36,82,0.6)]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue/5">
                <Image
                  src={amenity.icon}
                  alt={amenity.title}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <p className="text-center text-sm md:text-base font-raleway text-blue font-semibold tracking-wide">
                {amenity.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
