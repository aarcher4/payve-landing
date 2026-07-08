#!/usr/bin/env node
/**
 * One-shot regrade of the homepage hero (r2 critique: "slightly increase
 * background visibility/saturation so the hero image reads more clearly").
 * Uses Playwright's canvas filter so no native image deps are needed.
 *
 * Run: node scripts/regrade-hero.mjs [src] [dest] [--filter "saturate(1.25) ..."]
 * Defaults: design-context/imagery-originals/hero-home.png -> public/images/hero-home.jpg
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const src = args[0] || "design-context/imagery-originals/hero-home.png";
const dest = args[1] || "public/images/hero-home.jpg";
const fi = process.argv.indexOf("--filter");
const filter =
  fi >= 0 && process.argv[fi + 1]
    ? process.argv[fi + 1]
    : "saturate(1.22) brightness(1.03) contrast(1.05)";
const qi = process.argv.indexOf("--quality");
const quality = qi >= 0 && process.argv[qi + 1] ? Number(process.argv[qi + 1]) : 0.82;

const dataUri = `data:image/png;base64,${readFileSync(src).toString("base64")}`;

const browser = await chromium.launch();
const page = await browser.newPage();
const jpeg = await page.evaluate(
  async ({ dataUri, filter, quality }) => {
    const img = new Image();
    img.src = dataUri;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.filter = filter;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/jpeg", quality).split(",")[1];
  },
  { dataUri, filter, quality }
);
await browser.close();

writeFileSync(dest, Buffer.from(jpeg, "base64"));
console.log(`regraded ${src} -> ${dest} with ${filter} (${Buffer.from(jpeg, "base64").length} bytes)`);
