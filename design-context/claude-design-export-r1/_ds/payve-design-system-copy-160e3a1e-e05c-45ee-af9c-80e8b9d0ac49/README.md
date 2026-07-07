# Payve Design System

> **Direction: Industrial Confidence (β) — LOCKED.** Grotesque sans for display + body (Geist as the Söhne/Suisse stand-in), cool near-white paper, tighter table density, sage as the single accent. Lineage: Ramp / Brex / Linear, not Mercury. The tone is a B2B operating-system power tool, not a literary financial paper of record.

Payve is a B2B payments & financing platform connecting US buyers with US/MX/CO/BR suppliers across three rails (Astra ACH, Bridge cross-border stablecoin, Oatfi receivables financing). Two personas share one design system: **buyer org admins** (table-heavy operational UI) and **suppliers** (token-authed single-page portal). We differentiate by chrome and what's in it — not by changing the system.

This folder is the source of truth for type, color, components, and pixel-perfect UI kits for both personas.

---

## Direction lock — what's in, what's out

| | β · Industrial Confidence (locked) | α · Editorial Trust (archived) |
|---|---|---|
| Display type | **Geist** (grotesque sans, 700/800) | Newsreader (serif) |
| Body type | **Geist** 400/500/600 | Inter Tight |
| Mono | **Geist Mono** | IBM Plex Mono |
| Paper | **Cool near-white** `#F7F8F9` | Warm cream `#FBFAF7` |
| Hairline | `#E1E4E8` (cool) | `#E5E2D8` (warm) |
| Table row height | **36px** (β density) | 44px |
| Card padding | **20px** default · 14px compact | 24–28px |
| Sage usage | **Unchanged** — primary CTA, focus ring, positive state | Same |
| Tone | "B2B operating-system power tool" | "Calm financial paper of record" |

The α direction is **archived** — do not pull from it for new pages. The dashboard reference render that locked β is `screenshots/buyer-dashboard.jpg` (the β version); `screenshots/supplier-welcome.jpg` shows pre-β state and is kept only as a before/after.

---

## Sources & inputs

| Source                          | Where                                                      | Use |
|---------------------------------|------------------------------------------------------------|-----|
| Payve standing instructions     | `design-context/CLAUDE.md` (mounted locally, read-only)    | Anti-slop guardrails, persona realism, composition rules. |
| Product journey & flow spec     | `design-context/journey-map.md`                            | Page content, B-flows, S-flows, payment routing tree. |
| Backend verb shapes             | `design-context/verb-inventory.md`                         | Mock API I/O must match these exactly. |
| Status enums & data model       | `design-context/data-model.md`                             | All status badges and labels use these enum values. |
| Logo                            | `uploads/payve-logo.png`, `payve-logo-transparent.png`     | Chrome wordmark + sage checkmark. Copied to `assets/`. |
| Stack target                    | React 18 + Vite + Tailwind + shadcn/ui. Not Next.js.       | UI kits use vanilla React + Babel inline for portability. |

If any of these are unreachable (codebase un-mounted, Figma link broken) — re-attach via the Import menu before iterating.

---

## Index — what's in this folder

```
README.md                  ← you are here
SKILL.md                   ← cross-compatible Agent Skill manifest
colors_and_type.css        ← single source of truth for tokens (β)
assets/                    ← logos + brand imagery (copied, not generated)
fonts/                     ← (none locally — Geist & Geist Mono via Google Fonts)
preview/                   ← Design System tab cards (20 small HTML files)
ui_kits/
  buyer-admin/             ← buyer org chrome: nav, dashboard, suppliers, pay
    index.html             ← interactive click-thru prototype
    *.jsx                  ← component files (Sidebar, SupplierTable, etc.)
    README.md
  supplier-portal/         ← token-auth single-page; mobile-first
    index.html             ← magic-link landing → finish onboarding → success
    README.md
```

---

## CONTENT FUNDAMENTALS — copy, tone, voice

**Voice.** Calm, precise, finance-literate. We are the calm desk colleague who already knows what you need to do today. We never market at our own users. β leans slightly harder into operator-tool directness — fewer adjectives, more verbs.

