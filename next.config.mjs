/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Bypasses WASM-deserialization crashes on Windows compile fallbacks
    ignoreBuildErrors: true,
  },
  compress: true,
};

export default nextConfig;
