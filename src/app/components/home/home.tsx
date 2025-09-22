"use client"
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Image from "next/image"; 

export default function Home(){
    const isMobile = useMediaQuery("(max-width: 1280px)");
    const img = isMobile ? "/img/hero_paginaprincipal.webp"  : "/img/hero_paginaprincipal1.webp"
    return(  
        <section className="sticky top-0 flex flex-col justify-center items-center py-16  h-[80vh] bg-transparent -z-1"> 
            <h1 
                className="z-10 flex flex-col justify-center items-center font-raleway text-3xl xl:text-7xl gap-4 text-white uppercase xl:mt-20 "
                aria-label="Elegí tu nuevo hogar Y viví la vida que mereces."
                style={{ textShadow: '6px 3px 4px rgba(0,0,0,0.5)' }}
            >
                Elegí tu nuevo hogar <br/>
                <b className="text-6xl md:text-8xl font-playfair text-center">Y <b className="lowercase"> viví la vida que mereces.</b></b>
            </h1> 
            <Image //la imagen 1271x628
                priority={true}
                loading="eager"
                src={img}
                alt="Hero Pagina Principal" 
                aria-label="Hero Pagina Principal"
                width={2000} 
                height={2000} 
                className="w-full h-[90vh] absolute  -z-1"
            />
        </section> 
              
    )
}