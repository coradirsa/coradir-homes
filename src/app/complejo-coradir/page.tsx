import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import ReCaptcha from "../components/reCaptcha";
import ProjectForm from "../components/projectForm";
import { SITE_DATA } from "./data";
import Hero from "./components/Hero";
import FeaturesBar from "./components/FeaturesBar";
import ThreeDSlider from "./components/ThreeDSlider";
import ProjectLocation from "./components/ProjectLocation";
import Ambientes from "./components/Ambientes";
import Construction from "./components/Construction";

export function generateMetadata(): Metadata {
  return createMetadata({ pathname: "/complejo-coradir" }).metadata;
}

export const revalidate = 3600;

export default function ComplejoCoradirPage() {
  return (
    <ReCaptcha>
      <>
        <StructuredDataScripts pathname="/complejo-coradir" />
        <Hero data={SITE_DATA} />
        <FeaturesBar data={SITE_DATA} />
        <ThreeDSlider data={SITE_DATA} />
        <ProjectLocation data={SITE_DATA} />
        <Ambientes data={SITE_DATA} />
        <Construction data={SITE_DATA} />
        <ProjectForm
          id="contact"
          interest="complejo-coradir"
          heading={SITE_DATA.contact.title}
          subtitle={SITE_DATA.contact.subtitle}
          backgroundImage={SITE_DATA.contact.bgImage}
          transactionTypes={SITE_DATA.contact.options}
        />
      </>
    </ReCaptcha>
  );
}
