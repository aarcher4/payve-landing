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
