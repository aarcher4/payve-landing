# Payve Network Rebrand — Experimental Branch

## Context

The payve landing site (`C:\Users\Alex Archer\Desktop\payve-landing`, deployed on Render, targeting getpayve.com) currently markets three products: Payments, Early pay, and Payve Agents. Alex wants to trial a rebrand around a **network** concept on a new branch — keeping the existing `site/pr16-solutions-content` PR stack fully intact — where the company has exactly **two products**:

1. **The Payve Network** — enroll once; send instant cross-border payments across the US, Mexico, Colombia, Brazil, and the EU; global accounts; connected data that agents can read for reconciliation; and the flagship sell: enrolling **unlocks liquidity for your suppliers** (early pay), who can enroll and extend the same to *their* vendors — a named cascade.
2. **Agentic Intelligence** — AI agents running on the network's connected data (today's "Payve Agents", reframed).

Decisions locked with Alex:
- **Two products only** in the nav; payments/early-pay/global accounts become features *inside* the Network story.
- **Full-site rebrand** on the branch — but the **homepage keeps its current general structure and details** (same section arc, proof, trust), with copy adjusted to the two-product network framing. No hero blow-up.
- **Softer fee framing** — "no wire fees / no per-transaction fees", not an absolute "free" promise.
- **All five corridors presented uniformly** as the network (US, MX, CO, BR, EU).
- **Evolve the existing design system** (Industrial Confidence sage/paper + Geist + the documented motion system) — add flowing network expression, don't replace the brand.

## Research foundations (from the positioning study)

Patterns to encode (verbatim analog examples researched from Visa, Wise, C2FO, Taulia, BILL, Paystand, PrimeRevenue, Tradeshift):
- **Connect once, reach everyone** — enrollment framed as one small act with permanent payoff (BILL: "share details once"; C2FO: "two clicks gets you paid early").
- **The cascade is unclaimed territory** — no competitor names the recursion ("when you enroll, your suppliers get paid faster; when they enroll, so do theirs"). State it in exactly **one sentence**, then prove with specifics (the BILL method).
- **Day-one value must stand alone** (Marco Polo failure mode) — every headline must survive "what do I get if I'm the only member today?" Answer: instant cross-border payment + global accounts + agent-ready data.
- **Supplier-side benefits are three-layered**: speed → visibility/certainty → grow the relationship, win more business. Free for the invited party, always explicit.
- **Vocabulary**: *enroll* (institutional, ownable — rarer than "join"), *unlock/accelerate/release* (never lend/finance/factor), *member*. Flywheel expressed as concrete benefit, never the phrase "network effects."
- **Banned words**: seamless, frictionless, revolutionize, reimagine, ecosystem, solution, leverage, empower, next-generation. No literal node-and-mesh hero graphics, no me-too Stripe gradient.
- **Visual code for "network" in 2025-26**: motion (things visibly traveling), an accent reserved for money-movement moments (Ramp's pattern), place-based corridor texture (Wise's pattern) — all compatible with the existing system.

## Branch & repo mechanics

- Repo: `Desktop\payve-landing` (Next.js 15 App Router, Tailwind, framer-motion, Geist). Clean tree, currently on `site/pr16-solutions-content`.
- Create branch **`site/network-rebrand`** off `site/pr16-solutions-content`. Push; open a **draft PR based against `site/pr16-solutions-content`** so the diff shows only the rebrand. Existing stack untouched.
- Render deploys from dashboard config (no render.yaml); note in the PR that previewing requires pointing a Render preview/service at this branch.

## Step 1 — Positioning spec doc

`docs/network-rebrand.md`: the two-product architecture, the one-sentence cascade, vocabulary/banned-words tables, softer-fee claim wording, corridor list, and the design-evolution rules below. This is the single reference for all copy in later steps (and for keeping `public/llms.txt` in sync).

## Step 2 — Design-system evolution (evolve, don't replace)

All in existing token/component files (`app/globals.css`, `tailwind.config.ts`, `app/components/site/`):
- **Flow motif**: a `FlowLine` component — a thin SVG path with a traveling pulse (money visibly moving), used as the *one ambient element* per page (per `docs/motion-system.md` rules; `prefers-reduced-motion` collapses it). Sage palette only.
- **Cascade visualization**: `CascadeFlow` component — enrolled member lights up → payment lines extend to suppliers → a supplier lights up and extends its own lines. Reveal-once, framer-motion, no scroll hijack. This is the Network page's hero demo (peer of the existing `PaymentsDemo`/`EarlyPayDemo` in `app/components/site/demos.tsx`).
- **Corridor strip**: `CorridorStrip` — the five regions (US · Mexico · Colombia · Brazil · European Union) with the existing atmosphere-photography treatment (assets in `public/images/`, Midjourney prompt library in `docs/midjourney-prompts.md` if new imagery is needed). Uniform presentation, no live/coming split.
- **Accent rule**: brighter sage stops (`--sage-500`) appear only where money moves or a member lights up — codified in the spec doc.
- Softer section rhythm on the two product pages (more generous curves/whitespace between bands), while keeping type, palette, hairlines, and the locked token file untouched.

