import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['www.solarsystemscope.com', 'images.unsplash.com'],
  },
  webpack(config) {
    // This enables proper handling of texture files in Three.js
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
