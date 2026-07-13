# Payve Network Rebrand — r3: Benefits-First Customer Voice

## Context

r2 shipped (Network/Intelligence nav, no em dashes, operating account, NetworkCanvas). Alex's r3 note, from a designer-for-the-audience perspective: **customers don't care about corridors** or feature mechanics. The theme is the *benefits of the network*: payments are sent on the network and received instantly ("you send it, and it's there"), members are connected to **global liquidity** so suppliers get the capital they need quicker, and that builds stronger relationships. De-emphasize fee talk in headline positions (keep the factual "no wire fees" in detail lists). Every section must answer: what does the member get, what problem does this kill.

All changes on `site/network-rebrand`; copy-only plus one eyebrow/label pass — no structural or component changes. The NetworkCanvas stays exactly as built (country + currency chips are concrete, not jargon); only its heading and aria text change.

## Voice rules (added to docs/network-rebrand.md §0)

- **"Corridor" is banned in customer-facing copy** (gate-enforced). Country names are welcome; the word corridor is ours, not theirs.
- Benefits-first test: every headline/eyebrow/blurb answers "what do I get" or "what problem disappears," not "what the feature is."
- Canonical benefit lines to weave (Alex's words, polished):
  - Instant: "Send a payment on the network and it's there." / "received instantly"
  - Liquidity: "connected to global liquidity, so your suppliers get the capital they need, quicker"
  - Relationships: "funded suppliers ship first / stay close / grow with you" → win more business
- Fee claims move down-page: no fee talk in heros/eyebrows; "no wire fees" survives only in detail lists (ValueList/FeatureGrid). Absolute "free" stays banned.

## Copy changes by file

1. **`app/products/network/page.tsx`**
   - Canvas band eyebrow: "Five corridors, one network" → **"Send it. It's there."**
   - Hero sub → benefits voice, e.g.: "Payments sent on the network arrive instantly: any supplier, any country, paid in their own currency. Every member is connected to global liquidity, so your suppliers can take the capital they need the moment they need it. Funded suppliers stay close, ship first, and grow with you."
   - Metadata description to match (instant + global liquidity + relationships, no corridor).
   - ValueList title touch-ups where feature-y: "Fast supplier receipt" → "Received in minutes, not days" (body unchanged); others already read as benefits.
   - "Move money" section body: drop residual fee-forward phrasing from the first sentence if it reads feature-first; keep facts.
2. **`app/components/site/network.tsx`** — NetworkCanvas `aria-label` reworded without "corridors"; CORRIDOR_* internal names stay (code, not copy).
3. **`app/components/home/ProductTour.tsx`** — Network blurb → "Send a payment and it's there: any supplier, paid instantly in their own currency. Enrolling connects your suppliers to capital, so they can grow with you." (operating-account mention moves out of the blurb; it lives on the product page.)
4. **`app/layout.tsx`** — site description: benefits voice ("send instantly… connect your suppliers to global liquidity…").
5. **`public/llms.txt`** — replace "five corridors (US, Mexico, Colombia, Brazil, EU)" phrasing with country list + instant/liquidity benefits.
6. **`docs/network-rebrand.md`** — §0 voice rules above; §5 retitled from "Corridors" to "Countries" (five, uniform — unchanged decision); §9 note that the visualization heading is now benefit-led.
7. **`scripts/verify-rebrand.mjs`** — add `/corridor/i` to the copy-banned list (comments exempt, same mechanism as em-dash check). Grep-audit "corridor" across `app/` + `public/llms.txt` and fix all hits.
8. Solutions/customers/company: grep pass only; fix any corridor/feature-first stragglers (fresh-produce metadata says "across the US, Mexico, Colombia, Brazil, and the EU" — fine, countries stay).

## Verification

1. `node scripts/verify-rebrand.mjs` exit 0 (now also failing on "corridor" in copy).
2. Screenshot the network page + homepage tour (existing `scripts/screenshot-pages.mjs` pattern); read the copy in-context for voice; append REVIEW.md round 5.
3. Commit, push (auto-deploys the preview), confirm deploy live via Render API, smoke-check the new copy on payve-site-preview.onrender.com, send Alex the link.
