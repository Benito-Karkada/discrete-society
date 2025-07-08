import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.shopify.com"],
  },
  eslint: {
    // Skip ESLint during production builds on Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
