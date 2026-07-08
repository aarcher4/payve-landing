# Payve Marketing Site — canvas design context

Standing law for the "Payve Marketing Site" Claude design project. This project polishes the VISUAL DESIGN of getpayve.com. The information architecture, section structure, and copy were locked at r1. The 2026-07-07 team critique (r2) unlocks ONLY the sections enumerated under "r2 unlocked sections" below; everything else remains locked. Regenerate the look, never the words or the order of sections, except where r2 explicitly changes words (the r2 copy lives verbatim in marketing-copy-inventory.md).

## r2 unlocked sections (2026-07-07 team critique)

Homepage:
- Hero: the 4 floating agent-state chips are REMOVED (they confused viewers). Background image gets more presence (regraded for visibility/saturation, lighter paper-fade). Static background stays for launch; motion hero is r3 backlog.
- Product tour accordion: stronger clickable affordance. Active item gets a clear selected treatment (sage rail/fill, color change) and a visual connection from the selected text block into the demo panel on the right. Accordion and demo panel vertically centered against each other.
- How it works: the four boxes get hover states (slight grow + color treatment, calm not flashy) and a NEW proof layer beneath the grid. Hovering or selecting a box surfaces its proof entry (customer quote / micro case / compact real example). Default state shows box 01's proof so content is never hover-gated. "No rip and replace" is visually emphasized (brand green or bold). Step 02 copy becomes "Ask questions in plain English (or Spanish), ...".
- Section rhythm: alternate backgrounds (paper / paper-elev / sage-tinted recess) to break the long gray/white stretches; subtle, never noisy.

Product pages (all three):
- New scaffold: headline, brief subhead, product animation near the top, CTA above the fold, then a hover-expand value list, then CTA band. Minimal scrolling.
- The FeatureGrid(6) is REPLACED by the value list: left-aligned list of value props with the Payve checkmark; the hovered/selected item expands to the right with its description and proof. Solutions pages keep FeatureGrid.
- Product demos on product pages may run longer/more explanatory than the homepage versions (homepage = quick proof the product exists; product page = enough to understand how it works).
- Payments: explicitly cross-border. Visuals reinforce the international use case (MXN/COP local-currency cues, cross-border payment run).
- Early pay: supplier-liquidity-first framing (suppliers get paid faster, relationships strengthen, approved invoices become capital), not financing mechanics.
- Agents: renamed "Payve Agents" everywhere (nav, tour label, page title, H1).

Customers:
- Hub: the bridge/truck banner image is REMOVED (read as fabricated). Straight into story cards after the hero copy. Card = customer logo + one-line company description + primary result/use case + click-through.
- StoryHero: no bridge image; dark sage band or a per-story image.
- Stories rebuilt per docs/case-study-template.md with the team-call content (see copy inventory): Fortune Growers voucher automation, SL Produce (Selman, organizational intelligence), Dal Campo (complexity/reconciliation), Manny (fintech/payments, naming gated on consent).

Trust/company:
- Security: hero image replaced (cold-storage/warehouse felt wrong); contact becomes infosec@getpayve.com.
- Footer/company: placeholder alex@getpayve.com removed.

r2.1 (2026-07-07 eve, Alex):
- HERO GRAMMAR UNIFIED: the five atmosphere pages (3 solutions, security, company) use the home-style FULL-BLEED BACKGROUND hero (image behind the text at 0.62 opacity under paper + sage washes, headline left, no side card). This is variant B, which won the team A/B against the side-card treatment 9 to 6.5. Product pages keep framed side-image heroes.
- LOOPS (new feature copy, Alex-approved): agents page gains a "Loops" split section ("A live pulse on the business.") with a running-loops panel (cadence tags: hourly / 15 min / 6:00 am); the "Notify me when it happens" value item becomes "Loops on a schedule"; one loops sentence each on the home See-everything proof and the FG/SL/Dal Campo stories. Claim "Every Payve customer runs loops today." approved by Alex 2026-07-07.
- Imagery: hero-security/packaging/seafood are the new truck-free Midjourney selects (see docs/midjourney-prompts.md r2; NO semi trucks rule).

r3 (2026-07-08, Alex):
- NO-CANVAS EXCEPTION: the r3 polish wave is implemented app-direct (Alex explicit, one
  iteration only, weekly canvas limit at 95%). Docs stay source of truth and are updated before
  code; a canvas catch-up batch re-syncs the canvas after Fri Jul 10 and cuts export r3. Until
  then export r2 is stale for touched sections.
- Logo: back to assets payve-logo-transparent.png in nav + footer (the dark variant read badly;
  vector SVGs still pending from the shared drive).
- Logo wall eyebrow: "Trusted by supply chain leaders" (Alex; replaces the US/Mexico/Colombia line).
- r3 scope: reference-benchmarked polish per docs/design-review-r3.md (live walks of Mercury/
  Ramp/HappyRobot/Brex): ProductTour rebuild (type-led, no icon tiles), SITE-WIDE icon diet
  (decorative icons removed; functional header/menu glyphs and in-demo working-state marks stay),
  type/spacing corrections, products/solutions/customers gap fixes, closing-CTA copy re-pick.

