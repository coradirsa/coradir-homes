import Script from "next/script";
import { createMetadata } from "@/lib/seo";
import type { MetadataOptions } from "@/lib/seo";

type Props = Omit<MetadataOptions, 'structuredData'>;

export function StructuredDataScripts({ pathname, overrides }: Props) {
  const structuredData = createMetadata({ pathname, overrides }).structuredData ?? [];

  return structuredData.map((entry, index) => (
    <Script
      key={`structured-data-${pathname}-${index}`}
      id={`structured-data-${pathname.replace(/[^a-zA-Z0-9-]/g, "-")}-${index}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
    />
  ));
}

