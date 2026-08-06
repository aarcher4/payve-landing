import type { MetadataRoute } from "next";

const base = "https://www.getpayve.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/products/network",
    "/products/agentic-intelligence",
    "/rates",
    "/solutions/fresh-produce",
    "/solutions/seafood",
    "/solutions/packaging",
    "/customers",
    "/customers/fortune-growers",
    "/security",
    "/company",
    "/privacy",
    "/terms",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
