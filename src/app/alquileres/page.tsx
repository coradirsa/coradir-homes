import type { Metadata } from "next";
import { metadataListado, PaginaListado } from "../components/catalogo/paginas";

// Datos en vivo del catalogo de Inmobiliario (cache en memoria, sin ISR: el contenedor es read-only).
export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataListado("alquiler");

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <PaginaListado operacion="alquiler" searchParams={searchParams} />;
}
