import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
      'react-icons',
      'react-icons/fa',
      'react-icons/fa6',
      'react-icons/fi',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-avatar',
      '@radix-ui/react-select',
      '@radix-ui/react-popover',
      'next-cloudinary',
      'react-hook-form',
      'next-auth'
    ],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
    serverComponentsExternalPackages: ['mongodb', 'bcryptjs', 'zxcvbn'],
    optimizeCss: {
      preload: 'body',
    },
    scrollRestoration: true,
    largePageDataBytes: 128 * 1000, // 128KB
  },

  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Security and performance headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://res.cloudinary.com https://images.unsplash.com data:; connect-src 'self' https://vercel.live wss://ws.pusherapp.com https://fonts.googleapis.com https://fonts.gstatic.com https://www.google-analytics.com https://www.googletagmanager.com; frame-ancestors 'none';"
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/images/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400' },
      ],
    },
  ],

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Enhanced image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // Output optimization - removed standalone for development
  // output: 'standalone', // Enable only for production deployment

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Enhanced chunk splitting for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // عزل framer-motion في حزمة منفصلة
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 35,
            reuseExistingChunk: true,
          },
          // عزل zxcvbn في حزمة منفصلة (يتم تحميلها فقط عند الحاجة)
          zxcvbn: {
            test: /[\\/]node_modules[\\/]zxcvbn[\\/]/,
            name: 'zxcvbn',
            priority: 35,
            reuseExistingChunk: true,
          },
          // عزل @radix-ui في حزمة منفصلة
          radixUI: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            priority: 35,
            reuseExistingChunk: true,
          },
          // عزل next-cloudinary في حزمة منفصلة
          cloudinary: {
            test: /[\\/]node_modules[\\/](next-cloudinary|cloudinary)[\\/]/,
            name: 'cloudinary',
            priority: 35,
            reuseExistingChunk: true,
          },
          // عزل react-hook-form في حزمة منفصلة
          reactHookForm: {
            test: /[\\/]node_modules[\\/]react-hook-form[\\/]/,
            name: 'react-hook-form',
            priority: 35,
            reuseExistingChunk: true,
          },
          lib: {
            test(module) {
              return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier())
            },
            name: 'lib',
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        },
      }
    }
    return config
  },
}

export default withBundleAnalyzer(nextConfig)