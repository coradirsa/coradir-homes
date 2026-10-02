import type { Metadata } from "next";
import { metadataFicha, PaginaFicha } from "../../components/catalogo/paginas";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  return metadataFicha(slug, "venta");
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  return <PaginaFicha slug={slug} operacion="venta" />;
}
