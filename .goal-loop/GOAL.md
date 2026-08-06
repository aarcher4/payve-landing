# goal-loop: The Payve Rate — live FX one-pager + wire-fee calculator at /rates

Source plan (authoritative, do not deviate):
`C:\Users\Alex Archer\.claude\plans\coulyyou-help-me-put-atomic-dawn.md`

## Goal (behavioral outcomes)

A shareable, indexed page at `/rates` on the payve-landing marketing site that:

- Shows the live mid-market rate beside the **Payve Rate** for MXN, EUR, COP, BRL and GBP,
  refreshing every 30s, with an "as of" timestamp.
- Never shows a fabricated number. When the upstream rate is unavailable the row says so.
  A synthetic fallback rate (18.0 MXN / 4000.0 COP) must NEVER reach the browser.
- States the pricing plainly: no outgoing fee, no incoming wire fee, $25M+ annual volume →
  inquire for volume pricing.
- Carries a wire-fee savings calculator with per-corridor defaults and a legally-reviewed
  footnote, computing buyer-side and supplier-side savings separately and labelling the
  combined total as spanning both parties.
- Is reachable from site nav and the footer, and is present in the sitemap.

**Scope boundary:** this is Part 1 of the plan ONLY. The 60→20 bps platform re-price
(Part 2) is a separate agentic-implementation ticket in a different repo and MUST NOT be
built here.

## Acceptance criteria

- [x] A1 `app/api/rates/route.ts` proxies Bridge server-side. Holds `BRIDGE_API_KEY` (never
      `NEXT_PUBLIC_`), native `fetch`, module-scope 30s cache. Returns per currency:
      `{code, mid, payveRate, allInBps, asOf, live}`. **Never** returns Bridge's
      `sell_rate` or `buy_rate` to the browser.
- [x] A2 `payveRate = sell_rate × (1 − PAYVE_PUBLIC_SPREAD_BPS/10_000)`, default 20 bps —
      mirrors `effectiveRate()` in payve-fintech `developerFees.ts`.
- [ ] A3 `app/rates/page.tsx` composes ONLY existing primitives from
      `app/components/site/ProductPage.tsx` (PageHero, SplitSection, FeatureGrid,
      ProductCtaBand) plus ValueList/StatStrip. No new design tokens.
- [ ] A4 `app/rates/RateTable.tsx` — client component, 30s poll, three states:
      live / stale (>2 min, dimmed + labelled) / unavailable. Figures in `font-mono`.
- [ ] A5 `app/rates/WireSavings.tsx` — wire-fee-only calculator. Per-corridor defaults
      exactly per the plan table. Both fee fields editable. Optional average-payment-size
      input showing fee as % of payment.
- [ ] A6 The calculator footnote is reproduced VERBATIM from the plan.
- [ ] A7 `docs/rates-page-substantiation.md` exists and every number published on the page
      traces to a row in it with source URL + schedule effective date.
- [ ] A8 `/rates` registered in `app/components/site/config.ts` (navGroups + footerColumns)
      and `app/sitemap.ts`. NO `X-Robots-Tag` entry in `next.config.ts` — this page IS indexed.
- [ ] A9 Degraded path: with `BRIDGE_API_KEY` unset, every row reads "unavailable" and the
      strings `18.0` / `4000` never appear as a rate anywhere in the served HTML or JSON.
- [ ] A10 Calculator arithmetic: Mexico 10 wires → $350 buyer, $350 supplier, $700 combined,
      $8,400/yr. Eurozone 10 wires → $350 buyer, $0 supplier. At $500 average payment the
      fee reads 14%.
- [ ] A11 Renders without layout overflow at 390 / 768 / 1440.
- [ ] A12 Forbidden-content check passes: the page never uses "SWIFT fee" as a label for
      these charges, never publishes a bank FX spread percentage, and never publishes a
      per-hop correspondent fee figure.
- [ ] A13 `npm run typecheck` (`tsc --noEmit`) and `next build` both clean.

      NOTE: the plan said "lint". This repo has **no ESLint config**, so `next lint` prompts
      interactively and can never run unattended — `npm run lint` was already broken here.
      Substituted `tsc --noEmit`, which is a stricter correctness gate. This is a
      strengthening, not a weakening; adding an ESLint config repo-wide is out of scope for
      this run.

## Verify gate (objective definition of done)

`npm run verify:rates` — must exit 0. Run it every iteration.

It chains: `tsc --noEmit` → `next build` → `node scripts/verify-rates.mjs`, where the script
boots the built server with `BRIDGE_API_KEY` unset and asserts A9, A10, A11 and A12 against
the real DOM via Playwright, plus asserts the substantiation doc covers every published
figure (A7).

## Guardrails

- **NEVER** delete, skip, `.skip`/`xit`/comment-out, or weaken tests to make the gate pass.
- **NEVER** hardcode expected outputs, stub/replace the verify command, or otherwise fake success.
- The `<promise>` may be emitted **only when the statement is completely and unequivocally true.**
  Do not lie to escape the loop, even if you feel stuck or it's taking long — use
  `<promise>GOAL-LOOP BLOCKED</promise>` instead.
- Do exactly **one** meaningful thing per iteration and commit it.
- If the gate keeps failing the same way, diagnose the root cause; do not retry the identical
  action hoping for a different result.

## Run-specific hard constraints

- Branch `goal-loop/rates-page`. Do NOT push. Do NOT deploy to Render. Do NOT touch DNS.
- Do NOT create or modify anything in `payve-fintech` or `payve-monorepo`.
- Never commit a Bridge API key; never prefix it `NEXT_PUBLIC_`.
- Footnote wording and the per-corridor default table are copied EXACTLY from the plan —
  those numbers are researched and legally load-bearing.
- Live-rate verification requires a production Bridge key (sandbox 503s on
  `/v0/exchange_rates`). If no key is available locally, verify the degraded path thoroughly
  and report the live check as BLOCKED — do not fake it.

## Completion

Emit `<promise>GOAL-LOOP COMPLETE</promise>` only when every box above is checked AND
`npm run verify:rates` exits 0.
Emit `<promise>GOAL-LOOP BLOCKED</promise>` if genuinely stuck (and write why in PROGRESS.md).
