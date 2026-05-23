/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk'],
  },
}

export default nextConfig
