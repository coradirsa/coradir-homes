import type { CommercialProject, ConditionItem, GalleryImage, LeasingPlan } from "./types";

export const COMMERCIAL_HERO = {
  eyebrow: "Locales comerciales en San Luis",
  title: "Locales comerciales en San Luis y Juana Koslay",
  subtitle:
    "Invertí, alquilá o abrí tu negocio en ubicaciones estratégicas: Ruta 3 km 0.6 y Juana 64, con compra en pozo, alquiler y leasing inmobiliario.",
  image: "/img/locales-comerciales/ruta-3/frente-atardecer.webp",
  highlights: ["Venta y alquiler de locales", "Backup energético Ruta 3", "Leasing inmobiliario"],
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
      { label: "Precio pozo", value: "USD 85.000 + IVA", featured: true },
      { label: "Precio de lista", value: "USD 107.000 + IVA" },
      { label: "Alquiler mensual", value: "USD 690 + IVA" },
    ],
    iconFeatures: [
      { icon: "bolt", title: "Backup energético para continuidad operativa" },
      { icon: "local_parking", title: "Cocheras y accesos vehiculares definidos en plano" },
      { icon: "videocam", title: "Seguridad con IA" },
      { icon: "payments", title: "Posibilidad de leasing" },
      { icon: "policy", title: "Póliza de caución" },
    ],
    suitableFor: ["Showroom", "Servicios", "Franquicias", "Oficinas comerciales"],
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
    status: "En pozo / primera etapa estimada fin de julio 2026",
    specs: [
      { label: "Tipo", value: "Locales dentro del desarrollo Juana 64" },
      { label: "Superficie", value: "84 m2 por local" },
      { label: "Medidas", value: "6 m x 14 m" },
      { label: "Cantidad", value: "6 locales" },
      { label: "Entrega locales", value: "Primera etapa estimada fin de julio 2026" },
    ],
    prices: [
      { label: "Precio pozo", value: "USD 53.000 + IVA", featured: true },
      { label: "Precio de lista", value: "USD 70.000 + IVA" },
      { label: "Alquiler mensual", value: "USD 391 + IVA" },
    ],
    iconFeatures: [
      { icon: "groups", title: "Flujo natural del desarrollo residencial" },
      { icon: "savings", title: "Compra en pozo o contado" },
      { icon: "payments", title: "Leasing inmobiliario hasta 96 meses" },
      { icon: "percent", title: "Reserva del 3%" },
      { icon: "policy", title: "Póliza de caución para compra en pozo" },
      { icon: "location_on", title: "Ubicación en Juana Koslay" },
    ],
    suitableFor: ["Comercio de cercanía", "Servicios profesionales", "Gastronomía liviana", "Atención diaria"],
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
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

export const COMMERCIAL_CONDITIONS: ConditionItem[] = [
  {
    title: "Reserva",
    description: "Para avanzar con la unidad se toma una reserva del 3%, sujeta a disponibilidad y aprobación comercial.",
  },
  {
    title: "Compra en pozo",
    description: "En compra en pozo adelantada, el saldo se abona según condiciones comerciales vigentes al momento de la operación.",
  },
  {
    title: "Leasing inmobiliario",
    description: "Permite ingresar con adelanto y cuotas pactadas, con opción de valor residual. Juana 64 cuenta con planes hasta 96 meses.",
  },
  {
    title: "Garantía para inversores",
    description: "Para compra en pozo se puede instrumentar póliza de caución por el total aportado, con incremento comercial del 3%.",
  },
];

export const CONTACT_COPY = {
  title: "Consultá disponibilidad y condiciones comerciales",
  subtitle: "Te contactamos con precios vigentes, opciones de pago y alternativas de leasing.",
  backgroundImage: "/img/locales-comerciales/ruta-3/frente-noche.webp",
};
