import type { SiteConfig } from "./siteConfig";
import { siteConfig } from "./siteConfig";

export type StructuredDataEntry = Record<string, unknown>;

export type StructuredDataContext = {
  canonical: string;
  pageTitle: string;
  description: string;
  image?: string;
  site: SiteConfig;
  additional?: Record<string, unknown>;
};

export const buildOrganizationJsonLd = (site: SiteConfig = siteConfig): StructuredDataEntry => {
  const sameAs = site.socialProfiles.map((profile) => profile.url);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: site.logo,
    description: site.description,
    sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phone,
        email: site.email,
        contactType: "customer service",
        areaServed: "AR",
        availableLanguage: ["es"],
      },
    ],
    address: site.address && {
      "@type": "PostalAddress",
      ...site.address,
    },
    foundingDate: site.foundingDate,
  };
};

export const buildWebsiteJsonLd = (site: SiteConfig = siteConfig): StructuredDataEntry => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description: site.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${site.url}/saber-mas/{{search_term_string}}`,
    "query-input": "required name=search_term_string",
  },
});

export const buildRealEstateProjectJsonLd = (context: StructuredDataContext): StructuredDataEntry => ({
  "@context": "https://schema.org",
  "@type": "ResidentialBuilding",
  name: context.pageTitle,
  description: context.description,
  url: context.canonical,
  image: context.image,
  offers: {
    "@type": "Offer",
    url: context.canonical,
    availability: "https://schema.org/InStock",
    priceCurrency: "ARS",
  },
  publisher: {
    "@type": "Organization",
    name: context.site.name,
    url: context.site.url,
  },
  ...context.additional,
});

export const buildBreadcrumbJsonLd = (items: { name: string; item: string }[]): StructuredDataEntry => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((entry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: entry.name,
    item: entry.item,
  })),
});

