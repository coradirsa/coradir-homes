import type { NextConfig } from "next";

const ONE_DAY = 60 * 60 * 24;
const ONE_YEAR = ONE_DAY * 365;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  output: 'standalone', // Required for Docker deployment

  // Optimizar imágenes
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com https://www.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://recaptchaenterprise.googleapis.com https://*.n8n.cloud; frame-src https://www.google.com; base-uri 'self'; form-action 'self';"
          },
        ],
      },
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
