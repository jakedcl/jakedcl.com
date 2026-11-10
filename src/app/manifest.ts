import type { MetadataRoute } from "next";

import { getSite } from "@/lib/content";
import { faviconUrl } from "@/lib/favicon";

export const revalidate = 60;

// Names, description, and icon come from Studio > Search & sharing. Empty fields are left out.
// start_url, display, and colors are fixed app/design settings.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSite();
  return {
    ...(site.appName ? { name: site.appName } : {}),
    ...(site.appShortName ? { short_name: site.appShortName } : {}),
    ...(site.appDescription ? { description: site.appDescription } : {}),
    start_url: "/",
    display: "standalone",
    background_color: "#f6f3ec",
    theme_color: "#f6f3ec",
    icons: [
      ...(site.faviconUrl
        ? [{ src: faviconUrl(site.faviconUrl), sizes: "32x32", type: "image/png" }]
        : []),
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
