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
  navbar: {
    logoText: string;
    links: Array<{
      label: string;
      href: string;
    }>;
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
  contact: {
    title: string;
    subtitle: string;
    fields: Array<{
      name: string;
      label: string;
      type: string;
    }>;
    options: string[];
    bgImage: string;
  };
}