## Step 3 — Information architecture

- **Nav** (`app/components/site/config.ts`): Products ▾ → **The Payve Network** (`/products/network`) · **Agentic Intelligence** (`/products/agentic-intelligence`). Solutions/Customers/Company unchanged as nav items. Footer mirrors.
- **Redirects** in `next.config.ts`: `/products/payments`, `/products/early-pay` → `/products/network`; `/products/agents` → `/products/agentic-intelligence`.
- **Sitemap/robots/metadata** (`app/sitemap.ts`, `app/layout.tsx`): new routes, updated title/keywords ("payment network", "agentic intelligence", "working capital network").
- **`public/llms.txt`** rewritten to the two-product framing.

## Step 4 — `/products/network` (new page, merges payments + early-pay)

Section arc using existing components (`PageHero`, `SplitSection`, `ValueList`, `StatStrip`, `QuoteBand`, `CtaBand`) plus the new `CascadeFlow`/`CorridorStrip`:
1. Hero — network category claim + the one-sentence cascade; softer fee line ("no wire fees, no per-transaction charges").
2. **Enroll** — the connect-once moment (reuses onboarding copy patterns; enrollment unlocks everything below).
3. **Move money** — instant cross-border, `CorridorStrip` (all five corridors), global accounts; port the strongest content from `/products/payments` (PaymentsDemo, "One payment run").
4. **Unlock your suppliers** — the liquidity cascade: suppliers get paid early on approved invoices, see exact dollars before deciding (port EarlyPayDemo); benefits ladder: paid faster → certainty/visibility → stronger relationships, win and secure more business, more profit. Free for suppliers, explicit.
5. **Connected data** — every network payment is structured data agents can reconcile; the bridge section that cross-sells Agentic Intelligence.
6. QuoteBand (existing Fortune Growers quote) + CtaBand.

## Step 5 — `/products/agentic-intelligence` (reframe of agents page)

Move/rename `app/products/agents/` → `app/products/agentic-intelligence/`. Keep the strong existing content (organizational intelligence, Loops, approval-gate trust story, AgentsDemo/LoopsDemo) and reframe the top: agents are powerful *because the network's data is already connected* — reconciliation, briefings, and back-office loops run on network data ("your network already knows" angle). Cross-sell back to the Network.

## Step 6 — Homepage (same structure, network-adjusted copy)

Keep the existing arc and details: `Hero → LogoWall → ProductTour → HowItWorks → MidCta → Proof → TrustSection → CtaBand` (`app/components/home/`). Changes only:
- **Hero**: keep the headline pattern and general copy; subheadline updated to the two-product framing (network + agentic intelligence) with the cascade sentence woven in.
- **ProductTour**: three accordion rows become **two** — The Payve Network (payments + corridors + supplier liquidity) and Agentic Intelligence — links updated to new routes.
- **HowItWorks**: step 01 "Connect" becomes "Enroll"; step 04 reflects network money movement; customer proof mini-cases stay.
- Optionally the homepage's one ambient element becomes a subtle `FlowLine` through the ProductTour band.
- Proof, TrustSection, LogoWall, CtaBand: untouched except link/label fixes.

## Step 7 — Solutions, customers, and remaining pages (light rebrand pass)

- `/solutions/fresh-produce`, `/solutions/seafood`, `/solutions/packaging`: retitle "Supplier liquidity"-type sections into network-membership language ("your growers join the network…"), swap product names/links, keep structure and research-grounded stats.
- `/customers` + story pages: label-level only (chips "Payve Agents" → "Agentic Intelligence", product references updated). Drafts stay drafts.
- `/company`, `/security`: product-name references updated; security page gains one line on network data isolation if natural. Disclosure line ("financial technology company, not a bank") stays everywhere.

## Verification

1. `npm run build` — exit 0, all static pages generate (currently 24; expect same ±new/renamed routes).
2. `node scripts/walk.mjs` — full route walk at 1440/390 must be CLEAN, including the two new product routes.
3. Redirect checks: `/products/payments`, `/products/early-pay`, `/products/agents` 308 → new routes (curl against `next start`).
4. `npm run visual-diff` — expect intentional diffs on rebranded pages; confirm near-zero diff on customers/privacy/terms (light-touch pages).
5. Manual pass at localhost: motion honors `prefers-reduced-motion`; one ambient element per page; banned-words grep across `app/` (`seamless|frictionless|ecosystem|revolutioniz|reimagin`...) returns zero.
6. Content oracle greps: cascade sentence appears exactly once per page at most; "enroll" present on network page; no absolute "free" claims; all five corridors named on `/products/network`.
7. Push `site/network-rebrand`, open draft PR against `site/pr16-solutions-content` with before/after screenshots; note Render branch-preview instructions.
