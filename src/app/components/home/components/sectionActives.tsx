import Link from "next/link";  

export default function SectionActives(){
    const links = [
        { href: "/inversiones-inteligentes", label: "Inversiones Inteligentes" },
        { href: "/instituciones", label: "Instituciones" },
        { href: "/terrenos", label: "Terrenos" }, 
    ]
    return(
        <section
            className="relative w-full xl:p-20 pb-0 flex flex-col items-center justify-start gap-10 overflow-hidden"
        >
            {/* Fondo con opacidad y posición ajustable */}
            <div
                aria-hidden="true"
                className="absolute -left-24 xl:left-0 xl:top-14 w-full h-full pointer-events-none z-0"
                style={{
                    backgroundImage: "url('/img/torre.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "10% bottom", 
                    backgroundSize: "contain", 
                }}
            />

            {/* Contenido por encima del fondo */}
            <div className="relative z-10 w-full flex flex-col items-center gap-10 py-20">
                {
                    links.map((link,index) => (
                        <Link
                            href={link.href}
                            key={`active-${index}`}
                            className="flex items-center justify-center text-center  xl:w-[50%] w-full 
                            border-2 border-blue py-2 rounded-full
                            text-gray font-raleway uppercase xl:text-xl bg-transparent z-10 link-clip-hover overflow-hidden relative"
                        >
                            {link.label}
                        </Link>
                    ))
                }
            </div>
        </section>
    )
}