import type { AccessModel, CommercialProject, ConditionItem, GalleryImage, LeasingPlan } from "./types";

export const WHATSAPP_LOCALES = "5492664649967";
export const WHATSAPP_LOCALES_LABEL = "2664 64-9967";

export function whatsappLocales(mensaje: string) {
  return `https://wa.me/${WHATSAPP_LOCALES}?text=${encodeURIComponent(mensaje)}`;
}

export const COMMERCIAL_HERO = {
  eyebrow: "Locales comerciales · San Luis",
  title: "Tu próximo local puede costar menos de lo que imaginás.",
  subtitle:
    "Opciones en alquiler y venta en ubicaciones estratégicas de San Luis y Juana Koslay. Compará precios y encontrá el espacio ideal para tu negocio o inversión.",
  image: "/img/locales-comerciales/ruta-3/real-frente-calle.webp",
  highlights: ["Venta y alquiler de locales", "Backup energético Ruta 3", "Leasing inmobiliario"],
};

export const COMMERCIAL_INTRO = {
  eyebrow: "Oportunidades comerciales",
  title: "Precios que abren oportunidades.",
  text: "Locales pensados para instalar tu negocio o invertir, con valores claros y condiciones transparentes desde el primer contacto.",
  items: [
    {
      icon: "price_check",
      title: "Precios directos",
      text: "Precio de lista y alquiler publicados para cada desarrollo, sin intermediarios.",
    },
    {
      icon: "contract_edit",
      title: "Condiciones flexibles",
      text: "Compra, alquiler o leasing inmobiliario con planes de hasta 96 meses en Juana 64.",
    },
    {
      icon: "verified_user",
      title: "Respaldo CORADIR",
      text: "Desarrollos propios, con póliza de caución y seguridad con IA en Ruta 3.",
    },
  ],
};

export const COMMERCIAL_PROJECTS: CommercialProject[] = [
  {
    id: "ruta-3",
    name: "Locales CORADIR Ruta 3 km 0.6",
    eyebrow: "Ciudad de San Luis",
    location: "Ruta 3 km 0.6",
    address: "Ruta 3 Pque Ind Sur, San Luis",
    mapUrl: "https://maps.app.goo.gl/zcztdS5itTgfrFns9",
    mapEmbedUrl: "https://www.google.com/maps?q=-33.318220,-66.327227&z=17&output=embed",
    summary:
      "Complejo de 4 locales comerciales sobre un corredor de alto tránsito, con frente amplio, cocheras, acceso vehicular y acceso peatonal definidos en plano.",
    image: "/img/locales-comerciales/ruta-3/frente-dia.webp",
    status: "En obra / entrega estimada 2026-2027",
    specs: [
      { label: "Unidades", value: "4 locales" },
      { label: "Superficie comercial", value: "180 m2 por local" },
      { label: "Backup energético", value: "12 meses de respaldo" },
      { label: "Frente", value: "6 m por local" },
      { label: "Ubicación", value: "Ruta 3 km 0.6" },
    ],
    prices: [
      { label: "Precio de lista", value: "USD 107.000 + IVA" },
      { label: "Alquiler mensual", value: "ARS $1.280.000" },
    ],
    iconFeatures: [
      { icon: "bolt", title: "Backup energético para continuidad operativa" },
      { icon: "local_parking", title: "Cocheras y accesos vehiculares definidos en plano" },
      { icon: "videocam", title: "Seguridad con IA" },
      { icon: "payments", title: "Posibilidad de leasing" },
      { icon: "policy", title: "Póliza de caución" },
    ],
    suitableFor: ["Showroom", "Servicios", "Franquicias", "Oficinas comerciales"],
    reference: {
      shortName: "Ruta 3",
      zone: "Ruta 3 km 0.6 · San Luis",
      icon: "domain",
      units: 4,
      surface: "180 m²",
      rent: "$1.280.000",
      sale: "USD 107.000 + IVA",
      profile: "Gran exposición sobre un corredor de alto tránsito, con frente amplio, cocheras y respaldo energético.",
    },
  },
  {
    id: "juana-64",
    name: "Locales comerciales Juana 64",
    eyebrow: "Juana Koslay",
    location: "Juana Koslay, San Luis",
    address: "Juana Koslay, San Luis",
    mapUrl: "https://maps.app.goo.gl/4zgfoDyicqu5jZR19",
    mapEmbedUrl: "https://www.google.com/maps?q=Juana%2064%2C%20Juana%20Koslay%2C%20San%20Luis%2C%20Argentina&output=embed",
    summary:
      "Locales comerciales dentro de un desarrollo residencial, pensados para negocios de cercanía, servicios profesionales, atención diaria y renta comercial.",
    image: "/img/locales-comerciales/juana-64/locales/jk-64.webp",
    status: "Entrega estimada en septiembre de 2026",
    specs: [
      { label: "Tipo", value: "Locales dentro del desarrollo Juana 64" },
      { label: "Superficie", value: "72 m2 por local" },
      { label: "Medidas", value: "6 m x 12 m" },
      { label: "Cantidad", value: "6 locales" },
      { label: "Entrega locales", value: "Entrega estimada en septiembre de 2026" },
    ],
    prices: [
      { label: "Precio de lista", value: "USD 70.000 + IVA" },
      { label: "Alquiler mensual", value: "ARS $729.000" },
    ],
    iconFeatures: [
      { icon: "groups", title: "Flujo natural del desarrollo residencial" },
      { icon: "savings", title: "Compra al contado" },
      { icon: "payments", title: "Leasing inmobiliario hasta 96 meses" },
      { icon: "percent", title: "Reserva del 3%" },
      { icon: "location_on", title: "Ubicación en Juana Koslay" },
    ],
    suitableFor: ["Comercio de cercanía", "Servicios profesionales", "Gastronomía liviana", "Atención diaria"],
    reference: {
      shortName: "Juana 64",
      zone: "Juana Koslay",
      icon: "storefront",
      units: 6,
      surface: "72 m²",
      rent: "$729.000",
      sale: "USD 70.000 + IVA",
      profile: "Comercio de cercanía y servicios dentro de un desarrollo residencial, con flujo natural de vecinos todo el año.",
    },
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: "/img/locales-comerciales/ruta-3/real-frente-calle.webp",
    alt: "Frente de los locales comerciales CORADIR sobre Ruta 3",
    label: "Ruta 3 - Frente sobre la calle",
  },
  {
    src: "/img/locales-comerciales/ruta-3/real-lateral.webp",
    alt: "Vista lateral de los locales CORADIR Ruta 3 con estacionamiento",
    label: "Ruta 3 - Estacionamiento",
  },
  {
    src: "/img/locales-comerciales/ruta-3/real-frente.webp",
    alt: "Vidrieras de los locales comerciales CORADIR Ruta 3",
    label: "Ruta 3 - Vidrieras",
  },
  {
    src: "/img/locales-comerciales/ruta-3/luminarias-locales.webp",
    alt: "Luminarias exteriores de locales comerciales CORADIR Ruta 3",
    label: "Ruta 3 - Luminarias",
  },
  {
    src: "/img/locales-comerciales/ruta-3/nueva.webp",
    alt: "Render exterior de locales comerciales CORADIR Ruta 3",
    label: "Ruta 3 - Fachada comercial",
  },
  {
    src: "/img/locales-comerciales/ruta-3/perfecto.webp",
    alt: "Vista comercial de locales CORADIR Ruta 3",
    label: "Ruta 3 - Proyecto comercial",
  },
  {
    src: "/img/locales-comerciales/juana-64/locales/jk-64.webp",
    alt: "Locales comerciales Juana 64 en Juana Koslay",
    label: "Juana 64 - Locales comerciales",
  },
  {
    src: "/img/locales-comerciales/juana-64/locales/local02.webp",
    alt: "Vista exterior de local comercial Juana 64",
    label: "Juana 64 - Frente comercial",
  },
  {
    src: "/img/locales-comerciales/juana-64/locales/locales-08.webp",
    alt: "Render de locales comerciales Juana 64",
    label: "Juana 64 - Vista de locales",
  },
  {
    src: "/img/locales-comerciales/juana-64/locales/locales-06.webp",
    alt: "Locales Juana 64 dentro del desarrollo residencial",
    label: "Juana 64 - Desarrollo comercial",
  },
  {
    src: "/img/locales-comerciales/juana-64/locales/locales.webp",
    alt: "Vista general de locales comerciales Juana 64",
    label: "Juana 64 - Vista general",
  },
];

