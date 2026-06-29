import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/value-calculator", destination: "/value-calculator.html" },
    ];
  },
};

export default nextConfig;


