"use client";
import Image from "next/image"
import { useEffect, useRef, useState } from "react";
export default function Carrucel(){
    const sliders = [
        "/img/pozo.png",
        "/img/casa_joven_1.png",
        "/img/casajoven_2.png",
        "/img/casa_joven_3.png",
        "/img/coraporativos_final.jpg",
    ];
    const [currentSlide, setCurrentSlide] = useState(0);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Limpiamos el autoplay anterior
        if (autoplayRef.current) clearInterval(autoplayRef.current);

        // Creamos un nuevo autoplay
        autoplayRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliders.length);
        }, 3000);

        // Limpiamos el intervalo al desmontar o cuando cambia el slide
        return () => {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
        };
    }, [currentSlide, sliders.length]);
    return(
        <section className="w-[80%] xl:w-[60%] xl:h-[80vh] 2xl:h-[60vh] h-[50vh] overflow-hidden relative bg-transparent my-10">
                    <div 
                        className={`flex h-full absolute top-0 left-0 transition-transform duration-700`}
                        style={{
                            width: `${sliders.length * 100}%`,
                            transform: `translateX(-${currentSlide*20 }%)`,
                        }}
                    >
                        {
                            sliders.map((slider,index) => (
                                <div key={`slider-${index}`} className="w-full h-full ">
                                    <Image
                                        loading="lazy"
                                        src={slider}
                                        alt="Slider"
                                        width={2000}
                                        height={2000}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                        ))
                    }
                    </div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2">
                        {
                            sliders.map((_,index) => (
                                <button
                                    key={`slider-${index}`}
                                    className="w-3 h-3 bg-white/70 rounded-full cursor-pointer"
                                    onClick={() => setCurrentSlide(index)}
                                    style={{
                                        backgroundColor: index === currentSlide ? "white" : "rgba(255,255,255,0.7)"  ,
                                    }}
                                />
                            ))
                        }
                    </div>
                    <span 
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length)}
                        className="flex items-center justify-center absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer z-10 xl:text-5xl text-white rounded-full pb-2 px-3 hover:bg-gray/80 transition-colors duration-300"> {"<"} </span>
                    <span 
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % sliders.length)}
                        className="flex items-center justify-center absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer z-10 xl:text-5xl text-white rounded-full pb-2 px-3 hover:bg-gray/80 transition-colors duration-300"> {">"} </span>
                </section>
    );
}