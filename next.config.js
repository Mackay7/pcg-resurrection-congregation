/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Type errors caught in dev — don't block production builds
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
}
module.exports = nextConfig
