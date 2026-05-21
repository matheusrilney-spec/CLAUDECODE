/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/data/:path*',
        destination: '/api/static/:path*',
      },
    ];
  },
}

module.exports = nextConfig
