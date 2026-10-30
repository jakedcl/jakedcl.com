import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Syne } from "next/font/google";
import { getHomeContent } from "@/lib/siteContent";
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

// Every piece of copy below comes from Site Settings in Studio. Empty fields are left out.
export async function generateMetadata(): Promise<Metadata> {
  const c = await getHomeContent();
  const ogImage = c.ogImage
    ? {
        url: c.ogImage.url,
        ...(c.ogImage.width ? { width: c.ogImage.width } : {}),
        ...(c.ogImage.height ? { height: c.ogImage.height } : {}),
        ...(c.ogImageAlt ? { alt: c.ogImageAlt } : {}),
      }
    : {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        ...(c.ogImageAlt ? { alt: c.ogImageAlt } : {}),
      };

  return {
    metadataBase: new URL("https://jakedcl.com"),
    ...(c.siteTitle ? { title: c.siteTitle } : {}),
    ...(c.metaDescription ? { description: c.metaDescription } : {}),
    ...(c.keywords.length > 0 ? { keywords: c.keywords } : {}),
    ...(c.authorName ? { authors: [{ name: c.authorName }], creator: c.authorName } : {}),
    ...(c.metaCategory ? { category: c.metaCategory } : {}),
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png", sizes: "32x32" }],
      apple: [{ url: "/apple-icon", type: "image/png" }],
      shortcut: ["/favicon.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://jakedcl.com",
      ...(c.ogTitle ? { title: c.ogTitle } : {}),
      ...(c.ogDescription ? { description: c.ogDescription } : {}),
      ...(c.ogSiteName ? { siteName: c.ogSiteName } : {}),
      images: [ogImage],
    },
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
