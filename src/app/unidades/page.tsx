import type { Metadata } from "next";
import { metadataListado, PaginaListado } from "../components/catalogo/paginas";

// Pagina unica del catalogo: alquiler y venta se filtran con ?operacion=.
// Datos en vivo de Inmobiliario (cache en memoria, sin ISR: el contenedor es read-only).
export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataListado();

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <PaginaListado searchParams={searchParams} />;
}
