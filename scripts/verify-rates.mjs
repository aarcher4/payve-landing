#!/usr/bin/env node
/**
 * Objective acceptance gate for the /rates page (goal-loop A7, A9–A12).
 *
 * Boots the PRODUCTION build with BRIDGE_API_KEY deliberately UNSET, so the whole
 * run exercises the degraded path — the state that must never leak a fabricated
 * rate. Live-rate correctness is NOT asserted here: Bridge's sandbox 503s on
 * /v0/exchange_rates, so a truthful live check needs a production key and is a
 * human step (see .goal-loop/GOAL.md).
 *
 * Exits non-zero on the first failed assertion. Never soften an assertion to get
 * a green — fix the page.
 *
 *   node scripts/verify-rates.mjs [--port 3177] [--keep]
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return (i >= 0 && process.argv[i + 1]) || dflt;
};
const PORT = Number(arg("--port", "3177"));
const BASE = `http://localhost:${PORT}`;

const failures = [];
const checks = [];
function assert(ok, label, detail = "") {
  checks.push({ ok, label });
  if (ok) {
    console.log(`  ok   ${label}`);
  } else {
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
    failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
  }
}

// ---------------------------------------------------------------- boot server
/**
 * Refuse to run against a port that is already serving. A leftover `next start` from an
 * earlier run will happily answer every request from a STALE build, which silently turns
 * this gate into a test of the wrong code (it reported a phantom /api/rates 404 exactly
 * once already). Fail loudly instead.
 */
async function portIsBusy() {
  try {
    await fetch(BASE, { method: "HEAD", signal: AbortSignal.timeout(1500) });
    return true;
  } catch {
    return false;
  }
}
if (await portIsBusy()) {
  console.error(
    `[verify-rates] port ${PORT} is already serving — a stale server would make this gate ` +
      `test the wrong build. Kill it and re-run.`,
  );
  process.exit(1);
}

// BRIDGE_API_KEY is stripped from the child env on purpose (A9).
const childEnv = { ...process.env, PORT: String(PORT), NODE_ENV: "production" };
delete childEnv.BRIDGE_API_KEY;

console.log(`\n[verify-rates] starting next on :${PORT} with BRIDGE_API_KEY unset`);
const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  env: childEnv,
  stdio: ["ignore", "pipe", "pipe"],
  shell: process.platform === "win32",
});
let serverLog = "";
server.stdout.on("data", (d) => (serverLog += d.toString()));
server.stderr.on("data", (d) => (serverLog += d.toString()));

