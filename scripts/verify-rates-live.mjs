#!/usr/bin/env node
/**
 * Live-path verification for /api/rates, WITHOUT a Bridge credential.
 *
 * The degraded path is covered by verify-rates.mjs. This covers the branch that only runs
 * when a key IS configured — the rate math, the response shape, and the guarantee that
 * Bridge's own sell/buy rates never leak. Without this, the live branch would ship having
 * never once executed.
 *
 * Method: stand up a local stub that speaks Bridge's /v0/exchange_rates contract, point
 * BRIDGE_BASE_URL at it, and hand the app a dummy key. Real Bridge is never contacted.
 * (Bridge's sandbox 503s on this endpoint, so a sandbox key would not help either.)
 *
 * The fixture is Bridge's documented shape: decimal STRINGS, and a sell_rate below mid.
 *
 *   node scripts/verify-rates-live.mjs [--port 3179] [--stub-port 3189]
 */
import { spawn } from "node:child_process";
import { createServer } from "node:http";

const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return (i >= 0 && process.argv[i + 1]) || dflt;
};
const PORT = Number(arg("--port", "3179"));
const STUB_PORT = Number(arg("--stub-port", "3189"));
const BASE = `http://localhost:${PORT}`;
const SPREAD_BPS = 20;

const failures = [];
let passed = 0;
function assert(ok, label, detail = "") {
  if (ok) {
    passed++;
    console.log(`  ok   ${label}`);
  } else {
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
    failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/**
 * Fixture rates. Chosen so each corridor has a DIFFERENT implied Bridge spread, which means
 * a hardcoded expected output cannot accidentally satisfy all five.
 */
const fresh = () => new Date().toISOString();
const FIXTURE = {
  mxn: { midmarket_rate: "18.4210", sell_rate: "18.4026", buy_rate: "18.4394" }, // ~10 bps
  eur: { midmarket_rate: "0.9231", sell_rate: "0.9217", buy_rate: "0.9245" }, // ~15 bps
  cop: { midmarket_rate: "4021.55", sell_rate: "4001.44", buy_rate: "4041.66" }, // ~50 bps
  brl: { midmarket_rate: "5.4120", sell_rate: "5.4012", buy_rate: "5.4228" }, // ~20 bps
  gbp: { midmarket_rate: "0.7844", sell_rate: "0.7825", buy_rate: "0.7863" }, // ~24 bps
};

/**
 * Stale variant, modelled on what Bridge's SANDBOX actually returns: a well-formed 200 whose
 * `updated_at` is months old. Probing sandbox with a real key showed USD/MXN at 20.00025
 * stamped 2026-04-24. Publishing that as "live" is the exact failure this page must not have,
 * so the second pass below asserts every such row degrades to unavailable.
 */
const STALE_UPDATED_AT = "2026-04-24T23:24:05.421Z";

/**
 * Inverted variant: a fresh, well-formed 200 whose quote is nonsense — both sides sit ABOVE
 * mid, so no honest two-sided quote can be derived from it. This is the only thing that
 * exercises the sanity gate (`isPublishable`), the guard standing between a broken upstream
 * and a fabricated rate on a public page. Without this pass the guard would ship having never
 * once executed.
 */
const INVERTED = {
  mxn: { midmarket_rate: "18.4210", sell_rate: "18.9000", buy_rate: "19.1000" },
  eur: { midmarket_rate: "0.9231", sell_rate: "0.9500", buy_rate: "0.9600" },
  cop: { midmarket_rate: "4021.55", sell_rate: "4200.00", buy_rate: "4300.00" },
  brl: { midmarket_rate: "5.4120", sell_rate: "5.6000", buy_rate: "5.7000" },
  gbp: { midmarket_rate: "0.7844", sell_rate: "0.8000", buy_rate: "0.8100" },
};

let sawApiKeyHeader = false;
let serveStale = false;
let serveInverted = false;
const stub = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${STUB_PORT}`);
  if (!url.pathname.startsWith("/v0/exchange_rates")) {
    res.writeHead(404).end("{}");
    return;
  }
  if (req.headers["api-key"]) sawApiKeyHeader = true;
  const to = (url.searchParams.get("to") || "").toLowerCase();
  const body = serveInverted ? INVERTED[to] : FIXTURE[to];
  if (!body) {
    res.writeHead(400).end("{}");
    return;
  }
  const payload = { ...body, updated_at: serveStale ? STALE_UPDATED_AT : fresh() };
  res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(payload));
});
await new Promise((r) => stub.listen(STUB_PORT, r));
console.log(`\n[verify-rates-live] Bridge stub on :${STUB_PORT}`);

async function portIsBusy(port) {
  try {
    await fetch(`http://localhost:${port}`, { method: "HEAD", signal: AbortSignal.timeout(1500) });
    return true;
  } catch {
    return false;
  }
}
if (await portIsBusy(PORT)) {
  console.error(`[verify-rates-live] port ${PORT} already serving — refusing to test a stale build`);
  stub.close();
  process.exit(1);
}

