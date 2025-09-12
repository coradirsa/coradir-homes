"use client"
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SectionCarucel() {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const COUNT = 5;
  const images = [];

  for (let i = 0; i < COUNT; i++) {
    images.push(`/img/vivienda-joven/carucel-${i}.webp`);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % COUNT);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 50);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  useEffect(()=>{},[isMobile])
  return ( 
    <>
      <section className="relative w-full h-[50vh] md:h-[60vh]  bg-white overflow-hidden   my-5">
        {images.map((image, index) => {
          const getPosition = () => {
            const diff = index - currentIndex;
            const adjustedDiff = diff < -2 ? diff + COUNT : diff > 2 ? diff - COUNT : diff;
            
            if (adjustedDiff === 0) return "slide-middle";
            if (adjustedDiff === -1 || (currentIndex === 0 && index === COUNT - 1)) return "slide-left";
            if (adjustedDiff === 1 || (currentIndex === COUNT - 1 && index === 0)) return "slide-right";
            return "absolute opacity-0 pointer-events-none";
          };

          const positionClass = getPosition();
          const shouldShow = positionClass !== "absolute opacity-0 pointer-events-none";
          
          return (
            <Image
              key={`image-${index}`}
              src={image}
              alt="Vivienda Joven"
              width={1000}
              height={1000}
              className={`object-cover ${positionClass} ${isTransitioning && !shouldShow ? 'transition-none' : ''}`}
              style={{
                width: !isMobile ? "40em" : "15em",
                height: !isMobile ? "25em" : "15em",
              }}
            />
          );
        })}
      </section>   
    </>
  );
}
