/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optional: Add this if you're using images from external domains
  images: {
    domains: ['localhost'],
  },
  // Enable React Strict Mode
  reactStrictMode: true,
};

export default nextConfig;
