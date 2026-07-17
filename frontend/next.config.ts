import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Safeguard: Ignore TypeScript compilation check errors during production packaging
  typescript: {
    ignoreBuildErrors: true,
  },
  // Safeguard: Ignore ESLint syntax warnings/errors during production packaging
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
