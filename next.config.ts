import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirects live in Studio (see src/app/[...path]/page.tsx).
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/we7xgg1a/**',
      },
    ],
  },
};

export default nextConfig;
