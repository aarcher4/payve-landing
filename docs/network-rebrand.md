# Payve Network rebrand — positioning + copy spec

Single source of truth for all copy on branch `site/network-rebrand`. Every page edit conforms to this
doc. Research base: positioning study of Visa/Visa Direct, Wise Platform, C2FO, Taulia, PrimeRevenue,
BILL, Paystand, Tradeshift, Melio, SWIFT gpi (2026-07-12). Keep in sync with `public/llms.txt`.
Discipline per payve-fintech's `design-system-sync` skill (r2 pass, 2026-07-13): docs first, canonical
tokens only, translation layer (no vendor names), tabular numerics, screenshot-verify before done.
App-direct implementation; canvas re-sync deferred (documented exception).

## 0. Copy style (r2 + r3, Alex)

- **No em dashes in copy.** Break the sentence in two, or use a colon or comma. (Code comments exempt.)
- Explain the network in three plain beats wherever it is introduced:
  **instant payments** (any supplier, their own currency, one approval) ·
  **liquidity** (suppliers elect early payment on approved invoices) ·
  **operating account + connected data** (fund once; every payment lands as data).
- Product names: **Network** and **Intelligence** in nav, footer, and selector rails. Full names
  "The Payve Network" / "Agentic Intelligence" in H1s and prose where natural.
- **"Operating account"**, never "global account".

### r3 voice rules — benefits first (designer-for-the-audience)

- **"Corridor" is banned in customer-facing copy** (gate-enforced). It is our word, not the
  customer's. Country and currency names are concrete and always welcome.
- **Benefits-first test**: every headline, eyebrow, and blurb must answer "what do I get" or
  "what problem disappears," never "what the feature is." Write for a produce buyer or grower.
- Canonical benefit lines (weave, don't repeat verbatim everywhere):
  - Instant: "Send a payment on the network and it's there." / "received instantly"
  - Liquidity: "connected to global liquidity, so your suppliers get the capital they need, quicker"
  - Relationships: funded suppliers stay close, ship first, grow with you; that wins more business
- **Fee claims move down-page**: no fee talk in heros or eyebrows. "No wire fees" survives only in
  detail lists (ValueList / FeatureGrid). Absolute "free" stays banned.

## 1. Product architecture — exactly two products

| Product | Route | What it is |
|---|---|---|
| **The Payve Network** | `/products/network` | Enroll once. Move money instantly across borders, run one operating account, and unlock on-demand working capital for every supplier you pay. Payments, early pay, and the operating account are *features inside* this product — never named as standalone products. |
| **Agentic Intelligence** | `/products/agentic-intelligence` | Agents that run on the network's connected data: reconciliation, briefings, order entry, document matching, Loops — a person approving every write. Powerful *because* the network's data is already connected. |

Everything else on the site (solutions, customers, security) frames itself in terms of these two.

## 2. The cascade — Payve's unclaimed territory

No competitor names the recursion. We state it in **exactly one sentence per page, maximum**, then
prove with specifics (the BILL method: name it once, then only ever show results).

Canonical sentence (adapt tense/person per page, keep the two-beat shape):

> **When you enroll, every supplier you pay gains instant payment and on-demand working capital — and when they enroll, so do theirs.**

Rules:
- The cascade is upside, never prerequisite. Every headline must survive: *"what do I get if I'm the
  only member today?"* Day-one answer: instant cross-border payment, one operating account, agent-ready data.
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

## 5. Countries (locked decision: five, uniform)

**United States · Mexico · Colombia · Brazil · European Union** — always all five, always presented
uniformly (no live/coming split anywhere on this branch). Pay in USD, MXN, COP, BRL, EUR.
(r3: never call them "corridors" in copy; say countries, or just name them.)

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

## 9. NetworkCanvas — the network visualization (r2, Dakota grammar; r3: benefit-led heading)

r3: the band's heading is benefit language ("Send it. It's there."), not inventory language
("five corridors"). The scene itself is unchanged: country + currency chips are concrete.

Reference: dakota.xyz hero (screenshots in `design-context/reference-dakota/`), a Three.js particle
globe with thin arcs between labeled rail chips (ACH, SWIFT, USDC) and pulses traveling the arcs.
We take the **grammar** (particle arcs + boxed mono endpoint chips + traveling pulses + faint
ambient texture), translated into light Industrial Confidence. Not the dark theme.

- 2D `<canvas>`, no new dependencies. Scene: a dotted arc field on paper; five corridor endpoints
  as boxed mono chips (region + currency code); thin sage arcs; small `--sage-500` pulses traveling
  the arcs (accent only where money moves); faint `--sage-200` particle field for depth.
- Craft: devicePixelRatio-aware; rAF paused off-screen (IntersectionObserver); prefers-reduced-motion
  renders one static frame; sizes 390 to 1440 gracefully.
- Placement: the corridor band on /products/network (replaces FlowLine + CorridorStrip there).
  It is that page's ONE ambient element. CascadeFlow keeps the enrollment story in SVG, styled to
  the same grammar (dotted arcs, boxed mono chips).
- Prototype at `design-context/network-canvas-proto.html`, then port.