**Casing.** Sentence case everywhere — buttons, nav items, page titles, table headers. Exceptions: legal entity names ("Casa de Tortillas SA de CV"), the eyebrow microlabel (UPPERCASE TRACKED), and acronyms (USDB, ACH, CLABE, EIN).

**Pronouns.** "You" for the user. "We" sparingly, only in confirmations and system speech ("We sent a reminder to Casa de Tortillas SA de CV"). Never "I". No "your account" — say "your org", "your supplier", "your invoice".

**Numbers.** Always tabular, always locale-correct. `$8,420.00` not `$8420`. `MX$226,182.40` not `226182 MXN`. Cents in muted ink-3 when next to a large dollar figure on a KPI tile.

**Dates.** `MMM D, YYYY` for everything user-facing ("May 27, 2026"). Relative time only as a sub-label ("Reminded 3 days ago"), never as the primary value.

**Translation layer (critical).** The buyer is finance ops, not an engineer. We translate rail vendor names in the buyer UI:
- Astra → "Bank transfer" / "ACH"
- Oatfi → "Early payment financing" / "Available credit"
- Bridge → "International payment" / "USDB wallet"

Rail names appear only in: admin tools, developer settings, the Activity log (small print under the human label), the Settings → API & webhooks page.

**Two-tier label composition** (locked at system level — see `data-model.md`):
- `Active` (sage) + `awaiting bank` (muted) when `onboarding_state='active'` AND `pending_fields=['bank_account']`
- `Reminded N days ago` (muted) below the state badge when `has_active_invite=true` and `reminder_count > 0`; switches to `Sent N days ago` when `reminder_count=0`.

**Empty states are first-class.** Every list view has copy. Pattern: one-line headline ("No suppliers yet"), one-line explanation telling user the next step in concrete terms, primary CTA naming the action ("Invite supplier →"). Never "Add new item".

**Emoji & symbols.** None. No ✅ ❌ ⚠️ status indicators. Use the sage dot + colored badge instead. Unicode in copy is fine where typographically correct (· en/em dashes, ‘smart quotes’, ≈ for FX approximations).

**Anti-slop checklist** (Payve-specific, on top of system-wide anti-slop):
- ❌ Inter as default body. Geist (or licensed Söhne/Suisse) only.
- ❌ Purple gradients, neon, gradient blobs.
- ❌ Warm-cream paper. The β direction is cool near-white; warm surfaces are α and archived.
- ❌ Serif display type. Reserved for editorial product (not Payve under β).
- ❌ "John Doe" / "Acme Corp" / lorem in tables. Use the realistic supplier names from `data-model.md` (Casa de Tortillas SA de CV, Pacific Northwest Maple Co., Tepic Logística SC, Café del Quindío SAS).
- ❌ "Sign up to get started" CTAs. Be specific: "Pay your first vendor in under 5 minutes."
- ❌ AI-generated illustrations of people-with-laptops.
- ❌ Card-on-card-on-card stacking. One card depth per region.

---

## VISUAL FOUNDATIONS

