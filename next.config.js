/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  images: {
    formats: ['image/webp'],
    domains: ['firebasestorage.googleapis.com', 'fonts.gstatic.com'],
    // Use these if your images are from an external source
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'example.com',
    //     pathname: '/images/**',
    //   },
    // ],
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeServerReact: true,
  },
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    // Add fs mock for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    // Handle native modules that cause build issues
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@google-cloud/speech': 'commonjs @google-cloud/speech',
        '@google-cloud/storage': 'commonjs @google-cloud/storage',
      });
    }
    
    return config;
  },
}

module.exports = nextConfig 