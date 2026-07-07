# Payve Marketing Site — canvas design context

Standing law for the "Payve Marketing Site" Claude design project. This project polishes the VISUAL DESIGN of getpayve.com. The information architecture, section structure, and copy are LOCKED — regenerate the look, never the words or the order of sections.

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

## Locked copy rules (violations are drift, not preference)

- NO rail vendor names ever: never Astra / OatFi / Bridge / USDB / stablecoin / wallet address. Say "Bank transfer" / "Early payment financing" / "International payment".
- NO percentage rates, APR, or period rates anywhere. Financing cost = dollars + plain term: "Get $127,264.46 today instead of $129,500.50 in 28 days · $2,236.04 fee."
- Settlement timings are locked strings: financed early pay = "within one business day"; wallet/local withdrawal = "within an hour, 24/7"; US standard bank transfer receipt = "within one business day".
- Disclosure = "Payve is a financial technology company, not a bank." ONLY (no deposit/FDIC clause on marketing surfaces — Alex 2026-07-06).
- Agents = "organizational intelligence" + "automate back office workflows"; never name a chat channel.
- No em dashes in copy. No persuasion: no sell lines, loss framing, urgency, or outcome promises. Calm, factual, specific.
- Real customers only (Fortune Growers, SL Produce, Dal Campo, PH Distribution, Tierra Suelta, Vitos Trading, ASL Produce, Market Value Packhouse); real quote (Geoff Pence). Never invent testimonials, metrics, or company names.

## Anti-slop

No purple/neon gradients, no emoji status icons, no lorem ipsum, no generic "Sign up to get started" CTAs, no AI people-with-laptops art, no card-on-card-on-card stacking. Visible 2px focus ring on interactive elements; WCAG AA contrast; semantic HTML.

## The 13 pages and their locked section structures

1. `/` — Hero (headline "The money and the busywork, handled." + sub + Book a demo/Sign in + 4 floating agent-state chips over Michoacán image) → customer wordmark wall → product tour (accordion left: Payments/Early pay/Agents; animated demo right) → How it works 01-04 → Proof (Geoff Pence quote + 3 count-up stats) → Trust (4 tiles + disclosure) → CTA band (sage-900 over hills image).
2. `/products/payments`, `/products/early-pay`, `/products/agents` — PageHero (eyebrow/title/sub/CTA + hero image right) → SplitSection with the product's animated demo → FeatureGrid (6) → CTA band.
3. `/solutions/fresh-produce` — PageHero + image → StatStrip (3 sourced stats) → 2 SplitSections (early-pay demo, agents demo) → FeatureGrid (6) → CTA band. `/solutions/seafood`, `/solutions/packaging` — PageHero + image → StatStrip → FeatureGrid (6) → CTA band.
4. `/customers` — hero + bridge banner + wordmark wall → 3 metric-headline story cards → CTA band. `/customers/{slug}` — dark StoryHero over bridge image → 3-stat band → editorial body with pull quote → "What they run on Payve" chips → related stories → CTA band.
5. `/security` — PageHero + image → FeatureGrid (6 trust items) → "About your funds" prose → CTA band. `/company` — PageHero + image → prose → CTA band.

The exact copy for every section lives in `marketing-copy-inventory.md` (this bundle). Render it verbatim.
