import Script from "next/script";
import { buildInvestmentProductJsonLd } from "@/lib/seo";

/**
 * Structured Data para el popup de inversiones
 * Agrega Schema.org FinancialProduct al sitio
 */
export default function InvestmentModalStructuredData() {
  const structuredData = buildInvestmentProductJsonLd();

  return (
    <Script
      id="investment-product-structured-data"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
