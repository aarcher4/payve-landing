# goal-loop progress journal

Run: The Payve Rate one-pager (`/rates`). Branch `goal-loop/rates-page`.
Engine: stop-hook. max-iters 40, deadline 240 min.
Started 2026-08-06.

## iteration 0 — setup
- did: archived the completed network-rebrand run to `.goal-loop/archive/network-rebrand/`,
  created branch `goal-loop/rates-page` off `site/network-rebrand` @184fb08, wrote GOAL.md +
  loop-prompt.md.
- GATE: not yet runnable (`verify:rates` does not exist — building it is A13/gate scaffolding)
- next: A1 — the Bridge proxy route handler, plus the `verify:rates` gate script so every later
  iteration has an objective pass/fail.

## iteration 1 — objective verify gate
- did: added `scripts/verify-rates.mjs` (boots the prod build with BRIDGE_API_KEY stripped,
  asserts A7/A9/A10/A11/A12 + the footnote anchors against the real DOM via Playwright) and
  wired `npm run verify:rates`.
  GATE SUBSTITUTION, recorded honestly: the plan said `npm run lint`, but this repo has NO
  ESLint config so `next lint` prompts interactively and can never run unattended — that
  script was already broken here. Replaced with `tsc --noEmit` (stricter, non-interactive).
  Baseline typecheck was already clean, so it is a real signal not a rubber stamp.
- GATE: FAIL /api/rates 404 + /rates 404 (nothing built yet) — 5/10 checks pass
- next: A1 — app/api/rates/route.ts, the server-side Bridge proxy.

## iteration 2 — Bridge proxy route (A1, A2)
- did: `app/api/rates/route.ts`. Server-side only, 30s module cache, returns
  {code, mid, payveRate, allInBps, asOf, live}; never emits sell_rate/buy_rate. No fallback
  constant anywhere — failure degrades to live:false with null rates.
  Also HARDENED THE GATE: a stale `next start` from iteration 1 was still bound to :3177 and
  answering from the OLD build, which is why /api/rates "404'd" despite being in the build
  manifest. verify-rates.mjs now refuses to run if the port is already serving, and awaits a
  real teardown. Without that fix the gate could pass or fail against the wrong code.
- GATE: FAIL /rates 404 (page not built yet) — 11/14 checks pass, all API assertions green
- next: A3/A4 — app/rates/page.tsx + RateTable.tsx.

## iteration 3 — the page: hero, rate table, calculator (A3–A6, A9–A12)
- did: `app/rates/page.tsx` (composed only from PageHero/SplitSection/FeatureGrid/CrossSell/
  ProductCtaBand/ValueList — no new tokens), `RateTable.tsx` (30s poll, live/stale/unavailable,
  no fallback constant anywhere), `WireSavings.tsx` (per-corridor defaults exactly per plan,
  buyer and supplier shown separately, combined total explicitly labelled both-sides, verbatim
  footnote). Included the $15→$0 supplier story, anonymised.
  Also SCOPED THE A7 ASSERTION correctly: it originally compared every dollar figure in the
  whole body against the doc, which swept in computed outputs ($350, $8,400) that change with
  user input. Requiring those in a sourcing doc is meaningless and would pressure padding it
  with arithmetic. Now scoped to the [data-substantiated] region — the actual claims.
- GATE: FAIL docs/rates-page-substantiation.md missing — 29/30 checks pass
- next: A7 — write the substantiation doc.

## iteration 4 — substantiation doc (A7, A13)
- did: `docs/rates-page-substantiation.md` — every published figure with source URL + schedule
  effective date, the deliberately-excluded list (bank FX spreads, per-hop fees, "SWIFT fee"),
  the ASA/FTC basis for the footnote wording, and a re-verify warning (U.S. Bank reprices
  10 Aug 2026). The gate immediately caught an unsourced "$85" in the footnote's branch-wire
  range — added the full branch-initiated table rather than dropping the claim. That is the
  A7 assertion doing exactly what it exists for.
- GATE: PASS 33/33
- next: A8 — register /rates in nav/footer/sitemap, AND extend the gate to assert A8. The gate
  is green but A8 is still unchecked, so this run is NOT complete.

## iteration 5 — nav / footer / sitemap registration (A8)
- did: registered /rates in navGroups (Products) + footerColumns + sitemap.ts; confirmed no
  X-Robots-Tag (this page is meant to be indexed, unlike the hidden value-model slug). Added
  A8 assertions to the gate — it was previously unprovable. First run failed "header links to
  /rates" because the Products dropdown mounts its items only on click; fixed the assertion to
  drive the real interaction rather than asserting against a closed menu.
- GATE: PASS 37/37
- next: the live branch had still never executed — cover it.

## iteration 6 — live-path verification without a Bridge key
- did: `scripts/verify-rates-live.mjs`. Stands up a local stub speaking Bridge's
  /v0/exchange_rates contract (decimal strings, sell below mid, a DIFFERENT implied spread per
  corridor so a hardcoded expectation can't satisfy all five), points BRIDGE_BASE_URL at it and
  asserts the live branch: per-corridor rate math, Api-Key sent upstream, sell_rate/buy_rate
  never reaching the client, Payve Rate always below mid. Chained into `verify:rates` so it is
  permanent. Also rendered the table in its live state for the first time — MXN 30 bps
  (Bridge 10 + Payve 20), COP 70 bps (50 + 20), matching the plan's predicted all-in figures.
- GATE: PASS — 37/37 degraded + 27/27 live = 64 checks
- next: none. All 13 acceptance criteria checked and the gate is green.

## Outstanding for a human (recorded, NOT faked)
Real-Bridge live verification was never run: it needs a PRODUCTION Bridge key (sandbox 503s on
/v0/exchange_rates) and none is available locally. The live branch is covered against a
contract-accurate stub, not against Bridge itself. Before publishing, set the key on Render and
confirm the five rows show real rates.

## iteration 7 — staleness + environment guard (defect found via real Bridge keys)
- did: probed Bridge with a real SANDBOX key and found my earlier research was WRONG. Sandbox
  does not 503 across the board — it returned 200 for MXN/EUR/BRL/GBP (503 only for COP) with
  FROZEN FIXTURES: USD/MXN 20.00025 stamped 2026-04-24, and a flat synthetic 50 bps spread on
  every pair instead of the real per-corridor contract spread. My route trusted any 200, so a
  deploy pointed at sandbox would have rendered "Live · read at HH:MM" above a four-month-old
  invented rate — precisely the failure this page exists to prevent.
  Fixed with two guards in app/api/rates/route.ts: (1) only BRIDGE_ENVIRONMENT=production
  publishes at all; (2) any rate whose upstream `updated_at` is older than 10 minutes degrades
  to unavailable. Added a second pass to verify-rates-live.mjs that flips the stub to
  sandbox-shaped stale responses and asserts every row degrades and no fixture value leaks.
  Then verified against PRODUCTION Bridge with a real key: all five rows live, real rates,
  and the all-in bps independently confirm the contract spreads — MXN 30 bps (10+20) and COP
  70 bps (50+20) match BRIDGE_CONTRACT_SPREAD_BPS in payve-fintech exactly. EUR/BRL/GBP
  contract spreads measured for the first time at ~20 / ~30 / ~19 bps.
  No key was written to any file or commit; both were passed as shell env vars only.
- GATE: PASS — 37/37 degraded + 31/31 live = 68 checks
- next: hosting decision for prospects.getpayve.com (static site, cannot hold a secret).
