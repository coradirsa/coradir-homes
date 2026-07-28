/* eslint-disable @typescript-eslint/no-var-requires */
// The public SEO origin is intentionally fixed so a local or stale environment
// variable cannot publish canonicals and sitemap URLs for another hostname.
const siteUrl = "https://homes.coradir.com.ar";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ["/gracias", "/locales-comerciales-maqueta"],
  outDir: "./public",
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.7,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config?.changefreq ?? "weekly",
      priority: config?.priority ?? 0.7,
      lastmod: new Date().toISOString(),
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
  },
};
