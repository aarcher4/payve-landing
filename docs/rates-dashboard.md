# The rates surface: spreads, storage, and how it degrades

Companion to [`rates-page-deploy.md`](rates-page-deploy.md), which covers the Bridge key and
the custom domain. This file covers the database and the published spread.

## The spread is data now

`PAYVE_PUBLIC_SPREAD_BPS` used to be the single published markup for all five corridors, and
changing it meant a redeploy with no audit trail. It is now a per-corridor value in
`fx_spread_config`, and the env var is what the app uses when no database is configured.

The table is **append-only and versioned**. A re-price INSERTs a new row; nothing is ever
UPDATEd. The live value is the newest row with `effective_from <= now()`. This is what makes
the change log trustworthy: the history *is* the data, not a log written alongside it and hoped
to agree. Same doctrine as `bridge_fee_config` in the payments app.

Seeded values (migration `002`):

| Corridor | Payve markup | Bridge contract spread | All-in vs mid |
|---|---|---|---|
| `usd_to_mxn` | **16 bps** | 10 bps | ~26 bps |
| `usd_to_eur` | 20 bps | 15 bps | ~35 bps |
| `usd_to_cop` | 20 bps | 50 bps | ~70 bps |
| `usd_to_brl` | 20 bps | 50 bps | ~70 bps |
| `usd_to_gbp` | 20 bps | 24 bps | ~44 bps |

MXN publishes at 16. The other four carry over the 20 bps that has been serving in production,
unchanged — introducing a table must not silently re-price four corridors as a side effect.

Bridge's contract spread is a **reference only**, never a pricing input. It exists so the
settings screen can show an operator what their markup sits on top of, and what the all-in
figure comes to, while they type.

