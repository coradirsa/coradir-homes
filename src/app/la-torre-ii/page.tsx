import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { StructuredDataScripts } from "../components/structuredDataScripts";
import ReCaptcha from "../components/reCaptcha";
import HeroSection from "./components/HeroSection";
import OverviewSection from "./components/OverviewSection";
import SliderSection from "./components/SliderSection";
import AmenitiesSection from "./components/AmenitiesSection";
import TypologiesSection from "./components/TypologiesSection";
import LocationSection from "./components/LocationSection";
import ContactSection from "./components/ContactSection";
import FaqSection from "../components/faq/faqSection";
import { FAQ_CONTENT } from "@/content/seo/copy";

export function generateMetadata(): Metadata {
  return createMetadata({ pathname: "/la-torre-ii" }).metadata;
}

export const revalidate = 3600;

export default function LaTorreIIPage() {
  const faq = FAQ_CONTENT["la-torre-ii"];
  return (
    <ReCaptcha>
      <>
        <StructuredDataScripts pathname="/la-torre-ii" />
        <HeroSection />
        <OverviewSection />
        <SliderSection />
        <AmenitiesSection />
        <TypologiesSection />
        <LocationSection />
        <FaqSection title={faq.title} items={faq.items} schemaId="la-torre-ii" />
        <ContactSection />
      </>
    </ReCaptcha>
  );
}
