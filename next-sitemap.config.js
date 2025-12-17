/* eslint-disable @typescript-eslint/no-var-requires */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.coradirhomes.com";

const baseEntries = require("./src/lib/seo/baseEntries.json");
const interestSlugs = require("./src/lib/seo/interestSlugs.json");

const staticPaths = Array.from(
  new Set(
    baseEntries
      .map((entry) => entry.pathname)
      .filter((pathname) => typeof pathname === "string" && pathname.length > 0)
  )
);

const dynamicInterestPaths = Array.isArray(interestSlugs)
  ? interestSlugs.map((slug) => `/saber-mas/${slug}`)
  : [];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
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
  additionalPaths: async () => {
    const today = new Date().toISOString();
    const extraPaths = dynamicInterestPaths.filter((path) => !staticPaths.includes(path));
    return extraPaths.map((path) => ({
      loc: `${siteUrl}${path}`,
      changefreq: "weekly",
      priority: 0.6,
      lastmod: today,
    }));
  },
  exclude: ["/complejo-coradir"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/api/", "/complejo-coradir"],
      },
    ],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
};
