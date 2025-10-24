import baseEntries from "./baseEntries.json";
import interestSlugsData from "./interestSlugs.json";
import { siteConfig } from "./siteConfig";
import type { StructuredDataContext, StructuredDataEntry } from "./structuredData";
import {
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildRealEstateProjectJsonLd,
  buildWebsiteJsonLd,
} from "./structuredData";

export type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export type PageSeoConfig = {
  pathname: string;
  title: string;
  description: string;
  changefreq?: ChangeFrequency;
  priority?: number;
  image?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
    noimageindex?: boolean;
    nocache?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
      "max-video-preview"?: number;
      "max-image-preview"?: "none" | "standard" | "large";
      "max-snippet"?: number;
    };
  };
  structuredData?: (context: StructuredDataContext) => StructuredDataEntry[];
};

type BaseEntry = {
  pathname: string;
  title: string;
  description: string;
  changefreq?: ChangeFrequency;
  priority?: number;
  image?: string;
};

const defaultRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

const toAbsoluteImage = (image?: string) => (image ? new URL(image, siteConfig.url).toString() : undefined);

const baseSeoEntries: PageSeoConfig[] = (baseEntries as BaseEntry[]).map((entry) => ({
  ...entry,
  image: toAbsoluteImage(entry.image),
}));

const entryMap = new Map<string, PageSeoConfig>();

baseSeoEntries.forEach((entry) => {
  entryMap.set(entry.pathname, entry);
});

const projectPaths = ["/vivienda-joven", "/la-torre-ii", "/inversiones-inteligentes", "/terrenos", "/corporativos", "/instituciones"];

const homeEntry = entryMap.get("/");
if (homeEntry) {
  homeEntry.structuredData = (context) => [
    buildOrganizationJsonLd(siteConfig),
    buildWebsiteJsonLd(siteConfig),
    buildBreadcrumbJsonLd([{ name: "Inicio", item: context.canonical }]),
  ];
}

const viviendaJovenEntry = entryMap.get("/vivienda-joven");
if (viviendaJovenEntry) {
  viviendaJovenEntry.structuredData = (context) => [
    buildRealEstateProjectJsonLd(context),
    buildBreadcrumbJsonLd([
      { name: "Inicio", item: siteConfig.url },
      { name: "Vivienda Joven", item: context.canonical },
    ]),
  ];
}

const laTorreEntry = entryMap.get("/la-torre-ii");
if (laTorreEntry) {
  laTorreEntry.structuredData = (context) => [
    buildRealEstateProjectJsonLd({
      ...context,
      additional: {
        numberOfRooms: 3,
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Gimnasio" },
          { "@type": "LocationFeatureSpecification", name: "Piscina" },
          { "@type": "LocationFeatureSpecification", name: "Cocheras cubiertas" },
        ],
      },
    }),
    buildBreadcrumbJsonLd([
      { name: "Inicio", item: siteConfig.url },
      { name: "La Torre II", item: context.canonical },
    ]),
  ];
}

const proyectosEntry = entryMap.get("/proyectos");
if (proyectosEntry) {
  const itemListElements = projectPaths.map((path, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: entryMap.get(path)?.title ?? `Proyecto ${index + 1}`,
    item: new URL(path, siteConfig.url).toString(),
  }));

  proyectosEntry.structuredData = (context) => [
    buildBreadcrumbJsonLd([
      { name: "Inicio", item: siteConfig.url },
      { name: "Proyectos de inversion", item: context.canonical },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: itemListElements,
    },
  ];
}

export const seoEntries: PageSeoConfig[] = Array.from(entryMap.values());

export const resolveSeoEntry = (pathname: string): PageSeoConfig => {
  const normalizedPathname =
    pathname && pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname || "/";

  const directMatch = entryMap.get(normalizedPathname);
  if (directMatch) {
    return {
      ...directMatch,
      robots: directMatch.robots ?? defaultRobots,
    };
  }

  const startsWithMatch = seoEntries.find(
    (entry) => entry.pathname !== "/" && normalizedPathname.startsWith(entry.pathname)
  );

  if (startsWithMatch) {
    return {
      ...startsWithMatch,
      pathname: normalizedPathname,
      robots: {
        ...defaultRobots,
        ...startsWithMatch.robots,
      },
    };
  }

  return {
    pathname: normalizedPathname,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    changefreq: "monthly",
    priority: 0.5,
    robots: defaultRobots,
  };
};

export const interestSlugs: string[] = [...(interestSlugsData as string[])];
