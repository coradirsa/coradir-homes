import ReCaptcha from "../components/reCaptcha";
import HeroSection from "./components/HeroSection";
import OverviewSection from "./components/OverviewSection";
import SliderSection from "./components/SliderSection";
import AmenitiesSection from "./components/AmenitiesSection";
import TypologiesSection from "./components/TypologiesSection";
import LocationSection from "./components/LocationSection";
import ContactSection from "./components/ContactSection";

export const metadata = {
  title: "La Torre II",
  description: "Departamentos inteligentes en Mitre 526, San Luis. Conoce La Torre II de Coradir Homes.",
};

export default function LaTorreIIPage() {
  return (
    <ReCaptcha>
      <>
        <HeroSection />
        <OverviewSection />
        <SliderSection />
        <AmenitiesSection />
        <TypologiesSection />
        <LocationSection />
        <ContactSection />
      </>
    </ReCaptcha>
  );
}
