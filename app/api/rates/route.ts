/**
 * Public FX rate feed for /rates — the ONLY server-side surface that talks to Bridge.
 *
 * Why a route handler and not a client fetch: a Bridge API key grants full account access. It
 * stays server-side, is never NEXT_PUBLIC_-prefixed, and never reaches the browser.
 *
 * What crosses the wire to the browser is deliberately narrow:
 *   { code, buy, sell, payveRate, spreadBps, asOf, live }
 * Bridge's own `sell_rate` / `buy_rate` and the mid-market rate are NEVER returned. They are
 * computed here to gate freshness and sanity, but publishing them beside ours would disclose
 * Payve's cost basis and per-corridor margin. The rate math lives in `lib/rates-math.ts`; the
 * two-sided orientation is DERIVED from mid rather than assumed, so no live probe is needed
 * to get the buy side right.
 *
 * `payveRate` is retained as an alias of `sell` so the existing rate board keeps rendering
 * while the dashboard is built. It is the same number, not a second opinion.
 *
 * The spread is now DATA, per corridor, read from `fx_spread_config` (see `lib/spread.ts`).
 * With no `DATABASE_URL` configured it comes from `PAYVE_PUBLIC_SPREAD_BPS`, exactly as
 * before — so local dev, previews, and the currently-deployed service are unaffected.
 *
 * Degraded behaviour is load-bearing: on any failure a row comes back `live: false` with NULL
 * rates. There is deliberately no fallback constant here. The payments app carries synthetic
 * constants (MXN 18.0 / COP 4000.0) so a real withdrawal degrades to a sane estimate rather
 * than failing, but a public page showing a made-up rate as if it were live is a different
 * and unacceptable thing.
 *
 * Bridge offers NO quote and NO rate lock; these are estimates, and the page says so.
 */

import {
  CURRENCIES,
  isPublishable,
  pairFor,
  parseRate,
  publishedPair,
  type BridgeTriple,
  type CurrencyCode,
} from "@/lib/rates-math";
import { defaultSpreadBps, resolveSpreads } from "@/lib/spread";

export interface PublicRate {
  code: CurrencyCode;
  /** What a customer pays per 1 USDc to buy USDc. Null when unavailable. */
  buy: number | null;
  /** What a customer receives per 1 USDc when selling USDc. Null when unavailable. */
  sell: number | null;
  /** Alias of `sell`, kept so the existing board renders unchanged. Same number. */
  payveRate: number | null;
  /** The Payve markup actually applied to this corridor, in bps. */
  spreadBps: number | null;
  /** ISO timestamp the rate was fetched. Not a quote lock. */
  asOf: string;
  live: boolean;
}

/**
 * A 200 from Bridge is NOT sufficient to publish a rate. Two guards, both learned the hard way
 * from probing the sandbox with a real key:
 *
 *  1. Bridge's SANDBOX serves frozen fixtures — USD/MXN at 20.00025 with an `updated_at` of
 *     2026-04-24, and a flat synthetic 50 bps spread on every pair instead of the real
 *     per-corridor contract spread. Without a guard, a public page pointed at sandbox renders
 *     "Live · read at 00:41" above a months-old invented number. Only production rates are
 *     ever publishable.
 *  2. Even in production, a frozen upstream must not be presented as live. Bridge refreshes
 *     roughly every 30s, so anything older than MAX_RATE_AGE_MS is treated as no rate at all.
 *
 * Both failures degrade to `live: false`. Showing nothing is always better than showing a
 * number a customer could price a shipment against.
 */
const MAX_RATE_AGE_MS = 10 * 60_000;

function isPublishableEnvironment(): boolean {
  return process.env.BRIDGE_ENVIRONMENT === "production";
}

function isFresh(updatedAt: unknown): boolean {
  if (updatedAt == null) return true; // field absent — fall back to the environment guard alone
  const t = Date.parse(String(updatedAt));
  if (!Number.isFinite(t)) return false;
  return Date.now() - t <= MAX_RATE_AGE_MS;
}

function bridgeBaseUrl(): string {
  return (
    process.env.BRIDGE_BASE_URL ??
    (process.env.BRIDGE_ENVIRONMENT === "production"
      ? "https://api.bridge.xyz"
      : "https://api.sandbox.bridge.xyz")
  );
}

