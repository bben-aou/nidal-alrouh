import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Log environment variables on startup
console.log(
  '\x1b[36m%s\x1b[0m',
  '==================================================='
);
console.log(
  '\x1b[36m%s\x1b[0m',
  '🚀 FRONTEND ENVIRONMENT CONFIGURATION LOADED'
);
console.log(
  '\x1b[36m%s\x1b[0m',
  '---------------------------------------------------'
);
console.log(`NODE_ENV:             ${process.env.NODE_ENV}`);
console.log(`NEXT_PUBLIC_API_URL:  ${process.env.NEXT_PUBLIC_API_URL}`);
console.log(`NEXT_PUBLIC_APP_URL:  ${process.env.NEXT_PUBLIC_APP_URL}`);
console.log(
  '\x1b[36m%s\x1b[0m',
  '==================================================='
);

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'github.com', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const target = process.env.API_PROXY_TARGET;
    if (!target) {
      return [];
    }
    console.log('\x1b[33m%s\x1b[0m', `Using API proxy target: ${target}`);
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ];
  },
  /* config options here */
  turbopack: {
    root: process.cwd(),
  },
};

export default withNextIntl(nextConfig);
