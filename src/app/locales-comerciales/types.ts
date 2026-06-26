export type PriceItem = {
  label: string;
  value: string;
  note?: string;
  featured?: boolean;
};

export type CommercialProject = {
  id: "ruta-3" | "juana-64";
  name: string;
  eyebrow: string;
  location: string;
  address: string;
  mapUrl: string;
  mapEmbedUrl: string;
  summary: string;
  image: string;
  status: string;
  specs: Array<{
    label: string;
    value: string;
  }>;
  prices: PriceItem[];
  iconFeatures: Array<{
    icon: string;
    title: string;
  }>;
  suitableFor: string[];
  validationNote?: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
  label: string;
};

export type LeasingPlan = {
  term: string;
  interest: string;
  downPayment: string;
  monthlyPayment: string;
  residualValue: string;
};

export type ConditionItem = {
  title: string;
  description: string;
};

export type ComparisonRow = {
  project: string;
  location: string;
  surface: string;
  presalePrice: string;
  listPrice: string;
  rent: string;
  leasing: string;
};

export interface SiteData {
  theme: {
    colors: {
      primary: string;
      accent: string;
      textMain: string;
      textLight: string;
      bgLight: string;
    };
  };
  hero: {
    title: string;
    subtitle: string;
    specs: string;
    tagline: string;
    buttons: Array<{
      label: string;
      href: string;
      style: "solid" | "outline";
      download?: boolean;
      id?: string;
    }>;
    bgImage: string;
  };
  features_bar: Array<{
    icon: string;
    title: string;
  }>;
  energy_backup: {
    title: string;
    description: string;
    highlights: Array<{
      icon: "zap" | "shield";
      title: string;
      description: string;
    }>;
    panelIcon: string;
    panelTitle: string;
    panelSubtitle: string;
  };
  carousel: {
    images: string[];
  };
  project_detail: {
    title: string;
    location: string;
    description: string;
    mapUrl: string;
  };
  ambientes: {
    title: string;
    cards: Array<{
      label: string;
      img: string;
    }>;
  };
  construction: {
    title: string;
    rows: Array<{
      type: "video-text" | "text-video";
      textBlock: {
        mainText: string;
        list: string[];
      };
      videoUrl: string;
      videoPoster: string;
    }>;
  };
  cta_banner: {
    title: string;
    subtitle: string;
    button: string;
  };
}
