/**
 * Public FX rate feed for /rates — the ONLY server-side surface that talks to Bridge.
 *
 * Why a route handler and not a client fetch: a Bridge API key grants full account
 * access. It stays server-side, is never NEXT_PUBLIC_-prefixed, and never reaches the
 * browser.
 *
 * What crosses the wire to the browser is deliberately narrow:
 *   { code, mid, payveRate, allInBps, asOf, live }
 * Bridge's own `sell_rate` / `buy_rate` are NEVER returned — publishing them beside ours
 * would disclose Payve's cost basis and per-corridor margin.
 *
 * The rate math mirrors `effectiveRate()` in payve-fintech
 * (server/src/services/bridge/developerFees.ts):
 *
 *   payveRate = sell_rate × (1 − spreadBps / 10_000)
 *
 * `sell_rate` already contains Bridge's own contract spread, so the all-in cost a supplier
 * sees vs mid-market is Bridge's spread PLUS ours — which is what `allInBps` reports.
 *
 * Degraded behaviour is load-bearing: on any failure a row comes back `live: false` with
 * NULL rates. There is deliberately no fallback constant here. payve-fintech carries
 * synthetic constants (MXN 18.0 / COP 4000.0) so that a real withdrawal degrades to a sane
 * estimate rather than failing — but a marketing page showing a made-up rate as if it were
 * live is a different and unacceptable thing.
 *
 * Bridge offers NO quote and NO rate lock; these are estimates, and the page says so.
 */

/** Bridge's exchange-rate currency enum. USD is the anchor; USDB is 1:1 USD-pegged and not in the enum. */
const CURRENCIES = ["MXN", "EUR", "COP", "BRL", "GBP"] as const;
type CurrencyCode = (typeof CURRENCIES)[number];

export interface PublicRate {
  code: CurrencyCode;
  /**
   * The rate a supplier is paid at = Bridge's sell rate haircut by the Payve spread.
   * Null when unavailable.
   *
   * This is the ONLY rate that crosses the wire. The mid-market rate and the all-in spread
   * in bps are computed server-side (they gate freshness and sanity below) but are
   * deliberately NOT returned: together they disclose Payve's per-corridor margin, and the
   * page no longer displays them.
   */
  payveRate: number | null;
  /** ISO timestamp the rate was fetched. Not a quote lock. */
  asOf: string;
  live: boolean;
}

/** Payve's published spread over Bridge's sell rate, in bps. */
function spreadBps(): number {
  const raw = Number(process.env.PAYVE_PUBLIC_SPREAD_BPS);
  return Number.isFinite(raw) && raw >= 0 ? raw : 20;
}

/**
 * A 200 from Bridge is NOT sufficient to publish a rate. Two guards, both learned the hard
 * way from probing the sandbox with a real key:
 *
 *  1. Bridge's SANDBOX serves frozen fixtures — USD/MXN at 20.00025 with an `updated_at` of
 *     2026-04-24, and a flat synthetic 50 bps spread on every pair instead of the real
 *     per-corridor contract spread. Without a guard, a marketing page pointed at sandbox
 *     renders "Live · read at 00:41" above a months-old invented number. Only production
 *     rates are ever publishable.
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
 * Module-scope cache, 30s TTL — matches both Bridge's ~30s refresh cadence and
 * RATE_CACHE_TTL_MS in payve-fintech's feeConfig.ts. This also bounds upstream load:
 * however much public traffic the page takes, Bridge sees at most ~2 calls/min/currency.
 */
const CACHE_TTL_MS = 30_000;
interface CacheEntry {
  rate: PublicRate;
  fetchedAt: number;
}
const cache = new Map<CurrencyCode, CacheEntry>();

function unavailable(code: CurrencyCode): PublicRate {
  return { code, payveRate: null, asOf: new Date().toISOString(), live: false };
}

/** Bridge returns decimal STRINGS. A rate is a multiplier, not money, so parseFloat is correct. */
function parseRate(raw: unknown): number | null {
  const n = Number.parseFloat(String(raw ?? ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function fetchRate(code: CurrencyCode, apiKey: string): Promise<PublicRate> {
  const now = Date.now();
  const hit = cache.get(code);
  if (hit && now - hit.fetchedAt < CACHE_TTL_MS) return hit.rate;

  const url = `${bridgeBaseUrl()}/v0/exchange_rates?from=usd&to=${code.toLowerCase()}`;
  try {
    const res = await fetch(url, {
      headers: { "Api-Key": apiKey, Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!res.ok) return unavailable(code);

    const body = (await res.json()) as Record<string, unknown>;
    const mid = parseRate(body.midmarket_rate);
    const sell = parseRate(body.sell_rate);
    // Both are required even though only the derived Payve Rate is published: `sell` is the
    // rate itself, and `mid` is the sanity reference below. Partial data → unavailable.
    if (mid == null || sell == null) return unavailable(code);
    // A stale upstream must never be dressed up as "live" — see MAX_RATE_AGE_MS.
    if (!isFresh(body.updated_at)) return unavailable(code);

    const payveRate = sell * (1 - spreadBps() / 10_000);
    // Sanity gate, computed but never published: a supplier can never be quoted a rate at or
    // above mid-market. If that inverts, the upstream is wrong and we show nothing.
    if (!(payveRate < mid)) return unavailable(code);

    const rate: PublicRate = {
      code,
      payveRate,
      asOf: new Date(now).toISOString(),
      live: true,
    };
    cache.set(code, { rate, fetchedAt: now });
    return rate;
  } catch {
    // Network error, timeout, malformed JSON — all degrade to unavailable. Never a constant.
    return unavailable(code);
  }
}

export async function GET() {
  const apiKey = process.env.BRIDGE_API_KEY;

  // No key configured (local dev, preview, misconfigured deploy) → every row unavailable.
  // Not production → also every row unavailable, because sandbox serves frozen fixtures that
  // must never be published. Both are correct visible states, not errors.
  const publishable = Boolean(apiKey) && isPublishableEnvironment();
  const rates: PublicRate[] = publishable
    ? await Promise.all(CURRENCIES.map((c) => fetchRate(c, apiKey as string)))
    : CURRENCIES.map(unavailable);

  return Response.json(
    { rates, spreadBps: spreadBps(), asOf: new Date().toISOString() },
    { headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=30" } },
  );
}

/** Rates change every ~30s; a statically-rendered response would be wrong immediately. */
export const dynamic = "force-dynamic";
