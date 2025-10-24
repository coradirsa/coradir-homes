export type SocialProfile = {
  name: string;
  url: string;
};

export type SiteConfig = {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  logo: string;
  foundingDate?: string;
  phone?: string;
  email?: string;
  socialProfiles: SocialProfile[];
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
};

const fallbackSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.coradirhomes.com";

export const siteConfig: SiteConfig = {
  name: "Coradir Homes",
  legalName: "Coradir Homes",
  tagline: "Desarrollos inmobiliarios inteligentes y sustentables",
  description:
    "Coradir Homes desarrolla viviendas y proyectos inmobiliarios con enfoque en innovación, sustentabilidad y confort, ofreciendo oportunidades de inversión y soluciones habitacionales de alta calidad.",
  url: fallbackSiteUrl,
  logo: `${fallbackSiteUrl}/img/marca.png`,
  foundingDate: "2018-01-01",
  phone: "+54 266 454-7788",
  email: "contacto@coradirhomes.com",
  socialProfiles: [
    { name: "LinkedIn", url: "https://www.linkedin.com/company/coradir" },
    { name: "Instagram", url: "https://www.instagram.com/coradirhomes" },
    { name: "Facebook", url: "https://www.facebook.com/coradirhomes" },
  ],
  address: {
    streetAddress: "Av. Lafinur 840",
    addressLocality: "San Luis",
    addressRegion: "San Luis",
    postalCode: "5700",
    addressCountry: "AR",
  },
};

