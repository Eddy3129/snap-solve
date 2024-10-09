const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com'
      },
      {
        protocol: 'https',
        hostname: 'mybuxkutxuhcwdclejpm.supabase.co'
      },
      // If you also need https for example.com, add this:
      {
        protocol: 'http',
        hostname: 'example.com'
      }
    ]
  }
};

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
}
