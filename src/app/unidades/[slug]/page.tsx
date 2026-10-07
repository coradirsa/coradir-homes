import type { Metadata } from "next";
import { metadataFicha, PaginaFicha } from "../../components/catalogo/paginas";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  return metadataFicha(slug);
}

export default async function Page({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { slug } = await params;
  return <PaginaFicha slug={slug} searchParams={searchParams} />;
}
