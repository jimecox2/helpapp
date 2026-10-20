/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '**' },   // Google avatars
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '**' }, // GitHub avatars
      { protocol: 'https', hostname: 'be2.timebars.com', pathname: '**' },
      { protocol: 'https', hostname: 'be2.timebars.app', pathname: '**' },
    ],
  },

  // The AI Generator moved onto the Help Assistant page.
  async redirects() {
    return [{ source: '/tbgenerator', destination: '/help/ask?tool=generator', permanent: true }]
  },

  experimental: {
    // Consolidated dashboard sources are posted to a server action with all their rows.
    serverActions: { bodySizeLimit: '25mb' },
  },
}

export default nextConfig