const childEnv = {
  ...process.env,
  NODE_ENV: "production",
  BRIDGE_API_KEY: "stub-key-not-a-real-credential",
  BRIDGE_BASE_URL: `http://localhost:${STUB_PORT}`,
  // The route only publishes in production — sandbox serves frozen fixtures. The stub is
  // standing in for production Bridge, so it must present as such.
  BRIDGE_ENVIRONMENT: "production",
  PAYVE_PUBLIC_SPREAD_BPS: String(SPREAD_BPS),
};
const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  env: childEnv,
  stdio: ["ignore", "pipe", "pipe"],
  shell: process.platform === "win32",
});
let log = "";
server.stdout.on("data", (d) => (log += d.toString()));
server.stderr.on("data", (d) => (log += d.toString()));

async function shutdown() {
  try {
    if (process.platform === "win32") {
      const k = spawn("taskkill", ["/pid", String(server.pid), "/f", "/t"], { stdio: "ignore" });
      await new Promise((r) => k.on("exit", r));
    } else {
      server.kill("SIGTERM");
    }
  } catch {
    /* gone */
  }
  for (let i = 0; i < 20; i++) {
    if (!(await portIsBusy(PORT))) return;
    await new Promise((r) => setTimeout(r, 250));
  }
}

try {
  const deadline = Date.now() + 90_000;
  let up = false;
  while (Date.now() < deadline) {
    if (await portIsBusy(PORT)) {
      up = true;
      break;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  if (!up) {
    console.error("[verify-rates-live] server did not start:\n" + log.slice(-2000));
    await shutdown();
    stub.close();
    process.exit(1);
  }

  console.log("\nLive path (stubbed Bridge)");
  const res = await fetch(`${BASE}/api/rates`);
  const text = await res.text();
  assert(res.ok, "GET /api/rates 2xx", String(res.status));

  const body = JSON.parse(text);
  const rows = body.rates ?? [];
  assert(rows.length === 5, "five rows returned", String(rows.length));
  assert(
    rows.every((r) => r.live === true),
    "every row is live:true when the upstream answers",
  );
  assert(sawApiKeyHeader, "the app sent an Api-Key header upstream");
  assert(
    !/sell_?[Rr]ate|buy_?[Rr]ate/.test(text),
    "Bridge sell_rate/buy_rate never reach the client",
  );
  // Margin non-disclosure: mid and the all-in spread gate freshness/sanity server-side but
  // must never be published — together they reveal Payve's per-corridor margin.
  assert(!/"mid"|midmarket|allInBps/.test(text), "mid-market and all-in bps never published");
  // The two-sided payload adds `buy`/`sell` keys, which the sell_rate/buy_rate ban above does
  // not cover. Assert the Bridge-side field names and any bridge_-prefixed mirror stay out.
  assert(!/bridge_?[SsBb](ell|uy)/.test(text), "no bridge_sell / bridge_buy mirror is published");
  // The mid-market VALUES themselves must not appear, under any key name. This catches a leak
  // that renames the field rather than removing it.
  const midValues = Object.values(FIXTURE).map((f) => f.midmarket_rate);
  assert(
    midValues.every((v) => !text.includes(v)),
    "no mid-market value appears in the payload under any key",
    midValues.filter((v) => text.includes(v)).join(", "),
  );
  assert(body.spreadBps === SPREAD_BPS, "published spread echoes PAYVE_PUBLIC_SPREAD_BPS", String(body.spreadBps));

  // The core money math, checked per corridor against independently-computed expectations.
  for (const [code, fx] of Object.entries(FIXTURE)) {
    const up = code.toUpperCase();
    const row = rows.find((r) => r.code === up);
    if (!row) {
      assert(false, `${up} row present`);
      continue;
    }
    const mid = Number.parseFloat(fx.midmarket_rate);
    // Orientation is DERIVED, not assumed: the side below mid is the sell side, the side
    // above it is the buy side. Recompute that here independently of the app rather than
    // reading fx.sell_rate/fx.buy_rate by name, so the test proves the derivation instead
    // of sharing the app's assumption about which field is which.
    const below = Math.min(Number.parseFloat(fx.sell_rate), Number.parseFloat(fx.buy_rate));
    const above = Math.max(Number.parseFloat(fx.sell_rate), Number.parseFloat(fx.buy_rate));
    const expectedSell = below * (1 - SPREAD_BPS / 10_000);
    const expectedBuy = above * (1 + SPREAD_BPS / 10_000);

    assert(
      Math.abs(row.payveRate - expectedSell) < 1e-9,
      `${up} payveRate = sell × (1 − ${SPREAD_BPS}bps)`,
      `${row.payveRate} vs ${expectedSell}`,
    );
    assert(
      Math.abs(row.sell - expectedSell) < 1e-9,
      `${up} sell = below-mid side × (1 − ${SPREAD_BPS}bps)`,
      `${row.sell} vs ${expectedSell}`,
    );
    assert(
      Math.abs(row.buy - expectedBuy) < 1e-9,
      `${up} buy = above-mid side × (1 + ${SPREAD_BPS}bps)`,
      `${row.buy} vs ${expectedBuy}`,
    );
    // payveRate is an ALIAS of sell, not a second opinion. If these ever diverge the board
    // and the hero would show two different numbers for the same thing.
    assert(row.payveRate === row.sell, `${up} payveRate is exactly the sell side`);
    // The two-sided sanity gate, asserted from outside: sell below mid, buy above it.
    assert(row.sell < mid, `${up} sell sits below mid-market`);
    assert(row.buy > mid, `${up} buy sits above mid-market`);
    // Per-corridor spread is published so the page can label the quote. With no database
    // configured every corridor resolves to PAYVE_PUBLIC_SPREAD_BPS.
    assert(
      row.spreadBps === SPREAD_BPS,
      `${up} row carries the applied spread`,
      String(row.spreadBps),
    );
  }

  assert(
    rows.every((r) => r.payveRate != null),
    "every live row carries a rate",
  );

  // ---------------------------------------------------------------- stale guard
  // Flip the stub to Bridge-sandbox behaviour: a well-formed 200 with a months-old
  // `updated_at`. Every row must degrade to unavailable rather than render as "live".
  console.log("\nStale upstream (sandbox-shaped 200 with an old updated_at)");
  serveStale = true;
  // Wait out the route's 30s cache so this is a fresh upstream read, not a replay.
  await new Promise((r) => setTimeout(r, 31_000));
  const staleRes = await fetch(`${BASE}/api/rates`);
  const staleText = await staleRes.text();
  const staleRows = JSON.parse(staleText).rates ?? [];
  assert(staleRes.ok, "GET /api/rates still 2xx with a stale upstream");
  assert(
    staleRows.length === 5 && staleRows.every((r) => r.live === false),
    "every stale row degrades to live:false",
    JSON.stringify(staleRows.map((r) => `${r.code}:${r.live}`)),
  );
  assert(
    staleRows.every((r) => r.payveRate == null),
    "no stale rate values are emitted",
  );
  assert(
    !staleText.includes("20.00025") && !staleText.includes("18.4210"),
    "stale fixture values never reach the client",
  );

  // ------------------------------------------------------------- sanity gate
  // A FRESH, well-formed 200 carrying a nonsense quote: both sides above mid, so no honest
  // two-sided quote exists. This is the only pass that exercises isPublishable() — the guard
  // between a broken upstream and a fabricated rate on a public page.
  console.log("\nInverted upstream (fresh 200, both sides above mid)");
  serveStale = false;
  serveInverted = true;
  await new Promise((r) => setTimeout(r, 31_000));
  const invRes = await fetch(`${BASE}/api/rates`);
  const invText = await invRes.text();
  const invRows = JSON.parse(invText).rates ?? [];
  assert(invRes.ok, "GET /api/rates still 2xx with an inverted upstream");
  assert(
    invRows.length === 5 && invRows.every((r) => r.live === false),
    "every corridor with an unpublishable quote degrades to live:false",
    JSON.stringify(invRows.map((r) => `${r.code}:${r.live}`)),
  );
  assert(
    invRows.every((r) => r.buy == null && r.sell == null && r.payveRate == null),
    "no rate values are emitted from an inverted quote",
  );
  assert(
    Object.values(INVERTED).every((f) => !invText.includes(f.sell_rate)),
    "inverted fixture values never reach the client",
  );
  // The spread is still known even when the rate is not — the corridor is unavailable because
  // the UPSTREAM is wrong, not because the configuration is missing.
  assert(
    invRows.every((r) => r.spreadBps === SPREAD_BPS),
    "an unavailable corridor still reports its configured spread",
  );
} catch (err) {
  console.error(`\n[verify-rates-live] threw: ${err && err.message}`);
  failures.push(`exception: ${err && err.message}`);
} finally {
  await shutdown();
  stub.close();
}

console.log(`\n[verify-rates-live] ${passed}/${passed + failures.length} checks passed`);
if (failures.length) {
  console.error("[verify-rates-live] FAILED:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("[verify-rates-live] PASS");
process.exit(0);
