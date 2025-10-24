import type { Metadata } from "next";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import Ofert from "./components/ofert";
import CardInvestment from "../components/cardInvestment";
import { INSTITUCIONES_COPY } from "@/content/seo/copy";

export function generateMetadata(): Metadata {
    return createMetadata({ pathname: "/instituciones" }).metadata;
}

export const revalidate = 3600;

export default function Instituciones() {
    return (
        <>
            <StructuredDataScripts pathname="/instituciones" />
            <section className="flex flex-col justify-end items-center p-16 relative h-[60vh] xl:h-[80vh]">
                <h1
                    className="z-10 flex flex-col justify-center items-center font-playfair text-5xl xl:text-8xl gap-4 text-white xl:mt-10"
                    style={{ textShadow: "6px 3px 4px rgba(0,0,0,0.5)" }}
                >
                    {INSTITUCIONES_COPY.heroTitle}
                </h1>
                <Image
                    priority
                    loading="eager"
                    src="/img/optimized/instituciones_hero.webp"
                    alt="Residencias estudiantiles Coradir Homes"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1440px) 100vw, 1600px"
                    className="absolute top-0 left-0 h-[60vh] w-[100vw] object-cover object-top"
                />
            </section>
            <Ofert />
            <section className="flex flex-col items-center justify-center container relative overflow-hidden xl:px-20 pb-10 xl:py-10">
                <hr className="xl:hidden w-[80%] h-px bg-blue rounded-full my-12" />
                {INSTITUCIONES_COPY.features.map((feature, index) => (
                    <CardInvestment key={`instituciones-feature-${index}`} {...feature} />
                ))}
                <div
                    aria-hidden="true"
                    className="absolute -right-36 bottom-0 w-full h-full pointer-events-none z-0"
                    style={{
                        backgroundImage: "url('/img/torre.webp')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right",
                        backgroundSize: "contain",
                    }}
                />
            </section>
        </>
    );
}
