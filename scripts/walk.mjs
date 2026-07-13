#!/usr/bin/env node
/**
 * Quick site walk: every route at 1440 + 390, assert zero console errors,
 * CTA label/href correctness, no placeholder email, all internal links resolve.
 * Run against a running server: node scripts/walk.mjs [--base http://localhost:3100]
 */
import { chromium } from "playwright";

const i = process.argv.indexOf("--base");
const BASE = (i >= 0 && process.argv[i + 1]) || process.env.WALK_BASE || "http://localhost:3100";
const CTA_LABEL = "Schedule time with us";
const CTA_HREF = "https://zcal.co/payve";

const ROUTES = [
  "/", "/products/network", "/products/agentic-intelligence",
  // Old product routes stay listed: they must keep resolving (via redirect).
  "/products/payments", "/products/early-pay", "/products/agents",
  "/solutions/fresh-produce", "/solutions/seafood", "/solutions/packaging",
  "/customers", "/customers/fortune-growers", "/customers/sl-produce",
  "/customers/dal-campo", "/customers/producer-pro",
  "/security", "/company", "/privacy", "/terms",
];
const VIEWPORTS = [
  { width: 1440, height: 960 },
  { width: 390, height: 844 },
];

const browser = await chromium.launch();
let failures = 0;
const seenLinks = new Set();

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: vp });
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  for (const route of ROUTES) {
    consoleErrors.length = 0;
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    const status = res?.status() ?? 0;
    const problems = [];
    if (status !== 200) problems.push(`status ${status}`);
    if (consoleErrors.length) problems.push(`console: ${consoleErrors.join(" | ").slice(0, 200)}`);

    const html = await page.content();
    if (html.includes("alex@getpayve.com")) problems.push("placeholder email present");
    if (/>\s*Book a demo\s*</.test(html)) problems.push('stale "Book a demo" label');

    const ctas = await page.$$eval(`a[href="${CTA_HREF}"]`, (as) => as.map((a) => a.textContent?.trim()));
    if (!ctas.length) problems.push("no Zcal CTA on page");
    else if (!ctas.every((t) => t === CTA_LABEL)) problems.push(`CTA labels: ${[...new Set(ctas)].join(", ")}`);

    for (const href of await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute("href")))) {
      if (href) seenLinks.add(href.split("#")[0]);
    }

    if (problems.length) {
      failures++;
      console.log(`FAIL ${vp.width} ${route}: ${problems.join("; ")}`);
    } else {
      console.log(`ok   ${vp.width} ${route}`);
    }
  }
  await page.close();
}

// Internal-link resolution sweep (HEAD-ish via GET, once)
const page = await browser.newPage();
for (const href of [...seenLinks].sort()) {
  const res = await page.goto(BASE + href, { waitUntil: "domcontentloaded" });
  if ((res?.status() ?? 0) !== 200) {
    failures++;
    console.log(`FAIL link ${href}: status ${res?.status()}`);
  }
}
await browser.close();

console.log(failures ? `WALK FAILED: ${failures} problem(s)` : "WALK CLEAN");
process.exit(failures ? 1 : 0);
