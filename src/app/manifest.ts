import type { MetadataRoute } from "next";

import { getHomeContent } from "@/lib/siteContent";

export const revalidate = 60;

// Names and description come from Site Settings in Studio. Empty fields are left out.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const c = await getHomeContent();
  return {
    ...(c.appName ? { name: c.appName } : {}),
    ...(c.appShortName ? { short_name: c.appShortName } : {}),
    ...(c.appDescription ? { description: c.appDescription } : {}),
    start_url: "/",
    display: "standalone",
    background_color: "#f6f3ec",
    theme_color: "#f6f3ec",
    icons: [
      {
        src: "/favicon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
