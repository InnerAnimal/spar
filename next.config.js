/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel Configuration
  // Removed 'output: export' - Vercel uses serverless functions for API routes
  // Removed 'basePath' - Use custom domain or Vercel subdomain
  
  images: {
    // Vercel optimizes images automatically
    unoptimized: false,
  },
  
  trailingSlash: false,
  
  // Enable React strict mode
  reactStrictMode: true,
};

module.exports = nextConfig;
