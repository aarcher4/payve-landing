/**
 * Which hostname this surface calls home.
 *
 * It began life as rates.getpayve.com, when a rate board was all it was. It now also carries
 * Working Capital, so `liquidity.getpayve.com` is the better name for the whole thing.
 *
 * BOTH HOSTS SERVE, AND ONE OF THEM IS CANONICAL. Search engines must be told which URL is the
 * real one or the two compete, and a canonical pointing at a hostname that does not resolve yet
 * is worse than no change at all. So the canonical host is an env var rather than a constant:
 * the code ships host-agnostic today, and the cutover is one environment change on Render once
 * the DNS record exists, with no code edit and no second deploy to write.
 *
 * To cut over:
 *   1. Create the DNS record:  liquidity  CNAME  payve-site-preview.onrender.com
 *   2. Wait for Render to report the custom domain verified and its certificate issued.
 *   3. Set PAYVE_PRIMARY_HOST=liquidity.getpayve.com and redeploy.
 *   4. Optionally set PAYVE_REDIRECT_LEGACY_HOST=1 so rates.getpayve.com 308s to liquidity.
 *      Leave it off until step 2 is confirmed, or the old host starts sending visitors to a
 *      hostname that does not answer.
 */

export const LEGACY_HOST = "rates.getpayve.com";
export const LIQUIDITY_HOST = "liquidity.getpayve.com";

/** Every hostname this app treats as the rate/liquidity surface, where short URLs are aliased. */
export const SURFACE_HOSTS = new Set([LEGACY_HOST, LIQUIDITY_HOST]);

/**
 * The hostname used in canonical URLs. Defaults to the legacy host, so nothing changes until
 * the new record is live and someone flips it deliberately.
 */
export function primaryHost(): string {
  const configured = process.env.PAYVE_PRIMARY_HOST?.trim();
  return configured && SURFACE_HOSTS.has(configured) ? configured : LEGACY_HOST;
}

export function canonical(path = "/"): string {
  return `https://${primaryHost()}${path}`;
}

/** Whether the legacy host should permanently redirect to the primary one. */
export function redirectLegacyHost(): boolean {
  return process.env.PAYVE_REDIRECT_LEGACY_HOST === "1" && primaryHost() !== LEGACY_HOST;
}
