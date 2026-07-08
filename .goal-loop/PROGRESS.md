# goal-loop progress journal

r3 run started 2026-07-08. Engine: stop-hook. Max-iters 50. Branch site/pr15-polish.
Plan: C:\Users\Alex Archer\.claude\plans\continue-the-landing-rebuild-nested-thimble.md
NO CANVAS this run (Alex). r2 journal preserved in git history of .goal-loop/PROGRESS.md.

## iteration 1 — Phase 0: logo revert + wall copy + PR #18
- did: header+footer logo src -> payve-logo-transparent.png; LogoWall eyebrow -> "Trusted by supply chain leaders"; copy-inventory (replace_all) + design-system r3 note (no-canvas exception, icon-diet scope, logo, wall copy); PR #18 opened base pr14. Preview repoint to pr15 BLOCKED by deploy classifier (needs fresh per-branch user confirm); deferred to wave end as a single confirm+deploy of the finished state.
- GATE: PASS (npm run build exit 0)
- next: Phase 1 reference walks (mercury.com first: home + 2 product pages + customer proof; screenshots to design-context/reference-r3/)

## iteration 2 — Phase 1a: reference walks captured
- did: scripts/reference-walk.mjs (scroll-step viewport frames, IntersectionObserver-safe, + facts JSON per page: headings/CTAs/eyebrows/icon census). 11 pages captured: mercury home/banking/treasury, ramp home/ap/expense/customers/story-hingham, happyrobot home/customers, brex home. 117 frames + 11 facts files in design-context/reference-r3/ (jpgs gitignored, facts committed). Note: mercury-banking only h=1943 (likely thin/redirect page; treasury is the deep product-page sample).
- GATE: PASS (build unchanged since iter 1; no app code touched)
- next: Phase 1b analysis: read facts + key frames, write docs/design-review-r3.md (8 lenses + our 14-page grading + CTA shortlist)

## iteration 3 — Phase 1b: design-review-r3.md written (evidence + grading + backlog + CTA shortlist)
- did: evidence agent read 50 frames across 10 valid reference pages (mercury-banking was a 404); docs/design-review-r3.md written: 6 headline findings (zero icon-on-card anywhere; multi-product = text-rail+media or bento, never tabs/icon-tiles; dark chapter bands; two-tone H2s; CTA ring composition; Ramp story grammar w/ hero stat band + sticky fact sidebar), 14-page grading (home weakest at 5.5 driven by icons 4/10 + multi-product 5/10), ranked backlog P1(6)/P2(4)/P3(3), CTA shortlist A-E with A = "The money and the busywork, handled." (ring composition) recommended. Self frames confirmed Alex's complaints concretely (floaty tour column, dead demo-panel space, 11 decorative icons, orphan H2 wraps, over-wide proof panel).
- GATE: PASS (build exit 0; docs only)
- next: checkpoint R post to Alex (grading + CTA pick), then Round 1 homepage implementation (tour rebuild on sage-900 text-rail, icon diet, two-tone H2s, proof panel fix)

## iteration 4 — Round 1a: ProductTour rebuilt (Mercury grammar, dark band)
- did: docs first (design-system r3 locked-decisions block: tour grammar, icon-diet targets, two-tone device, CTA pick "The money and the busywork, handled." per Alex); ProductTour.tsx rewritten: sage-900 full-bleed band, hairline white/10 text rail (no icons/boxes), active = sage-400 dot + white title + blurb expansion (reduced-motion safe), inactive white/50, one underlined sage-300 "Explore <product>" link following selection, demo crossfade right (self-framed light cards), mobile inline demo; copy inventory tour block updated (3 new short blurbs + 3 Explore link strings). Screenshot verified: reads like the reference dark chapter.
- GATE: PASS (build exit 0)
- next: Round 1b icon diet (HowItWorks + TrustSection), two-tone H2s, proof panel width, H2 orphan fixes, CtaBand headline swap

## iteration 5 — Round 1b: icon diet + two-tone H2s + CTA ring composition
- did: HowItWorks corner icons removed (mono 01-04 carry the cards) + two-tone H2 + proof panel max-w-4xl/min-h-96; TrustSection icons removed, tiles restyled type-first with border-t-2 sage-600 rules + two-tone H2; Proof H2 two-tone; CtaBand H2 -> "The money and the busywork, handled." (ring composition, Alex pick; shared component so all pages' closing bands swap; inventory sed x15); hover-check tour assertions updated to click-activation (Mercury grammar). Homepage decorative icon count: 11 -> 0.
- verification: build PASS; walk CLEAN (16x2); hover-check CLEAN (proof hover x4, tour click x3, keyboard); screenshots confirm type-led trust tiles + ring close. Round 1 (P1 items 1-6) DONE.
- GATE: PASS
- next: Round 2 products/solutions (ValueList -> hairline text rail w/o checkmarks; quote band on product pages; cross-sell row; FeatureGrid hairline restyle)

## iteration 6 — Round 2: product/solutions grammar
- did: ValueList -> hairline text rail (checkmarks removed, sage dot active, ink-3 inactive); FeatureGrid -> border-t-2 sage rule cells (boxes removed; solutions+security inherit); NEW QuoteBand (short Geoff pull, sage-50 band) on payments+agents; NEW CrossSell text row (eyebrow One platform + underlined display links to the other two products) on all 3 product pages; docs (design-system round-2 block + inventory r3 changelog) first.
- verification: build PASS; walk CLEAN 16x2; screenshots confirm rail/quote/cross-sell/ring-close stack on payments.
- GATE: PASS
- next: Round 3 customers (story kickers, sticky fact sidebar absorbing runs-on chips, hub tag pair styling)

## iteration 7 — Round 3: customers story grammar
- did: StoryBody -> two-column with STICKY FACT SIDEBAR (Company/Industry/What they run/About from customers-data; old runs-on chip card absorbed); Kicker component + kickers inserted in all 4 stories (The problem/The solution/How it started/What Payve runs/The result); hub industry tags -> small caps tracked; docs round-3 block first.
- verification: build PASS; walk CLEAN 16x2; hover-check CLEAN; FG story screenshot matches Ramp grammar (dark hero + stat band + ruled quote + kicker + sidebar).
- GATE: PASS
- next: re-grade touched pages in design-review-r3.md, final copy-rule grep, memory update, deploy ask (per-branch confirm), final report
