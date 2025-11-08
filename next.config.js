/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages Configuration
  output: 'export', // Static export for GitHub Pages
  basePath: '/spar', // GitHub Pages subdirectory
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // GitHub Pages works better with trailing slashes
  
  // Enable React strict mode
  reactStrictMode: true,
};

module.exports = nextConfig;
