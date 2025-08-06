"use client"
import Image from "next/image";
import Link from "next/link";
import HoverLink from "./components/hover-link";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import MobileMenu from "./components/mobileMenu";
import { useState } from "react";

export const links = [
    { href: "#", label: <>Proyectos de <br/> inversión </> , hover: [
        { href: "/vivienda-joven", label: "Vivienda Joven" },
        { href: "/inversiones-inteligentes", label: "Inversiones Inteligentes" },
        { href: "/corporativos", label: "Corporativos" },  
        { href: "/instituciones", label: "Instituciones" },
        { href: "/terrenos", label: "Terrenos" }, 
    ] }, 
    { href: "/beneficios", label: "Beneficios" , hover:null},
    { href: "/", label: <>Sobre <br/> nosotros</> , hover:null},
];
export default function Header() {
    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    return (
        <header className="relative flex md:flex-col xl:flex-row justify-between md:justify-start items-center md:px-10 px-2 bg-blue w-full h-auto xl:max-h-[15vh]"> 
            <Link onClick={() => setOpen(false)} href="/" className="z-100 xl:h-30 h-20 xl:my-20 my-5 flex items-center justify-center overflow-hidden">
                <Image 
                    priority={true}
                    loading="eager"
                    src="/img/marca blanco.png" 
                    alt="Logo Coradir Homes" 
                aria-label="Logo Coradir Homes"
                width={1000} 
                height={1000} 
                className="w-60 h-60 xl:w-100 xl:h-90"
                />
            </Link>
            <div className="w-full hidden md:flex md:justify-center xl:justify-end">
                <div className="flex items-center justify-evenly sm:gap-5 xl:gap-10 px-5">  
                    {links.map((link,index) => ( 
                        <div className="flex items-center justify-center relative py-4 p-9 xl:max-w-64 group" key={`navlink-${index}`}>
                            <Link
                                href={link.href} 
                                key={`navlink-${index}`}
                                className={`relative text-center text-white xl:px-4 xl:py-5    font-raleway uppercase sm:text-xs xl:text-lg font-bold z-2 ${link.hover ? "group-hover:text-blue" : "hover:bg-white hover:text-blue hover:rounded-3xl  hover:shadow-[4px_2px_5px_0_rgba(0,0,0,0.5)]"}`}
                            >{link.label}</Link> 
                            {link.hover && (
                                <HoverLink links={link.hover} key={`hoverlink-${index}`}/>
                            )}
                        </div>
                    ))} 
                </div>
            </div>
            {isMobile && (
                <MobileMenu open={open} setOpen={setOpen}/>
             )}   
        </header>
    );
}