/**
 * Module-scope cache, 30s TTL — matches Bridge's ~30s refresh. This also bounds upstream load:
 * however much public traffic the page takes, Bridge sees at most ~2 calls/min/currency.
 *
 * The cache holds Bridge's RAW TRIPLE, not the derived published rates. Caching the derived
 * numbers would mean a spread change in settings took up to 30 seconds to appear, and worse,
 * that two corridors could briefly publish under different spreads. The triple is upstream
 * data with an upstream refresh cadence; the spread is ours and applies immediately.
 */
const CACHE_TTL_MS = 30_000;
interface CacheEntry {
  triple: BridgeTriple;
  fetchedAt: number;
}
const cache = new Map<CurrencyCode, CacheEntry>();

function unavailable(code: CurrencyCode, spreadBps: number | null): PublicRate {
  return {
    code,
    buy: null,
    sell: null,
    payveRate: null,
    spreadBps,
    asOf: new Date().toISOString(),
    live: false,
  };
}

/** Fetch Bridge's raw triple for one corridor, or null on any failure. */
async function fetchTriple(code: CurrencyCode, apiKey: string): Promise<BridgeTriple | null> {
  const now = Date.now();
  const hit = cache.get(code);
  if (hit && now - hit.fetchedAt < CACHE_TTL_MS) return hit.triple;

  const url = `${bridgeBaseUrl()}/v0/exchange_rates?from=usd&to=${code.toLowerCase()}`;
  try {
    const res = await fetch(url, {
      headers: { "Api-Key": apiKey, Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!res.ok) return null;

    const body = (await res.json()) as Record<string, unknown>;
    const mid = parseRate(body.midmarket_rate);
    const sell = parseRate(body.sell_rate);
    const buy = parseRate(body.buy_rate);
    // All three are required. `mid` is the sanity reference and the orientation reference;
    // partial data is not a rate.
    if (mid == null || sell == null || buy == null) return null;
    // A stale upstream must never be dressed up as "live" — see MAX_RATE_AGE_MS.
    if (!isFresh(body.updated_at)) return null;

    const triple: BridgeTriple = { mid, buy, sell };
    cache.set(code, { triple, fetchedAt: now });
    return triple;
  } catch {
    // Network error, timeout, malformed JSON — all degrade to unavailable. Never a constant.
    return null;
  }
}

export async function GET() {
  const apiKey = process.env.BRIDGE_API_KEY;

  // Spreads first: a corridor whose spread we cannot establish must publish nothing, whether
  // or not Bridge answers. See lib/spread.ts for why an unreachable database does NOT silently
  // fall back to the env var.
  const spreads = await resolveSpreads();

  // No key configured (local dev, preview, misconfigured deploy) → every row unavailable.
  // Not production → also every row unavailable, because sandbox serves frozen fixtures that
  // must never be published. Both are correct visible states, not errors.
  const publishable = Boolean(apiKey) && isPublishableEnvironment();

  const rates: PublicRate[] = await Promise.all(
    CURRENCIES.map(async (code) => {
      const spreadBps = spreads[pairFor(code)]?.bps ?? null;
      if (!publishable || spreadBps == null) return unavailable(code, spreadBps);

      const triple = await fetchTriple(code, apiKey as string);
      if (!triple) return unavailable(code, spreadBps);

      const published = publishedPair(triple, spreadBps);
      // Sanity gate, computed but never published: sell must sit below mid and buy above it.
      // If that inverts, the upstream is wrong and we show nothing.
      if (!isPublishable(triple, published)) return unavailable(code, spreadBps);

      return {
        code,
        buy: published.buy,
        sell: published.sell,
        payveRate: published.sell,
        spreadBps,
        asOf: new Date().toISOString(),
        live: true,
      };
    }),
  );

  return Response.json(
    {
      rates,
      // Retained for the existing board. It is the DEFAULT markup, not necessarily the one
      // applied to any given corridor — read `spreadBps` on each row for that.
      spreadBps: defaultSpreadBps(),
      asOf: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=30" } },
  );
}

/** Rates change every ~30s; a statically-rendered response would be wrong immediately. */
export const dynamic = "force-dynamic";
