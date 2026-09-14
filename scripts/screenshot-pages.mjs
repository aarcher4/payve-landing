#!/usr/bin/env node
/**
 * Full-page screenshots of every rebranded route at 1440 + 390 for design
 * review. Run against a running server:
 *   node scripts/screenshot-pages.mjs --out .goal-loop/screens/r1 [--base http://localhost:3100]
 * reducedMotion: 'reduce' so reveals/demos render final-state (deterministic).
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return (i >= 0 && process.argv[i + 1]) || dflt;
};
const BASE = arg("--base", "http://localhost:3100");
const OUT = arg("--out", ".goal-loop/screens/latest");
mkdirSync(OUT, { recursive: true });

const ROUTES = [
  "/", "/products/network", "/products/agentic-intelligence",
  "/solutions/fresh-produce", "/solutions/seafood", "/solutions/packaging",
  "/customers", "/company", "/security",
];
const VIEWPORTS = [
  { width: 1440, height: 960 },
  { width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
    const file = `${OUT}/${slug}-${vp.width}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`shot ${file}`);
  }
  await ctx.close();
}
await browser.close();
console.log("SCREENSHOTS DONE");
