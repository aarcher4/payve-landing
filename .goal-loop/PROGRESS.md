# goal-loop progress journal

Network-rebrand run started 2026-07-12. Engine: stop-hook. Max-iters 40. Branch site/network-rebrand (off site/pr16-solutions-content).
Plan: .goal-loop/PLAN.md (copy of C:\Users\Alex Archer\.claude\plans\on-our-website-we-ve-dapper-cake.md).
Prior r2/r3 journals preserved in git history of .goal-loop/PROGRESS.md.
Locked user decisions: two products only; full-site rebrand; softer fee framing (no absolute free); evolve design system; all five corridors uniform; homepage keeps its general structure and details.

## iteration 1 — positioning spec + gate operational
- did: wrote docs/network-rebrand.md (two-product architecture, canonical cascade sentence, vocabulary/banned-words, softer fee framing, five uniform corridors, page-level copy directions, design-evolution rules). Fixed fileURLToPath bug in scripts/verify-rebrand.mjs; full gate now runs end-to-end (build green, walk CLEAN 1440/390, greps clean).
- GATE: FAIL redirects-missing x3 (/products/payments, /products/early-pay, /products/agents expected redirect, got 200) — expected until Step 3 IA lands
- next: build the three new components (FlowLine, CascadeFlow, CorridorStrip) so the /products/network page has its materials

## iteration 2 — network components (FlowLine, CascadeFlow, CorridorStrip)
- did: app/components/site/network.tsx — FlowLine (ambient sage path + animateMotion pulse, reduced-motion static), CascadeFlow (framed demo: enroll → 3 suppliers paid → Casa de Tortillas enrolls → its 2 suppliers unlock; framer-motion pathLength edges, aria-label, final-state-static under reduced motion), CorridorStrip (5 corridors uniform, type-led). Matches demos.tsx grammar (frame/frameHeader, useSteps=useLoopStep pattern, accent only where money moves).
- GATE: FAIL redirects-missing x3 (2nd consecutive — next iter must flip signature by landing IA)
- next: IA step — /products/network + /products/agentic-intelligence pages, next.config.ts redirects, walk.mjs routes, nav/footer config → gate green

## iteration 3 — IA lands: two-product architecture, gate GREEN
- did: /products/network (hero + Enroll/CascadeFlow + CorridorStrip + Move money/PaymentsDemo + Unlock your suppliers/EarlyPayDemo + membership ValueList + Connected data/AgentsDemo bridge + QuoteBand); /products/agentic-intelligence (agents page reframed on network data, reconciliation-on-network-data value item, cross-sell to Network); deleted old 3 product dirs; next.config.ts permanent redirects; config.ts nav+footer = two products; walk.mjs routes updated (old kept via redirect). Checked 7 GOAL boxes.
- GATE: PASS (build green, redirects 308 verified, WALK CLEAN 1440/390, greps clean)
- next: homepage — ProductTour 3→2 rows, Hero subhead reframe + cascade sentence, HowItWorks step 01 Enroll, links off old routes

## iteration 4 — homepage reframe (arc unchanged)
- did: Hero subhead = network category + THE cascade sentence + agents-on-connected-network (headline untouched); ProductTour 3→2 rows (The Payve Network w/ CascadeFlow demo, Agentic Intelligence w/ AgentsDemo; eyebrow "One network", H2 "The network moves the money and runs the back office."); HowItWorks step 01 Connect→Enroll, step 04 link → /products/network, corridor descriptor 5 regions. Section arc + Proof/Trust/LogoWall untouched.
- GATE: PASS
- next: solutions pages network-membership reframe (fresh-produce, seafood, packaging)

## iteration 5 — solutions network-membership reframe
- did: fresh-produce (hero sub = Network pays in own currency + unlocks liquidity; grower-enroll sentence in Supplier liquidity; eyebrow Agentic intelligence; "One network to pay"; metadata 5 corridors), seafood (hero sub network liquidity; "suppliers who enroll"), packaging (supplier-side: "when your customers pay through the Payve Network, approved invoices become working capital"). Structure + StatStrips untouched.
- GATE: PASS
- next: customers/company/security label pass (Payve Agents → Agentic Intelligence)

## iteration 6 — customers/company/security label pass
- did: runsOn chips → ["The Payve Network","Agentic Intelligence"] (fortune-growers, sl-produce); company page: metadata = payment-network framing, "network that moves your money", "one network to pay", "suppliers who enroll", corridors → 5. Security page needed no changes (approval gate/isolation copy is product-agnostic); disclosure line untouched site-wide (config-driven).
- GATE: PASS
- next: metadata (app/layout.tsx) + public/llms.txt + app/sitemap.ts to two-product framing + new routes

## iteration 7 — metadata, llms.txt, sitemap
- did: layout.tsx (title "The payment network for supply chain trade", description w/ 5 corridors + working capital + agentic intelligence, keywords → B2B payment network / working capital network / agentic intelligence, OG updated); sitemap.ts → /products/network + /products/agentic-intelligence (old routes dropped from sitemap, still redirect); llms.txt rewritten to two-product framing incl. cascade + no-cost supplier enrollment + not-a-bank line kept.
- GATE: PASS
- next: design-review loop round 1 — Playwright full-page screenshots 1440+390 of all rebranded pages, ruthless critique in REVIEW.md, fix must-fixes

