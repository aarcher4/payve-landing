# goal-loop: ship the landing-rebuild r2 critique wave (5 stacked PRs, canvas-driven)

## Goal (behavioral outcomes)
Execute the approved plan at `C:\Users\Alex Archer\.claude\plans\continue-the-landing-rebuild-nested-thimble.md`
in repo `C:\Users\Alex Archer\Desktop\payve-landing`. When done: five stacked PRs (W1..W5) are open on
GitHub stacked on `site/pr9-canvas-polish`, every team-critique item from the 2026-07-07 call is either
shipped or explicitly gated-and-flagged, the Claude design canvas "Payve Marketing Site" reflects r2 and
its export is committed as `design-context/claude-design-export-r2/`, the app matches the approved canvas
state (visual-diff attributed), and every page walks clean in Playwright at 1440+390 with the new CTA label
"Schedule time with us" everywhere.

## Acceptance criteria
- [x] W1 `site/pr10-docs-and-direct` PR open: design-system + copy-inventory docs revised to r2 (unlock list, CTA label, proof-layer copy, Payve Agents, case-study beats), conversion-review amended, midjourney-prompts extended; emails fixed (infosec@getpayve.com on security; alex@ removed from footer+company); `bookDemoLabel` centralized in config and used by all 5 render sites; hero-home regraded (visibility/saturation) + gradient softened; logo raster variant correctness (dark-on-light / light-on-dark); visual-diff `--export` support; unused legacy components deleted. Build green.
- [x] Canvas batch 1 (home) driven via Playwright MCP per plan, exported to design-context/claude-design-export-r2/, checkpoint-1 review request posted for Alex.
- [x] W2 `site/pr11-home-critique` PR open: hero chips removed, ProductTour affordance+connector+centering, HowItWorks client component with hover/proof layer (default step 01, keyboard+390 tap+reduced-motion), "(or Spanish)", section background rhythm. Build green + hover-state Playwright screenshots.
- [x] Canvas batch 2 (3 product pages) driven + exported; checkpoint-2 posted.
- [x] W3 `site/pr12-product-pattern` PR open: ValueList.tsx replaces FeatureGrid on product pages (hover-expand, mobile accordion), ProductPage scaffold reordered (demo up, CTA above fold), demos extended variant, payments cross-border repositioning, early-pay supplier-liquidity reframe, "Payve Agents" rename everywhere. Build green.
- [x] Ramp customers reference walk done; canvas batch 3 (hub + FG + SL + Dal Campo + Manny) driven + exported; checkpoint-3 posted.
- [x] W4 `site/pr13-customers` PR open: hub bridge hero removed (straight to cards: logo + one-liner + result), StoryHero de-bridged, FULL story content for FG (800 vouchers/mo, ~3min, ~40hrs), SL (person = Selman, org-intelligence), Dal Campo (complexity/reconciliation), Manny (fintech/payments, generic naming until consent); SL/Dal Campo/Manny draft+noindex+not-in-sitemap. Build green.
- [x] Canvas batch 4 (security, company, 3 solutions) driven + exported; checkpoint-4 posted. New imagery: Midjourney gens per prompts doc if reachable, else de-faking overlay treatment of existing images + gens flagged for Alex.
- [x] W5 `site/pr14-trust-imagery` PR open: security image swap, packaging/seafood imagery direction, de-faking treatment. Build green.
- [x] Final sweep: full visual-diff (13+ screens x 1440/390) against r2 export with every delta attributed; Playwright walk all routes both viewports (zero console errors, all links resolve, all CTAs = zcal.co/payve + "Schedule time with us"); copy-rule grep clean (no em dashes in copy, no %, no Astra|OatFi|Bridge|USDB|stablecoin|WhatsApp, no leftover "Book a demo"); reduced-motion + keyboard pass on new interactions.
- [x] Memory updated: landing-rebuild-letitrip-0707.md extended with r2 wave state + gated items.

## Verify gate (objective definition of done)
`cd "C:\Users\Alex Archer\Desktop\payve-landing" && npm run build`  — must exit 0. Run it every iteration.

## Human-gated items (do NOT block the loop on these; flag in final report)
Alex canvas checkpoint approvals (post review request, continue working; ports proceed from the driven
canvas state, re-drive if Alex requests changes). Shared-drive SVG logos (vector swap deferred until they
appear in Desktop\Brand-Assets). Manny naming consent. Customer sign-offs before un-drafting. If
claude.ai/design shows a login wall, pause and ask Alex (that one IS blocking for canvas batches; do
app-direct + docs work meanwhile, BLOCKED only if nothing else remains).

## Guardrails
- **NEVER** delete, skip, `.skip`/`xit`/comment-out, or weaken tests to make the gate pass.
- **NEVER** hardcode expected outputs, stub/replace the verify command, or otherwise fake success.
- The `<promise>` may be emitted **only when the statement is completely and unequivocally true.** Do not lie to escape the loop, even if you feel stuck or it's taking long — use `<promise>GOAL-LOOP BLOCKED</promise>` instead.
- Do exactly **one** meaningful thing per iteration and commit it.
- If the gate keeps failing the same way, diagnose the root cause; do not retry the identical action hoping for a different result.
- Copy rules bind every word shipped: no em dashes, no persuasion/sell copy, no rail vendor names, no %/rates, agents = organizational intelligence, disclosure short form only, every number traceable.
- Canvas-driven rule: visual/structural/copy changes go docs → canvas → export → port. App-direct only for the items the plan classifies app-direct.

## Completion
Emit `<promise>GOAL-LOOP COMPLETE</promise>` only when every box above is checked AND the verify gate exits 0.
Emit `<promise>GOAL-LOOP BLOCKED</promise>` if genuinely stuck (and write why in PROGRESS.md).
