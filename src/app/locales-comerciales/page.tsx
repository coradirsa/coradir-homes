import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import ReCaptcha from "../components/reCaptcha";
import ProjectForm from "../components/projectForm";
import { SITE_DATA } from "./data";
import FeaturesBar from "./components/FeaturesBar";
import ThreeDSlider from "./components/ThreeDSlider";
import Ambientes from "./components/Ambientes";
import Construction from "./components/Construction";
import EnergyBackup from "./components/EnergyBackup";
import {
  Benefits,
  CommercialOptions,
  Hero,
  Location,
  UseCases,
} from "../locales-comerciales-maqueta/components/LocalesMockup";

export function generateMetadata(): Metadata {
  return createMetadata({ pathname: "/locales-comerciales" }).metadata;
}

export const revalidate = 3600;

export default function LocalesComercialesPage() {
  return (
    <ReCaptcha>
      <>
        <StructuredDataScripts pathname="/locales-comerciales" />
        <Hero data={SITE_DATA} />
        <FeaturesBar data={SITE_DATA} />
        <CommercialOptions />
        <Location data={SITE_DATA} />
        <EnergyBackup data={SITE_DATA} />
        <ThreeDSlider data={SITE_DATA} />
        <Ambientes data={SITE_DATA} />
        <Construction data={SITE_DATA} />
        <Benefits />
        <UseCases />
        <ProjectForm
          id="contact"
          interest="locales-comerciales"
          heading={SITE_DATA.contact.title}
          subtitle={SITE_DATA.contact.subtitle}
          backgroundImage={SITE_DATA.contact.bgImage}
          transactionTypes={["comprar", "alquilar", "leasing"]}
        />
      </>
    </ReCaptcha>
  );
}
