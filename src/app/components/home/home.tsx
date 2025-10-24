"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HOME_COPY } from "@/content/seo/copy";
import Image from "next/image";

export default function Home() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(max-width: 1280px)");

    // Usar imágenes optimizadas específicas por dispositivo
    const heroImage = isMobile
        ? "/img/optimized/hero_mobile.webp"
        : isTablet
            ? "/img/optimized/hero_tablet.webp"
            : "/img/optimized/hero_desktop.webp";

    return (
        <section className="sticky top-0 flex flex-col justify-center items-center py-16 h-[80vh] bg-transparent -z-1">
            <h1
                className="z-10 flex flex-col justify-center items-center font-raleway text-3xl xl:text-7xl gap-4 text-white xl:mt-20"
                style={{ textShadow: "6px 3px 4px rgba(0,0,0,0.5)" }}
            >
                <span className="uppercase tracking-wide text-center">{HOME_COPY.heroTitle.primary}</span>
                <span className="text-5xl md:text-7xl xl:text-8xl font-playfair text-center normal-case">
                    {HOME_COPY.heroTitle.secondary}
                </span>
            </h1>
            <Image
                priority
                fetchPriority="high"
                src={heroImage}
                alt="Hero pagina principal"
                fill
                sizes="(max-width: 768px) 828px, (max-width: 1280px) 1280px, 1920px"
                className="absolute inset-0 -z-1 h-full w-full object-cover"
                quality={70}
            />
        </section>
    );
}
