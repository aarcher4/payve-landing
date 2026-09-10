#!/usr/bin/env node
/**
 * One-time 5-year daily backfill for the rate chart.
 *
 * Bridge has no history endpoint, so the long windows (1M through 5Y) are built from official
 * daily closes: ECB reference rates via Frankfurter for MXN/EUR/GBP/BRL, and Banco de la
 * República's TRM for COP, which the ECB does not publish.
 *
 * Safe to re-run: every write is an upsert on (currency_pair, bucket_at, granularity), so a
 * second run corrects rows rather than duplicating them. Fetches in yearly chunks because a
 * single 5-year Frankfurter request is a large response and a slow one.
 *
 *   DATABASE_URL=... node scripts/backfill-history.mjs [--years 5]
 *
 * This is a JS mirror of the TypeScript source fetchers in lib/history.ts. The duplication is
 * deliberate: a standalone ops script that needs a TypeScript loader to run is a script that
 * will not run on the day it is needed.
 */
import pg from "pg";

const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return (i >= 0 && process.argv[i + 1]) || dflt;
};
const YEARS = Number(arg("--years", "5"));

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[backfill] DATABASE_URL is required");
  process.exit(1);
}

const FRANKFURTER = { usd_to_mxn: "MXN", usd_to_eur: "EUR", usd_to_gbp: "GBP", usd_to_brl: "BRL" };
const day = (offsetDays = 0) =>
  new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);

/** Carry the previous close forward across days a source does not publish. */
function fillForward(byDay, start, end) {
  const out = new Map();
  let last = null;
  for (let d = new Date(`${start}T00:00:00Z`); ; d = new Date(d.getTime() + 86_400_000)) {
    const key = d.toISOString().slice(0, 10);
    if (byDay.has(key)) last = byDay.get(key);
    // Emit nothing before the first real observation: a chart must not open on a flat
    // invented run-in.
    if (last != null) out.set(key, last);
    if (key >= end) break;
  }
  return out;
}

async function frankfurter(start, end) {
  const symbols = Object.values(FRANKFURTER).join(",");
  const res = await fetch(
    `https://api.frankfurter.dev/v1/${start}..${end}?base=USD&symbols=${symbols}`,
    { signal: AbortSignal.timeout(60_000) },
  );
  if (!res.ok) throw new Error(`frankfurter ${res.status}`);
  const body = await res.json();
  const out = new Map(Object.keys(FRANKFURTER).map((p) => [p, new Map()]));
  for (const [d, byCode] of Object.entries(body.rates ?? {})) {
    for (const [pair, code] of Object.entries(FRANKFURTER)) {
      const v = byCode[code];
      if (typeof v === "number" && Number.isFinite(v) && v > 0) out.get(pair).set(d, v);
    }
  }
  return out;
}

async function banrep(start, end) {
  const res = await fetch(
    `https://www.datos.gov.co/resource/32sa-8pi3.json` +
      `?$where=vigenciadesde >= '${start}T00:00:00' and vigenciadesde <= '${end}T23:59:59'` +
      `&$order=vigenciadesde ASC&$limit=50000`,
    { signal: AbortSignal.timeout(90_000) },
  );
  if (!res.ok) throw new Error(`banrep ${res.status}`);
  const out = new Map();
  for (const row of await res.json()) {
    const value = Number.parseFloat(String(row.valor ?? ""));
    if (!Number.isFinite(value) || value <= 0) continue;
    const from = String(row.vigenciadesde ?? "").slice(0, 10);
    const to = String(row.vigenciahasta ?? from).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) continue;
    // The TRM carries a validity RANGE that already spans weekends and holidays, so expanding
    // it is the correct read of the source rather than a gap-fill guess.
    for (let d = new Date(`${from}T00:00:00Z`); ; d = new Date(d.getTime() + 86_400_000)) {
      const key = d.toISOString().slice(0, 10);
      out.set(key, value);
      if (key >= to || out.size > 40_000) break;
    }
  }
  return out;
}

const client = new pg.Client({
  connectionString: url,
  ssl: /sslmode=require/.test(url) ? { rejectUnauthorized: false } : undefined,
});

let written = 0;
async function upsert(pair, d, mid, source) {
  await client.query(
    `insert into fx_rate_snapshot
       (currency_pair, bucket_at, granularity, mid_rate, bridge_sell_rate, bridge_buy_rate,
        source, captured_at)
     values ($1, $2, 'daily', $3, null, null, $4, now())
     on conflict (currency_pair, bucket_at, granularity) do update
        set mid_rate = excluded.mid_rate, source = excluded.source, captured_at = now()`,
    [pair, new Date(`${d}T00:00:00Z`), mid, source],
  );
  written++;
}

try {
  await client.connect();
  const end = day(0);

  for (let y = YEARS; y >= 1; y--) {
    const chunkStart = day(-365 * y);
    const chunkEnd = y === 1 ? end : day(-365 * (y - 1));
    process.stdout.write(`[backfill] ${chunkStart} .. ${chunkEnd} `);

    try {
      const byPair = await frankfurter(chunkStart, chunkEnd);
      for (const [pair, byDay] of byPair) {
        for (const [d, mid] of fillForward(byDay, chunkStart, chunkEnd)) {
          await upsert(pair, d, mid, "ecb");
        }
      }
      process.stdout.write("ecb:ok ");
    } catch (err) {
      process.stdout.write(`ecb:FAILED(${err.message}) `);
    }

    try {
      const trm = await banrep(chunkStart, chunkEnd);
      for (const [d, mid] of fillForward(trm, chunkStart, chunkEnd)) {
        await upsert("usd_to_cop", d, mid, "banrep");
      }
      process.stdout.write("banrep:ok");
    } catch (err) {
      process.stdout.write(`banrep:FAILED(${err.message})`);
    }
    process.stdout.write("\n");
  }

  const { rows } = await client.query(
    `select currency_pair, count(*)::int as points,
            min(bucket_at)::date as first_day, max(bucket_at)::date as last_day
       from fx_rate_snapshot where granularity = 'daily'
      group by currency_pair order by currency_pair`,
  );
  console.log(`\n[backfill] ${written} upserts`);
  for (const r of rows) {
    console.log(`  ${r.currency_pair}: ${r.points} points, ${r.first_day} .. ${r.last_day}`);
  }
  if (rows.length < 5) {
    console.error(`[backfill] expected 5 corridors, got ${rows.length}`);
    process.exitCode = 1;
  }
} catch (err) {
  console.error("[backfill] failed:", err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
