import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Network rebrand: the old three-product IA folds into two products.
    return [
      { source: "/products/payments", destination: "/products/network", permanent: true },
      { source: "/products/early-pay", destination: "/products/network", permanent: true },
      { source: "/products/agents", destination: "/products/agentic-intelligence", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Hidden, qualified-prospect-only value calculator. Unguessable slug; not linked anywhere.
      { source: "/value-model-9f3ac21b", destination: "/value-model-9f3ac21b.html" },
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
      {
        source: "/value-model-9f3ac21b",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/value-model-9f3ac21b.html",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;


