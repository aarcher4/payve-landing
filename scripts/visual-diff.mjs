#!/usr/bin/env node
/**
 * Canvas-vs-app visual-diff harness for the marketing site.
 * Ported from payve-fintech scripts/e2e/visual-diff.ts (same philosophy:
 * the canvas export is the pixel source of truth; the % is an inspection
 * signal, not a binary gate — attribute every delta).
 *
 * Serves design-context/claude-design-export-r1/ statically, screenshots
 * each canvas page and the matching app route (default http://localhost:3100)
 * at 1440 + 390 with reduced motion, pixelmatches, writes
 * reports/visual-diff/<name>/<viewport>/{app,proto,diff}.png + summary.json.
 *
 * Run: node scripts/visual-diff.mjs [name...] [--base http://...]
 */
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const EXPORT_DIR = "design-context/claude-design-export-r1";
const OUT_DIR = "reports/visual-diff";
const APP_BASE = (() => {
  const i = process.argv.indexOf("--base");
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1].replace(/\/$/, "");
  return process.env.VISUAL_DIFF_BASE || "http://localhost:3100";
})();
const PER_PIXEL = Number(process.env.PIXELMATCH_THRESHOLD ?? "0.1");
const PROTO_PORT = 4180;

const SCREENS = [
  { name: "home", app: "/", proto: "home.dc.html" },
  { name: "products-payments", app: "/products/payments", proto: "products-payments.dc.html" },
  { name: "products-early-pay", app: "/products/early-pay", proto: "products-early-pay.dc.html" },
  { name: "products-agents", app: "/products/agents", proto: "products-agents.dc.html" },
  { name: "solutions-fresh-produce", app: "/solutions/fresh-produce", proto: "solutions-fresh-produce.dc.html" },
  { name: "solutions-seafood", app: "/solutions/seafood", proto: "solutions-seafood.dc.html" },
  { name: "solutions-packaging", app: "/solutions/packaging", proto: "solutions-packaging.dc.html" },
  { name: "customers", app: "/customers", proto: "customers.dc.html" },
  { name: "customers-fortune-growers", app: "/customers/fortune-growers", proto: "customers-fortune-growers.dc.html" },
  { name: "customers-sl-produce", app: "/customers/sl-produce", proto: "customers-sl-produce.dc.html" },
  { name: "customers-dal-campo", app: "/customers/dal-campo", proto: "customers-dal-campo.dc.html" },
  { name: "security", app: "/security", proto: "security.dc.html" },
  { name: "company", app: "/company", proto: "company.dc.html" },
];

const VIEWPORTS = [
  { label: "1440", width: 1440, height: 960 },
  { label: "390", width: 390, height: 844 },
];

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".json": "application/json", ".woff2": "font/woff2",
};

function serveExport() {
  const srv = createServer((req, res) => {
    const path = decodeURIComponent((req.url || "/").split("?")[0]);
    let file = join(EXPORT_DIR, path === "/" ? "home.dc.html" : path.slice(1));
    try {
      if (existsSync(file) && statSync(file).isFile()) {
        res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
        res.end(readFileSync(file));
        return;
      }
    } catch {}
    res.writeHead(404);
    res.end("not found");
  });
  return new Promise((resolve) => srv.listen(PROTO_PORT, () => resolve(srv)));
}

function padTo(png, width, height) {
  if (png.width === width && png.height === height) return png;
  const out = new PNG({ width, height, fill: true });
  out.data.fill(255);
  PNG.bitblt(png, out, 0, 0, Math.min(png.width, width), Math.min(png.height, height), 0, 0);
  return out;
}

async function shoot(page, url, viewport, outPath) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(1500);
  const buf = await page.screenshot({ fullPage: true });
  writeFileSync(outPath, buf);
  return PNG.sync.read(buf);
}

const only = process.argv.slice(2).filter((a) => !a.startsWith("--") && a !== APP_BASE);
const screens = only.length ? SCREENS.filter((s) => only.includes(s.name)) : SCREENS;

const srv = await serveExport();
const browser = await chromium.launch();
const page = await browser.newPage();
const summary = [];

for (const s of screens) {
  for (const vp of VIEWPORTS) {
    const dir = join(OUT_DIR, s.name, vp.label);
    mkdirSync(dir, { recursive: true });
    try {
      const protoPng = await shoot(page, `http://localhost:${PROTO_PORT}/${s.proto}`, vp, join(dir, "proto.png"));
      const appPng = await shoot(page, `${APP_BASE}${s.app}`, vp, join(dir, "app.png"));
      const w = Math.max(protoPng.width, appPng.width);
      const h = Math.max(protoPng.height, appPng.height);
      const a = padTo(protoPng, w, h);
      const b = padTo(appPng, w, h);
      const diff = new PNG({ width: w, height: h });
      const mismatched = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: PER_PIXEL });
      writeFileSync(join(dir, "diff.png"), PNG.sync.write(diff));
      const pct = (mismatched / (w * h)) * 100;
      summary.push({ screen: s.name, viewport: vp.label, mismatchPct: Number(pct.toFixed(2)), protoH: protoPng.height, appH: appPng.height });
      console.log(`${s.name} @${vp.label}: ${pct.toFixed(2)}% mismatch (proto ${protoPng.height}px vs app ${appPng.height}px tall)`);
    } catch (e) {
      summary.push({ screen: s.name, viewport: vp.label, error: String(e).slice(0, 160) });
      console.log(`${s.name} @${vp.label}: ERROR ${String(e).slice(0, 120)}`);
    }
  }
}

writeFileSync(join(OUT_DIR, "summary.json"), JSON.stringify({ base: APP_BASE, generatedAt: "run-local", results: summary }, null, 2));
await browser.close();
srv.close();
console.log(`\nSummary written to ${OUT_DIR}/summary.json`);
