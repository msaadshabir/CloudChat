import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force fresh builds and disable caching issues
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  // Disable static optimization for dynamic content
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs', 'drizzle-orm'],
  },
};

export default nextConfig;
