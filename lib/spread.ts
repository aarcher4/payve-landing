/**
 * Resolve the Payve markup, in basis points, for each corridor.
 *
 * Precedence:
 *   1. The newest `fx_spread_config` row for the pair with `effective_from <= now()`.
 *   2. `PAYVE_PUBLIC_SPREAD_BPS`, when no database is configured at all.
 *
 * The table is APPEND-ONLY and versioned — a re-price inserts a new row, it never UPDATEs.
 * That is what makes the change log on the settings screen trustworthy: the history is the
 * data, not a side-effect written beside it. Same doctrine as `bridge_fee_config` in the
 * payments app.
 *
 * DEGRADATION IS DELIBERATE AND ASYMMETRIC, because the two "no value" cases mean different
 * things:
 *
 *   - No `DATABASE_URL` at all → the env var IS the configured spread. Not a fallback, not a
 *     guess. Publish it.
 *   - `DATABASE_URL` set but the query fails → the configured spread is UNKNOWN. Falling back
 *     to the env var here would publish a rate nobody configured. Serve the last value we
 *     actually read, for a bounded grace period, and after that publish nothing.
 *
 * That second branch is the whole reason this file is not three lines. A stale-but-real spread
 * for a few minutes is defensible; an invented one never is.
 */
import { getPool, hasDatabase } from "./db";
import { CURRENCY_PAIRS, type CurrencyPair } from "./rates-math";

/** Matches Bridge's ~30s refresh and the rate cache in the route. */
const CACHE_TTL_MS = 30_000;
/** How long a last-known-good spread may outlive a database we can no longer reach. */
const STALE_GRACE_MS = 10 * 60_000;

const FALLBACK_SPREAD_BPS = 20;

export function defaultSpreadBps(): number {
  const raw = Number(process.env.PAYVE_PUBLIC_SPREAD_BPS);
  return Number.isInteger(raw) && raw >= 0 && raw <= 10_000 ? raw : FALLBACK_SPREAD_BPS;
}

interface Entry {
  bps: number;
  readAt: number;
}
const cache = new Map<CurrencyPair, Entry>();

/** Test seam — the verify scripts boot a fresh process, but unit tests do not. */
export function __resetSpreadCache(): void {
  cache.clear();
}

export interface SpreadResolution {
  bps: number | null;
  source: "database" | "env_default" | "stale_cache" | "unavailable";
}

async function readAllFromDb(): Promise<Map<CurrencyPair, number> | null> {
  const pool = getPool();
  if (!pool) return null;
  try {
    // distinct on picks the newest already-effective row per pair in one pass.
    const { rows } = await pool.query<{ currency_pair: CurrencyPair; payve_spread_bps: number }>(
      `select distinct on (currency_pair) currency_pair, payve_spread_bps
         from fx_spread_config
        where effective_from <= now()
        order by currency_pair, effective_from desc, id desc`,
    );
    const out = new Map<CurrencyPair, number>();
    for (const r of rows) out.set(r.currency_pair, Number(r.payve_spread_bps));
    return out;
  } catch (err) {
    console.error("[spread] read failed:", err instanceof Error ? err.message : String(err));
    return null;
  }
}

/**
 * Resolve every corridor at once. One query serves the whole board — resolving per corridor
 * would issue five round trips per request for data that changes a few times a year.
 */
export async function resolveSpreads(): Promise<Record<CurrencyPair, SpreadResolution>> {
  const now = Date.now();

  if (!hasDatabase()) {
    const bps = defaultSpreadBps();
    return Object.fromEntries(
      CURRENCY_PAIRS.map((p) => [p, { bps, source: "env_default" as const }]),
    ) as Record<CurrencyPair, SpreadResolution>;
  }

  const allFresh = CURRENCY_PAIRS.every((p) => {
    const hit = cache.get(p);
    return hit && now - hit.readAt < CACHE_TTL_MS;
  });
  if (allFresh) {
    return Object.fromEntries(
      CURRENCY_PAIRS.map((p) => [p, { bps: cache.get(p)!.bps, source: "database" as const }]),
    ) as Record<CurrencyPair, SpreadResolution>;
  }

  const fromDb = await readAllFromDb();
  if (fromDb) {
    for (const [pair, bps] of fromDb) cache.set(pair, { bps, readAt: now });
  }

  const out = {} as Record<CurrencyPair, SpreadResolution>;
  for (const pair of CURRENCY_PAIRS) {
    const dbValue = fromDb?.get(pair);
    if (dbValue != null) {
      out[pair] = { bps: dbValue, source: "database" };
      continue;
    }
    // Either the read failed, or the database has no row for this corridor yet.
    const hit = cache.get(pair);
    if (hit && now - hit.readAt < STALE_GRACE_MS) {
      out[pair] = { bps: hit.bps, source: "stale_cache" };
      continue;
    }
    out[pair] = { bps: null, source: "unavailable" };
  }
  return out;
}
