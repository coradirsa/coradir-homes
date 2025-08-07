import { useEffect, useState, useRef } from "react";
import { links } from "../header";
import Link from "next/link"; 

export default function MobileMenu({open,setOpen}: {open: boolean,setOpen: (open: boolean) => void}){
    const [openHover, setOpenHover] = useState<number | null>(null);
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        document.body.style.overflowY = open ? "hidden" : "auto";
        return () => {
            // Limpia el timeout al desmontar
            if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        };
    }, [open]);

    const handleOpenHover = (index: number) => {
        if (openHover === index) {
            setOpenHover(null); // Si ya está abierto, lo cierra
        } else {
            setOpenHover(null); // Cierra el actual
            if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
            hoverTimeout.current = setTimeout(() => {
                setOpenHover(index); // Abre el nuevo después del delay
            }, 200); // 300ms delay para transición
        }
    };

    return(
        <div className="flex xl:hidden">
            <button 
                onClick={() => setOpen(!open)} aria-label="Boton para abrir y cerrar el menu"
                className="relative z-70 flex flex-col justify-center items-center gap-1 w-12 cursor-pointer rounded-full hover:bg-gray/20 py-4 px-3 transition-all duration-300 ease-in-out"
            >
                <span className="slider-burger transition-all duration-300 ease-in-out bg-white" 
                    style={
                        open ? { position: "absolute", transform: "rotate(45deg)", width:"2em" } : 
                        {  }
                    }
                ></span>
                <span className="slider-burger transition-all duration-300 ease-in-out  bg-white" 
                    style={
                        open ? { display: "none"} : 
                        { }
                    }
                ></span>
                <span className="slider-burger transition-all duration-300 ease-in-out  bg-white" 
                    style={
                        open ? {   position: "absolute" , transform: "rotate(-45deg) ", width:"2em"  } : 
                        { }
                    }
                ></span>
            </button> 
            <div className="
                fixed top-0 right-0 w-[90%] h-[100vh] bg-gradient-to-bl from-blue  to-gray z-60 transition-all duration-300 ease-in-out
                p-10 pl-0 pt-25  flex flex-col justify-start items-start 
                "
                style={{ 
                    transform: open ? "translateX(0)" : "translateX(100%)", 
                    opacity: open ? 1 : 0,
                    visibility: open ? "visible" : "hidden" 
                }}
            > 
                <section className="flex flex-col justify-start items-start gap-10 w-full py-10">
                    {links.map((link, index) => (
                        <div key={index} className="pl-14 flex flex-col justify-start items-start"> 
                            <div className="flex flex-col justify-start items-start gap-1 -mt-6" >
                                <div 
                                    className="relative w-64 flex gap-10 items-center justify-center text-white 
                                    font-raleway px-5 py-2 rounded-3xl"
                                    style={{
                                        backgroundColor: openHover === index ? "rgba(255,255,255,0.1)" : "" 
                                    }}
                                    onClick={link.href !== "#" ? () => setOpen(false) : () => handleOpenHover(index)}
                                > 
                                    <Link href={link.href} className="w-full text-2xl" > {link.label} </Link>
                                    {link.hover && (
                                        <span 
                                            className="flex justify-start items-center text-center text-white font-raleway rotate-270 text-3xl" 
                                            
                                            aria-label="Boton para abrir y cerrar el submenu"
                                            style={{
                                                transform: openHover === index ? "rotate(-180deg)" : "rotate(0deg)",
                                                transition: "transform 0.3s ease-in-out"
                                            }}
                                        >
                                            {"<"}
                                        </span>
                                    )}
                                </div> 
                                <div
                                className={
                                    "flex flex-col py-3 gap-3 menu-submenu-transition ml-4 " +
                                    (openHover === index ? " menu-submenu-open" : "")
                                }
                                >
                                    {link.hover && link.hover.map((hover, idx) => (
                                        <Link
                                        key={idx}
                                        href={hover.href}
                                        className="text-left text-white font-raleway px-5 w-full py-2 rounded-3xl"
                                        style={{
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                        }}
                                        onClick={() => setOpen(false)}
                                        >
                                        {hover.label}
                                        </Link>
                                    ))}
                                </div> 

                            </div>
                        </div>
                    ))}
                </section>                 
            </div> 
        </div>
    )
}