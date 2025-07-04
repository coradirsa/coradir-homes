/* eslint-disable @next/next/next-script-for-ga */
import type { Metadata } from "next"; 
import "./globals.css";
import Header from "./components/header/header"; 
import Footer from "./components/footer/footer";
import Bot from "./components/bot"; 
import Script from "next/script";

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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="beforeInteractive"  dangerouslySetInnerHTML={{ __html: `function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-PBZQ65VZ');`}} />
        <Script  strategy="beforeInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-0FW1131XF8"/>
        <Script id="gtm-script-2" strategy="beforeInteractive" async dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-0FW1131XF8');`}}
        />
      </head>
      <body className="bg-white overflow-x-hidden">
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PBZQ65VZ" height="0" width="0" style={{display:"none",visibility:"hidden"}}></iframe></noscript>
        <Header/>   
        <Bot/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
