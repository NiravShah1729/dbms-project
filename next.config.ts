import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  images: {
    domains: ['api.dicebear.com'],
  },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
