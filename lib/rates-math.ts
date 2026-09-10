/**
 * Two-sided published-rate math for /rates.
 *
 * The board used to publish one number per corridor. It now publishes a two-sided quote —
 * "Buy 1 USDc / Sell 1 USDc", the shape a customer recognises from a market screen. Both
 * sides are derived from OUR spread around Bridge's quote. Bridge's own rates and the
 * mid-market rate stay server-side: publishing them beside ours would disclose Payve's
 * per-corridor margin. See `app/api/rates/route.ts` for what actually crosses the wire.
 *
 * ORIENTATION IS DERIVED, NOT ASSUMED. Bridge returns `buy_rate` and `sell_rate` for a
 * given `from`/`to`, and which of the two is the higher number depends on the direction of
 * the pair. Rather than hardcode an assumption about that (and be silently wrong the day it
 * differs), we take the side BELOW mid as the sell side and the side ABOVE mid as the buy
 * side. That is true by definition of a two-sided quote: the customer selling USDc receives
 * the worse-for-them lower rate, the customer buying USDc pays the higher one. No credential
 * and no live probe is needed to get this right.
 *
 * Bridge's quote already contains Bridge's own contract spread (MXN 10 bps, COP 50 bps, …),
 * so the Payve markup applied here sits ON TOP of that. The all-in cost against mid-market is
 * Bridge's spread plus ours — which is what the settings screen shows the operator while they
 * type, so the number they enter is never ambiguous.
 *
 * A rate is a multiplier, not money, so floating point is correct here (unlike minor-unit
 * amounts, which must never round-trip through a float).
 */

export const CURRENCIES = ["MXN", "EUR", "COP", "BRL", "GBP"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const CURRENCY_PAIRS = [
  "usd_to_mxn",
  "usd_to_eur",
  "usd_to_cop",
  "usd_to_brl",
  "usd_to_gbp",
] as const;
export type CurrencyPair = (typeof CURRENCY_PAIRS)[number];

/** Data identifiers are underscore_snake_case (they end up in SQL); system ids are kebab. */
export function pairFor(code: CurrencyCode): CurrencyPair {
  return `usd_to_${code.toLowerCase()}` as CurrencyPair;
}

export function codeFor(pair: CurrencyPair): CurrencyCode {
  return pair.slice("usd_to_".length).toUpperCase() as CurrencyCode;
}

/**
 * Bridge's contractual spread per corridor, in bps, as a REFERENCE ONLY. It is never a
 * pricing input — it is shown on the settings screen so an operator can see what the Payve
 * markup sits on top of, and read the all-in figure. Mirrors BRIDGE_CONTRACT_SPREAD_BPS in
 * the payments app.
 */
export const BRIDGE_CONTRACT_SPREAD_BPS: Record<CurrencyPair, number> = {
  usd_to_mxn: 10,
  usd_to_eur: 15,
  usd_to_cop: 50,
  usd_to_brl: 50,
  usd_to_gbp: 24,
};

export interface BridgeTriple {
  /** Unspread mid-market rate. Server-side only — never published. */
  mid: number;
  /** Bridge's buy rate, already including Bridge's fee. Server-side only. */
  buy: number;
  /** Bridge's sell rate, already including Bridge's fee. Server-side only. */
  sell: number;
}

export interface PublishedPair {
  /** What a customer pays, per 1 USDc, to buy USDc. Sits above mid. */
  buy: number;
  /** What a customer receives, per 1 USDc, when selling USDc. Sits below mid. */
  sell: number;
}

/** Apply the Payve markup to both sides of Bridge's quote. */
export function publishedPair(t: BridgeTriple, spreadBps: number): PublishedPair {
  const below = Math.min(t.buy, t.sell);
  const above = Math.max(t.buy, t.sell);
  return {
    sell: below * (1 - spreadBps / 10_000),
    buy: above * (1 + spreadBps / 10_000),
  };
}

/**
 * The sanity gate, computed but never published.
 *
 * A customer can never be quoted a sell rate at or above mid-market, nor a buy rate at or
 * below it. If that inverts, the upstream is wrong (or the spread is nonsense) and the
 * corridor must show nothing at all. Deliberately strict: this is the guard that stops a
 * fabricated number reaching a customer who might price a shipment against it.
 */
export function isPublishable(t: BridgeTriple, p: PublishedPair): boolean {
  return (
    Number.isFinite(t.mid) &&
    Number.isFinite(p.buy) &&
    Number.isFinite(p.sell) &&
    p.sell > 0 &&
    p.sell < t.mid &&
    t.mid < p.buy
  );
}

/** Total cost against mid-market: Bridge's contract spread plus the Payve markup. */
export function allInBps(pair: CurrencyPair, payveSpreadBps: number): number {
  return BRIDGE_CONTRACT_SPREAD_BPS[pair] + payveSpreadBps;
}

/** Bridge returns decimal STRINGS. Non-finite or non-positive is not a rate. */
export function parseRate(raw: unknown): number | null {
  const n = Number.parseFloat(String(raw ?? ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}
