import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static optimization for pages with dynamic content
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs', 'drizzle-orm'],
  },
  // Ensure proper headers for dynamic content
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache' },
        ],
      },
    ];
  },
};

export default nextConfig;
