import Image from "next/image";
import ButtonContact from "@/app/components/buttonContact";

export default function SectionHero() {
    const heroHeight = 80;

    return (
        <section
            className="relative w-full flex flex-col items-center justify-center gap-8 md:gap-14"
            style={{ height: `${heroHeight}vh` }}
        >
            <h1
                className="text-4xl md:text-5xl xl:text-8xl text-center font-playfair text-white"
                style={{ textShadow: "6px 3px 4px rgba(0,0,0,0.5)" }}
            >
                <span className="block">Juana 64</span>
                <span className="block text-4xl xl:text-6xl font-raleway">
                    tu nuevo hogar a precio accesible
                </span>
            </h1>
            <p
                className="text-center text-white max-w-[90%] md:max-w-full text-xl md:text-lg xl:text-3xl font-raleway"
                style={{ textShadow: "1px 3px 3px rgba(0,0,0,0.9)" }}
            >
                Departamentos inteligentes en Juana Koslay · Entrega proyectada · Cupos limitados
            </p>
            <ButtonContact
                href="#formulario"
                className="text-xs md:text-2xl uppercase bg-white text-blue hover:bg-white/40 hover:text-white hover:border-white border-1 py-5"
                label="Consulta hoy mismo que se agotan"
            />
            <Image
                src="/img/optimized/vivienda-joven-hero-1600.webp"
                alt="Vivienda Joven"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 100vw, 1600px"
                className="absolute top-0 left-0 -z-2 h-full w-full object-cover object-left"
                style={{ height: `${heroHeight}vh` }}
                priority
            />
        </section>
    );
}





