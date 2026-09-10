#!/usr/bin/env node
/**
 * Database-backed verification of the rate-history endpoint.
 *
 * The other two gate scripts run without a database on purpose, so the windowing, the
 * reconstruction maths and the downsample cap would otherwise ship having never executed
 * against real rows — the same gap that `verify-rates-live.mjs` exists to close for the
 * live-rate branch.
 *
 * OPT-IN, because CI cannot assume a Postgres. Set HISTORY_TEST_DATABASE_URL and it runs;
 * leave it unset and it prints SKIP and exits 0, so it is safe in the `verify:rates` chain.
 *
 *   docker run -d --name rates-pg -e POSTGRES_PASSWORD=x -e POSTGRES_DB=rates -p 5439:5432 postgres:16-alpine
 *   HISTORY_TEST_DATABASE_URL=postgres://postgres:x@localhost:5439/rates node scripts/verify-rates-history.mjs
 *
 * The fixture is SYNTHETIC and deliberately shaped: a known ramp, so an off-by-one in the
 * window boundary or a downsample that drops the last point is visible as a wrong number
 * rather than as a plausible-looking chart.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import pg from "pg";

const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return (i >= 0 && process.argv[i + 1]) || dflt;
};
const PORT = Number(arg("--port", "3181"));
const STUB_PORT = Number(arg("--stub-port", "3191"));
const BASE = `http://localhost:${PORT}`;
const DB = process.env.HISTORY_TEST_DATABASE_URL;

if (!DB) {
  console.log(
    "\n[verify-rates-history] SKIP — set HISTORY_TEST_DATABASE_URL to run the database-backed" +
      " history checks (see the header of this file for a one-line docker command)",
  );
  process.exit(0);
}

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

const client = new pg.Client({ connectionString: DB });

/** MXN daily closes: a clean ramp from 17.00, one point per day for 5 years. */
const DAILY_DAYS = 1826;
const DAILY_BASE = 17.0;
const DAILY_STEP = 0.001;
/** MXN intraday: 5-minute buckets over the last 8 days, so 1D and 1W both have real data. */
const INTRADAY_DAYS = 8;
const INTRADAY_BUCKET_MS = 5 * 60_000;

async function seed() {
  // Wipe the WHOLE table, not just the corridors we are about to write. A previous
  // `backfill:history` run against the same database left ~1,800 real BRL rows behind, and the
  // "a corridor with no rows reports empty" check passed against that residue instead of
  // against an empty corridor. HISTORY_TEST_DATABASE_URL must therefore point at a throwaway
  // database - which is what the docker one-liner in the header creates.
  await client.query("delete from fx_rate_snapshot");

  const dailyValues = [];
  for (let i = DAILY_DAYS; i >= 0; i--) {
    const at = new Date(Date.now() - i * 86_400_000);
    const bucket = new Date(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()));
    const mid = DAILY_BASE + (DAILY_DAYS - i) * DAILY_STEP;
    dailyValues.push([bucket, mid]);
  }
  for (const [bucket, mid] of dailyValues) {
    await client.query(
      `insert into fx_rate_snapshot
         (currency_pair, bucket_at, granularity, mid_rate, source)
       values ('usd_to_mxn', $1, 'daily', $2, 'ecb')
       on conflict (currency_pair, bucket_at, granularity) do update set mid_rate = excluded.mid_rate`,
      [bucket, mid],
    );
  }

  // COP: a flat daily series at a level far from what the stub quotes, so the anchor guard
  // has something to refuse.
  for (let i = 400; i >= 0; i--) {
    const at = new Date(Date.now() - i * 86_400_000);
    const bucket = new Date(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()));
    await client.query(
      `insert into fx_rate_snapshot (currency_pair, bucket_at, granularity, mid_rate, source)
       values ('usd_to_cop', $1, 'daily', 4000, 'banrep')
       on conflict (currency_pair, bucket_at, granularity) do update set mid_rate = excluded.mid_rate`,
      [bucket],
    );
  }

  let intraday = 0;
  const now = Date.now();
  const first = now - INTRADAY_DAYS * 86_400_000;
  for (let t = Math.floor(first / INTRADAY_BUCKET_MS) * INTRADAY_BUCKET_MS; t <= now; t += INTRADAY_BUCKET_MS) {
    const mid = 17.5 + ((t - first) / 86_400_000) * 0.01;
    await client.query(
      `insert into fx_rate_snapshot
         (currency_pair, bucket_at, granularity, mid_rate, bridge_sell_rate, bridge_buy_rate, source)
       values ('usd_to_mxn', $1, 'intraday', $2, $3, $4, 'bridge')
       on conflict (currency_pair, bucket_at, granularity) do update set mid_rate = excluded.mid_rate`,
      [new Date(t), mid, mid * 0.999, mid * 1.001],
    );
    intraday++;
  }
  return { daily: dailyValues.length, intraday };
}

