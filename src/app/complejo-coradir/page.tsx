import type { Metadata } from "next";
import Hero from "./components/Hero";
import FeaturesBar from "./components/FeaturesBar";
import ThreeDSlider from "./components/ThreeDSlider";
import ProjectLocation from "./components/ProjectLocation";
import Ambientes from "./components/Ambientes";
import Construction from "./components/Construction";
import CtaBanner from "./components/CtaBanner";
import ContactForm from "./components/ContactForm";
import { SITE_DATA } from "./data";

export const metadata: Metadata = {
  title: "Locales Comerciales CORADIR | Venta y Alquiler en San Luis",
  description: "Locales comerciales de 144 m² y 180 m² en venta y alquiler. Entrega 2026-2027. Ubicación estratégica en Ruta 3 km 0.6, San Luis. Aire acondicionado, gas y seguridad con IA incluidos.",
  keywords: "locales comerciales san luis, alquiler locales coradir, venta locales comerciales, inversión inmobiliaria san luis, locales en pozo, coradir homes",
  openGraph: {
    title: "Locales Comerciales CORADIR - Tu Espacio Comercial en San Luis",
    description: "Comercios diseñados para crecer con vos. Pre-reservas y alquileres anticipados disponibles. Entrega asegurada 2026-2027.",
    images: ["/img/complejo-coradir/1.webp"],
    type: "website",
    locale: "es_AR",
    siteName: "CORADIR Homes"
  },
  twitter: {
    card: "summary_large_image",
    title: "Locales CORADIR | Oportunidad de Inversión en San Luis",
    description: "5 locales comerciales en construcción. Ubicación estratégica, entrega asegurada. ¡Cupos limitados!",
    images: ["/img/complejo-coradir/1.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ComplejoCoradirPage() {
  return (
    <main className="font-sans antialiased bg-white selection:bg-blue-100 selection:text-blue-900">
      <Hero data={SITE_DATA} />
      <FeaturesBar data={SITE_DATA} />
      <ThreeDSlider data={SITE_DATA} />
      <ProjectLocation data={SITE_DATA} />
      <Ambientes data={SITE_DATA} />
      <Construction data={SITE_DATA} />
      <CtaBanner data={SITE_DATA} />
      <ContactForm data={SITE_DATA} />
    </main>
  );
}