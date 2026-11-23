import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/projects',
        destination: '/work',
        permanent: true,
      },
      {
        source: '/projects/:slug*',
        destination: '/work/:slug*',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/studio',
        permanent: true,
      },
    ]
  },
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