/**
 * A minimal Bridge stub, so the ANCHORING path actually executes.
 *
 * MXN is quoted close to where the seeded daily ramp ends, so the anchor ratio lands in band
 * and the series is level-matched. COP is quoted far from its seeded level on purpose, so the
 * out-of-band guard trips and that series is served unanchored. One pass exercises both
 * branches, with no cache wait between them.
 */
const STUB_RATES = {
  mxn: { midmarket_rate: "18.9500", sell_rate: "18.9310", buy_rate: "18.9690" },
  cop: { midmarket_rate: "3100.00", sell_rate: "3084.50", buy_rate: "3115.50" },
  eur: { midmarket_rate: "0.9231", sell_rate: "0.9217", buy_rate: "0.9245" },
  brl: { midmarket_rate: "5.4120", sell_rate: "5.4012", buy_rate: "5.4228" },
  gbp: { midmarket_rate: "0.7844", sell_rate: "0.7825", buy_rate: "0.7863" },
};
const stub = createServer((req, res) => {
  const u = new URL(req.url, `http://localhost:${STUB_PORT}`);
  if (!u.pathname.startsWith("/v0/exchange_rates")) return void res.writeHead(404).end("{}");
  const body = STUB_RATES[(u.searchParams.get("to") || "").toLowerCase()];
  if (!body) return void res.writeHead(400).end("{}");
  res
    .writeHead(200, { "Content-Type": "application/json" })
    .end(JSON.stringify({ ...body, updated_at: new Date().toISOString() }));
});
await new Promise((r) => stub.listen(STUB_PORT, r));

async function portIsBusy() {
  try {
    await fetch(BASE, { method: "HEAD", signal: AbortSignal.timeout(1500) });
    return true;
  } catch {
    return false;
  }
}

let server;
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
  // `next start` spawns a child of its own; killing the wrapper alone leaves the port bound.
  for (let i = 0; i < 20; i++) {
    if (!(await portIsBusy())) return;
    await new Promise((r) => setTimeout(r, 250));
  }
}

