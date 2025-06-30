import Image from "next/image";

export default function Footer(){
    const socialMedia = [
        { href: "https://www.facebook.com/CoradirSA/", img:"/icons/facebook.png", ariaLabel:"Logo de Facebook", alt:"Logo de Facebook" },
        { href: "https://www.linkedin.com/company/502705", img:"/icons/linkedin.png", ariaLabel:"Logo de LinkedIn", alt:"Logo de LinkedIn" },
        { href: "#", img:"/icons/instagram.png", ariaLabel:"Logo de Instagram", alt:"Logo de Instagram" },
    ];
    return(
        <footer className="flex  xl:flex-row justify-between pt-10 xl:pt-0 items-center  xl:max-h-[25vh] bg-blue xl:px-10 px-5 overflow-hidden">
            <div className="flex flex-col justify-start items-center gap-3">
                <span className="text-xs xl:text-xl text-white font-raleway">¡Seguinos y conocé más!</span>
                <span className="flex items-center justify-center md:justify-start gap-3 pl-2 text-white">
                    {
                        socialMedia.map((social, index) => (
                            <a href={social.href} key={`social-${index}`} className="hover:shadow-[0_1px_5px_rgba(255,255,255,0.3)]">
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
            </div>
            <div className="overflow-hidden h-[10vh] xl:h-auto">
                <Image 
                loading="lazy"
                src="/img/marca blanco.png" 
                alt="Logo Coradir Homes" 
                aria-label="Logo Coradir Homes"
                width={1000} 
                height={1000} 
                className="xl:w-90 xl:h-90 w-50 h-50 -mt-12 xl:-mt-0"
            />
            </div>
        </footer>
    )
}