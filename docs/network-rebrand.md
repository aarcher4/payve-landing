# Payve Network rebrand — positioning + copy spec

Single source of truth for all copy on branch `site/network-rebrand`. Every page edit conforms to this
doc. Research base: positioning study of Visa/Visa Direct, Wise Platform, C2FO, Taulia, PrimeRevenue,
BILL, Paystand, Tradeshift, Melio, SWIFT gpi (2026-07-12). Keep in sync with `public/llms.txt`.

## 1. Product architecture — exactly two products

| Product | Route | What it is |
|---|---|---|
| **The Payve Network** | `/products/network` | Enroll once. Move money instantly across borders, hold global accounts, and unlock on-demand working capital for every supplier you pay. Payments, early pay, and global accounts are *features inside* this product — never named as standalone products. |
| **Agentic Intelligence** | `/products/agentic-intelligence` | Agents that run on the network's connected data: reconciliation, briefings, order entry, document matching, Loops — a person approving every write. Powerful *because* the network's data is already connected. |

Everything else on the site (solutions, customers, security) frames itself in terms of these two.

## 2. The cascade — Payve's unclaimed territory

No competitor names the recursion. We state it in **exactly one sentence per page, maximum**, then
prove with specifics (the BILL method: name it once, then only ever show results).

Canonical sentence (adapt tense/person per page, keep the two-beat shape):

> **When you enroll, every supplier you pay gains instant payment and on-demand working capital — and when they enroll, so do theirs.**

Rules:
- The cascade is upside, never prerequisite. Every headline must survive: *"what do I get if I'm the
  only member today?"* Day-one answer: instant cross-border payment, global accounts, agent-ready data.
- Never lecture about "network effects" (investor vocabulary; banned). Show the flywheel as concrete
  member benefit.

## 3. Vocabulary

| Say | Never say |
|---|---|
| enroll, enrollment (the ownable institutional verb) | sign up, onboard (in headlines) |
| member, your network | user, ecosystem |
| unlock, accelerate, release working capital | lend, loan, finance, factoring, borrow |
| instant, same-day, the day you approve | real-time (overused), seamless/frictionless |
| suppliers choose / elect / see the exact dollars first | automatic early pay (agency is the point) |
| connected data, one record of every payment | data lake, integration layer, plumbing/rails vendors |

Supplier benefits are always the three-layer ladder, in order: **paid faster → certainty & visibility
→ stronger relationships, win and secure more business, more profit.** Free-for-suppliers is stated
explicitly ("Suppliers enroll at no cost") — the invited party never pays to join.

## 4. Fee framing (locked decision: softer, defensible)

- Allowed: "no wire fees", "no per-transaction charges between members", "suppliers enroll at no
  cost", "keep the spread banks take".
- Banned (absolute claims): "free", "for free", "$0", "zero fees", "no transaction costs", "100% free".

## 5. Corridors (locked decision: five, uniform)

**United States · Mexico · Colombia · Brazil · European Union** — always all five, always presented
uniformly (no live/coming split anywhere on this branch). Pay in USD, MXN, COP, BRL, EUR.

## 6. Banned words (enforced by `scripts/verify-rebrand.mjs`)

seamless · frictionless · revolutionize · reimagine · ecosystem · next-generation · cutting-edge ·
empower · "network effects" — plus the absolute fee claims above. Replace every instinct toward these
with a measurable or concrete claim.

## 7. Page-level copy directions

- **Homepage** — keeps its current section arc and general details (locked). Hero headline stays
  "The money and the busywork, handled." Subhead reframes to the two products and carries the
  page's single cascade sentence. ProductTour: 3 rows → 2 (The Payve Network / Agentic
  Intelligence). HowItWorks step 01 "Connect" → "Enroll".
- **/products/network** — H1: "The payment network for the fresh supply chain." Arc: Enroll →
  Move money (five corridors, PaymentsDemo) → Unlock your suppliers (EarlyPayDemo, benefits
  ladder) → Connected data (bridge to Agentic Intelligence).
- **/products/agentic-intelligence** — angle: "your network already knows." Agents reconcile,
  brief, and act because every payment, invoice, and election already lives as connected network
  data. Keep Loops, approval gate, live demos.
- **Solutions** — supplier-liquidity sections become network-membership language ("your growers
  enroll…"); structure and research stats stay.
- **Customers / company / security** — label pass only: "Payve Agents" → "Agentic Intelligence",
  product links updated. Never edit customer quotes. Disclosure line stays site-wide:
  "Payve is a financial technology company, not a bank."

## 8. Design evolution rules (evolve Industrial Confidence β — never replace)

- Color tokens, type (Geist), hairlines, elevation: **unchanged**. New CSS vars may be added for
  motion only.
- **Flow motif**: `FlowLine` — a thin sage SVG path with a traveling pulse (money visibly moving).
  It is the *one ambient element* on any page it appears on (motion-system rule), reveal-once,
  collapses under `prefers-reduced-motion`.
- **Cascade visualization**: `CascadeFlow` — member lights up → payment lines extend to suppliers →
  a supplier lights up and extends its own. The Network page's hero-adjacent demo.
- **Corridor strip**: `CorridorStrip` — five regions with the existing atmosphere-photography
  treatment. Uniform.
- **Accent rule** (Ramp pattern): brighter sage stops (`--sage-500`+) appear only where money moves
  or a member lights up — CTAs, live counters, pulse dots, cascade nodes.
- No literal node-and-mesh hero graphics; no me-too mesh gradients. Network is expressed through
  motion, reserved accent, and corridor texture (Wise pattern).
