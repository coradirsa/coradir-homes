import type { Metadata } from "next";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import CardInvestment from "../components/cardInvestment";
import ButtonContact from "../components/buttonContact";
import FaqSection from "../components/faq/faqSection";
import { INVERSIONES_COPY, FAQ_CONTENT } from "@/content/seo/copy";

export function generateMetadata(): Metadata {
    return createMetadata({ pathname: "/inversiones-inteligentes" }).metadata;
}

export const revalidate = 3600;

export default function Investments() {
    const faq = FAQ_CONTENT["inversiones-inteligentes"];
    return (
        <>
            <StructuredDataScripts pathname="/inversiones-inteligentes" />
            <section className="flex flex-col items-center justify-center container py-10 pb-0 gap-5">
                <h1 className="font-raleway text-black text-4xl xl:text-8xl text-center px-6 md:px-16">
                    <span className="block font-playfair text-blue">{INVERSIONES_COPY.heroTitle}</span>
                    <span className="block uppercase tracking-[0.4rem] md:tracking-[0.6rem]">{INVERSIONES_COPY.heroHighlight}</span>
                </h1>
                <p className="font-raleway text-black text-2xl xl:text-4xl text-center xl:mb-20 my-5 xl:w-[60%] px-6 md:px-16">
                    {INVERSIONES_COPY.description}
                </p>
                <div className="grid grid-cols-1 gap-4 xl:w-[70%] mx-auto">
                    {INVERSIONES_COPY.items.map((investment) => (
                        <CardInvestment key={investment.title} {...investment} />
                    ))}
                </div>
            </section>
            <FaqSection title={faq.title} items={faq.items} schemaId="inversiones-inteligentes" />
            <section className="relative w-full">
                <Image
                    src="/img/inversiones_inteligentes.webp"
                    alt="Inversiones inteligentes"
                    width={2000}
                    height={2000}
                    className="w-full xl:h-[120vh] h-[40vh] object-cover object-top"
                    priority
                />
                <ButtonContact
                    id="boton-homes-inversiones-inteligentes"
                    href="/saber-mas/inversiones"
                    className="absolute bottom-10 xl:bottom-1/3 left-1/2 transform -translate-x-1/2 text-blue bg-white hover:text-white hover:border-white hover:bg-blue/80 border-transparent border-2"
                />
            </section>
        </>
    );
}
