#!/usr/bin/env node
/**
 * Objective acceptance gate for the /rates page (goal-loop A7, A9–A12).
 *
 * Boots the PRODUCTION build with BRIDGE_API_KEY deliberately UNSET, so the whole
 * run exercises the degraded path — the state that must never leak a fabricated
 * rate. Live-rate correctness is asserted by its sibling, scripts/verify-rates-live.mjs,
 * which drives a local Bridge stub; real Bridge is never contacted by either script.
 *
 * Assertions ACCUMULATE — the run reports every failure, then exits non-zero at the end.
 * Only a thrown error short-circuits, which is why locator assertions must check presence
 * before evaluating (a bare .evaluate() on an absent element burns a 30s timeout, throws,
 * and silently skips every assertion below it). Never soften an assertion to get a green —
 * fix the page.
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

  // ------------------------------------------------- history API, no database
  /**
   * With no DATABASE_URL there is no series, and that is a legitimate visible state rather
   * than an error — a corridor whose capture has not started yet has no 1D points either.
   * The endpoint must therefore answer 200 with a well-formed empty series, and must still
   * reject nonsense parameters. A 500 here would take the whole dashboard down with it.
   */
  console.log("\nHistory API — no database configured");
  for (const w of ["1D", "1W", "1M", "6M", "1Y", "5Y"]) {
    const r = await fetch(`${BASE}/api/rates/history?pair=usd_to_mxn&window=${w}`);
    const j = await r.json().catch(() => null);
    assert(
      r.ok && j && j.available === false && Array.isArray(j.points) && j.points.length === 0,
      `history ${w} returns a well-formed empty series`,
      `status ${r.status} ${JSON.stringify(j)?.slice(0, 120)}`,
    );
  }
  const badPair = await fetch(`${BASE}/api/rates/history?pair=usd_to_jpy&window=1D`);
  assert(badPair.status === 400, "history rejects an unknown pair", String(badPair.status));
  const badWindow = await fetch(`${BASE}/api/rates/history?pair=usd_to_mxn&window=10Y`);
  assert(badWindow.status === 400, "history rejects an unknown window", String(badWindow.status));
  // A change figure with no data would render a confident "unchanged" on an empty chart.
  const emptyBody = await (await fetch(`${BASE}/api/rates/history?pair=usd_to_cop&window=1M`)).json();
  assert(
    emptyBody.changeAbs === null && emptyBody.changePct === null,
    "an empty series reports no change rather than zero",
    JSON.stringify({ abs: emptyBody.changeAbs, pct: emptyBody.changePct }),
  );

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

  // -------------------------------------- floating chrome over the dark band
  /**
   * The market band is dark. Anything sticky or fixed floating over it must be opaque:
   * translucent chrome puts dark ink on a dark-green band and becomes illegible. That is
   * exactly what shipped once — `bg-paper/90` compiled to NO rule at all, because the design
   * tokens are plain `var(--paper)` strings and Tailwind cannot alpha-modify them.
   *
   * The guard is written against the CONDITION, not against a specific element. Commit
   * cf8c527 reverted the site to a one-pager and stopped mounting SiteHeader/SiteFooter, so
   * /rates currently carries no floating chrome at all and the failure cannot occur. Asserting
   * `locator("header")` unconditionally made this block THROW on a 30s timeout, which aborted
   * the run and silently skipped every assertion below it — the gate reported 17 checks
   * instead of 37 and never reached the live-path stage. Enumerate what actually floats, and
   * assert each one is opaque. Zero floating elements passes vacuously and correctly; the
   * moment chrome returns, every piece of it is checked.
   */
  console.log("\nFloating chrome contrast");
  const floating = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((el) => {
        const p = getComputedStyle(el).position;
        return p === "sticky" || p === "fixed";
      })
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        bg: getComputedStyle(el).backgroundColor,
      })),
  );
  const alphaOf = (color) => {
    const m = /rgba?\(([^)]+)\)/.exec(color || "");
    if (!m) return 0;
    const parts = m[1].split(",").map((s) => Number(s.trim()));
    return parts.length < 4 ? 1 : parts[3];
  };
  const translucent = floating.filter((f) => alphaOf(f.bg) < 0.95);
  assert(
    translucent.length === 0,
    `floating chrome over the dark band is opaque (${floating.length} sticky/fixed element(s))`,
    translucent.map((f) => `${f.tag} ${f.bg}`).join(", "),
  );

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

  // -------------------------------------------------- A8: discoverability
  /**
   * This block used to drive the marketing header's Products dropdown and assert a
   * footer link. Commit cf8c527 reverted the site to a one-pager and stopped mounting
   * SiteHeader/SiteFooter, so there is no nav or footer DOM on any route to assert
   * against — those assertions could only ever fail from that commit onward.
   *
   * The INTENT is unchanged and still enforced: /rates must be discoverable and
   * indexable. With chrome unmounted, that rests on three things, all asserted here —
   * the nav config that will drive chrome whenever it is remounted, the sitemap, and
   * the absence of a noindex header. If SiteHeader returns, the config assertion is
   * what keeps its /rates entry from being dropped.
   */
  console.log("\nA8 — discoverability");
  await page.setViewportSize({ width: 1440, height: 960 });

  const navConfig = readFileSync("app/components/site/config.ts", "utf8");
  assert(/["']\/rates["']/.test(navConfig), "nav config still registers /rates");

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