## iteration 8 — design review round 1
- did: scripts/screenshot-pages.mjs (reusable, reduced-motion, fullPage 1440+390, 9 routes); captured .goal-loop/screens/r1/; deep-reviewed home/network/agentic/fresh-produce; wrote REVIEW.md round 1: 5 must-fix (CascadeFlow illegible @390, stale footer tagline, CrossSell "One platform" eyebrow, orphaned CorridorStrip, FlowLine unused) + 3 polish. Verdict NOT YET.
- GATE: PASS
- next: fix the 5 must-fixes (+polish 6-8 where cheap), re-screenshot, round 2 incl. pages not yet deep-reviewed

## iteration 9 — round-1 must-fixes applied (all 5 + polish 6-8)
- did: CascadeFlow mobile stacked-tree variant (sm:hidden) + desktop labels 12/10 on 118x52 nodes + status order Enrolled→Suppliers unlocked→Network growing; footer tagline → "The payment network for supply chain trade."; CrossSell eyebrow → "One network"; corridor band on /products/network gets FlowLine (page's one ambient element) + "Five corridors, one network" eyebrow; ProductTour rail gets corridor mono line (white/40).
- GATE: PASS
- next: design review round 2 — re-screenshot, verify fixes landed visually, deep-review remaining pages (seafood, packaging, customers, company, security + 390 variants)

## iteration 10 — design review round 2 + critical Reveal a11y fix
- did: r2/r2b screenshots; verified all 8 round-1 fixes visually; FOUND+FIXED critical pre-existing bug — Reveal left framer SSR opacity:0 inline style on reduced-motion (customers/company rendered blank for reduced-motion users); Reveal reduced branch now same motion.div driven to final state instantly, probe-verified opacity 1 across routes. New small must-fix logged: customers hub hero sub still three-product phrasing.
- GATE: PASS
- next: fix customers hub copy (#10), round-3 sweep (seafood, packaging, company, security, home-390), then verdict

## iteration 11 — round 3: customers copy fix + full-site sweep → VERDICT: EXTRAORDINARY — SHIP
- did: customers hub hero sub + metadata to network phrasing (#10); r3 screenshots post-change; deep-reviewed company/seafood/packaging/home-390; wrote round-3 scoring (clarity/credibility/craft) with zero open must-fixes; REVIEW.md carries VERDICT: EXTRAORDINARY — SHIP from a pass performed after the last code change. Design-review acceptance box checked.
- GATE: PASS
- next: final item — draft PR against site/pr16-solutions-content with before/after screenshots + Render preview note

## iteration 12 — draft PR opened; run complete
- did: pushed site/network-rebrand; opened draft PR #20 against site/pr16-solutions-content (https://github.com/aarcher4/payve-landing/pull/20) with full change summary, verification record, before/after screenshot pointers (.goal-loop/screens/r1→r3), and Render branch-preview note. Final GOAL box checked — ALL acceptance criteria met.
- GATE: PASS (final run)
- next: none — run complete

# ---- r3 run: benefits-first voice, higher essence ----
r3 run started 2026-07-13. Engine: stop-hook. Max-iters 15. Branch site/network-rebrand (continuing).
Plan: .goal-loop/PLAN.md (r3). Prior network-rebrand + r2 journals above / in git history.
Alex r3 notes: customers don't care about corridors; benefits language (send it and it's there; global liquidity; suppliers get capital quicker; stronger relationships); fee talk out of heros.

## r3 iteration 1 — voice rules + corridor gate
- did: docs/network-rebrand.md §0 r3 voice rules (corridor ban, benefits-first test, canonical instant/liquidity/relationships lines, fees down-page), §5 → Countries, §9 benefit-led heading note; verify-rebrand.mjs corridor check (prose only; CORRIDOR*/Corridor identifiers exempt after 2 precision fixes). NetworkCanvas aria-label audited: already corridor-free.
- GATE: FAIL corridor-copy x2 (network page eyebrow, llms.txt) — the exact copy iteration 2 rewrites
- next: r3 copy pass (network page hero/eyebrow/ValueList, ProductTour blurb, layout description, llms.txt)

## r3 iteration 2 — benefits copy pass, gate GREEN
- did: network page (eyebrow "Send it. It's there.", benefits hero sub: instant/global liquidity/relationships, metadata, "Received in minutes, not days"); ProductTour Network blurb; layout.tsx description + OG; llms.txt (corridor out, global liquidity in). Gate regex handles PascalCase identifiers (CorridorStrip); walk failure was a 3100 port collision from the prior screenshot server, clean after kill.
- GATE: PASS (incl. corridor check live)
- next: review round 5 — screenshots + in-context copy read against the voice rules, REVIEW.md verdict

## r3 iteration 3 — review round 5: HIGHER ESSENCE — SHIP
- did: r5 screenshots (network hero, canvas band, home tour); line-by-line voice-rule read; REVIEW.md round 5 with zero must-fixes and VERDICT: HIGHER ESSENCE — SHIP (post-change). Review acceptance box checked.
- GATE: PASS
- next: final box — push, confirm Render deploy live, smoke-check copy on preview → COMPLETE

## r3 iteration 4 — shipped; run complete
- did: pushed d0f72bd; Render deploy dep live on payve-site-preview.onrender.com; smoke-checked live copy ("Send it. It's there.", "arrive instantly", "connected to global liquidity", zero "corridor"). Final GOAL box checked — ALL r3 acceptance criteria met.
- GATE: PASS (final run)
- next: none — r3 run complete

# ---- r4 run: particle globe under "Send it. It's there." ----
r4 run started 2026-07-13. Engine: stop-hook. Max-iters 20. Branch site/network-rebrand (continuing).
Plan: .goal-loop/PLAN.md (r4). Bar: absolutely incredible; proto passes before porting.

## r4 iteration 1 — proto v2 globe built + pass-1 critique
- did: design-context/network-canvas-proto.html rewritten as the particle-globe scene (Fibonacci sphere, spin+tilt, anchors/chips riding projection, slerped dotted arcs + pulses, heading overlay); pass-1 screenshots; ruthless critique in REVIEW.md round 6 (5 must-fixes: dot presence, radius/curvature, rotation phase, chip fade, arc alpha).
- GATE: PASS (proto is design-context only; site untouched)
- next: apply pass-2 fixes to proto, re-shoot, critique again

## r4 iteration 2 — proto passes 2-5: globe reaches the bar, proto CLEAN
- did: pass 2 (density/falloff/R/limb), pass 3 (hash jitter kills lattice, phase, glow, CY), pass 4 (center Americas, arc presence), pass 5 (tilt +0.30 lifts equator: all 5 countries reachable in frame; 4 visible at once w/ arcs). REVIEW.md round-6 passes logged; PROTO VERDICT: CLEAN — PORT IT. Both proto acceptance boxes checked.
- GATE: PASS
- next: port globe into NetworkCanvas + band → statement section + docs §9

## r4 iteration 3 — globe ported into NetworkCanvas + statement section
- did: network.tsx flat-map NetworkCanvas replaced with the pass-5 globe (GLOBE_ANCHORS lat/lon, jittered Fibonacci dots, tilt +0.30, chips riding projection w/ chip-hit kept, arcs+pulses; component now fills its positioned parent); page band = statement section (display H2 two-tone + benefits sub-line over the globe, 380/540px); docs §9 rewritten. tsc clean.
- GATE: PASS
- next: in-app verification (screenshots 1440+390, reduced-motion probe, rAF frame-time sample) then final review round

## r4 iteration 4 — in-app verification (+ mobile radius must-fix)
- did: live screenshots 1440/390 (zero pageerrors); reduced-motion probe {staticFrame:true, rafCount:0, painted:true}; frame-time sample p50/p95 16.7ms (locked 60fps, one 33ms outlier). FOUND+FIXED mobile must-fix: width-driven radius made the sphere 129px w/ stacked chips → R floor clamped to 210 (component + proto), rebuilt, re-shot: mobile fills the band, chips spread.
- GATE: PASS
- next: final review round (REVIEW.md, VERDICT: INCREDIBLE — SHIP) then push/deploy/smoke

## r4 iteration 5 — final review: INCREDIBLE — SHIP
- did: fresh post-change shots (r4final-1440/390); six-lens scoring, zero must-fixes; REVIEW.md carries VERDICT: INCREDIBLE — SHIP. Final-review box checked.
- GATE: PASS
- next: push, confirm Render deploy, smoke-check → COMPLETE

## r4 iteration 6 — shipped; run complete
- did: pushed 722de5e; Render deploy live; smoke-checked /products/network (200, heading + canvas markup serving). Final box checked — ALL r4 acceptance criteria met.
- GATE: PASS (final run)
- next: none — r4 run complete

# ---- r5 run: interconnected traffic, no dead air ----
r5 run started 2026-07-13. Engine: stop-hook. Max-iters 10. Branch site/network-rebrand (continuing).
Alex: everyone also pays EU; reverse flows; country-to-country (MX-CO, CO-BR); if rotating looks off, STATIC earth with moving payments (first-class option); iterate until fully satisfied.

## r5 iteration 1 — 9-arc mesh + STATIC earth decision + Brazil crop fix
- did: GLOBE_ARCS 5→9 (component+proto); rotating-globe evidence showed ~40% dead rotation → static earth at mid-Atlantic composition (Alex's instruction, evidence logged REVIEW round 7); Brazil chip below crop → CY raised + BR lat -4; r5c shot: all five chips + live pulses in one composition. tsc + build clean.
- GATE: PASS
- next: mobile two-moment verification + reduced-motion/frame-time re-probe, then final verdict + ship
