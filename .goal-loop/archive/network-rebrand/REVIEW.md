# Design review log — network rebrand

## Round 1 — 2026-07-12 (post iter-7 build, screenshots .goal-loop/screens/r1/, reduced-motion, 1440+390)

Deep-reviewed: home (1440), products/network (1440+390), products/agentic-intelligence (1440),
solutions/fresh-produce (1440). Remaining pages/viewports walk-verified only this round; deep review
owed in round 2.

### MUST-FIX

1. **CascadeFlow illegible at 390** (products/network, home tour). The 700-wide SVG scales to ~358px;
   node labels render ~5px. Fix: mobile (<sm) gets a stacked-list variant of the same story (You →
   your suppliers paid → one enrolls → its suppliers unlock, with status chips); SVG stays sm+.
2. **Footer tagline stale**: "Payments, early pay, and agents for supply chain trade." — pre-rebrand
   three-product line under the logo on every page. → "The payment network for supply chain trade."
3. **CrossSell eyebrow hardcoded "One platform"** (ProductPage.tsx) — rebrand vocabulary says network.
   → "One network" (shows on both product pages).
4. **CorridorStrip floats context-free** on products/network between Enroll and Move money — a bare
   grid with no eyebrow/heading; reads orphaned. → give it a t-eyebrow header ("Five corridors, one
   network") inside the same section container.
5. **FlowLine unused** — the brief's ambient "flowing network" signature appears nowhere. → place as
   the ONE ambient element on products/network (quiet, above/behind the corridor strip band).
   Home already has its ambient element (hero atmosphere) — do NOT add there.

### SHOULD-FIX (polish)

6. CascadeFlow header status order: shows "Suppliers unlocked" at step 0 before anything unlocks.
   → step-appropriate: "Enrolled" → "Suppliers unlocked" → "Network growing".
7. CascadeFlow desktop node labels are borderline small (10.5px in 700 viewBox ≈ 7.8px rendered).
   → bump to 12/10 and widen node rects.
8. ProductTour rail (home) is vertically sparse with 2 rows vs the 452px demo panel. → add a quiet
   corridor line under the Explore link ("United States · Mexico · Colombia · Brazil · European
   Union") in white/40 mono — reinforces network reach and balances the column.

### Reads well (keep)

- Home hero: headline + cascade subhead land clearly; arc unchanged and coherent.
- products/network arc: Enroll → Move money → Unlock → Connected data tells the story in the right
  order; PaymentsDemo/EarlyPayDemo/AgentsDemo port cleanly.
- Agentic Intelligence page: "already knows your business" + network-data framing is credible;
  Loops and approval-gate content intact.
- Fresh-produce: enroll-at-no-cost grower paragraph reads naturally; stats band credible.

VERDICT: NOT YET — 5 must-fixes open.

## Round 2 — 2026-07-13 (post iter-9 fixes, screenshots .goal-loop/screens/r2 + r2b)

### Round-1 fixes verified visually
1. CascadeFlow @390: stacked tree legible, status chips read; desktop labels 12px clear. ✔
2. Footer tagline "The payment network for supply chain trade." on every page. ✔
3. CrossSell eyebrow "One network". ✔
4. Corridor band: FlowLine + "Five corridors, one network" eyebrow — reads intentional. ✔
5. FlowLine live as the network page's one ambient element. ✔
6-8. Status order / label size / tour corridor line. ✔

### NEW — CRITICAL (found & FIXED this round)
9. **Reduced-motion users got permanently blank customers + company pages** (pre-existing, also on
   the pr16 base): Reveal returned a plain <div> under prefers-reduced-motion, leaving framer's SSR
   inline `opacity:0` style in place on pages with no other client re-render. Probed and confirmed
   (computed opacity 0 on h1 wrappers). FIX: Reveal's reduced branch now renders the same motion.div
   driven instantly to the final state (initial={false}, animate opacity 1, duration 0). Verified
   opacity 1 on /products/network, /customers, /company under reduce; full-page screenshots now
   capture complete pages.

### MUST-FIX (open, small)
10. Customers hub hero sub still three-product phrasing: "…use Payve to pay suppliers, offer early
    pay, and put agents on their back office." → network phrasing ("pay suppliers across the
    network, unlock early payment for them, and put agentic intelligence on the back office").
    Same page metadata description too.

### Deep-review coverage
home ✔, products/network ✔ (1440+390), products/agentic-intelligence ✔, fresh-produce ✔,
customers ✔ (r2b). Remaining to eyeball in round 3: seafood, packaging, company, security (all
template pages sharing PageHero-atmosphere + FeatureGrid; low delta) + home-390.

VERDICT: NOT YET — 1 small must-fix open + round-3 sweep owed.

## Round 3 — 2026-07-13 (post iter-11 fix, screenshots .goal-loop/screens/r3 — taken AFTER the last code change)

- Fix #10 verified: customers hub hero + metadata now network-phrased. ✔
- company (1440): renders fully post-Reveal-fix; "the network that moves your money" + enroll copy + 5 corridors. ✔
- seafood (1440): network sub + "suppliers who enroll" grid item; stats intact. ✔
- packaging (1440): supplier-side network framing lands; grid + stats intact. ✔
- home (390): full arc renders; cascade stacked tree legible in tour; corridor line balances rail; proof/trust intact. ✔
- Coverage: every rebranded page screenshotted at 1440+390 (r3); deep-eyeballed home/network/agentic/fresh-produce/customers/company/seafood/packaging (+ 390 variants of home & network). Security carried zero copy changes on this branch (pre-polished template page; walk-clean, screenshots captured).

Scoring against the bar:
- **Clarity**: two products, one cascade sentence per page, day-one value stated before network upside on every surface. Nav→page→footer naming is now fully consistent.
- **Credibility**: softer fee framing everywhere ("no wire fees", never "free"); specific numbers (800 vouchers, 40 hours, USDA/NOAA/FBA-sourced stats); no banned vocabulary; customer quotes untouched; disclosure line site-wide.
- **Craft**: Industrial Confidence system intact (locked tokens untouched); network expressed the way 2025-26 leaders do it — motion (FlowLine pulse, CascadeFlow), accent reserved for money-moving moments, corridor texture — not mesh clichés; one ambient element per page; reduced-motion now renders complete final states (a11y improved beyond the base branch).

Zero must-fix critiques open. This pass postdates the last code change.

VERDICT: EXTRAORDINARY — SHIP

## Round 4 — 2026-07-13 (r2 refinement pass, Alex's notes; screenshots .goal-loop/screens/r4-*)

Scope: design-system-sync discipline (docs first, app-direct); em-dash purge (15 removed, now
gate-enforced); nav/rail → Network / Intelligence; "operating account" replaces "global account"
(gate-enforced); network explained in three beats (instant payments · liquidity · operating account
+ connected data) on the network hero; NetworkCanvas shipped.

- NetworkCanvas (1440): dotted sage arcs between boxed mono corridor chips, pulses traveling,
  particle field subtle; Dakota grammar translated into light Industrial Confidence. ✔
- NetworkCanvas (390): chips abbreviate (US · USD), scene stays legible at 300px. ✔
- Home tour: "Network" / "Intelligence" rail; three-beat blurb; corridor mono line. ✔
- CascadeFlow: mono uppercase sub-labels + rx-4 chips match the new grammar. ✔
- Gate: PASS with new em-dash + operating-account checks live.

VERDICT: EXTRAORDINARY — SHIP (r2)

## Round 5 — 2026-07-13 (r3 benefits-voice pass; screenshots .goal-loop/screens/r5-*)

In-context copy read against docs/network-rebrand.md §0 r3 voice rules:

- Network hero: "Payments sent on the network arrive instantly: any supplier, any country, paid in
  their own currency. Every member is connected to global liquidity, so your suppliers can take the
  capital they need the moment they need it. Funded suppliers stay close, ship first, and grow with
  you." Benefits only; zero mechanics, zero fee talk, zero jargon. ✔
- Canvas band: "SEND IT. IT'S THERE." over the animated map; heading and visual now say the same
  thing. ✔
- Home tour (Network): send-and-it's-there + suppliers connected to capital. Rail reads Network /
  Intelligence. ✔
- Voice test applied line-by-line to every headline/eyebrow/blurb changed in r3: all answer
  "what do I get" in customer words. "Corridor" gone from copy site-wide (gate-enforced). Fee facts
  survive only in detail lists. Countries and currencies stay concrete (canvas chips, tour rail
  line, HowItWorks descriptor).
- Full-site assurance this round: gate walk CLEAN across all 18 routes at 1440/390 with zero console
  errors; copy rules enforced by grep site-wide; pages untouched by r3 carry their round-3/4
  verdicts unchanged.

Zero must-fix critiques. This pass postdates the last code change (r5 screenshots taken after
iter-2 commit; no code changed during this round).

VERDICT: HIGHER ESSENCE — SHIP

## Round 6 (r4 globe) — proto pass 1 — 2026-07-13 (.goal-loop/screens/proto2-*)

Scene built: Fibonacci sphere (800 dots), Y-spin + X-tilt, anchors from lat/long, chips riding
projection, slerped surface arcs + pulses, bottom-crop composition under the display heading.

### MUST-FIX (pass 1 → pass 2)
1. Sphere does not READ as a sphere: dots far too faint/sparse (form dissolves into noise).
   → 1300 dots; front alpha 0.10 + 0.72·f^1.35; radius 0.8 + 1.3f; sage-600 for f>0.6; back floor 0.10.
2. Radius too large / center too low: curvature so gentle it reads as an arch, not a globe.
   → R = min(W·0.33, H·0.72), CY = H + R·0.18 (visible curvature, unmistakable sphere).
3. Rotation phase centers the Atlantic: only US + EU chips visible, Americas back-side.
   → base rotation W0 = -2.88 rad so the Americas face front at t0 and in the reduced-motion frame.
4. Chips float on emptiness (consequence of 1) and fade too aggressively → vis window widened.
5. Arcs sub-visible → alpha up (0.22 + 0.4·frontness); limb stroke 0.35.

Heading/sub composition works (two-tone display over the crop). Rotation speed slowed 26→30s.
VERDICT: NOT YET (pass 2 owed)

## Round 6 (r4 globe) — proto passes 2-5 — 2026-07-13

- Pass 2 (fixes 1-5 from pass 1): sphere now READS (1300 dots, stronger falloff, smaller R, limb).
  New finds: Fibonacci lattice too regular (polka-dot fabric); rotation phase hides Americas; glow
  edge shows as a pale dome; composition can tighten.
- Pass 3: per-dot hash jitter + size variance → organic field ✔; W0 phase + quieter glow + CY
  tightened. New find: Americas hug the right limb at first view.
- Pass 4: phase centered, arc dots 1.3px + alpha up. STRUCTURAL FIND: negative tilt pushes
  equator/southern anchors (Colombia, Brazil) permanently below the band crop — 2 of 5 countries
  could never appear.
- Pass 5: TILT flipped to +0.30 (viewer looks slightly down at the globe): equator lifts into frame;
  EU, US, MX, Colombia visible simultaneously with arcs traveling (US→EU arching over the top);
  Brazil rotates through. Mobile (390): sphere reads, chips abbreviate, arcs legible.

Pass 5 judgment against the bar (sphere legibility ✔ / dot falloff ✔ / rotation speed ✔ 30s /
chip tracking ✔ / arc elegance ✔ / composition with heading ✔): zero must-fixes.
PROTO VERDICT: CLEAN — PORT IT.

## Round 6 (r4 globe) — FINAL — 2026-07-13 (post-change shots .goal-loop/screens/r4final-*, post mobile-clamp)

Scored against the six lenses on fresh post-change screenshots (1440 + 390; mobile also verified
post-clamp in r4app-globe-390b):
- Sphere legibility: unmistakable globe; organic jittered field, z-graded size/alpha, grounded limb. ✔
- Dot falloff: front sage-600 presence → faint sage-300 back texture; real depth. ✔
- Rotation: 30s/rev, tilt +0.30 keeps all five countries reachable; Americas front at first view
  and in the reduced-motion frame. ✔
- Chip tracking: chips ride the projection, fade/scale at the limb (EU mid-fade in the final shot
  while US/MX/CO sit front); mobile abbreviates and no longer stacks. ✔
- Arc elegance: dotted slerped arcs with lift; pulse visible cresting the US→EU arc over the
  sphere crown; chip-hit flashes on arrival. ✔
- Composition: two-tone display H2 + benefits sub-line breathe above the crown; band borders
  frame the crop; the section reads as the page's statement piece without fighting the demos. ✔
Technical: zero pageerrors; reduced-motion = static painted frame, rafCount 0; frame times
p50/p95 16.7ms. Gate green with all copy checks.

Zero must-fix critiques. This pass postdates the last code change (radius clamp).

VERDICT: INCREDIBLE — SHIP

## Round 7 (r5 interconnected traffic) — 2026-07-13

### Mesh 5 → 9
Added CO↔EU, BR↔EU (everyone pays Europe), MX↔CO, CO↔BR (countries pay each other); durations
5.6-9.2s, scattered phases; per-cycle direction alternation kept (reverse flows).

### Rotating vs static — DECISION: STATIC (evidence-based, per Alex's instruction)
Two-moment shots on the ROTATING globe (r5-m1/m2-1440): moment 1 rich; moment 2 (+9s) near-blank —
the rotation carries all five anchors to the back hemisphere for ~40% of every revolution, so no
amount of arcs fixes the dead air. Switched to a STATIC earth at a mid-Atlantic composition
(wStatic = -2.269 rad ≈ lon -40 front): all five countries on the visible hemisphere, payments
moving continuously. Rotation code path removed from the draw; pulses consume the clock.

### Post-change fixes
- Brazil chip landed below the bottom crop in the static frame → sphere raised (CY = H + 0.05R)
  and BR display latitude nudged -10 → -4 (artistic license per Alex: "don't have to be super
  specific"). r5c-1440: ALL FIVE chips visible in one composition, EU left, US/MX/CO/BR right,
  pulses live on multiple arcs simultaneously.
- Arc clutter check at 9 arcs on the static sphere: reads as texture, not noise — no alpha change
  needed. EU arrival flashes are debounced per-chip (hits map) — no strobe.

Remaining for next pass: mobile two-moment verification + frame-time/reduced-motion re-probe, then
final verdict.

### Round 7 — mobile + technical verification (r5 iteration 2)
- Mobile two-moment (r5c-m1/m2-390): ALL FIVE chips visible in both frames, composition stable,
  pulse positions differ between moments (traffic moving), zero pageerrors. No dead air at 390. ✔
- MX chip clipped at the right viewport edge → chip x clamped to [46, W-46] (component + proto);
  labels stay fully readable, desktop unaffected. ✔
- Reduced-motion: static painted frame confirmed. Frame times with 9 arcs: p50/p95 = 16.7ms. ✔

### Round 7 — FINAL (post chip-clamp shot r5final-390)
MX chip fully on-screen; all five countries in frame with live traffic. Desktop verified r5c-1440.
The scene now reads as a proper interconnected network: nine bidirectional routes, everyone paying
Europe, countries paying each other, no moment without visible movement, static earth holding one
composed frame. Zero must-fix critiques; this pass postdates the last code change.

VERDICT: ALIVE — SHIP
