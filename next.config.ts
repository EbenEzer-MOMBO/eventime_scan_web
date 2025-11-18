import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eventime.ga',
        port: '',
        pathname: '/public/storage/**',
      },
    ],
  },
};

export default nextConfig;
