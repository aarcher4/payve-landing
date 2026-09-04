import type { MetadataRoute } from "next";

const base = "https://www.getpayve.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // One-pager site: only the landing page and the legal pages are public.
  const routes = ["", "/privacy", "/terms"];
  return routes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.5,
  }));
}