try {
  await client.connect();

  // The migrations must already be applied. Fail loudly rather than testing an absent table.
  const { rows: t } = await client.query(
    "select to_regclass('public.fx_rate_snapshot') is not null as present",
  );
  if (!t[0]?.present) {
    console.error("[verify-rates-history] fx_rate_snapshot missing — run scripts/migrate.mjs first");
    process.exit(1);
  }

  const seeded = await seed();
  console.log(`\n[verify-rates-history] seeded ${seeded.daily} daily + ${seeded.intraday} intraday`);

  if (await portIsBusy()) {
    console.error(`[verify-rates-history] port ${PORT} already serving — refusing a stale build`);
    process.exit(1);
  }

  server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      DATABASE_URL: DB,
      BRIDGE_API_KEY: "stub-key-not-a-real-credential",
      BRIDGE_BASE_URL: `http://localhost:${STUB_PORT}`,
      BRIDGE_ENVIRONMENT: "production",
      // Capture would otherwise start on boot (it needs only a database, a key, and
      // production) and write intraday rows for all five corridors, then hit the REAL ECB and
      // Banrep APIs on its first tick - polluting the fixture and making this gate depend on
      // the internet. It is why the empty-corridor check once passed against residue.
      RATES_CAPTURE_DISABLED: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
  });
  let log = "";
  server.stdout.on("data", (d) => (log += d.toString()));
  server.stderr.on("data", (d) => (log += d.toString()));

  const deadline = Date.now() + 90_000;
  let up = false;
  while (Date.now() < deadline) {
    if (await portIsBusy()) {
      up = true;
      break;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  if (!up) {
    console.error("[verify-rates-history] server did not start:\n" + log.slice(-2000));
    await shutdown();
    process.exit(1);
  }

  console.log("\nHistory windows");
  const seen = {};
  for (const w of ["1D", "1W", "1M", "6M", "1Y", "5Y"]) {
    const r = await fetch(`${BASE}/api/rates/history?pair=usd_to_mxn&window=${w}`);
    const j = await r.json();
    seen[w] = j;
    assert(r.ok && j.available === true, `${w} returns an available series`, String(r.status));
    assert(j.points.length > 1, `${w} has more than one point`, String(j.points?.length));
    // 300 from the downsample, plus at most one appended live point on an anchored series.
    assert(j.points.length <= 301, `${w} is downsampled to at most 300 points`, String(j.points.length));
    const ts = j.points.map((p) => p.t);
    assert(
      ts.every((v, i) => i === 0 || v > ts[i - 1]),
      `${w} points are strictly increasing in time`,
    );
    assert(
      j.points.every((p) => Number.isFinite(p.sell) && p.sell > 0),
      `${w} every point carries a positive sell rate`,
    );
    // Only the sell side may cross the wire — see lib/history.ts.
    assert(
      j.points.every((p) => p.buy === undefined && p.mid === undefined),
      `${w} publishes no buy or mid side`,
    );
  }

  console.log("\nWindow boundaries and grain");
  // 1D reads our own 5-minute captures; 1Y reads daily closes. If the granularity routing were
  // wrong, both would silently return the same series and every tab would look identical.
  assert(
    seen["1D"].points.every((p) => p.source === "bridge"),
    "1D is served from first-party bridge captures",
  );
  // Every point except the appended live one comes from the daily source. If the granularity
  // routing were wrong, 1D and 1Y would silently return the same series and every tab would
  // look identical.
  assert(
    seen["1Y"].points.slice(0, -1).every((p) => p.source === "ecb"),
    "1Y is served from official daily closes",
  );
  const span = (j) => j.points[j.points.length - 1].t - j.points[0].t;
  assert(span(seen["1D"]) <= 26 * 3_600_000, "1D spans about a day", String(span(seen["1D"])));
  assert(span(seen["1W"]) > 3 * 86_400_000, "1W spans more than three days");
  assert(span(seen["5Y"]) > 4 * 365 * 86_400_000, "5Y spans more than four years");
  assert(span(seen["5Y"]) > span(seen["1Y"]), "5Y spans strictly more than 1Y");
  assert(span(seen["1Y"]) > span(seen["1M"]), "1Y spans strictly more than 1M");

  console.log("\nChange, reconstruction and spread");
  // The daily fixture is a rising ramp, so the change must be positive and non-null.
  assert(seen["1Y"].changeAbs > 0, "a rising series reports a positive absolute change");
  assert(seen["1Y"].changePct > 0, "a rising series reports a positive percentage change");
  const first = seen["1Y"].points[0].sell;
  const last = seen["1Y"].points[seen["1Y"].points.length - 1].sell;
  assert(
    Math.abs(seen["1Y"].changeAbs - (last - first)) < 1e-9,
    "changeAbs is last minus first of the published points",
  );
  assert(
    Math.abs(seen["1Y"].changePct - ((last - first) / first) * 100) < 1e-9,
    "changePct is derived from the same two points",
  );
  assert(seen["1Y"].reconstructedBefore != null, "a daily-sourced window is flagged reconstructed");
  assert(seen["1D"].reconstructedBefore == null, "a bridge-sourced window is not flagged reconstructed");
  assert(seen["1D"].spreadBps === 16, "MXN history renders at the seeded 16 bps", String(seen["1D"].spreadBps));


  console.log("\nAnchoring a reconstructed series to the live rate");
  // The public daily sources disagree with Bridge about the LEVEL of the market by more than a
  // day of movement, so an unanchored daily chart would end well away from the headline number.
  const live = await (await fetch(`${BASE}/api/rates`)).json();
  const liveMxn = live.rates.find((r) => r.code === "MXN");
  assert(liveMxn?.live === true, "the stub is serving a live MXN rate");

  const y = seen["1Y"];
  assert(y.anchorRatio !== 1, "a reconstructed window is anchored", String(y.anchorRatio));
  assert(y.anchorRatio > 0.8 && y.anchorRatio < 1.2, "the anchor ratio is in band", String(y.anchorRatio));
  const lastPoint = y.points[y.points.length - 1];
  assert(
    Math.abs(lastPoint.sell - liveMxn.sell) < 1e-9,
    "the anchored series ENDS at exactly the live published rate",
    `${lastPoint.sell} vs ${liveMxn.sell}`,
  );
  assert(lastPoint.source === "bridge", "the appended final point is a real observation");
  assert(seen["1D"].anchorRatio === 1, "an intraday window is never anchored", String(seen["1D"].anchorRatio));

  console.log("\nAnchor guard");
  // COP is seeded flat at 4000 while the stub quotes ~3100 - a ratio near 0.77. That is not a
  // source disagreement, it is a bug, and a 23%-rescaled history would be worse than an
  // unadjusted one.
  const copY = await (await fetch(`${BASE}/api/rates/history?pair=usd_to_cop&window=1Y`)).json();
  assert(copY.available === true, "COP has a series to test the guard against");
  assert(copY.anchorRatio === 1, "an out-of-band anchor ratio is refused", String(copY.anchorRatio));

  // The published rate must sit below the mid it came from. Asserted on COP, the one series
  // whose anchor is refused and which is therefore unanchored - on an anchored series the
  // points are indexed to a live quote from a DIFFERENT source, so comparing them to the
  // stored daily mid compares two measurements and proves nothing.
  const { rows: copMid } = await client.query(
    `select mid_rate::float8 as mid from fx_rate_snapshot
      where currency_pair='usd_to_cop' and granularity='daily' order by bucket_at desc limit 1`,
  );
  const copLast = copY.points[copY.points.length - 1];
  assert(
    copLast.sell < copMid[0].mid,
    "an unanchored reconstructed point sits below the mid it came from",
    `${copLast.sell} vs ${copMid[0].mid}`,
  );

  console.log("\nEmpty corridor");
  // GBP is seeded with nothing, and capture is disabled for this run, so it stays empty. This
  // asserts the honest-empty path rather than borrowing another corridor's series.
  const gbp = await (await fetch(`${BASE}/api/rates/history?pair=usd_to_gbp&window=1Y`)).json();
  assert(gbp.available === false && gbp.points.length === 0, "a corridor with no rows reports empty");
  assert(gbp.changeAbs === null, "an empty corridor reports no change rather than zero");
} catch (err) {
  console.error(`\n[verify-rates-history] threw: ${err && err.message}`);
  failures.push(`exception: ${err && err.message}`);
} finally {
  if (server) await shutdown();
  stub.close();
  await client.end().catch(() => {});
}

console.log(`\n[verify-rates-history] ${passed}/${passed + failures.length} checks passed`);
if (failures.length) {
  console.error("[verify-rates-history] FAILED:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("[verify-rates-history] PASS");
