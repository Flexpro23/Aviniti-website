/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  images: {
    formats: ['image/webp'],
    // Use these if your images are from an external source
    // domains: ['example.com'],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'example.com',
    //     pathname: '/images/**',
    //   },
    // ],
  },
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeServerReact: true,
  },
  poweredByHeader: false,
}

module.exports = nextConfig 