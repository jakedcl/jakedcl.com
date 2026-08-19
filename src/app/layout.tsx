import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
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
    <html lang="en">
      <body className="font-sans antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}
