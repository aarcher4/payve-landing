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

Current values (seeded by `002`, made uniform by `004`): **16 bps on every corridor.**

| Corridor | Payve markup | Rail spread (measured) | All-in vs mid |
|---|---|---|---|
| `usd_to_mxn` | 16 bps | ~10 bps | ~26 bps |
| `usd_to_eur` | 16 bps | ~20 bps | ~36 bps |
| `usd_to_cop` | 16 bps | ~50 bps | ~66 bps |
| `usd_to_brl` | 16 bps | ~30 bps | ~46 bps |
| `usd_to_gbp` | 16 bps | ~19 bps | ~35 bps |

### The rail spread is MEASURED, not a constant

Every intraday snapshot stores both the mid and the rail's sell side, so the spread the rail
actually charged is `(1 - sell / mid) * 10_000`. The settings screen reads that, and labels it
**measured** or **estimate** so the operator knows which they are looking at — "66 bps all-in"
carries different weight depending on the answer.

This replaced a hardcoded table, because that table was wrong. Cross-checking the two written
sources on 10 Sep 2026:

- the payments app's own `BRIDGE_CONTRACT_SPREAD_BPS` covers only the off-ramp currencies —
  MXN 10, COP 50, BRL 50 — and has no EUR or GBP at all;
- the all-in figures this repo's deploy runbook measured on 6 Aug 2026 (at the then-20bps
  markup) imply MXN 10, EUR 20, COP 50, BRL **30**, GBP 19.

MXN and COP agree. BRL does not. EUR and GBP exist in one source only. Three of five were a
guess, which is why the number a customer is quoted against should come from observation.
`FALLBACK_CONTRACT_SPREAD_BPS` is used only for a corridor we have not observed yet.

The rail spread is a **reference only**, never a pricing input — it exists so an operator can
see what their markup sits on top of.

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
own observations — but every window does get the live quote appended, so the chart's last
point always equals the headline number above it.

A ratio outside `0.8 .. 1.2` is **refused, and refusing withholds the series entirely**
(`anchorRefused: true`, `available: false`). That far off is a bug, not a source disagreement.
Serving it unanchored was the first implementation and it was wrong on screen: COP rendered a
flat line at ~3,972 directly beneath a headline of 3,100.72, a 22% contradiction with nothing
to explain it. The payload looked fine; only the rendered page showed it. An empty chart with
its honest empty state is the correct output.

### Backfill happens by itself

On its first tick, capture counts the daily rows per corridor and, for any corridor below a
year's worth, loads **five years** in yearly chunks. So a fresh deployment, a restored
database, or a corridor added later all populate themselves with no human step.

That is not just convenience. Render keeps a managed Postgres **internal-only by default**
(`ipAllowList: []`), so a laptop cannot reach it at all without first opening the database to
the public internet. Backfilling from inside the service needs no such hole. This was found the
hard way: the manual step this section used to document could not actually be run.

`scripts/backfill-history.mjs` (`npm run backfill:history`) is kept for a database you *can*
reach — a local one, or a provider whose allowlist you have opened deliberately.

Both sources were verified reachable on 10 Sep 2026 and load ~1,825 points per corridor.

> **TLS is on by default for any non-local host.** Opting in on `sslmode=require` was the first
> implementation and it was wrong: Render's external connection string omits that parameter but
> the server still demands TLS, so the connection died with `ECONNRESET` — a failure that reads
> like a network fault rather than a missing option. `sslmode=disable` or a localhost host name
> turns it off.

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

## Provisioning

Done for production on 10 Sep 2026: `payve-rates-db`, Postgres 16, `basic_256mb`, Oregon,
linked to `payve-site-preview` as `DATABASE_URL` (internal connection string).

To stand up another environment:

1. Render → **New → Postgres**. **Use a paid plan.** Free-tier Postgres expires after 30 days
   and would take the rate history with it.
2. Link it to the service so `DATABASE_URL` is injected. Prefer the **internal** connection
   string: same region, no TLS round trip, and it works with the allowlist closed.
3. Set `RATES_ADMIN_PASSWORD` and `RATES_SESSION_SECRET`.
4. Redeploy. `npm start` runs `scripts/migrate.mjs` before `next start`, so the schema applies
   itself, and capture backfills five years of history on its first tick.
5. Verify:
   ```bash
   curl -s https://rates.getpayve.com/api/rates | jq '.rates[] | {code, spreadBps}'
   curl -s "https://rates.getpayve.com/api/rates/history?pair=usd_to_mxn&window=5Y" | jq '.available, (.points|length)'
   ```
   MXN should read 16 bps and the rest 20, and 5Y should report ~300 points once the backfill
   has run.

Leave the database's IP allowlist **empty**. Nothing outside Render needs to reach it: the
schema applies on boot and the history loads from inside the service.

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

## Settings

`rates.getpayve.com/settings`, gated by a single shared password.

| Variable | Purpose |
|---|---|
| `RATES_ADMIN_PASSWORD` | The shared operator password. |
| `RATES_SESSION_SECRET` | HMAC key for the session cookie. **Minimum 16 characters** — a shorter one is refused rather than used. |

Both missing means the page is **locked**, not open: a misconfigured deploy must never be the
thing that exposes the spread editor. `verifySession` returns false with no secret configured,
and the login route answers 503.

The session is a signed, httpOnly, `SameSite=Lax` cookie, 12 hours, `Secure` in production. It
carries only an expiry — there is no identity to carry, and putting anything else in it would
invite treating an unauthenticated string as data. Signing uses **Web Crypto, not
`node:crypto`**, because middleware runs on the Edge runtime where `createHmac` does not exist.
Password comparison stays in the Node-only API route, where a constant-time compare is
available.

Login attempts are throttled to 8 per minute per address. That turns online guessing into an
impractical attack; it is not a substitute for a strong password.

### What the screen does

Each corridor shows the arithmetic while you type, because "16 bps" alone is ambiguous:

```
Bridge contract spread   10 bps      (their fee, already inside the rate we receive)
Payve markup             16 bps  ←   you edit this
─────────────────────────────────────
All-in vs mid-market     26 bps
Publishes as    Sell 16.9569 · Buy 17.0453 MXN
```

A save requires a reason of at least 10 characters, enforced in the API *and* by a CHECK
constraint, so a direct `psql` edit cannot skip it. Saving appends a new `fx_spread_config`
row; nothing is ever updated in place. The change log below the editor is therefore the
record, not a copy of it — actor, exact timestamp, before and after, and the reason.

### Verified end to end

`scripts/verify-rates-history.mjs` covers the boundary over HTTP: logged-out redirect, 401 on
read and write, wrong password rejected **with no cookie issued**, a forged cookie rejected
(which is what proves the signature is checked rather than the cookie's presence), a reason
shorter than 10 characters rejected, a fractional bps rejected, and finally that a valid
re-price moves the published rate by exactly the amount changed and lands in the log.
