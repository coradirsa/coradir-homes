import type { Metadata } from "next";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import ButtonContact from "../components/buttonContact";
import { CASA_JOVEN_COPY } from "@/content/seo/copy";

export function generateMetadata(): Metadata {
    return createMetadata({ pathname: "/casa-joven" }).metadata;
}

export const revalidate = 3600;

export default function CasaJoven() {
    return (
        <>
            <StructuredDataScripts pathname="/casa-joven" />
            <section className="relative container flex flex-col items-center justify-start gap-6 min-h-[100vh] xl:pb-0 py-5">
                <h1 className="text-blue font-playfair text-6xl xl:text-8xl font-bold xl:mb-6">{CASA_JOVEN_COPY.title}</h1>
                <div className="flex flex-col items-center justify-center text-white py-4 px-5 text-center gap-2 bg-blue-gray rounded-full rounded-tr-none w-[90%] xl:w-[50%] xl:px-20">
                    <p className="font-raleway text-lg xl:text-3xl">{CASA_JOVEN_COPY.tagline}</p>
                </div>
                <section className="relative xl:px-16 px-4 w-full xl:pt-8 pt-2 flex flex-col items-center justify-center gap-6 xl:mb-10">
                    <p className="text-center text-black text-lg font-raleway xl:text-3xl w-[90%] xl:w-[50%]">{CASA_JOVEN_COPY.intro}</p>
                    <Image
                        src="/img/casa_joven_1.webp"
                        alt="Interior de Casa Joven"
                        width={1000}
                        height={1000}
                        className="hover:scale-110 transition-all duration-300 xl:w-72 xl:h-72 w-56 h-56 z-10 xl:absolute xl:-top-4 xl:right-0 rounded-full"
                    />
                </section>
                <section className="relative xl:px-16 px-4 w-full flex flex-col items-center justify-center gap-6 xl:mb-10">
                    {CASA_JOVEN_COPY.highlights.map((highlight, index) => (
                        <div key={`casa-joven-highlight-${index}`} className="text-center text-black font-raleway xl:text-3xl xl:w-[50%]">
                            <h2 className="text-xl xl:text-3xl font-semibold">{highlight.title}</h2>
                            <p className="text-base xl:text-2xl mt-2">{highlight.description}</p>
                        </div>
                    ))}
                    <Image
                        src="/img/casajoven_2.webp"
                        alt="Departamentos Casa Joven"
                        width={1000}
                        height={1000}
                        className="hover:scale-110 transition-all duration-300 xl:w-72 xl:h-72 w-56 h-56 xl:absolute xl:-top-4 xl:left-0 object-cover rounded-full"
                    />
                </section>
                <section className="relative flex flex-col items-center justify-center xl:gap-10 xl:w-[80%] px-5 xl:pr-0 xl:py-20">
                    <div className="relative flex flex-col items-center justify-center gap-8 sm:w-[70%] xl:w-full py-10">
                        <p className="text-black text-center font-raleway text-xl xl:text-5xl font-bold xl:w-[70%]">{CASA_JOVEN_COPY.closing}</p>
                        <ButtonContact
                            id="boton-homes-casa-joven"
                            href="/saber-mas/casa-joven"
                            className="!text-lg z-10 bg-blue text-white hover:bg-transparent hover:text-blue hover:border-blue border-transparent border-2"
                        />
                        <div
                            aria-hidden="true"
                            className="absolute xl:-left-32 -left-12 xl:-bottom-20 -bottom-0 w-full h-full xl:h-96 pointer-events-none z-0"
                            style={{
                                backgroundImage: "url('/img/torre.webp')",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "left",
                                backgroundSize: "contain",
                            }}
                        />
                    </div>
                    <Image
                        src="/img/casa_joven_3.webp"
                        alt="Exterior de Casa Joven"
                        width={1000}
                        height={1000}
                        className="hover:scale-110 transition-all duration-300 xl:w-96 xl:h-96 w-56 h-56 z-10 xl:absolute xl:-top-30 xl:-right-40 2xl:-right-50 rounded-full my-8"
                    />
                </section>
            </section>
        </>
    );
}
