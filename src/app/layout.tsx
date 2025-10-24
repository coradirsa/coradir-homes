import type { Metadata } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import "./globals.css";
import { playfairDisplay, raleway } from "@/content/ui/fonts";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Bot from "./components/bot";
import { createMetadata, siteConfig } from "@/lib/seo";

// Lazy load heavy sections
const SectionProjectsDone = dynamic(() => import("./components/sectionProjectsDone"), {
  loading: () => <div className="w-full h-[400px] bg-blue animate-pulse" />,
  ssr: true,
});

const { metadata: defaultMetadata, structuredData: defaultStructuredData } = createMetadata({ pathname: "/" });

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Preload critical LCP image - direct file for fastest load */}
        <link
          rel="preload"
          as="image"
          href="/img/optimized/hero_mobile.webp"
          imageSrcSet="/img/optimized/hero_mobile.webp 828w, /img/optimized/hero_tablet.webp 1280w, /img/optimized/hero_desktop.webp 1920w"
          imageSizes="(max-width: 768px) 828px, (max-width: 1280px) 1280px, 1920px"
          fetchPriority="high"
        />
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={`${playfairDisplay.variable} ${raleway.variable} bg-white overflow-x-hidden`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-blue focus:shadow-lg"
        >
          Saltar al contenido principal
        </a>

        {/* Google Tag Manager Script */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PBZQ65VZ');
            `
          }}
        />

        {/* Google Analytics Script - Deferred for better performance */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0FW1131XF8"
          strategy="lazyOnload"
        />
        <Script
          id="ga-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0FW1131XF8');
            `
          }}
        />

        {/* Google Tag Manager NoScript */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-PBZQ65VZ" 
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>

        {defaultStructuredData?.map((entry, index) => (
          <Script
            key={`global-structured-data-${index}`}
            id={`global-structured-data-${index}`}
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
          />
        ))}

        <Header/>   
        <Bot/>
        <main id="main-content" role="main" className="focus:outline-none">
          {children}
          <SectionProjectsDone/>
        </main>
        <Footer/>
        {/* <Script src={"http://localhost:8850/embed.js"} strategy="afterInteractive" /> */}

        {process.env.NEXT_PUBLIC_BOT_SCRIPT_URL && (
          <Script
              src={process.env.NEXT_PUBLIC_BOT_SCRIPT_URL}
              strategy="lazyOnload"
              data-mode="custom"
              data-trigger="#coradir-custom-avatar"
          />
        )}

      </body>
    </html>
  );
}
