# Deploying /rates to rates.getpayve.com

The page runs on the **existing payve-landing Render service** — no new service, no new repo.
`rates.getpayve.com` is added as a second custom domain on that service, so the page keeps one
implementation and stays in the site nav and sitemap.

`prospects.getpayve.com` was considered and ruled out: it is `runtime: static`
(`sales-operator/render.yaml`), so it has no server process and cannot hold a Bridge API key.
Live rates require a server-side secret.

---

## 1. Mint a scoped Bridge key — do this first

The rates page calls exactly one endpoint, read-only:

```
GET /v0/exchange_rates?from=usd&to={mxn|eur|cop|brl|gbp}
```

A Bridge API key grants **full account access**, and this service is internet-facing. Mint a
**separate, read-only key** for it rather than reusing the key the payments app uses. If a
marketing box is ever compromised, the blast radius should be "someone read public FX rates".

## 2. Set environment variables on the payve-landing service

Render dashboard → payve-landing → Environment:

| Variable | Value | Notes |
|---|---|---|
| `BRIDGE_API_KEY` | the scoped key from step 1 | **Never** `NEXT_PUBLIC_`-prefixed. Server-side only. |
| `BRIDGE_ENVIRONMENT` | `production` | **Required.** The route refuses to publish any rate unless this is exactly `production` — see step 5. |
| `BRIDGE_BASE_URL` | `https://api.bridge.xyz` | |
| `PAYVE_PUBLIC_SPREAD_BPS` | `20` | The published Payve spread over Bridge's sell rate. |

## 3. Add the custom domain

Render dashboard → payve-landing → Settings → Custom Domains → add `rates.getpayve.com`, then
create the DNS record Render shows (a CNAME at the `rates` subdomain). Certificate issuance is
automatic and usually takes a few minutes.

## 4. Deploy

Merge the `goal-loop/rates-page` branch. Render auto-deploys payve-landing on push.

## 5. Verify — in this order

```bash
curl -s https://rates.getpayve.com/api/rates | jq
```

Expect five rows with `"live": true` and plausible rates. As of 6 Aug 2026 the all-in figures
were MXN 30 bps, EUR 40, COP 70, BRL 50, GBP 39.

**If every row reads `live: false`, work through these in order — they are the only causes:**

1. `BRIDGE_API_KEY` unset.
2. `BRIDGE_ENVIRONMENT` is not exactly `production`. This is deliberate, not a bug. Bridge's
   sandbox returns well-formed 200s carrying **frozen fixtures months old** — USD/MXN at
   20.00025 stamped 2026-04-24, with a flat synthetic 50 bps spread on every pair. Publishing
   those as "live" would put an invented exchange rate in front of customers, so the route
   will not serve anything outside production.
3. The upstream `updated_at` is older than 10 minutes. Bridge refreshes roughly every 30s, so
   this means Bridge itself is stale — the page correctly shows nothing rather than a frozen
   number a customer might price a shipment against.

Then load `https://rates.getpayve.com/rates` and confirm five rows render with an "as of" time.

## 6. Before sending the link to anyone

Two things are still open, both recorded in the plan:

- **The page publishes 20 bps; the product still charges 60 bps.** The platform re-price is a
  separate ticket and should land first, or a customer quoted from this page gets a different
  rate in the app.
- **The calculator footnote has not had legal review.** It is modelled on ASA rulings upheld
  against TransferWise (2016) and FXcompared (2025), but that is research, not sign-off.

Also re-verify the bank fee table in `docs/rates-page-substantiation.md` before publishing —
U.S. Bank repriced effective 10 Aug 2026 and Citi's schedule moved twice in twelve months.

---

## Local development

```bash
npm run dev          # → http://localhost:3000/rates
```

Rates read "temporarily unavailable" without a production key. That is the correct degraded
state, not a failure.

## The gate

```bash
npm run verify:rates
```

Four stages, 68 assertions: `tsc --noEmit` → `next build` → degraded-path DOM assertions with
the key stripped (37) → live-path assertions against a local Bridge stub, including the
stale-upstream guard (31). Real Bridge is never contacted, so this is safe to run in CI.
