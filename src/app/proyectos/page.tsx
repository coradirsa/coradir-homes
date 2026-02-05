import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";

const PROJECTS = [
    {
        name: "Juana 64",
        description: "Unidades con domÃ³tica, zonas comunes equipadas y soluciones ecoeficientes en Juana Koslay.",
        href: "/juana-64",
        image: "/img/projects/jk.webp",
        ctaId: "proyectos-juana-64",
    },
    {
        name: "Complejo Coradir",
        description: "Locales comerciales con ubicacion estrategica y alto flujo en San Luis. Preventa y alquileres anticipados.",
        href: "/complejo-coradir",
        image: "/img/projects/complejo.webp",
        ctaId: "proyectos-complejo-coradir",
    },
    {
        name: "La Torre II",
        description: "Residencias premium con amenities de alta gama y ubicaciÃ³n estratÃ©gica en el centro de San Luis.",
        href: "/la-torre-ii",
        image: "/img/projects/torre2.png",
        ctaId: "proyectos-la-torre-ii",
    },
    {
        name: "Inversiones Inteligentes",
        description: "Portafolio administrado para inversores que buscan rentabilidad sostenible y gestiÃ³n profesional.",
        href: "/inversiones-inteligentes",
        image: "/img/inversiones_inteligentes.webp",
        ctaId: "proyectos-inversiones-inteligentes",
    },
    {
        name: "Terrenos",
        description: "Lotes seleccionados con potencial de valorizaciÃ³n para desarrollos residenciales y comerciales.",
        href: "/terrenos",
        image: "/img/terrenos_hero.webp",
        ctaId: "proyectos-terrenos",
    },
    {
        name: "Corporativos",
        description: "Infraestructura a medida para empresas con conectividad y servicios de primer nivel.",
        href: "/corporativos",
        image: "/img/pagina_corporativos_inicio.webp",
        ctaId: "proyectos-corporativos",
    },
    {
        name: "Instituciones",
        description: "Soluciones integrales para entidades educativas y organismos que buscan modernizar sus espacios.",
        href: "/instituciones",
        image: "/img/instituciones_hero.webp",
        ctaId: "proyectos-instituciones",
    },
];

export function generateMetadata(): Metadata {
    return createMetadata({ pathname: "/proyectos" }).metadata;
}

export const revalidate = 3600;

export default function ProyectosPage() {
    return (
        <>
            <StructuredDataScripts pathname="/proyectos" />
            <section className="container py-16 px-6 flex flex-col gap-12">
                <header className="flex flex-col items-center gap-6 text-center">
                    <h1 className="text-4xl md:text-6xl xl:text-7xl font-playfair text-blue">Proyectos de inversiÃ³n</h1>
                    <p className="max-w-3xl text-base md:text-xl font-raleway text-black">
                        ExplorÃ¡ el portafolio activo de Coradir Homes y encontrÃ¡ la propuesta que mejor se adapte a tu
                        perfil: desarrollos en preventa, residencias terminadas y oportunidades para diversificar tu
                        inversiÃ³n inmobiliaria.
                    </p>
                </header>
                <section className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                    {PROJECTS.map((project) => (
                        <article
                            key={project.name}
                            className="flex flex-col h-full overflow-hidden rounded-3xl border border-blue/20 shadow-sm bg-white"
                        >
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image
                                    src={project.image}
                                    alt={project.name}
                                    width={640}
                                    height={360}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <div className="flex flex-col gap-4 p-6">
                                <h2 className="text-2xl font-playfair text-blue">{project.name}</h2>
                                <p className="text-base font-raleway text-black/80">{project.description}</p>
                                <Link
                                    href={project.href}
                                    id={project.ctaId}
                                    className="mt-auto inline-flex items-center justify-center rounded-full bg-blue px-6 py-3 font-raleway text-sm uppercase tracking-wide text-white transition hover:bg-blue/80"
                                >
                                    Ver detalles
                                </Link>
                            </div>
                        </article>
                    ))}
                </section>
            </section>
        </>
    );
}
