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
            <div className="flex flex-col md:flex-row gap-4">
                <ButtonContact
                    href="#formulario"
                    className="text-xs md:text-2xl uppercase bg-white text-blue hover:bg-white/40 hover:text-white hover:border-white border-2 py-5 px-8 md:px-12"
                    label="Comprar"
                />
                <ButtonContact
                    href="#alquilar-en-pozo"
                    className="text-xs md:text-2xl uppercase bg-transparent text-white hover:bg-white hover:text-blue border-2 border-white py-5 px-8 md:px-12"
                    label="Alquilar"
                />
            </div>
            <Image
                src="/img/vivienda-joven/hero.webp"
                alt="Juana 64 - Departamentos en Juana Koslay"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 100vw, 1920px"
                className="absolute top-0 left-0 -z-2 h-full w-full object-cover object-center"
                priority
            />
        </section>
    );
}
