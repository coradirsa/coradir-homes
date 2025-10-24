import { NextResponse } from "next/server";
import baseEntries from "@/lib/seo/baseEntries.json";
import interestSlugs from "@/lib/seo/interestSlugs.json";
import { resolveSeoEntry, siteConfig } from "@/lib/seo";

const buildRssItem = (loc: string, title: string, description: string) => `
  <item>
    <title><![CDATA[${title}]]></title>
    <link>${loc}</link>
    <guid>${loc}</guid>
    <description><![CDATA[${description}]]></description>
    <pubDate>${new Date().toUTCString()}</pubDate>
  </item>
`;

export async function GET() {
  const homeEntries = (baseEntries as { pathname: string; title: string; description: string }[]).map((entry) => {
    const resolved = resolveSeoEntry(entry.pathname);
    const loc = new URL(entry.pathname, siteConfig.url).toString();
    return buildRssItem(loc, resolved.title, resolved.description);
  });

  const interestItems = (interestSlugs as string[]).map((slug) => {
    const path = `/saber-mas/${slug}`;
    const resolved = resolveSeoEntry(path);
    const loc = new URL(path, siteConfig.url).toString();
    return buildRssItem(loc, resolved.title, resolved.description);
  });

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${siteConfig.name}]]></title>
    <link>${siteConfig.url}</link>
    <description><![CDATA[${siteConfig.description}]]></description>
    <language>es</language>
    ${[...homeEntries, ...interestItems].join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=1800",
    },
  });
}
