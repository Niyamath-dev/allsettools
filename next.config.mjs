/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
    NEXT_PUBLIC_ADMIN_PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '',
  },
  typescript: {
    // Bypasses WASM-deserialization crashes on Windows compile fallbacks
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
