import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { BENEFICIOS_COPY } from "@/content/seo/copy";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import Carrucel from "./components/carrucel";

export function generateMetadata(): Metadata {
    return createMetadata({ pathname: "/beneficios" }).metadata;
}

export const revalidate = 3600;

export default function Page() {
    return (
        <>
            <StructuredDataScripts pathname="/beneficios" />
            <section className="relative container bg-white flex flex-col items-center justify-start xl:py-16 xl:px-36 gap-8">
                <header className="flex flex-col items-start w-full xl:w-[80%] gap-6">
                    <h1 className="text-blue font-playfair text-6xl xl:text-9xl font-bold">{BENEFICIOS_COPY.title}</h1>
                    <h2 className="text-black font-raleway text-2xl xl:text-6xl font-semibold uppercase">
                        {BENEFICIOS_COPY.subtitle}
                    </h2>
                </header>
                <section className="flex flex-col items-center justify-center w-full xl:w-[80%] gap-10 text-lg xl:text-3xl text-black font-raleway">
                    {BENEFICIOS_COPY.paragraphs.map((paragraph, index) => (
                        <p key={`benefits-paragraph-${index}`} className="w-full text-center xl:text-left">
                            {paragraph}
                        </p>
                    ))}
                    <p className="text-2xl xl:text-6xl text-center font-semibold">{BENEFICIOS_COPY.closing}</p>
                </section>
                <Carrucel />
            </section>
        </>
    );
}
