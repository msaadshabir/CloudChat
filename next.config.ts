const nextConfig: any = {
  // External packages for server components
  serverExternalPackages: ['drizzle-orm'],
  // Pin Turbopack root to this workspace to avoid incorrect root inference
  turbopack: {
    root: __dirname,
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
