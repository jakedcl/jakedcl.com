import type { MetadataRoute } from "next";

import { getSite } from "@/lib/content";

export const revalidate = 60;

// From Studio > Search & sharing > Google.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();
  return {
    rules: [
      site.allowIndexing
        ? {
            userAgent: "*",
            allow: "/",
            ...(site.hiddenPaths.length > 0 ? { disallow: site.hiddenPaths } : {}),
          }
        : { userAgent: "*", disallow: "/" },
    ],
    ...(site.siteUrl
      ? { sitemap: `${site.siteUrl}/sitemap.xml`, host: site.siteUrl }
      : {}),
  };
}