export const JUANA_64_LEASING_PLANS: LeasingPlan[] = [
  {
    term: "24 meses",
    interest: "0%",
    downPayment: "USD 20.058,02",
    monthlyPayment: "USD 1.552,11",
    residualValue: "USD 1.552,11",
  },
  {
    term: "48 meses",
    interest: "4% anual",
    downPayment: "USD 20.058,02",
    monthlyPayment: "USD 841,08",
    residualValue: "USD 929,40",
  },
  {
    term: "96 meses",
    interest: "8% anual",
    downPayment: "USD 20.058,02",
    monthlyPayment: "USD 526,60",
    residualValue: "USD 526,60",
  },
];

export const ACCESS_MODELS: AccessModel[] = [
  {
    icon: "receipt_long",
    title: "Compra directa",
    description: "Precio de lista publicado para cada desarrollo: USD 107.000 + IVA en Ruta 3 y USD 70.000 + IVA en Juana 64.",
    footnote: "Compra al contado",
  },
  {
    icon: "real_estate_agent",
    title: "Leasing inmobiliario",
    description: "Ingresás con un adelanto y cuotas pactadas, con opción de compra por el valor residual. Juana 64 tiene planes hasta 96 meses.",
    footnote: "Planes de 24, 48 y 96 meses",
  },
  {
    icon: "bookmark_added",
    title: "Reserva",
    description: "Para avanzar con la unidad se toma una reserva del 3%, sujeta a disponibilidad y aprobación comercial.",
    footnote: "Reserva del 3%",
  },
];

export const COMMERCIAL_CONDITIONS: ConditionItem[] = [
  {
    title: "Reserva",
    description: "Para avanzar con la unidad se toma una reserva del 3%, sujeta a disponibilidad y aprobación comercial.",
  },
  {
    title: "Leasing inmobiliario",
    description: "Permite ingresar con adelanto y cuotas pactadas, con opción de valor residual. Juana 64 cuenta con planes hasta 96 meses.",
  },
];

export const CONTACT_COPY = {
  title: "Consultá disponibilidad y condiciones comerciales",
  subtitle: "Te contactamos con precios vigentes, opciones de pago y alternativas de leasing.",
  backgroundImage: "/img/locales-comerciales/ruta-3/frente-noche.webp",
};
