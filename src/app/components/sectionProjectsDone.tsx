"use client"
import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CardProyect, { type ProyectCardData } from "./home/components/cardProyect";

const PROYECTS: ProyectCardData[] = [
  {
    title: "Villa Mercedes",
    image: "/img/villa-mercedes/complejo-aereo.webp",
    link: "/villa-mercedes",
    id: "boton-homes-home-proyectos-villa-mercedes",
  },
  {
    title: "San Luis",
    image: "/img/san-luis/complejo.webp",
    link: "/san-luis",
    id: "boton-homes-home-proyectos-san-luis",
  },
  {
    title: "Proyecto Juana Koslay",
    image: "/img/juana-64/proyecto-jk64.webp",
    link: "/juana-64",
    id: "boton-homes-home-proyectos-jk",
  },
  {
    title: "Locales Comerciales",
    image: "/img/locales-comerciales/proyecto-locales.webp",
    link: "/locales-comerciales",
    id: "boton-homes-home-proyectos-locales-comerciales",
  },
  {
    title: "La Torre I",
    image: "/img/optimized/projects/torre1.webp",
    link: "https://torreprivada.coradir.com.ar/",
    id: "boton-homes-home-proyectos-torre-1",
    sold: true,
  },
  {
    title: "La Torre II",
    image: "/img/optimized/projects/torre2.webp",
    link: "/la-torre-ii",
    id: "boton-homes-home-proyectos-torre-2",
    sold: true,
  },
];

const SCROLLER_ID = "carrusel-nuestros-proyectos";

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export default function SectionProjectsDone() {
  const scrollerRef = useRef<HTMLUListElement | null>(null);
  const slideRefs = useRef<Array<HTMLLIElement | null>>([]);
  const tickingRef = useRef(false);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    const first = slideRefs.current[0];
    const second = slideRefs.current[1];
    if (!scroller || !first) return;

    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    const index = Math.min(PROYECTS.length - 1, Math.max(0, Math.round(scroller.scrollLeft / Math.max(step, 1))));

    setActive(index);
    setCanPrev(scroller.scrollLeft > 2);
    setCanNext(scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 2);
  }, []);

  const handleScroll = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;
    requestAnimationFrame(() => {
      tickingRef.current = false;
      syncScrollState();
    });
  }, [syncScrollState]);

  const goTo = useCallback((index: number) => {
    const clamped = Math.min(PROYECTS.length - 1, Math.max(0, index));
    slideRefs.current[clamped]?.scrollIntoView({ behavior: scrollBehavior(), inline: "start", block: "nearest" });
  }, []);

  const arrowClassName =
    "hidden md:flex absolute top-1/2 z-10 h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue shadow-md transition-colors hover:bg-blue hover:text-white hover:ring-2 hover:ring-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-40";

  return (
    <section className="w-full flex items-center justify-center bg-white py-10">
      <section
        role="region"
        aria-roledescription="carrusel"
        aria-label="Nuestros proyectos"
        className="bg-blue container w-full flex flex-col gap-6 py-8 md:py-10"
      >
        <h2 className="px-4 text-center font-playfair text-4xl text-white xl:text-5xl">Nuestros proyectos</h2>

        <div className="relative">
          <button
            type="button"
            aria-label="Proyecto anterior"
            aria-controls={SCROLLER_ID}
            disabled={!canPrev}
            onClick={() => goTo(active - 1)}
            className={`${arrowClassName} left-3`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            aria-label="Proyecto siguiente"
            aria-controls={SCROLLER_ID}
            disabled={!canNext}
            onClick={() => goTo(active + 1)}
            className={`${arrowClassName} right-3`}
          >
            <ChevronRight size={24} />
          </button>

          <ul
            id={SCROLLER_ID}
            ref={scrollerRef}
            tabIndex={0}
            aria-label="Lista de proyectos"
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto py-2 px-4 snap-x snap-mandatory scroll-pl-4 overscroll-x-contain motion-safe:scroll-smooth md:gap-6 md:px-8 md:scroll-pl-8 xl:px-12 xl:scroll-pl-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {PROYECTS.map((proyect, index) => (
              <li
                key={proyect.id}
                ref={(node) => {
                  slideRefs.current[index] = node;
                }}
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`${index + 1} de ${PROYECTS.length}: ${proyect.title}`}
                className="w-[280px] shrink-0 snap-start md:w-[300px] xl:w-[320px]"
              >
                <CardProyect {...proyect} />
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Ir a proyecto" className="flex justify-center">
          {PROYECTS.map((proyect, index) => (
            <button
              key={proyect.id}
              type="button"
              aria-label={`Ir a ${proyect.title}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => goTo(index)}
              className="flex h-11 w-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span
                className={`h-2 rounded-full motion-safe:transition-all motion-safe:duration-200 ${
                  index === active ? "w-5 bg-white" : "w-2 bg-white/40"
                }`}
              />
            </button>
          ))}
        </nav>
      </section>
    </section>
  );
}