async function waitForServer(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(BASE, { method: "HEAD" });
      if (r.status < 500) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

/**
 * Tear the server down and WAIT for the port to actually free. `next start` spawns a child
 * of its own, so killing the npx wrapper alone leaves the listener bound — which is what
 * stranded a stale server on this port before.
 */
async function shutdown() {
  try {
    if (process.platform === "win32") {
      const kill = spawn("taskkill", ["/pid", String(server.pid), "/f", "/t"], { stdio: "ignore" });
      await new Promise((r) => kill.on("exit", r));
    } else {
      server.kill("SIGTERM");
    }
  } catch {
    /* already gone */
  }
  for (let i = 0; i < 20; i++) {
    if (!(await portIsBusy())) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  console.warn(`[verify-rates] warning: port ${PORT} still bound after teardown`);
}

let browser;
try {
  if (!(await waitForServer())) {
    console.error("[verify-rates] server did not come up:\n" + serverLog.slice(-2000));
    await shutdown();
    process.exit(1);
  }

  // ------------------------------------------------------- A9: degraded API
  console.log("\nA9 — degraded path (no BRIDGE_API_KEY)");
  const apiRes = await fetch(`${BASE}/api/rates`);
  assert(apiRes.ok, "GET /api/rates responds 2xx", `got ${apiRes.status}`);
  const apiText = await apiRes.text();
  let api = null;
  try {
    api = JSON.parse(apiText);
  } catch {
    assert(false, "GET /api/rates returns JSON", apiText.slice(0, 200));
  }

  if (api) {
    const rows = Array.isArray(api.rates) ? api.rates : [];
    const codes = rows.map((r) => r.code).sort();
    assert(
      JSON.stringify(codes) === JSON.stringify(["BRL", "COP", "EUR", "GBP", "MXN"]),
      "API returns exactly the five currencies",
      JSON.stringify(codes),
    );
    assert(
      rows.length > 0 && rows.every((r) => r.live === false),
      "every row is live:false with no key",
    );
    assert(
      rows.every((r) => r.payveRate == null),
      "no rate values are emitted when unavailable",
    );
    // A1: Bridge's own rates must never cross the wire.
    assert(
      !/sell_?[Rr]ate|buy_?[Rr]ate/.test(apiText),
      "API never exposes Bridge sell_rate/buy_rate",
    );
    // Margin non-disclosure: mid-market and the all-in spread are computed server-side for
    // the freshness/sanity guards but must never be published — together they reveal Payve's
    // per-corridor margin, and the page no longer shows them.
    assert(
      !/"mid"|midmarket|allInBps/.test(apiText),
      "API never exposes mid-market or all-in bps",
    );
    // A9: the synthetic fallback constants must never appear as a rate.
    assert(
      !/\b18(\.0+)?\b/.test(JSON.stringify(rows)) && !/\b4000(\.0+)?\b/.test(JSON.stringify(rows)),
      "synthetic fallback values (18.0 / 4000) absent from API payload",
    );
  }

  // ------------------------------------------------------------ page assertions
  browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const resp = await page.goto(`${BASE}/rates`, { waitUntil: "networkidle" });
  assert(resp && resp.status() === 200, "/rates returns 200", `got ${resp && resp.status()}`);

  console.log("\nA9 — degraded path (rendered page)");
  const rowEls = page.locator("[data-rate-row]");
  const rowCount = await rowEls.count();
  assert(rowCount === 5, "five currency rows render", `got ${rowCount}`);

  const unavailableCount = await page.locator('[data-rate-row][data-state="unavailable"]').count();
  assert(unavailableCount === 5, "all five rows show the unavailable state", `got ${unavailableCount}`);

  const bodyText = await page.locator("body").innerText();
  assert(!/\b18\.0{2,}\b/.test(bodyText), "no synthetic 18.0x rate rendered");
  assert(!/\b4[,.]?000\.0{2,}\b/.test(bodyText), "no synthetic 4000.0x rate rendered");

  // No mid-market anywhere: the board publishes the Payve Rate only, and the worked example
  // measures fee drag against that rate, never against a benchmark we don't publish.
  assert(!/mid-?market/i.test(bodyText), "page never shows a mid-market rate");
  // bps is used ONLY for the worked example's fee drag — never as a per-pair spread column.
  const boardHeaders = await page.locator("thead th").allInnerTexts();
  assert(
    boardHeaders.length === 3 && !/bps/i.test(boardHeaders.join(" ")),
    "rate board is pair/rate/change with no bps column",
    JSON.stringify(boardHeaders),
  );

  // ---------------------------------------------------------- A12: forbidden copy
  console.log("\nA12 — forbidden content");
  assert(!/SWIFT fee/i.test(bodyText), 'page never labels charges "SWIFT fee"');
  assert(
    !/banks?\s+(?:typically\s+)?(?:charge|add|mark\s*up)[^.]{0,40}\d(?:\.\d+)?\s*%/i.test(bodyText),
    "page publishes no bank FX spread percentage",
  );
  assert(
    !/per\s+(?:intermediary|hop|correspondent)/i.test(bodyText),
    "page publishes no per-hop correspondent fee figure",
  );

  // -------------------------------------- sticky header over the dark band
  /**
   * The header is sticky and the market band is dark. If the header has no opaque
   * background, dark-ink nav text sits on a dark-green band and becomes illegible.
   * That is exactly what shipped once: `bg-paper/90` compiled to NO rule, because the
   * design tokens are plain `var(--paper)` strings and Tailwind cannot alpha-modify them.
   * Assert a real, opaque background so it cannot regress.
   */
  console.log("\nSticky header contrast");
  const headerBg = await page
    .locator("header")
    .first()
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  const alpha = (() => {
    const m = /rgba?\(([^)]+)\)/.exec(headerBg || "");
    if (!m) return 0;
    const parts = m[1].split(",").map((s) => Number(s.trim()));
    return parts.length < 4 ? 1 : parts[3];
  })();
  assert(alpha >= 0.95, "sticky header has an opaque background", `${headerBg} (alpha ${alpha})`);

  // ------------------------------------------------- worked example ($10,000)
  console.log("\nWorked example — fee drag in bps");
  assert((await page.locator("[data-example]").count()) > 0, "worked example renders");
  assert(
    (await page.locator("[data-example-card='wire']").count()) === 1 &&
      (await page.locator("[data-example-card='payve']").count()) === 1,
    "both comparison cards render",
  );

  /**
   * The arithmetic, independently recomputed here rather than trusted from the component:
   * buyer outlays 10,000 + 35 = 10,035; supplier is credited 10,000 − 35 = 9,965.
   * drag = (1 − 9965/10035) × 10,000 = 69.75 bps → 70 rounded.
   * This is rate-independent, so it holds even with the upstream unavailable.
   */
  const expectedDrag = Math.round((1 - 9965 / 10035) * 10_000);
  assert(expectedDrag === 70, "expected fee drag is 70 bps", String(expectedDrag));

  const wireBps = (await page.locator("[data-example-bps='wire']").innerText()).trim();
  const payveBps = (await page.locator("[data-example-bps='payve']").innerText()).trim();
  assert(new RegExp(`\\b${expectedDrag}\\b`).test(wireBps), `wire card shows ${expectedDrag} bps`, wireBps);
  assert(/\b0\b/.test(payveBps), "Payve card shows 0 bps", payveBps);
  assert(/bps/i.test(wireBps) && /bps/i.test(payveBps), "fee drag is expressed in bps");

  assert(bodyText.includes("$10,035"), "wire path shows buyer paying $10,035");
  assert(bodyText.includes("$9,965"), "wire path shows $9,965 reaching the supplier");
  assert(bodyText.includes("$10,000"), "Payve path shows $10,000 both sides");
  assert(/Illustrative/i.test(bodyText), "example is labelled illustrative");

  // The calculator was deliberately removed — its controls must be gone, not orphaned.
  assert(
    (await page.locator("[data-calc-corridor], [data-calc-wires]").count()) === 0,
    "the old wire-fee calculator is fully removed",
  );

  // ---------------------------------------------------------- A11: responsive
  console.log("\nA11 — responsive");
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(200);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    assert(overflow <= 1, `no horizontal overflow at ${width}px`, `overflow ${overflow}px`);
  }

  // -------------------------------------------------- A8: registration
  console.log("\nA8 — nav / footer / sitemap registration");
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  // The Products dropdown mounts its items only once opened (click-toggle, not CSS hover),
  // so drive the real interaction rather than asserting against a closed menu.
  await page.locator("header button", { hasText: "Products" }).first().click();
  await page.waitForTimeout(150);
  const headerLinks = await page.locator("header a[href='/rates']").count();
  assert(headerLinks > 0, "site header nav links to /rates (Products menu)");
  const footerLinks = await page.locator("footer a[href='/rates']").count();
  assert(footerLinks > 0, "site footer links to /rates");

  const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
  const sitemapXml = await sitemapRes.text();
  assert(sitemapXml.includes("/rates"), "sitemap.xml includes /rates");

  // The page must be indexable — unlike the hidden value-model slug, /rates is meant to rank.
  const ratesHead = await fetch(`${BASE}/rates`);
  const robotsTag = ratesHead.headers.get("x-robots-tag");
  assert(
    !robotsTag || !/noindex/i.test(robotsTag),
    "/rates carries no noindex X-Robots-Tag",
    String(robotsTag),
  );

  // ------------------------------------------- substantiation coverage
  console.log("\nSubstantiation");
  let doc = "";
  try {
    doc = readFileSync("docs/rates-page-substantiation.md", "utf8");
  } catch {
    assert(false, "docs/rates-page-substantiation.md exists");
  }
  if (doc) {
    assert(/https?:\/\//.test(doc), "substantiation doc cites source URLs");
    // The only externally-sourced figures now on the page are the two $35 wire fees in the
    // worked example. Both must trace to the doc.
    assert(doc.includes("$35"), "the $35 wire-fee assumption is documented");
    assert(
      /median \$42\.50/i.test(doc),
      "the outgoing-fee range and median are documented",
    );
    assert(
      /HSBC M.xico|17\.00|USD 17/.test(doc),
      "the receiving-side basis is documented",
    );
  }

} catch (err) {
  console.error(`\n[verify-rates] threw: ${err && err.message}`);
  failures.push(`exception: ${err && err.message}`);
} finally {
  if (browser) await browser.close().catch(() => {});
  if (process.argv.indexOf("--keep") < 0) await shutdown();
}

console.log(`\n[verify-rates] ${checks.filter((c) => c.ok).length}/${checks.length} checks passed`);
if (failures.length) {
  console.error(`[verify-rates] FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("[verify-rates] PASS");
process.exit(0);
