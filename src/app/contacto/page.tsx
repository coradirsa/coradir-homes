import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import ReCaptcha from "../components/reCaptcha";
import ContactForm from "./components/ContactForm";
import { CONTACTO_COPY } from "@/content/seo/contactoCopy";

export function generateMetadata(): Metadata {
  return createMetadata({
    pathname: "/contacto",
    overrides: {
      title: "Contacto | Coradir Homes",
      description: CONTACTO_COPY.heroDescription,
    },
  }).metadata;
}

export const revalidate = 3600;

export default function ContactoPage() {
  return (
    <ReCaptcha>
      <>
        <StructuredDataScripts
          pathname="/contacto"
          overrides={{
            title: "Contacto | Coradir Homes",
            description: CONTACTO_COPY.heroDescription,
          }}
        />

        {/* Hero Section */}
        <section className="container flex flex-col items-center justify-start py-10 pt-14 gap-6 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl text-blue font-playfair">{CONTACTO_COPY.heroTitle}</h1>
          <p className="text-gray md:text-xl font-raleway">{CONTACTO_COPY.heroSubtitle}</p>
          <p className="text-gray/80 md:text-lg font-raleway">{CONTACTO_COPY.heroDescription}</p>
        </section>

        {/* Sobre Nosotros Section */}
        <section className="container flex flex-col items-center justify-center py-10 gap-6 max-w-5xl">
          <h2 className="text-3xl md:text-5xl text-blue font-playfair text-center">
            {CONTACTO_COPY.aboutTitle}
          </h2>
          <div className="flex flex-col gap-4 text-base md:text-lg text-gray/90 font-raleway leading-relaxed">
            {CONTACTO_COPY.aboutParagraphs.map((paragraph, index) => (
              <p key={index} className="text-center md:text-left">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="container flex flex-col items-center justify-center py-10 pb-20 gap-6">
          <div className="text-center max-w-3xl mb-4">
            <h2 className="text-3xl md:text-5xl text-blue font-playfair mb-3">
              {CONTACTO_COPY.formTitle}
            </h2>
            <p className="text-gray md:text-lg font-raleway">{CONTACTO_COPY.formDescription}</p>
          </div>
          <ContactForm />
        </section>
      </>
    </ReCaptcha>
  );
}
