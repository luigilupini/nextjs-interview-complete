import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // DummyJSON recipe images
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.dummyjson.com', pathname: '/recipe-images/**' },
    ],
  },
};

export default nextConfig;