### Color
- **Surface palette is cool near-white**, not warm cream. Paper `#F7F8F9` is the page; `--paper-2 #EEF0F2` is the recessed surface (table zebra, hint panels); `--paper-elev #FFFFFF` is true white for lifted cards/modals so they pop off the cool paper. Warm cream is forbidden under β.
- **Sage is the only accent.** Derived from the logo checkmark (#8DA89A / 400). Used for: primary actions (sage-700), focus rings (sage-500), positive money/state (positive = sage-deep family), links (sage-700). Never as a full-bleed background.
- **Semantic pairs** are cool-shifted: positive `#2F6A48`, warning `#8A5A12` (warm amber, restrained), critical `#94352B` (muted ox-blood), info `#2F4D6F` (slate-blue).
- **Money color rules.** Debits = ink-1. Credits = positive (sage-deep). Pending = ink-2. Cents are ink-3 in display-sized money. Strike-through original on early-pay shows the discount, in ink-3.

### Financing & money

- **No percentage rates on financing surfaces (locked 2026-05-31).** On any early-pay or financing offer/disclosure, show cost as a **dollar amount + plain-language term ONLY** — e.g. "$2,236.04 to get paid 28 days early." Never display APR, monthly/period rates, or "% of gross" anywhere in the UI. The itemized no-surprises disclosure is: gross invoice → fee in dollars → net advanced now → full invoice repaid at term + funding date + settlement timing. *Rationale:* keep the supplier surface calm and non-"lending-y." The regulated rate disclosure (APR, per CA SB 362 on commercial financing ≤ $500K) belongs in the binding offer agreement / terms, **not** in the product mockup.

- **Buyer financing repayment = scheduled cash-forecast (locked 2026-06-06).** A buyer's financed-invoice repayment is shown as an **upcoming debit** — date + dollar amount + debit account (last 4 digits) — framed as "scheduled," never "owed" (StateBadge `scheduled`; only `Past due` once a debit has actually slipped). "Never feel the financing" means no friction and no rate-anxiety, **not** no visibility — a finance-ops buyer doing cash management must be able to see money-out dates ahead of time. Use first-person voice ("We'll debit $X from your account ••••Y on DATE"), not third-person. Amount = the full invoice; date = the actual ACH debit date. Read-only forecast — no buyer-initiated early-payoff CTA. Still dollars + plain-language term only (no %/APR).

### Type
- **Display: Geist 700/800** (grotesque sans, ExtraBold for the largest sizes). Headlines, KPI numerals, hero text. Rectilinear, confident, not literary. **SUBSTITUTION FLAG:** Geist is the closest free stand-in for the Söhne / Suisse Int'l family. License a paid face for production.
- **UI/body: Geist 400/500/600.** All UI, table cells, form labels. Single-family ramp — display and body share metrics, which is the whole point of the β direction.
- **Mono: Geist Mono.** IDs, enum values, FX rates, currency codes, CLABE — anywhere we want the data feel.
- **Eyebrow microlabel** = Geist 600 / 11px / +8% tracking / uppercase / ink-3. Used over every section header and as the small sub-label inside cards.

### Spacing & rhythm
- 4px base scale: 4/8/12/16/20/24/32/40/48/64/80.
- Page gutters: 32px desktop, 16px mobile.
- Card padding: 14px (compact) / 20px (default) / 24px (hero) — **~20% tighter than α.**
- Table row height: **36px** default (β density); 44px when row has a sub-label below the primary text.

### Borders, hairlines, shadows
- **Hairlines do most of the work.** 1px `--hairline #E1E4E8` (cool) replaces most shadows. Cards use either a hairline OR a shadow-2 — never both stacked.
- **Three-step elevation:** shadow-1 (flat tables/rows), shadow-2 (resting cards/panels), shadow-3 (popovers/menus). Modal uses shadow-modal. All shadows are cool-ink-tinted under β.
- **Corner radii are small.** 6px for cards/buttons (`--radius-md`), 4px for inputs/chips, 999px only for status badges (state pills). No 16px-and-up "soft" rounding — it reads consumer, not finance.
- **No left-border accent cards.** Banned tropes.

### Backgrounds & imagery
- **Page background**: `--paper` cool near-white. Secondary surfaces step to paper-2 / paper-3. Lifted cards on cool paper use `--paper-elev` (true white) for the extra pop.
- **No full-bleed marketing imagery** in product. The supplier portal magic-link landing is the one exception — see the supplier-portal kit (which uses one quiet sage radial wash, not the old warm-cream gradient).
- **No gradients** anywhere except the chrome wordmark itself (fixed asset).
- **No textures, no grain, no patterns.** Pure flat surfaces.

### Motion
- **Transitions are short and ease-out.** 100–120ms for hover/state, 180–220ms for panel opens. No bounce. No spring overshoot.
- **Hover states** = background step (paper → paper-2 for ghost; sage-700 → sage-800 for primary). Never opacity changes alone.
- **Press states** = same background as hover; no scale transform. Money software doesn't bounce.
- **Focus** = 2px sage-500 ring with 2px paper inner gap (defined in `--focus-ring`). Always visible on keyboard nav.
- **Loading** = skeleton blocks at paper-2 with a 1.2s linear shimmer to paper-3. No spinners except in confirm modals.

### Tables (the heart of the product)
- Header row: 11px / 600 / uppercase / +4% / ink-3 / hairline bottom.
- Body row: 13.5px / 400 / ink-1, with sub-rows at 12.5px / ink-2. Row height **36px** (β density), 44px when sub-row present.
- Right-align money + dates. Left-align names + statuses.
- Zebra: subtle paper-2 every other row, optional (default off for short tables, on for >12 rows).
- Sticky header always. Footer total row pinned with a 1px hairline top.
- Row hover = paper-2; row click → drawer/sheet from right, not a new page.

### Use of transparency & blur
- Sparingly. Only the focus-ring inner-paper-gap technique uses it semantically.
- No glassmorphism. No backdrop blur on chrome.

### Iconography
- 16px / 1.5–1.75px stroke / Lucide.

---

## ICONOGRAPHY

**System:** [Lucide](https://lucide.dev/) via CDN. Stroke icons, 1.5–1.75px weight, 16×16 default. Lucide pairs cleanly with the grotesque-sans body and isn't overused like Heroicons in fintech.

**SUBSTITUTION FLAG:** The Payve codebase wasn't surfaced — we didn't see an existing icon font or sprite. Lucide is the closest match to the brand's restrained personality. If the production codebase already uses a different set (e.g. Phosphor, Tabler), swap by replacing the CDN tag in `ui_kits/*/index.html`.

**Loading**:
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
<script>lucide.createIcons();</script>
```

**Usage rules**:
- 16px in dense UI (table actions, button leading-icons, side nav items).
- 20px in headers and KPI tile labels.
- 24px max — only for empty-state line-art illustrations.
- Stroke color follows current text color (ink-2 by default, current sage on hover).
- Never as standalone navigation — always paired with a text label.
- **No emoji.** Never. Not as status, not as decoration. Period.
- **No unicode glyphs as icons.** ✓ / × / → are OK inline in copy ("12 of 18 ✓"), but not as button decoration. Use a Lucide check/x/arrow.

**Logos & brand imagery**:
- `assets/payve-logo.png` — chrome wordmark, full color, on white-only.
- `assets/payve-logo-transparent.png` — transparent background, works on `--paper` and `--ink-1`. **Primary asset.**
- Never reproduce the wordmark in flat single-color — the chrome gradient is the asset.
- Minimum lockup height: 20px (β density).

**Illustrations**: None ship. If a marketing surface needs one, draw flat ink-1 line art on paper-2 panels — never AI-generated stock vector.

---

## Quick start for a new screen

1. `<link rel="stylesheet" href="../../colors_and_type.css">` — gives you all tokens + utility classes.
2. Page wrapper: `body { background: var(--paper); }` (cool near-white).
3. Sectioning: `<div class="t-eyebrow">Overview</div>` then content. Spacing: 24px below eyebrow.
4. Headlines: `.t-display`, `.t-h1`, `.t-h2` — all grotesque sans under β. `.t-h1-sans` / `.t-h2-sans` remain as back-compat aliases.
5. Money cells: `<span class="t-money">$12,950.50</span>`. Credits: add `.t-money-credit`. Pending: `.t-money-muted`.
6. Tables: row height 36px via `--row-h`. See `ui_kits/buyer-admin/Screens.jsx` for the canonical pattern.
7. Focus ring is automatic via `:focus-visible` on the global stylesheet.

---

## Caveats & substitutions

- **Fonts**: Geist / Geist Mono are CDN'd from Google Fonts as the free stand-in for Söhne / Suisse Int'l / Inter Display ExtraBold. License a paid face (Söhne by Klim, Suisse by Swiss Typefaces, or GT America) for production — flagged for the user to decide.
- **Icons**: Lucide via CDN. No existing icon system was found in `design-context/` (no codebase mounted yet) — easy to swap.
- **Codebase access**: Only the four `.md` spec docs and the logo were available. The actual React/Vite codebase from `~/Desktop/payve-fintech` was not mounted. UI-kit components are built from journey-map + data-model + verb-inventory verbatim, not from existing JSX.
- **α direction**: archived. Both `colors_and_type.css` and every kit/HTML now render β. Do not pull from any α reference.
- **Screenshot caveat (`screenshots/*.jpg`)**: regenerated under β paper + density, but the capture pipeline (html-to-image) can't always embed Geist 800 from Google Fonts in time, so display headlines may show a serif fallback in the JPG. The live preview renders Geist correctly — re-capture from your browser if you need a pristine reference shot. Layout/paper/sage/density in the JPGs are accurate.