r4a (2026-07-08, Alex): solutions CONTENT refresh only — framework, heroes, and voice locked;
StatStrips + feature bodies re-grounded in vertical research (docs/solutions-research-r4.md:
web citations + the internal prospect corpus, insight-only, no non-customer names). Seafood is
species-broad (shrimp demoted to one of several); packaging grounded in PACA/PTI/FSMA-204/
deduction reality; produce stats verified ($35.6B replaced with $32B FY2025 ERS actuals).
Every StatStrip tile site-wide now carries a named source.

r3 locked decisions (2026-07-08, evidence in docs/design-review-r3.md):
- PRODUCT TOUR (home) = Mercury grammar on OUR tokens: full-bleed sage-900 dark chapter band;
  left rail of hairline-separated (white/10) text rows, NO icons, NO boxed rows; active row =
  small sage-400 dot + white bold title + 2-line white/70 description expansion; inactive titles
  white/60; one quiet underlined text link under the rail following the active product
  ("Explore payments" / "Explore early pay" / "Explore Payve Agents"); right = the working demo
  in its light card, crossfading per selection; mobile = demo inline under the active row.
- ICON DIET (site-wide): HowItWorks cards lose corner icons (mono 01-04 numbers carry them);
  TrustSection tiles lose icons (titles carry them); ValueList rows lose checkmarks and adopt
  the same hairline text-rail grammar (round 2). Functional glyphs stay: header chevrons/menu,
  in-demo working-state checks/status dots.
- TWO-TONE H2 device (Ramp): section H2s may split lead clause (ink-1) + second clause (ink-3);
  applied to home tour/how-it-works/proof/trust H2s where a natural clause break exists.
- CLOSING CTA (Alex pick): CtaBand H2 = "The money and the busywork, handled." (ring composition
  with the hero). MidCta keeps "See it on your own data." Subs and buttons unchanged.
- ROUND 3 (customers, evidence lens 6 / Ramp story grammar): story detail becomes two-column at
  lg with a STICKY FACT SIDEBAR (Company / Industry / What they run on Payve / About, sourced
  from customers-data), absorbing the old runs-on chip card; body sections gain small caps
  KICKERS above their H2s ("The problem" / "The solution" / "What Payve runs" register); hub
  card industry tags render as small caps tracked pairs.
- ROUND 2 (product/solutions, evidence lenses 1+7): ValueList adopts the hairline text-rail
  grammar (rows separated by hairlines, active = sage dot + bold sage-800 title, NO checkmarks,
  right expansion panel unchanged). Product pages gain a QUOTE BAND (Ramp pattern: sage-50 tinted
  full-width band, the signed Geoff Pence quote, name + company) on agents + payments, and a
  quiet CROSS-SELL text row above the CTA band (eyebrow "One platform" + text links to the other
  two products; Mercury cross-sell grammar minus the cards). Solutions/security FeatureGrid keeps
  text-only cells but swaps the boxed grid for TrustSection's border-t-2 sage rule grammar.

CTA (site-wide): label = "Schedule time with us" (Alex 2026-07-07, supersedes "Book a demo"; personal/high-touch, not big-corporate). Destination stays locked: https://zcal.co/payve (the 30-minute scheduling flow, never a generic calendar or contact form).

## r3 backlog (explicitly NOT in r2)

Motion-heavy hero revisit (slow pan, calm, industry-reflective). Company/About buildout (why the company exists, founder credibility, Silo/supply-chain background, investor logos, offices; personal, credible, not overproduced). Payments product own-name exploration (discussed, NO decision, do not act). Designer (Archer) project-based handoff. AI-interview case-study workflow (Claude interviews team, Granola finds quotes, Claude tightens).

## What this site is

The marketing site for Payve, the financial operating layer for supply chain trade. Three products (Payments, Early pay, Agents), three solution verticals (fresh produce, seafood, packaging), customer stories, security, company. 13 routes, built in Next.js at github.com/aarcher4/payve-landing. Reference quality bar: Mercury, Ramp, HappyRobot, Giga.

## Tokens (canonical: colors_and_type.css in this bundle)

Industrial Confidence (β), same system as the Payve product app. Never invent hex values.
- Page bg `--paper` #F7F8F9 (cool near-white; warm cream forbidden). Cards `--paper-elev` #FFFFFF, recess `--paper-2`.
- Ink ramp `--ink-1..4`; hairlines `--hairline`/`--hairline-2`.
- Brand sage ramp; primary CTA `--sage-700` #3B5448; dark bands `--sage-900` #1C2C26; success uses separate `--positive` #2F6A48.
- Type: Geist 400-800 (display = ExtraBold, tracking tight) + Geist Mono. NO serif.
- Radii small (2-10px); tabular numerics on every number; shadows from the `--shadow-*` tokens.

## Motion vocabulary (docs/motion-system.md in the repo)

- Reveals: opacity + 24px translate-y, 600ms, cubic-bezier(0.2,0.8,0.2,1), once, stagger 80ms capped at 5.
- One ambient element per page max (homepage hero tableau owns it).
- Product demos show agents WORKING (progress states), numbers count up, prefers-reduced-motion collapses everything.
- No scroll hijacking, no parallax stacks, nothing bounces.

