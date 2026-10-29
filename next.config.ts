import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/admin', destination: '/studio', permanent: false },
      { source: '/admin/:path*', destination: '/studio/:path*', permanent: false },
      {
        source: '/resume',
        destination: '/',
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
