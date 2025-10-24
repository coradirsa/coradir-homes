import type { Metadata } from "next";
import { siteConfig } from "./siteConfig";
import { resolveSeoEntry } from "./config";
import type { PageSeoConfig } from "./config";
import type { StructuredDataEntry } from "./structuredData";

export type MetadataOptions = {
  pathname: string;
  image?: string;
  overrides?: Partial<Omit<PageSeoConfig, 'structuredData'>> & {
    structuredData?: StructuredDataEntry[];
  };
  structuredData?: StructuredDataEntry[];
};

const buildCanonical = (pathname: string): string => {
  const fullUrl = new URL(pathname.startsWith("/") ? pathname : `/${pathname}`, siteConfig.url);
  return fullUrl.toString().replace(/\/$/, "");
};

export const createMetadata = (options: MetadataOptions): { metadata: Metadata; structuredData?: StructuredDataEntry[] } => {
  const { pathname, overrides = {}, image } = options;
  const resolved = resolveSeoEntry(pathname);

  // Extract structuredData separately to avoid type conflicts
  const { structuredData: overrideStructuredData, ...restOverrides } = overrides;

  const merged: PageSeoConfig = {
    ...resolved,
    ...restOverrides,
    robots: {
      ...resolved.robots,
      ...overrides.robots,
      googleBot: {
        ...resolved.robots?.googleBot,
        ...overrides.robots?.googleBot,
      },
    },
  };

  const pageImage = image ?? merged.image;
  const canonical = buildCanonical(merged.pathname);
  const title = merged.title;
  const description = merged.description;

  const baseMetadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type: merged.pathname === "/" ? "website" : "article",
      images: pageImage ? [{ url: pageImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: pageImage ? [pageImage] : undefined,
    },
    robots: merged.robots ?? resolved.robots,
  };

  let structuredData: StructuredDataEntry[] | undefined;

  if (overrideStructuredData) {
    structuredData = overrideStructuredData;
  } else if (typeof merged.structuredData === 'function') {
    structuredData = merged.structuredData({
      canonical,
      pageTitle: title,
      description,
      image: pageImage,
      site: siteConfig,
    });
  }

  return { metadata: baseMetadata, structuredData };
};

