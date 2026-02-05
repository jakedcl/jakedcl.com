import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jake DCL - Creative Portfolio",
  description: "Jacob Decore Lurker (Jake DCL) - Web Developer, Designer, and Creative Technologist. Exploring the intersection of code, design, and creative expression.",
  keywords: ["Jake DCL", "Jacob Decore Lurker", "web developer", "designer", "portfolio", "creative technologist"],
  authors: [{ name: "Jake DCL" }],
  creator: "Jake DCL",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jakedcl.com",
    title: "Jake DCL - Creative Portfolio",
    description: "Jacob Decore Lurker (Jake DCL) - Web Developer, Designer, and Creative Technologist.",
    siteName: "Jake DCL Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jake DCL - Creative Portfolio",
    description: "Jacob Decore Lurker (Jake DCL) - Web Developer, Designer, and Creative Technologist.",
    creator: "@jakedcl",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@300;400;500;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}
