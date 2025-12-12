import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata, interestSlugs } from "@/lib/seo";
import { StructuredDataScripts } from "../../components/structuredDataScripts";
import ReCaptcha from "../../components/reCaptcha";
import SaberMas from "./components/saberMas";
import { SABER_MAS_CONTENT } from "@/content/seo/copy";
import type { SaberMasLandingCopy } from "@/content/seo/copy";

type PageParams = {
  params: Promise<{
    interes: string;
  }>;
};

const DEFAULT_INTEREST = "inversiones";

const resolveContent = (slug: string): SaberMasLandingCopy => {
  return SABER_MAS_CONTENT[slug] ?? SABER_MAS_CONTENT[DEFAULT_INTEREST];
};

export async function generateStaticParams() {
  return interestSlugs.map((slug) => ({ interes: slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { interes: slug } = await params;

  if (!interestSlugs.includes(slug)) {
    return createMetadata({ pathname: `/saber-mas/${slug}` }).metadata;
  }

  const content = resolveContent(slug);
  return createMetadata({
    pathname: `/saber-mas/${slug}`,
    overrides: {
      title: content.heroTitle,
      description: content.description,
    },
  }).metadata;
}

export const revalidate = 3600;

export default async function Page({ params }: PageParams) {
  const { interes: slug } = await params;
  if (!interestSlugs.includes(slug)) {
    notFound();
  }

  const content = resolveContent(slug);
  const pathname = `/saber-mas/${slug}`;

  return (
    <ReCaptcha>
      <>
        <StructuredDataScripts
          pathname={pathname}
          overrides={{
            title: content.heroTitle,
            description: content.description,
          }}
        />
        <SaberMas copy={content} />
      </>
    </ReCaptcha>
  );
}
