import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/value-calculator", destination: "/value-calculator.html" },
      // Hidden, password-protected (StatiCrypt) EverAg × Payve deck. Unguessable slug; not linked anywhere.
      { source: "/roger-value-prop-bbc01d16", destination: "/roger-value-prop-bbc01d16.html" },
    ];
  },
  async headers() {
    // Keep the hidden deck out of search indexes (both the clean URL and the .html path).
    return [
      {
        source: "/roger-value-prop-bbc01d16",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/roger-value-prop-bbc01d16.html",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;


