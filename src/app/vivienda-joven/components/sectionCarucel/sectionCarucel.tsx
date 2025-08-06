"use client"
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SectionCarucel() {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [middle, setMiddle] = useState(1);
  const COUNT = 3;
  const images = [];

  for (let i = 0; i < COUNT; i++) {
    images.push(`/img/vivienda-joven/carucel-${i}.png`);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMiddle((prev) => (prev + 1) % COUNT);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  useEffect(()=>{},[isMobile])
  return (
    <section className="relative w-full overflow-hidden h-[50vh] md:h-[60vh] mt-10 bg-white">
      {images.map((image, index) => {
        const leftIndex = (middle - 1 + COUNT) % COUNT;
        const rightIndex = (middle + 1) % COUNT;

        let positionClass = "absolute opacity-0";
        if (index === middle) positionClass = "slide-middle";
        else if (index === leftIndex) positionClass = "slide-left";
        else if (index === rightIndex) positionClass = "slide-right";

        return (
          <Image
            key={`image-${index}`}
            src={image}
            alt="Vivienda Joven"
            width={1000}
            height={1000}
            className={`object-cover transition-all duration-500 ${positionClass}`}
            style={{
              width: !isMobile ? "40em" : "17em",
              height: !isMobile ? "30em" : "15em",
            }}
          />
        );
      })}
    </section>
  );
}
