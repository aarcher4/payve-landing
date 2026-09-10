import type { MetadataRoute } from "next";

const base = "https://www.getpayve.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // One-pager site: the landing page, the legal pages, and /rates.
  // /rates is a standalone public surface (it is linked from config.ts nav data and is
  // meant to rank), so it belongs here even though the marketing chrome that used to
  // link to it is no longer mounted.
  const routes = ["", "/rates", "/rates/working-capital", "/privacy", "/terms"];
  return routes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.5,
  }));
}
