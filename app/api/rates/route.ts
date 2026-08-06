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
  /** Unspread mid-market rate (1 USD → destination units). Null when unavailable. */
  mid: number | null;
  /** All-in rate a supplier receives = Bridge sell rate haircut by the Payve spread. */
  payveRate: number | null;
  /** Total cost vs mid-market in basis points (Bridge's contract spread + Payve's). */
  allInBps: number | null;
  /** ISO timestamp the rate was fetched. Not a quote lock. */
  asOf: string;
  live: boolean;
}

/** Payve's published spread over Bridge's sell rate, in bps. */
function spreadBps(): number {
  const raw = Number(process.env.PAYVE_PUBLIC_SPREAD_BPS);
  return Number.isFinite(raw) && raw >= 0 ? raw : 20;
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
  return { code, mid: null, payveRate: null, allInBps: null, asOf: new Date().toISOString(), live: false };
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
    // Both are required: without mid we cannot state the all-in cost honestly, and
    // without sell we have no rate to publish. Partial data is treated as unavailable.
    if (mid == null || sell == null) return unavailable(code);

    const payveRate = sell * (1 - spreadBps() / 10_000);
    const rate: PublicRate = {
      code,
      mid,
      payveRate,
      allInBps: (1 - payveRate / mid) * 10_000,
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
  // This is the correct visible state, not an error.
  const rates: PublicRate[] = apiKey
    ? await Promise.all(CURRENCIES.map((c) => fetchRate(c, apiKey)))
    : CURRENCIES.map(unavailable);

  return Response.json(
    { rates, spreadBps: spreadBps(), asOf: new Date().toISOString() },
    { headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=30" } },
  );
}

/** Rates change every ~30s; a statically-rendered response would be wrong immediately. */
export const dynamic = "force-dynamic";