## Imagery direction (v2, locked)

Golden-sunrise cinematic + bright-day action in beautiful working landscapes; distribution elements in frame (trailers, crates, cranes, combines). Images live in `public/images/` (hero-home, hero-payments, hero-early-pay, hero-agents, hero-produce, hero-seafood, hero-packaging, hero-customers, hero-security, hero-company, cta-hills, og-default). Text over images always gets a graded overlay; the paper-fade gradient on the homepage hero is the pattern.

v2.1 delta (r2, 2026-07-07 critique):
- hero-home regraded for more visibility/saturation so the image reads clearly through the paper fade.
- De-faking rule: AI imagery must never read as a fake "photo". Stylize with graded overlays, opacity, and background blends; avoid too-perfect polished scenes. Imagery is atmosphere/texture, not literal documentary proof.
- Packaging page: cardboard pallets / packaging operations imagery, not grain fields.
- Seafood page: broader seafood-industry framing, not narrow references.
- hero-customers (bridge/truck) and hero-security (cold storage) are RETIRED from their pages.

## Locked copy rules (violations are drift, not preference)

- NO rail vendor names ever: never Astra / OatFi / Bridge / USDB / stablecoin / wallet address. Say "Bank transfer" / "Early payment financing" / "International payment".
- NO percentage rates, APR, or period rates anywhere. Financing cost = dollars + plain term: "Get $127,264.46 today instead of $129,500.50 in 28 days · $2,236.04 fee."
- Settlement timings are locked strings: financed early pay = "within one business day"; wallet/local withdrawal = "within an hour, 24/7"; US standard bank transfer receipt = "within one business day".
- Disclosure = "Payve is a financial technology company, not a bank." ONLY (no deposit/FDIC clause on marketing surfaces — Alex 2026-07-06).
- Agents = "organizational intelligence" + "automate back office workflows"; never name a chat channel.
- No em dashes in copy. No persuasion: no sell lines, loss framing, urgency, or outcome promises. Calm, factual, specific.
- Real customers only (Fortune Growers, SL Produce, Dal Campo, PH Distribution, Tierra Suelta, Vitos Trading, ASL Produce, Market Value Packhouse); real quote (Geoff Pence). Never invent testimonials, metrics, or company names.
- Number provenance (r2): "800 voucher entries a month, about 3 minutes each, about 40 hours of manual entry" (Fortune Growers) is customer-sourced from the 2026-07-07 team call. The SL organizational-intelligence story (owner using the agent at night, later rolled out to the CFO and AR) and the Dal Campo complexity/reconciliation angle come from the same call. Every number stays traceable to the customer's own words, signed material, or measured platform data.
- Agents product name = "Payve Agents" (r2). Still framed as organizational intelligence + approval-gated workflows; never a chat channel.

## Anti-slop

No purple/neon gradients, no emoji status icons, no lorem ipsum, no generic "Sign up to get started" CTAs, no AI people-with-laptops art, no card-on-card-on-card stacking. Visible 2px focus ring on interactive elements; WCAG AA contrast; semantic HTML.

## The 13 pages and their locked section structures

1. `/` — Hero (headline "The money and the busywork, handled." + sub + Schedule time with us over the regraded Michoacán image; NO floating chips) → customer wordmark wall → product tour (accordion left: Payments/Early pay/Payve Agents with strong selected affordance + connector into the animated demo right; vertically centered) → How it works 01-04 (hover states, "No rip and replace" emphasized) + proof layer beneath (4 proof entries keyed to the boxes; default 01) → Proof (Geoff Pence quote + 3 count-up stats) → Trust (4 tiles + disclosure) → CTA band (sage-900 over hills image).
2. `/products/payments`, `/products/early-pay`, `/products/agents` — PageHero (eyebrow/title/sub/CTA + hero image right, CTA above fold) → SplitSection with the product's animated demo near the top (extended variant) → hover-expand value list (left checkmark list, active item expands right with description/proof) → CTA band. Payments = cross-border-explicit; Early pay = supplier-liquidity-first; Agents page = "Payve Agents".
3. `/solutions/fresh-produce` — PageHero + image → StatStrip (3 sourced stats) → 2 SplitSections (early-pay demo, agents demo) → FeatureGrid (6) → CTA band. `/solutions/seafood`, `/solutions/packaging` — PageHero + image → StatStrip → FeatureGrid (6) → CTA band. (Imagery per v2.1 delta.)
4. `/customers` — hero copy (no banner image) → wordmark wall → story cards immediately (customer logo + one-line company description + primary result + click-through) → CTA band. `/customers/{slug}` — StoryHero (dark sage band or per-story image, never the bridge) → 3-stat band → editorial body with pull quote → "What they run on Payve" chips → related stories → CTA band.
5. `/security` — PageHero + replacement image → FeatureGrid (6 trust items) → "About your funds" prose (contact infosec@getpayve.com) → CTA band. `/company` — PageHero + image → prose (no placeholder email) → CTA band.

The exact copy for every section lives in `marketing-copy-inventory.md` (this bundle). Render it verbatim.
