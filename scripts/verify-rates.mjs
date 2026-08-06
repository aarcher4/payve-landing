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
      rows.every((r) => r.mid == null && r.payveRate == null),
      "no rate values are emitted when unavailable",
    );
    // A1: Bridge's own rates must never cross the wire.
    assert(
      !/sell_?[Rr]ate|buy_?[Rr]ate/.test(apiText),
      "API never exposes Bridge sell_rate/buy_rate",
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

  // ----------------------------------------------------------- A10: calculator
  console.log("\nA10 — calculator arithmetic");
  async function calc({ corridor, wires, avg }) {
    await page.selectOption("[data-calc-corridor]", corridor);
    await page.fill("[data-calc-wires]", String(wires));
    if (avg != null) await page.fill("[data-calc-avg]", String(avg));
    await page.waitForTimeout(120);
    const read = async (sel) => (await page.locator(sel).innerText()).trim();
    return {
      buyer: await read("[data-calc-buyer]"),
      supplier: await read("[data-calc-supplier]"),
      total: await read("[data-calc-total]"),
      annual: await read("[data-calc-annual]"),
      pct: (await page.locator("[data-calc-pct]").count()) ? await read("[data-calc-pct]") : "",
    };
  }

  const mx = await calc({ corridor: "MX", wires: 10 });
  assert(/\$350\b/.test(mx.buyer), "MX 10 wires → buyer $350", mx.buyer);
  assert(/\$350\b/.test(mx.supplier), "MX 10 wires → supplier $350", mx.supplier);
  assert(/\$700\b/.test(mx.total), "MX 10 wires → combined $700", mx.total);
  assert(/\$8,400\b/.test(mx.annual), "MX 10 wires → $8,400/yr", mx.annual);

  const eu = await calc({ corridor: "EU", wires: 10 });
  assert(/\$350\b/.test(eu.buyer), "EU 10 wires → buyer $350", eu.buyer);
  assert(/\$0\b/.test(eu.supplier), "EU 10 wires → supplier $0", eu.supplier);

  const pctCase = await calc({ corridor: "MX", wires: 10, avg: 500 });
  assert(/\b14(\.0)?%/.test(pctCase.pct), "MX at $500 avg payment → fee reads 14%", pctCase.pct);

  // A6 — footnote must be present and match the plan's wording.
  const FOOTNOTE_ANCHORS = [
    "Potential saving vs. bank average",
    "median $42.50",
    "not independently validated",
    "Illustrative of savings that could be achieved; not guaranteed",
    "borne by different parties",
  ];
  for (const anchor of FOOTNOTE_ANCHORS) {
    assert(bodyText.includes(anchor), `footnote contains: "${anchor}"`);
  }

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

  // ------------------------------------------- A7: substantiation coverage
  console.log("\nA7 — substantiation");
  let doc = "";
  try {
    doc = readFileSync("docs/rates-page-substantiation.md", "utf8");
  } catch {
    assert(false, "docs/rates-page-substantiation.md exists");
  }
  if (doc) {
    assert(/https?:\/\//.test(doc), "substantiation doc cites source URLs");

    /**
     * Scope: the [data-substantiated] region — the corridor assumptions and the footnote.
     * Those are the CLAIMED figures, and each must trace to the doc.
     *
     * Deliberately NOT the whole body: the results panel prints computed outputs ($350,
     * $8,400, …) that change with user input. Requiring those in a sourcing document would
     * be meaningless and would pressure someone into padding the doc with arithmetic.
     * A7's intent is "every published claim is sourced", not "every rendered number".
     */
    const region = page.locator("[data-substantiated]");
    assert((await region.count()) > 0, "[data-substantiated] region exists");
    const claimText = (await region.count()) ? await region.innerText() : "";
    const claimed = [
      ...new Set(
        [...claimText.matchAll(/\$(\d{1,3}(?:\.\d{2})?)\b/g)]
          .map((m) => m[1])
          .filter((v) => Number(v) > 0),
      ),
    ];
    assert(claimed.length > 0, "substantiated region actually states dollar figures");
    const undocumented = claimed.filter((v) => !doc.includes(`$${v}`));
    assert(
      undocumented.length === 0,
      "every claimed dollar figure appears in the substantiation doc",
      undocumented.join(", "),
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
