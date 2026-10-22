import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // PokéAPI sprites / official artwork
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/PokeAPI/sprites/**' },
      // DummyJSON recipe images
      { protocol: 'https', hostname: 'cdn.dummyjson.com', pathname: '/recipe-images/**' },
    ],
  },
};

export default nextConfig;
