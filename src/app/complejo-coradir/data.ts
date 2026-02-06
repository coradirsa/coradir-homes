import type { SiteData } from './types';

export const SITE_DATA: SiteData = {
  theme: {
    colors: {
      primary: "bg-slate-900",
      accent: "bg-blue-600",
      textMain: "text-slate-800",
      textLight: "text-slate-500",
      bgLight: "bg-slate-50"
    }
  },
  // Navbar eliminado de la vista, pero mantenemos data por si se reutiliza
  navbar: {
    logoText: "CORADIR HOMES",
    links: [
      { label: "HOMES", href: "#" },
      { label: "PROYECTOS", href: "#" },
      { label: "BENEFICIOS", href: "#" },
      { label: "INVERSORES", href: "#" },
      { label: "CONTACTO", href: "#contact" }
    ]
  },
  hero: {
    title: "Locales CORADIR:",
    subtitle: "Comercios diseñados para crecer con vos",
    specs: "180 m²",
    tagline: "Un paso adelante para tu proyecto comercial. Entrega asegurada. Pre-reservas y alquileres anticipados.",
    buttons: [
      { label: "VENTA", href: "#venta", style: "solid" },
      { label: "ALQUILER", href: "#alquiler", style: "outline" },
      {
        label: "DESCARGAR FOLLETO",
        href: "/Folleto%20Locales%20CORADIR%20-%20low.pdf",
        style: "outline",
        download: true,
        id: "complejo-folleto-download",
      }
    ],
    bgImage: "/img/complejo-coradir/1.webp"
  },
  features_bar: [
    { icon: "/icons/complejo-coradir/icono aire.svg", title: "Aire acondicionado y gas" },
    { icon: "/icons/complejo-coradir/icono seguridad.svg", title: "Seguridad con IA" },
    { icon: "/icons/complejo-coradir/icono comercio.svg", title: "Ubicación comercial estratégica" }
  ],
  carousel: {
    images: [
      "/img/complejo-coradir/2.webp",
      "/img/complejo-coradir/6.webp",
      "/img/complejo-coradir/7.webp",
      "/img/complejo-coradir/8.webp",
      "/img/complejo-coradir/8.2.webp"
    ]
  },
  project_detail: {
    title: "Proyecto de alquiler en pozo - 4 locales comerciales",
    location: "Ruta 3km 0.6, Ciudad de San Luis",
    description: "El complejo comercial se encuentra ubicado en una zona con gran afluencia de vehículos, proyección y demanda creciente. Coincide con barrios residenciales amplios, paradas de colectivos y nuevos desarrollos sociales que aumentan la demanda comercial y el transito de personas. Sumate a un desarrollo pensado para potenciar tu negocio",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3334.467!2d-66.32722715716481!3d-33.3182200724134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDE5JzA1LjYiUyA2NsKwMTknMzguMCJX!5e0!3m2!1ses!2sar!4v1733325400000!5m2!1ses!2sar"
  },
  ambientes: {
    title: "Ambientes",
    cards: [
      { label: "Espacio comercial", img: "/img/complejo-coradir/6.webp" },
      { label: "Baño", img: "/img/complejo-coradir/8.webp" }
    ]
  },
  construction: {
    title: "Construcción rápida y eficiente",
    rows: [
      {
        type: "video-text",
        textBlock: {
          mainText: "Entrega asegurada de tu local para el año 2026-2027, tu dinero crece mientras construimos.",
          list: [
            "Entrega rápida",
            "Amplio descuento en pagos adelantado",
            "Respaldo por PÓLIZA DE CAUCIÓN",
            "Posibilidad de LEASING"
          ]
        },
        videoUrl: "/img/complejo-coradir/locales.webm",
        videoPoster: "/img/complejo-coradir/1.webp"
      },
      {
        type: "text-video",
        textBlock: {
          mainText: "Empezá a planificar tu futuro hoy, elegí cómo va ser tu espacio comercial.",
          list: [
            "Ambientes de 180 m²",
            "Locales amplios y modernos",
            "Gas y aire acondicionado incluidos",
            "Descuento mensual en el primer año de alquiler"
          ]
        },
        videoUrl: "/img/complejo-coradir/v4.webm",
        videoPoster: "/img/complejo-coradir/8.2.webp"
      }
    ]
  },
  cta_banner: {
    title: "Cupos limitados",
    subtitle: "Planificá tu local, congelá tu lugar en la lista y asegurá tu espacio este 2026",
    button: "UNIRME A LA LISTA DE ESPERA"
  },
  contact: {
    title: "Proyectá tu futuro, a precio de hoy.",
    subtitle: "Comunicate con nosotros:",
    fields: [
      { name: "nombre", label: "NOMBRE Y APELLIDO", type: "text" },
      { name: "email", label: "CORREO ELECTRONICO", type: "email" },
      { name: "celular", label: "CELULAR", type: "tel" },
      { name: "mensaje", label: "TU MENSAJE (opcional)", type: "textarea" }
    ],
    options: ["comprar", "alquilar"],
    bgImage: "/img/complejo-coradir/12.webp"
  }
};
