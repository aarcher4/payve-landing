/**
 * The single place that speaks Bridge's /v0/exchange_rates contract.
 *
 * Extracted so the public route and the snapshot capture share one implementation of the
 * freshness and shape guards. They deliberately do NOT share a cache: the route caches for 30s
 * to bound upstream load under public traffic, while capture must record what Bridge actually
 * said at that moment. A capture reading through a cache would write the same quote into
 * several consecutive buckets and draw a staircase that never happened.
 */
import { parseRate, type BridgeTriple, type CurrencyCode } from "./rates-math";

/**
 * Bridge refreshes roughly every 30s. Anything older than this is treated as no rate at all —
 * a frozen upstream must never be presented as live. Bridge's SANDBOX in particular serves
 * well-formed 200s carrying fixtures months old.
 */
export const MAX_RATE_AGE_MS = 10 * 60_000;

export function isPublishableEnvironment(): boolean {
  return process.env.BRIDGE_ENVIRONMENT === "production";
}

export function bridgeBaseUrl(): string {
  return (
    process.env.BRIDGE_BASE_URL ??
    (process.env.BRIDGE_ENVIRONMENT === "production"
      ? "https://api.bridge.xyz"
      : "https://api.sandbox.bridge.xyz")
  );
}

export function isFresh(updatedAt: unknown): boolean {
  if (updatedAt == null) return true; // field absent — fall back to the environment guard alone
  const t = Date.parse(String(updatedAt));
  if (!Number.isFinite(t)) return false;
  return Date.now() - t <= MAX_RATE_AGE_MS;
}

/**
 * Shared 30s cache of Bridge's raw triple.
 *
 * Lives here rather than in the route because the history endpoint needs the live rate too
 * (to anchor a reconstructed series), and two independent caches would let the chart and the
 * hero disagree about what "now" is by up to 30 seconds.
 *
 * The CAPTURE path deliberately bypasses this and calls `fetchBridgeTriple` directly: reading
 * through a cache would write one quote into several consecutive 5-minute buckets and draw a
 * staircase that never happened.
 */
const CACHE_TTL_MS = 30_000;
const cache = new Map<CurrencyCode, { triple: BridgeTriple; fetchedAt: number }>();

export async function cachedBridgeTriple(
  code: CurrencyCode,
  apiKey: string,
): Promise<BridgeTriple | null> {
  const now = Date.now();
  const hit = cache.get(code);
  if (hit && now - hit.fetchedAt < CACHE_TTL_MS) return hit.triple;

  const triple = await fetchBridgeTriple(code, apiKey);
  if (triple) cache.set(code, { triple, fetchedAt: now });
  return triple;
}

/** Fetch Bridge's raw triple for one corridor. Null on any failure — never a constant. */
export async function fetchBridgeTriple(
  code: CurrencyCode,
  apiKey: string,
): Promise<BridgeTriple | null> {
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
    // All three are required. `mid` is both the sanity reference and the orientation
    // reference; partial data is not a rate.
    if (mid == null || sell == null || buy == null) return null;
    if (!isFresh(body.updated_at)) return null;

    return { mid, buy, sell };
  } catch {
    // Network error, timeout, malformed JSON — all degrade to unavailable.
    return null;
  }
}
