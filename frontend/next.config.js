/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  // Optimizations for faster development
  swcMinify: true,
  compiler: {
    removeConsole: false,
  },
  // Faster module resolution
  transpilePackages: [],
  // Configuración para Vercel
  output: undefined, // Asegura que no esté en modo export
  // Configuración para manejar rutas dinámicas
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

module.exports = nextConfig;
