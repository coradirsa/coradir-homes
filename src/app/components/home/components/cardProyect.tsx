"use client"
import Link from "next/link";
import Image from "next/image";

export default function CardProyect({
  title,
  image,
  link,
  id,
  translateX,
  translateY,
  zIndex,
  principal,
  isMobile,
  isSmallMobile,
  colSpan = 2,
  gradientDirection = "left",
}: {
  title: string;
  image: string;
  link?: string;
  id?: string;
  translateX?: number;
  translateY?: number;
  zIndex?: number;
  principal?: boolean;
  isMobile: boolean;
  isSmallMobile: boolean;
  colSpan?: number;
  gradientDirection?: "left" | "right";
}) {
  const useStairEffect = isMobile && !isSmallMobile;
  const isDesktop = !isMobile && !isSmallMobile;

  const spanClass = isDesktop
    ? colSpan === 4
      ? "xl:col-span-4"
      : "xl:col-span-2"
    : "";

  const gradientClass = useStairEffect
    ? gradientDirection === "right"
      ? "bg-gradient-to-l from-white via-black/50 to-blue"
      : "bg-gradient-to-r from-white via-black/50 to-blue"
    : "";

  const isExternalLink = !!link && /^https?:\/\//i.test(link);
  const actionClassName =
    "absolute bottom-6 xl:bottom-12 z-200 text-center bg-white text-blue font-raleway px-10 md:px-12 py-1.5 md:py-2 text-base md:text-xl rounded-full transition-colors duration-300 ease-in-out hover:bg-blue hover:text-white hover:border-white border-transparent border-2";

  return (
    <div
      className={`flex flex-col items-center justify-center bg-transparent transition-all duration-300 ${
        useStairEffect ? "absolute top-0 left-1/2" : "relative"
      } ${spanClass}`}
      style={{
        transform: useStairEffect
          ? `translate(calc(-50% + ${translateX}px), ${translateY}px)`
          : undefined,
        zIndex: zIndex || 0,
      }}
    >
      <Image
        loading="lazy"
        src={image}
        alt={title}
        aria-label={title}
        width={1000}
        height={1000}
        className={`rounded-2xl object-cover transition-all duration-300 ${
          isMobile ? "w-[300px]" : principal ? "w-[580px]" : "w-[300px]"
        } ${useStairEffect ? "shadow-[10px_10px_2px_0_rgba(0,0,0,0.6)]" : ""}`}
        style={{
          filter: useStairEffect && !principal ? "blur(2px)" : "none",
          height: isMobile ? (principal ? "420px" : "320px") : "420px",
        }}
      />
      <span className="relative mb-3 xl:mb-10"></span>

      {link &&
        (isExternalLink ? (
          <a
            id={id}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={actionClassName}
            aria-label="Ver Proyecto"
          >
            Saber mas
          </a>
        ) : (
          <Link
            prefetch={false}
            id={id}
            href={link}
            aria-label="Ver Proyecto"
            className={actionClassName}
          >
            Saber mas
          </Link>
        ))}

      <h3
        className={`relative z-50 w-full text-center text-white font-raleway xl:text-2xl 2xl:text-3xl transition-all duration-300 ${gradientClass}`}
        style={{
          textShadow: useStairEffect ? "6px 3px 4px rgba(0,0,0,0.5)" : "none",
          backgroundColor: useStairEffect ? undefined : "transparent",
        }}
      >
        {title}
      </h3>
    </div>
  );
}
