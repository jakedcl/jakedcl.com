import type { MetadataRoute } from "next";

import { getSite } from "@/lib/content";

export const revalidate = 60;

// Names and description come from Studio > Search & sharing. Empty fields are left out.
// Icons, start_url, display, and colors are fixed app/design settings.
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
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
