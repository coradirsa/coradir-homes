import type { Metadata } from "next"; 
import "./globals.css";
import Header from "./components/header/header"; 
import Footer from "./components/footer/footer";
import Bot from "./components/bot"; 
import Script from "next/script";
import SectionProjectsDone from "./components/sectionProjectsDone";

export const metadata: Metadata = {
  title: "Coradir Homes",
  description: "Coradir Homes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-white overflow-x-hidden">
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

        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0FW1131XF8"
          strategy="afterInteractive"
        />
        <Script
          id="ga-script"
          strategy="afterInteractive"
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

        <Header/>   
        <Bot/>
        {children}
        <SectionProjectsDone/>
        <Footer/>
        {/* <Script src={"http://localhost:8850/embed.js"} strategy="afterInteractive" /> */}

        <Script
            src={process.env.NEXT_PUBLIC_BOT_SCRIPT_URL!}
            strategy="afterInteractive"
            data-mode="custom"
            data-trigger="#coradir-custom-avatar"
        />

      </body>
    </html>
  );
}