/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    runtime: 'experimental-edge',
  },
}

module.exports = nextConfig
