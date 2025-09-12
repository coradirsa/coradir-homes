"use client"
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import CardProyect from "./home/components/cardProyect";

export default function SectionProjectsDone() {
  const proyects = [
    { title: "Proyecto Juana Koslay", image: "/img/projects/jk.webp", link: "/vivienda-joven", id: "boton-homes-home-proyectos-jk" },
    { title: "Complejo Coradir", image: "/img/projects/complejo.png" },
    { title: "La Torre I", image: "/img/projects/torre1.png" },
    { title: "La Torre II", image: "/img/projects/torre2.png" },
  ];

  const SEPY = 180;
  const STEP_X = 100;
  const CARD_WIDTH = 300;

  const isMobile = useMediaQuery("(max-width: 1280px)");
  const isSmallMobile = useMediaQuery("(max-width: 768px)");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, [isMobile, isSmallMobile]);
  const render = () => {
    let currentX = 0;
    let direction = 1;
    const cards = [];
    const maxX = (containerWidth - CARD_WIDTH) / 2;

    for (let i = 0; i < proyects.length; i++) {
      const proyect = proyects[i];
      const baseY = SEPY * i;
      const useStair = isMobile && !isSmallMobile;

      let translateX = 0;
      let gradientDirection: "left" | "right" = "right";

      if (useStair) {
        if (i === 0) {
          currentX = 0;
          direction = 1;
        } else {
          const nextX = currentX + direction * STEP_X;
          if (Math.abs(nextX) > maxX) direction *= -1;
          currentX += direction * STEP_X;
          translateX = currentX;
          gradientDirection = direction === 1 ? "right" : "left";
        }
      }

      cards.push(
        <CardProyect
          key={`proyect-${i}`}
          {...proyect}
          translateX={useStair ? translateX : 0}
          translateY={useStair ? baseY : 0}
          zIndex={30 - i}
          principal={i === 0}
          isMobile={isMobile}
          isSmallMobile={isSmallMobile}
          colSpan={!isMobile && !isSmallMobile && i === 0 ? 4 : 2}
          gradientDirection={gradientDirection}
        />
      );
    }

    return cards;
  };
  return (
    <section className="w-full flex items-center justify-center bg-white py-10">
      <section className="bg-blue p-5 flex flex-col items-center justify-start container w-full gap-10 ">
        <h2 className="text-5xl xl:text-6xl text-center font-playfair text-white">¡Nuestro proyectos!</h2>

        <section
          ref={containerRef}
          className={`w-full py-5 relative ${
            isSmallMobile
              ? "flex flex-col items-center justify-center gap-5"
              : "grid xl:grid-cols-10 items-start xl:items-center xl:justify-center gap-10 xl:gap-8"
          }`}
          style={{
            minHeight: isMobile && !isSmallMobile
              ? `calc(20rem + ${proyects.length * SEPY}px)`
              : undefined,
          }}
        >
          { render() }
        </section>
      </section>
    </section>
  );
}
