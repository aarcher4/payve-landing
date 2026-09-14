/**
 * Background capture: the only thing that gives this site a rate history.
 *
 * Started once from `instrumentation.ts` when the server boots. Three jobs on one timer:
 *
 *   every 5 min  — record Bridge's quote per corridor (drives the 1D and 1W tabs)
 *   every 6 h    — pull the last few official daily closes (keeps 1M–5Y current)
 *   every 24 h   — prune intraday past its retention
 *
 * WHY IN-PROCESS AND NOT A CRON SERVICE. The service runs a single instance on a plan that
 * does not sleep, so a timer is sufficient and costs nothing extra. The correctness does not
 * depend on that being true, though: every write is an upsert on its time bucket, so a tick
 * that fires twice during a deploy overlap writes the same bucket twice and the second write
 * is a correction, not a duplicate. If capture ever needs to survive instance churn properly,
 * this becomes a Render cron hitting an authenticated endpoint and nothing else changes.
 *
 * WHY 6 HOURS FOR A DAILY JOB. A 24h interval pins the run to whenever the process last
 * restarted, so a deploy at 23:50 means the daily sync happens at 23:50 forever. A shorter
 * interval that re-fetches a small overlapping window is self-healing instead.
 */
import { fetchBridgeTriple, isPublishableEnvironment } from "./bridge";
import { getPool, hasDatabase } from "./db";
import {
  CURRENCY_PAIRS,
  bucketFor,
  fetchBanrepTrm,
  fetchFrankfurter,
  fillForward,
  pruneIntraday,
  writeSnapshots,
  type SnapshotRow,
} from "./history";
import { codeFor, pairFor, type CurrencyPair } from "./rates-math";

const INTRADAY_INTERVAL_MS = 5 * 60_000;
const DAILY_SYNC_INTERVAL_MS = 6 * 60 * 60_000;
const PRUNE_INTERVAL_MS = 24 * 60 * 60_000;
/** Re-pull a few days each time so a missed run heals itself instead of leaving a hole. */
const DAILY_SYNC_LOOKBACK_DAYS = 7;

let started = false;
let lastDailySync = 0;
let lastPrune = 0;
/** In-process re-entry guard: a slow pass must not overlap the next tick. */
let inFlight = false;

function day(offsetDays = 0): string {
  return new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);
}

export function captureEnabled(): boolean {
  // A kill switch, and the only way a test can boot the app with a database, a key and a
  // production environment without capture immediately writing rows and calling the real ECB
  // and Banrep APIs on its first tick.
  if (process.env.RATES_CAPTURE_DISABLED === "1") return false;
  // An explicit opt-in exists for local verification against a stub. Without it, capture only
  // runs where the rates are real: sandbox fixtures are months old and would poison the series
  // with invented history that looks first-party.
  if (process.env.RATES_CAPTURE_FORCE === "1") return hasDatabase();
  return hasDatabase() && Boolean(process.env.BRIDGE_API_KEY) && isPublishableEnvironment();
}

export async function captureIntradayOnce(): Promise<number> {
  const apiKey = process.env.BRIDGE_API_KEY;
  if (!apiKey) return 0;
  const at = bucketFor(new Date(), "intraday");
  const rows: SnapshotRow[] = [];
  for (const pair of CURRENCY_PAIRS) {
    const triple = await fetchBridgeTriple(codeFor(pair), apiKey);
    // A corridor Bridge could not answer for is simply not written. A gap in the series is
    // honest; a carried-forward point pretending to be an observation is not.
    if (!triple) continue;
    rows.push({
      currency_pair: pair,
      bucket_at: at,
      granularity: "intraday",
      mid_rate: triple.mid,
      bridge_sell_rate: triple.sell,
      bridge_buy_rate: triple.buy,
      source: "bridge",
    });
  }
  return writeSnapshots(rows);
}

export async function syncDailyOnce(
  start = day(-DAILY_SYNC_LOOKBACK_DAYS),
  end = day(0),
): Promise<number> {
  const rows: SnapshotRow[] = [];

  try {
    const byPair = await fetchFrankfurter(start, end);
    for (const [pair, byDay] of byPair) {
      for (const [d, mid] of fillForward(byDay, start, end)) {
        rows.push({
          currency_pair: pair,
          bucket_at: new Date(`${d}T00:00:00Z`),
          granularity: "daily",
          mid_rate: mid,
          bridge_sell_rate: null,
          bridge_buy_rate: null,
          source: "ecb",
        });
      }
    }
  } catch (err) {
    console.error("[capture] frankfurter:", err instanceof Error ? err.message : String(err));
  }

  // Colombia is a separate source because the ECB does not publish COP. Isolated in its own
  // try so a Banrep outage cannot cost the other four corridors their daily sync.
  try {
    const trm = await fetchBanrepTrm(start, end);
    for (const [d, mid] of fillForward(trm, start, end)) {
      rows.push({
        currency_pair: "usd_to_cop" as CurrencyPair,
        bucket_at: new Date(`${d}T00:00:00Z`),
        granularity: "daily",
        mid_rate: mid,
        bridge_sell_rate: null,
        bridge_buy_rate: null,
        source: "banrep",
      });
    }
  } catch (err) {
    console.error("[capture] banrep:", err instanceof Error ? err.message : String(err));
  }

  return writeSnapshots(rows);
}

