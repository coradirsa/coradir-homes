"use client"
import Link from "next/link";
import Image from "next/image";

export type ProyectCardData = {
  title: string;
  image: string;
  link: string;
  id: string;
  sold?: boolean;
};

export default function CardProyect({ title, image, link, id, sold = false }: ProyectCardData) {
  const isExternalLink = /^https?:\/\//i.test(link);
  const actionClassName =
    "inline-flex min-h-11 items-center justify-center bg-white text-blue font-raleway px-8 py-2 text-base xl:text-lg rounded-full border-2 border-transparent transition-colors duration-300 hover:bg-blue hover:text-white hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <div
      className={`flex flex-col items-center gap-3 ${
        sold ? "" : "motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1"
      }`}
    >
      <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-md ${sold ? "" : "hover:shadow-lg"}`}>
        <Image
          loading="lazy"
          src={image}
          alt={title}
          fill
          quality={60}
          sizes="(max-width: 767px) 280px, (max-width: 1279px) 300px, 320px"
          className={`object-cover ${sold ? "saturate-[.85]" : ""}`}
        />
      </div>

      <h3 className={`min-h-7 w-full text-center font-raleway text-lg xl:text-xl ${sold ? "text-white/80" : "text-white"}`}>
        {title}
      </h3>

      {isExternalLink ? (
        <a id={id} href={link} target="_blank" rel="noopener noreferrer" className={actionClassName} aria-label={`Ver proyecto ${title}`}>
          Saber más
        </a>
      ) : (
        <Link prefetch={false} id={id} href={link} className={actionClassName} aria-label={`Ver proyecto ${title}`}>
          Saber más
        </Link>
      )}
    </div>
  );
}
