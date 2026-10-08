import type { NextConfig } from "next";
const nextConfig: NextConfig = { images: {formats: ["image/avif", "image/webp"], remotePatterns: [new URL("https://raw.githubusercontent.com/AnthonyTornetta/hermes-integration-test/7e3748b54b6bdc9f28f657b04e4eba8219ca3b02/public/sample.png")]} };
export default nextConfig;
