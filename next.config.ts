import type { NextConfig } from "next";

const ONE_DAY = 60 * 60 * 24;
const ONE_YEAR = ONE_DAY * 365;

// Origen publico de Inmobiliario: de ahi salen las fotos y videos del catalogo
// de unidades (/uploads/...). Ver src/lib/catalogo.
const INMOBILIARIO_ORIGIN = (process.env.INMOBILIARIO_PUBLIC_ORIGIN || "https://inmobiliario.coradir.com.ar").replace(/\/+$/, "");
const inmobiliarioUrl = new URL(INMOBILIARIO_ORIGIN);

// Las paginas del catalogo cambian cuando se publica o alquila una unidad:
// no pueden quedar un dia entero en el cache compartido como el resto del sitio.
const CATALOGO_PATHS = ["/alquileres", "/alquileres/:path*", "/venta", "/venta/:path*"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  output: 'standalone', // Required for Docker deployment

  // Optimizar imágenes
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: inmobiliarioUrl.protocol.replace(":", "") as "http" | "https",
        hostname: inmobiliarioUrl.hostname,
        port: inmobiliarioUrl.port,
        pathname: "/uploads/**",
      },
    ],
  },

  // Reducir tamaño del bundle
  experimental: {
    optimizePackageImports: ['react-hook-form', '@hookform/resolvers'],
  },

  async redirects() {
    return [
      {
        source: "/manuales",
        destination: "https://torre2.coradir.com.ar/manuales/",
        permanent: true,
      },
      {
        source: "/complejo-coradir",
        destination: "/locales-comerciales",
        permanent: true,
      },
      {
        source: "/torre-ii-coradir",
        destination: "/la-torre-ii",
        statusCode: 301,
      },
      {
        source: "/:path+/",
        destination: "/:path+",
        statusCode: 308,
      },
    ];
  },


  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=0, s-maxage=${ONE_DAY}`,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://*.googletagmanager.com https://googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://google-analytics.com https://*.google-analytics.com https://www.gstatic.com https://www.google.com https://www.google.com.ar https://*.google.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://www.googleadservices.com https://*.googlesyndication.com https://pagead2.googlesyndication.com https://snap.licdn.com https://*.licdn.com https://testbothome.coradir.ai https://static.cloudflareinsights.com; script-src-elem 'self' 'unsafe-inline' https://connect.facebook.net https://*.googletagmanager.com https://googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://google-analytics.com https://*.google-analytics.com https://www.gstatic.com https://www.google.com https://www.google.com.ar https://*.google.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://www.googleadservices.com https://*.googlesyndication.com https://pagead2.googlesyndication.com https://snap.licdn.com https://*.licdn.com https://testbothome.coradir.ai https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://googletagmanager.com https://tagmanager.google.com https://fonts.googleapis.com https://*.google.com; img-src 'self' data: https: ${INMOBILIARIO_ORIGIN} https://*.google-analytics.com https://*.googletagmanager.com https://*.doubleclick.net https://*.google.com https://www.google.com.ar https://www.googleadservices.com https://*.googlesyndication.com https://*.licdn.com https://px.ads.linkedin.com; font-src 'self' data: https://fonts.gstatic.com; media-src 'self' ${INMOBILIARIO_ORIGIN}; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://analytics.google.com https://google-analytics.com https://region1.google-analytics.com https://*.googletagmanager.com https://googletagmanager.com https://www.google.com https://www.google.com.ar https://*.google.com https://recaptchaenterprise.googleapis.com https://*.n8n.cloud https://automatic.coradir.com.ar https://testbothome.coradir.ai https://*.doubleclick.net https://stats.g.doubleclick.net https://www.googleadservices.com https://*.googlesyndication.com https://*.licdn.com https://px.ads.linkedin.com https://connect.facebook.net https://www.facebook.com; frame-src https://www.youtube-nocookie.com https://www.youtube.com https://www.google.com https://www.google.com.ar https://*.google.com https://*.googletagmanager.com https://googletagmanager.com https://tagmanager.google.com https://bid.g.doubleclick.net https://*.doubleclick.net; base-uri 'self'; form-action 'self';`
          },
        ],
      },
      ...CATALOGO_PATHS.map((source) => ({
        source,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      })),
      {
        source: "/:all*(js|css|png|jpg|jpeg|gif|webp|svg|ico|ttf|woff|woff2|otf|json)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
