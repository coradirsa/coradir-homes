import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import Home from "./components/home/home";
import SectionCreateHomes from "./components/home/components/sectionCreateHomes";
import { StructuredDataScripts } from "./components/structuredDataScripts";

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
    <>
      <StructuredDataScripts pathname="/" />
      <Home />
      <SectionCreateHomes />
    </>
  );
}
