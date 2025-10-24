import type { Metadata } from "next";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import ButtonContact from "../components/buttonContact";
import { CORPORATIVOS_COPY } from "@/content/seo/copy";

export function generateMetadata(): Metadata {
    return createMetadata({ pathname: "/corporativos" }).metadata;
}

export const revalidate = 3600;

export default function Page() {
    return (
        <>
            <StructuredDataScripts pathname="/corporativos" />
            <section className="relative xl:container bg-white flex flex-col items-start xl:mx-auto justify-start px-6 md:px-10 mt-10 xl:py-16 xl:px-36 gap-6">
                <h1 className="text-blue font-playfair text-6xl xl:text-9xl font-bold">{CORPORATIVOS_COPY.title}</h1>
                {CORPORATIVOS_COPY.intro.map((paragraph, index) => (
                    <p key={`corporativos-intro-${index}`} className="text-black font-raleway text-lg xl:text-5xl md:w-[60%]">
                        {paragraph}
                    </p>
                ))}
                <Image
                    src="/img/pagina_corporativos_inicio.webp"
                    alt="Equipo corporativo en oficinas Coradir Homes"
                    width={3000}
                    height={3000}
                    className="xl:w-[45%] md:h-[67%] w-full h-[40vh] md:absolute relative z-10 top-[20%] md:-right-20 rounded-4xl object-cover object-right"
                    priority
                />
            </section>
            <section className="relative container bg-white flex flex-col items-center justify-start xl:py-16 xl:px-36 gap-10">
                <h2 className="uppercase text-black font-raleway text-2xl xl:text-7xl font-bold text-center">Beneficios destacados</h2>
                <div className="flex flex-col items-center justify-center py-6 gap-8 xl:w-full w-[90%]">
                    {CORPORATIVOS_COPY.benefits.map((benefit, index) => (
                        <div key={`corporativos-benefit-${index}`} className="flex items-center justify-center gap-5 w-full">
                            <Image
                                src="/icons/check.png"
                                alt="Icono de beneficio"
                                width={100}
                                height={100}
                                className="xl:w-20 xl:h-20 w-10 h-10"
                            />
                            <p className="text-black font-raleway text-lg xl:text-4xl w-[80%]">{benefit}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="relative w-full">
                <Image
                    src="/img/coraporativos_final.webp"
                    alt="Vista panoramica de proyecto corporativo"
                    width={3000}
                    height={3000}
                    className="w-full xl:h-[80vh] xl:object-cover h-[50vh] object-top"
                />
                <ButtonContact
                    id="boton-homes-corporativos"
                    href="/saber-mas/corporativos"
                    className="hover:text-white hover:border-white hover:bg-blue/80 border-blue border-2 absolute bottom-10 xl:bottom-32 left-1/2 transform -translate-x-1/2 text-blue bg-white"
                />
            </section>
        </>
    );
}
