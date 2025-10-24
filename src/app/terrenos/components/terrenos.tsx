import Image from "next/image";
import CardChar from "./cardChar";
import ButtonContact from "../../components/buttonContact";
import { TERRENOS_COPY } from "@/content/seo/copy";

export default function TerrenosSection() {
    return (
        <>
            <section className="flex flex-col justify-end items-center p-16 relative h-[30vh] xl:h-[70vh]">
                <h1
                    className="z-10 flex flex-col justify-center items-center font-playfair text-7xl xl:text-8xl gap-4 text-white xl:mt-20"
                    style={{ textShadow: "6px 3px 4px rgba(0,0,0,0.5)" }}
                >
                    {TERRENOS_COPY.heroTitle}
                </h1>
                <Image
                    priority
                    loading="eager"
                    src="/img/optimized/terrenos_hero.webp"
                    alt="Terrenos disponibles para desarrollo"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1440px) 100vw, 1600px"
                    className="absolute top-0 left-0 h-[30vh] w-[100vw] object-cover object-top"
                />
            </section>
            <section className="flex flex-col justify-start items-center container p-10 xl:p-16 bg-white gap-6 text-center">
                <p className="text-black font-raleway text-xl xl:text-4xl max-w-3xl">
                    {TERRENOS_COPY.intro}
                </p>
            </section>
            <section className="flex flex-col items-center justify-center w-full max-w-[2000px] mx-auto xl:container relative xl:px-56 py-10 pt-0 gap-8 xl:pb-26">
                <ButtonContact
                    id="boton-homes-terrenos"
                    href="/saber-mas/terrenos"
                    className="bg-blue text-white mb-16 hover:bg-transparent hover:text-blue hover:border-blue border-transparent border-2"
                />
                {TERRENOS_COPY.highlights.map((highlight, index) => (
                    <CardChar
                        key={`terrenos-highlight-${index}`}
                        {...highlight}
                        className={
                            index % 2 === 0
                                ? "bg-blue-gray rounded-full rounded-tr-none"
                                : "bg-blue rounded-full rounded-tl-none"
                        }
                    />
                ))}
            </section>
        </>
    );
}