> **Still open:** this site publishes 16 bps for MXN while the payments app's
> `bridge_fee_config` platform default charges **60 bps**. A customer who prices from this page
> and then pays in the app gets a different number. That divergence predates this work (the
> page has been publishing 20 against the app's 60) and resolving it is a pricing decision, not
> a code one.

## The two-sided quote

The board publishes `buy` and `sell` per corridor, not one number.

```
sell = (the side of Bridge's quote BELOW mid) × (1 − payve_spread_bps / 10_000)
buy  = (the side of Bridge's quote ABOVE mid) × (1 + payve_spread_bps / 10_000)
```

Orientation is **derived, not assumed**. Which of Bridge's `buy_rate` / `sell_rate` is the
higher number depends on the direction of the pair, so rather than hardcode that (and be
silently wrong the day it differs), the code takes the side below mid as the sell side. That is
true by definition of a two-sided quote, and it needs no live probe against production to get
right.

`payveRate` is retained in the payload as an alias of `sell` so the existing rate board renders
unchanged. It is the same number, not a second opinion — `verify-rates-live.mjs` asserts they
are identical.

**Never published:** `midmarket_rate`, Bridge's `sell_rate`, Bridge's `buy_rate`. They gate
freshness and sanity server-side. Together they would disclose Payve's per-corridor margin.
The gate asserts both the field names *and* the mid-market values are absent from the payload,
so a leak that renames the field rather than removing it still fails.

## The chart, and why history is anchored

`1D` and `1W` are drawn from rates we recorded ourselves, every 5 minutes, from Bridge.
`1M` through `5Y` are drawn from official daily closes: ECB reference rates via Frankfurter
for MXN/EUR/GBP/BRL, and Banco de la República's TRM for COP, which the ECB does not publish.

Only the **sell** series is published. A reconstructed point derives both sides from the same
mid, so publishing both would let anyone recover mid — and from mid, the all-in spread. The
live hero can show both sides because those come from Bridge's two genuinely different sides,
which do not straddle mid symmetrically.

### The seam, and the fix

The public sources and Bridge disagree about the **level** of the market, by more than the
chart's entire y-range. Measured 10 Sep 2026:

| Corridor | ECB / Banrep mid | Bridge live mid | Gap |
|---|---|---|---|
| MXN | 16.9025 | 17.0011 | +0.58% |
| COP | 3099.48 | 3122.54 | +0.74% |
| BRL | 5.0889 | 5.1491 | +1.18% |

The ECB fixes once a day as a EUR-based cross, Banrep's TRM is a previous-day average, and
Bridge is live spot — three measurements of three different moments. A day of real movement is
around 0.5%, so an unadjusted 1M chart would **end at 16.85 while the hero above it read
16.95**: a step larger than any real move on the chart, reading as a crash that never happened.

So a reconstructed series is **anchored**: multiplied by `liveSell / lastPointSell`, with the
live quote appended as its final point. Scaling is multiplicative, so every percentage move is
preserved exactly — only the level moves. The error is pushed into the distant past, where
0.5% is invisible against years of movement, and driven to zero at the right-hand edge, which
is the point a reader actually cross-checks against the headline.

The API reports `anchorRatio` so the UI can say the history is indexed rather than implying
five years of our own quotes. Intraday windows are never anchored — they are already Bridge's
own observations. A ratio outside `0.8 .. 1.2` is refused and the series is served unanchored:
that far off is a bug, not a source disagreement, and a 23%-rescaled history would be worse
than an unadjusted one.

### Backfill

```bash
DATABASE_URL=... npm run backfill:history          # 5 years, ~9,100 rows, safe to re-run
```

Both sources were verified reachable on 10 Sep 2026 and loaded ~1,825 points per corridor.

## The database is optional

With `DATABASE_URL` unset the whole surface behaves exactly as it did before one existed:
spreads come from `PAYVE_PUBLIC_SPREAD_BPS`, and the board publishes live Bridge rates. Local
dev, previews, and the currently-deployed production service all run this way today.

### Degradation is asymmetric, on purpose

| Situation | Behaviour | Why |
|---|---|---|
| No `DATABASE_URL` | Use `PAYVE_PUBLIC_SPREAD_BPS` | The env var **is** the configured spread. Not a fallback, not a guess. |
| `DATABASE_URL` set, query fails | Serve the last value actually read, for up to 10 minutes; then publish nothing | The configured spread is **unknown**. Falling back to the env var would publish a rate nobody configured. |
| `DATABASE_URL` set, no row for a corridor | Publish nothing for that corridor | Same reason. |

A stale-but-real spread for a few minutes is defensible. An invented one never is.

**This means setting `DATABASE_URL` is the moment the board starts depending on the database.**
If you point it at an unmigrated or unreachable database, the board goes dark rather than
publishing the env default. That is the intended safety property, but it does mean provisioning
is a step to take deliberately, not casually.

## Provisioning (human step — not done by this PR)

1. Render dashboard → **New → Postgres**, name `payve-rates-db`.
   **Use a paid plan.** Free-tier Postgres expires after 30 days and would take the rate
   history with it.
2. Link it to the `payve-site-preview` service so `DATABASE_URL` is injected. Prefer the
   internal connection string (same region, no TLS round trip).
3. Redeploy. `npm start` runs `scripts/migrate.mjs` before `next start`, so the schema applies
   itself on boot.
4. Verify: `curl -s https://rates.getpayve.com/api/rates | jq '.rates[] | {code, spreadBps}'`
   should show MXN at 16 and the rest at 20.

## Migrations

`db/*.sql`, applied in filename order, ledgered in `schema_migrations`, one transaction each,
under a Postgres advisory lock (Render overlaps instances during a deploy, so two boots can
race the same migration).

Every migration must be **idempotent** — a migration that is only safe once is a migration
that will eventually fail a redeploy.

The runner **no-ops without a database** (exit 0, so `npm start` still boots the site) and
**fails closed with one** (non-zero exit, server does not start). Serving a rate board against
a half-migrated schema is worse than not serving it.

## The gate

```bash
npm run verify:rates
```

Never pipe it through `tail` — you get tail's exit code, and a red gate reads as green. Read
the printed `N/N checks passed` totals, not just the exit status.
