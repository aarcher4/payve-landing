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
