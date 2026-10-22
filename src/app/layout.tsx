import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Syne } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://jakedcl.com"),
  title: {
    default: "Jake DCL | Web Developer Portfolio",
    template: "%s | Jake DCL",
  },
  description: "Jake DeCore-Lurker - Focused in designing, building, and maintaining web applications and IT systems.",
  keywords: ["Jake DCL", "Jacob Decore Lurker", "web developer", "designer", "portfolio", "creative technologist"],
  authors: [{ name: "Jake DCL" }],
  creator: "Jake DCL",
  category: "technology",
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
    title: "Jake DCL | Web Developer Portfolio",
    description: "Jacob Decore Lurker (Jake DCL) - Web Developer, Designer, and Creative Technologist.",
    siteName: "Jake DCL Portfolio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Jake DCL web developer portfolio",
      },
    ],
  },
};

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
