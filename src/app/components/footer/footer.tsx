import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const socialMedia = [
        { href: "https://www.facebook.com/CoradirSA/", img: "/icons/facebook.webp", ariaLabel: "Logo de Facebook", alt: "Logo de Facebook" },
        { href: "https://www.linkedin.com/company/502705", img: "/icons/linkedin.webp", ariaLabel: "Logo de LinkedIn", alt: "Logo de LinkedIn" },
    ];

    const footerLinks = {
        projects: [
            { label: "Vivienda Joven", href: "/vivienda-joven" },
            { label: "La Torre II", href: "/la-torre-ii" },
            { label: "Proyectos", href: "/proyectos" },
            { label: "Locales Coradir", href: "/complejo-coradir" },
        ],
        opportunities: [
            { label: "Inversiones Inteligentes", href: "/inversiones-inteligentes" },
            { label: "Corporativos", href: "/corporativos" },
            { label: "Instituciones", href: "/instituciones" },
            { label: "Terrenos", href: "/terrenos" },
        ],
        info: [
            { label: "Beneficios", href: "/beneficios" },
            { label: "Saber más", href: "/saber-mas/inversiones" },
        ]
    };

    return (
        <footer className="flex flex-col bg-blue xl:px-10 px-5 py-8 xl:py-10">
            {/* Links section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-5xl mx-auto w-full">
                {/* Proyectos */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-raleway font-bold text-lg xl:text-xl mb-2">Proyectos</h3>
                    {footerLinks.projects.map((link, index) => (
                        <Link
                            key={`project-${index}`}
                            href={link.href}
                            className="text-white/80 hover:text-white font-raleway text-sm xl:text-base transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Oportunidades */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-raleway font-bold text-lg xl:text-xl mb-2">Oportunidades</h3>
                    {footerLinks.opportunities.map((link, index) => (
                        <Link
                            key={`opportunity-${index}`}
                            href={link.href}
                            className="text-white/80 hover:text-white font-raleway text-sm xl:text-base transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Información */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-raleway font-bold text-lg xl:text-xl mb-2">Información</h3>
                    {footerLinks.info.map((link, index) => (
                        <Link
                            key={`info-${index}`}
                            href={link.href}
                            className="text-white/80 hover:text-white font-raleway text-sm xl:text-base transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        href="mailto:juana64@coradir.com.ar"
                        className="text-white/80 hover:text-white font-raleway text-sm xl:text-base transition-colors duration-200"
                    >
                        juana64@coradir.com.ar
                    </a>
                </div>
            </div>

            {/* Bottom section */}
            <div className="flex flex-col xl:flex-row justify-between items-center gap-5 border-t border-white/20 pt-6">
                <div className="flex flex-col justify-start items-center gap-3">
                    <span className="text-sm xl:text-xl text-white font-raleway">¡Seguinos y conocé más!</span>
                    <span className="flex items-center justify-center md:justify-start gap-3 pl-2 text-white">
                        {
                            socialMedia.map((social, index) => (
                                <a href={social.href} target="_blank" key={`social-${index}`} className="hover:shadow-[0_1px_5px_rgba(255,255,255,0.3)] transition-shadow duration-200" rel="noopener noreferrer">
                                    <Image
                                        loading="lazy"
                                        aria-label={social.ariaLabel}
                                        src={social.img}
                                        alt={social.alt}
                                        width={600}
                                        height={600}
                                        className="w-6 h-6 xl:w-8 xl:h-8"
                                    />
                                </a>
                            ))
                        }
                    </span>
                    <span className="text-xs md:text-sm text-white/70 font-raleway">Este sitio está protegido por reCAPTCHA</span>
                </div>
                <div className="flex items-center">
                    <Link href="/" aria-label="Ir a inicio">
                        <Image
                            loading="lazy"
                            src="/img/marca blanco.webp"
                            alt="Logo Coradir Homes"
                            aria-label="Logo Coradir Homes"
                            width={1000}
                            height={1000}
                            className="w-32 h-32 xl:w-40 xl:h-40"
                        />
                    </Link>
                </div>
            </div>
        </footer>
    )
}