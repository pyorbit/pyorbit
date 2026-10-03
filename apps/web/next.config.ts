import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pyorbit/ui", "@pyorbit/types"],
};

export default nextConfig;
