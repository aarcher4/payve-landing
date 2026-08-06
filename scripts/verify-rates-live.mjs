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
const FIXTURE = {
  mxn: { midmarket_rate: "18.4210", sell_rate: "18.4026", buy_rate: "18.4394" }, // ~10 bps
  eur: { midmarket_rate: "0.9231", sell_rate: "0.9217", buy_rate: "0.9245" }, // ~15 bps
  cop: { midmarket_rate: "4021.55", sell_rate: "4001.44", buy_rate: "4041.66" }, // ~50 bps
  brl: { midmarket_rate: "5.4120", sell_rate: "5.4012", buy_rate: "5.4228" }, // ~20 bps
  gbp: { midmarket_rate: "0.7844", sell_rate: "0.7825", buy_rate: "0.7863" }, // ~24 bps
};

let sawApiKeyHeader = false;
const stub = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${STUB_PORT}`);
  if (!url.pathname.startsWith("/v0/exchange_rates")) {
    res.writeHead(404).end("{}");
    return;
  }
  if (req.headers["api-key"]) sawApiKeyHeader = true;
  const to = (url.searchParams.get("to") || "").toLowerCase();
  const body = FIXTURE[to];
  if (!body) {
    res.writeHead(400).end("{}");
    return;
  }
  res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(body));
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
    const sell = Number.parseFloat(fx.sell_rate);
    const expectedPayve = sell * (1 - SPREAD_BPS / 10_000);
    const expectedBps = (1 - expectedPayve / mid) * 10_000;

    assert(Math.abs(row.mid - mid) < 1e-9, `${up} mid passed through unchanged`, String(row.mid));
    assert(
      Math.abs(row.payveRate - expectedPayve) < 1e-9,
      `${up} payveRate = sell × (1 − ${SPREAD_BPS}bps)`,
      `${row.payveRate} vs ${expectedPayve}`,
    );
    assert(
      Math.abs(row.allInBps - expectedBps) < 1e-6,
      `${up} allInBps = Bridge spread + Payve spread`,
      `${row.allInBps} vs ${expectedBps}`,
    );
    // Sanity: the supplier must never be quoted a rate better than mid.
    assert(row.payveRate < mid, `${up} Payve Rate sits below mid-market`);
  }

  // A partial upstream payload must degrade, not half-render.
  assert(
    rows.every((r) => r.mid != null && r.payveRate != null && r.allInBps != null),
    "live rows carry all three figures",
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
