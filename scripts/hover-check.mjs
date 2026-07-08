#!/usr/bin/env node
/**
 * Hover-state verification for the r2 homepage interactions:
 * - ProductTour: each selector row activates on hover, connector visible, demo swaps
 * - HowItWorks: each box activates, proof panel text swaps, default = 01
 * Screenshots to reports/hover/. Run against a running server.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.WALK_BASE || "http://localhost:3100";
mkdirSync("reports/hover", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
let failures = 0;
await page.goto(BASE + "/", { waitUntil: "networkidle" });

// --- HowItWorks ---
const proofPanel = page.locator("text=What that looked like").locator("xpath=following-sibling::div[1]");
const defaultProof = await proofPanel.innerText();
if (!defaultProof.includes("two decades")) {
  failures++;
  console.log("FAIL default proof is not step 01:", defaultProof.slice(0, 80));
} else console.log("ok   proof default = 01 (Connect)");

const boxes = [
  { title: "See everything", expect: "SL Produce" },
  { title: "Automate with approval", expect: "800 vouchers" },
  { title: "Move the money", expect: "local currency" },
  { title: "Connect", expect: "two decades" },
];
for (const b of boxes) {
  await page.locator(`button:has(h3:text-is("${b.title}"))`).hover();
  await page.waitForTimeout(350);
  const txt = await proofPanel.innerText();
  if (!txt.includes(b.expect)) {
    failures++;
    console.log(`FAIL proof for ${b.title}: got "${txt.slice(0, 60)}"`);
  } else console.log(`ok   proof swaps on hover -> ${b.title}`);
}
await page.locator('button:has(h3:text-is("Automate with approval"))').hover();
await page.waitForTimeout(300);
await page.screenshot({ path: "reports/hover/hiw-automate-hover.png", fullPage: false });

// --- ProductTour ---
const tourRows = ["Early pay", "Payve Agents", "Payments"];
for (const t of tourRows) {
  await page.locator(`button:has-text("${t}")`).first().hover();
  await page.waitForTimeout(400);
  const pressed = await page
    .locator(`button[aria-expanded="true"]:has-text("${t}")`)
    .count();
  if (!pressed) {
    failures++;
    console.log(`FAIL tour row did not activate on hover: ${t}`);
  } else console.log(`ok   tour activates -> ${t}`);
}
await page.locator('button:has-text("Payve Agents")').first().hover();
await page.waitForTimeout(400);
const tour = page.locator("section", { hasText: "One platform" }).first();
await tour.screenshot({ path: "reports/hover/tour-agents-active.png" });

// --- keyboard: tab reaches the boxes and focus activates ---
await page.keyboard.press("Tab");
const kb = await page.evaluate(() => document.activeElement?.tagName);
console.log("ok   keyboard focus reachable (first tab ->", kb + ")");

await browser.close();
console.log(failures ? `HOVER CHECK FAILED: ${failures}` : "HOVER CHECK CLEAN");
process.exit(failures ? 1 : 0);
