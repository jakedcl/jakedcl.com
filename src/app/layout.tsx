import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Syne } from "next/font/google";
import { getSite } from "@/lib/content";
import { faviconUrl } from "@/lib/favicon";
import { pageMetadata } from "@/lib/metadata";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["700", "800"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  // Variable font — discrete weight arrays break next/font's Google CSS parse on Vercel
  weight: "variable",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f3ec",
};

// Every piece of text below comes from Studio (Homepage > Search & sharing for this page,
// and the Search & sharing page). Empty fields are left out.
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const page = pageMetadata(site, site.homeSeo, "/");
  const googleBot = {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  };

  return {
    ...(site.siteUrl ? { metadataBase: new URL(site.siteUrl) } : {}),
    ...page,
    ...(site.keywords.length > 0 ? { keywords: site.keywords } : {}),
    ...(site.author ? { authors: [{ name: site.author }], creator: site.author } : {}),
    ...(site.category ? { category: site.category } : {}),
    ...(site.faviconUrl
      ? {
          icons: {
            icon: [{ url: faviconUrl(site.faviconUrl), type: "image/png", sizes: "32x32" }],
            apple: [{ url: "/apple-icon", type: "image/png" }],
            shortcut: [faviconUrl(site.faviconUrl)],
          },
        }
      : { icons: { apple: [{ url: "/apple-icon", type: "image/png" }] } }),
    robots: site.allowIndexing
      ? { index: true, follow: true, googleBot }
      : { index: false, follow: false },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${bricolage.variable} ${plexMono.variable}`}
    >
      <body className="font-sans antialiased text-ink bg-background">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