/**
 * Load five years of daily closes the first time a corridor has none.
 *
 * This replaces what was going to be a human step ("run npm run backfill:history against the
 * database"), and it exists because that step is not actually runnable in the normal case:
 * Render keeps a managed Postgres internal-only by default (`ipAllowList: []`), so a laptop
 * cannot reach it without opening the database to the public internet first. Doing the backfill
 * from inside the service needs no such hole, and it means any fresh deployment — a new
 * environment, a restored database, a corridor added later — populates itself.
 *
 * Idempotent and cheap to re-enter: it only fires for corridors below the threshold, and every
 * write is an upsert on its bucket. The threshold is well under five years' worth so a few
 * missing days never trigger a full reload; that is what the 6-hourly sync is for.
 */
const BACKFILL_YEARS = 5;
const BACKFILL_MIN_DAILY_ROWS = 365;
let backfillChecked = false;

export async function ensureHistoryBackfilled(): Promise<number> {
  if (backfillChecked) return 0;
  backfillChecked = true;

  const pool = getPool();
  if (!pool) return 0;

  let missing: CurrencyPair[] = [];
  try {
    const { rows } = await pool.query<{ currency_pair: CurrencyPair; n: string }>(
      `select currency_pair, count(*)::text as n
         from fx_rate_snapshot where granularity = 'daily'
        group by currency_pair`,
    );
    const counts = new Map(rows.map((r) => [r.currency_pair, Number(r.n)]));
    missing = CURRENCY_PAIRS.filter((p) => (counts.get(p) ?? 0) < BACKFILL_MIN_DAILY_ROWS);
  } catch (err) {
    // Let the next boot try again rather than treating a transient read as "nothing to do".
    backfillChecked = false;
    console.error("[capture] backfill check failed:", err instanceof Error ? err.message : String(err));
    return 0;
  }

  if (missing.length === 0) return 0;
  console.log(`[capture] backfilling ${BACKFILL_YEARS}y of daily history for: ${missing.join(", ")}`);

  let written = 0;
  // Yearly chunks: a single five-year request to Frankfurter is a large, slow response, and a
  // failure part-way through then costs the whole load rather than one year of it.
  for (let y = BACKFILL_YEARS; y >= 1; y--) {
    const start = day(-365 * y);
    const end = y === 1 ? day(0) : day(-365 * (y - 1));
    written += await syncDailyOnce(start, end);
  }
  console.log(`[capture] backfill wrote ${written} row(s)`);
  return written;
}

async function tick(): Promise<void> {
  if (inFlight) return;
  inFlight = true;
  try {
    const n = await captureIntradayOnce();
    if (n > 0) console.log(`[capture] intraday: ${n} corridor(s) recorded`);

    // Before the routine 7-day sync, make sure the long windows have something to draw.
    await ensureHistoryBackfilled();

    const now = Date.now();
    if (now - lastDailySync >= DAILY_SYNC_INTERVAL_MS) {
      lastDailySync = now;
      const d = await syncDailyOnce();
      console.log(`[capture] daily sync: ${d} row(s)`);
    }
    if (now - lastPrune >= PRUNE_INTERVAL_MS) {
      lastPrune = now;
      const p = await pruneIntraday();
      if (p > 0) console.log(`[capture] pruned ${p} intraday row(s)`);
    }
  } catch (err) {
    // One bad pass must never take the timer down with it.
    console.error("[capture] tick failed:", err instanceof Error ? err.message : String(err));
  } finally {
    inFlight = false;
  }
}

export function startRateCapture(): void {
  if (started) return;
  if (!captureEnabled()) {
    console.log("[capture] disabled (needs DATABASE_URL, a Bridge key, and production)");
    return;
  }
  started = true;
  console.log("[capture] starting: intraday every 5m, daily sync every 6h");
  // Fire once immediately so a redeploy does not leave a 5-minute hole at the head of the
  // series, then settle into the interval.
  void tick();
  const timer = setInterval(() => void tick(), INTRADAY_INTERVAL_MS);
  // Do not hold the event loop open on shutdown.
  timer.unref?.();
}

export { pairFor };
