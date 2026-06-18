import type { Metadata } from "next";
import ReCaptcha from "../components/reCaptcha";
import ProjectForm from "../components/projectForm";
import { SITE_DATA } from "../locales-comerciales/data";
import FeaturesBar from "../locales-comerciales/components/FeaturesBar";
import EnergyBackup from "../locales-comerciales/components/EnergyBackup";
import {
  Benefits,
  CommercialOptions,
  Hero,
  Location,
  UseCases,
} from "./components/LocalesMockup";

export const metadata: Metadata = {
  title: "Maqueta Locales Comerciales | CORADIR Homes",
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 3600;

export default function LocalesComercialesMaquetaPage() {
  return (
    <ReCaptcha>
      <>
        <Hero data={SITE_DATA} />
        <FeaturesBar data={SITE_DATA} />
        <CommercialOptions />
        <Location data={SITE_DATA} />
        <EnergyBackup data={SITE_DATA} />
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
