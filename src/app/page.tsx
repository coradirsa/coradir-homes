import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import Home from "./components/home/home";
import SectionCreateHomes from "./components/home/components/sectionCreateHomes";
import { StructuredDataScripts } from "./components/structuredDataScripts";
import ProjectForm from "./components/projectForm";
import ReCaptcha from "./components/reCaptcha";

export function generateMetadata(): Metadata {
  const baseMetadata = createMetadata({ pathname: "/" }).metadata;

  return {
    ...baseMetadata,
    other: {
      ...baseMetadata.other,
    },
  };
}

export const revalidate = 3600;

export default function Page() {
  return (
    <ReCaptcha>
      <StructuredDataScripts pathname="/" />
      <Home />
      <SectionCreateHomes />
      <ProjectForm
        interest="contacto-general"
        heading="Descubrí tu próximo hogar"
        subtitle="Comunicate con nosotros y encontrá el lugar perfecto para vos"
        backgroundImage="/img/vivienda-joven/bg-form.webp"
        id="formulario-home"
        transactionTypes={["comprar", "alquilar"]}
      />
    </ReCaptcha>
  );
}
