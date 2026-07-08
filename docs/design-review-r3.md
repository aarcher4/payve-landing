# Design review r3: Payve vs Mercury / Ramp / Brex / HappyRobot

Live-walk evidence captured 2026-07-08 (scripts/reference-walk.mjs; 117 frames + facts JSONs in
design-context/reference-r3/, self frames in reference-r3/self/). Full frame-cited evidence report
below the grading. mercury-banking 404'd; mercury-treasury is the deep Mercury product sample.

## Headline findings

1. **Nobody puts icons on feature cards.** Mercury home: ~0 decorative icons across ~10 sections.
   Ramp platform cards: zero icons; hierarchy is two-tone type + a corner arrow + a product
   mockup. Brex 5-up product row: heading + body + mini mockup, no icons. Even HappyRobot (the
   "iconiest") uses exactly one 3-card row with one small icon each. Structure is carried by:
   type weight contrast, ALL-CAPS eyebrows, mono numbers (01/02/03), hairline rules, and giant
   stat numerals. Our homepage carries 11 decorative icons in three inconsistent treatments.
2. **Multi-product = text rail + media panel, or bento. Never tabs, never icon tiles.**
   Mercury: full-bleed near-black band, hairline-separated text accordion left (active = small
   dot + expanded 2-3 line description), one big product mockup right, one underlined text CTA.
   Ramp/Brex: all-products-visible card grids with mockups. Our current tour is the Mercury
   family but weakened by icon tiles, boxed rows, and a floaty left column.
3. **Dark "chapter" bands are load-bearing.** Mercury bookends with dark bands (product areas +
   stats + close); Ramp cuts black interlude bands into warm white; HappyRobot color-blocks
   navy/cream. Our homepage has no dark band until the footer CTA.
4. **Two-tone headlines** (lead phrase ink, second phrase gray, same size/weight) are Ramp's
   signature hierarchy device and cheap to adopt.
5. **Closing CTA ring composition:** Ramp and HappyRobot close with the hero headline verbatim.
   Short band, one or two actions.
6. **Case-study detail grammar (Ramp):** stat band lives IN the hero, lead quote + headshot right
   under it, sticky fact sidebar (Company / Industry / Size / Pain point / Products used), body
   as kicker -> H2 -> paras -> indented pull quote, 4+ quotes per story.

## Our grading (1-10 per lens; references set the 9-10 bar)

| Page | Icons | Multi-product | Type | Rhythm | Proof | Case-study | Product IA | Overall |
|---|---|---|---|---|---|---|---|---|
| home | 4 | 5 | 6 | 6 | 7 | - | - | 5.5 |
| products/payments | 7 | - | 6 | 6 | 5 (no quote band) | - | 6 | 6 |
| products/early-pay | 7 | - | 6 | 6 | 5 | - | 6 | 6 |
| products/agents | 7 | - | 6 | 6 | 5 | - | 6 | 6 |
| solutions x3 | 8 (grids text-only) | - | 6 | 7 (B heroes good) | 6 | - | 7 | 7 |
| customers hub | 9 | - | 6 | 7 | 7 | 7 | - | 7 |
| stories x4 | 9 | - | 7 | 7 | 8 (FG quote) | 6 (no kickers/sidebar) | - | 7 |
| security/company | 9 | - | 6 | 7 | 7 | - | 7 | 7 |

Home is the weakest page and the highest-traffic one; its two failing lenses (icons,
multi-product) are exactly what Alex flagged.

## Post-implementation re-grade (2026-07-08, after rounds 1-3 on site/pr15-polish)

| Page | Icons | Multi-product | Type | Rhythm | Proof | Case-study | Product IA | Overall |
|---|---|---|---|---|---|---|---|---|
| home | 9 (0 decorative icons) | 8.5 (Mercury dark-band text rail) | 8 (two-tone H2s) | 8 (dark chapter band) | 7 | - | - | **8** |
| products x3 | 9 (rail, no checks) | - | 8 | 7 | 8 (QuoteBand) | - | 8 (quote + cross-sell added) | **8** |
| solutions x3 + security | 9 (ruled grids) | - | 7 | 7 | 6 | - | 7 | **7.5** |
| customers hub | 9 | - | 7 | 7 | 7 | 8 (caps tags) | - | **7.5** |
| stories x4 | 9 | - | 8 | 7 | 8 | 8.5 (kickers + sticky fact sidebar) | - | **8** |

All round-target lenses reached >=8. Remaining sub-8 items (solutions proof depth, hub type
scale, FAQ/cross-sell breadth on product pages) are logged as r4 candidates, not regressions.

## Ranked backlog

**P1 (Round 1, homepage):**
1. ProductTour rebuild, Mercury grammar: full-bleed sage-900 dark band; left = hairline-separated
   text rail (bold title, active row = small sage-300 dot + 2-line description expansion, NO
   icon tiles, NO boxed rows); right = the existing working demo in a light card; one quiet
   underlined text link under the rail. Vertical centering + connector feel preserved by the
   dot + expansion.
2. Icon diet: delete the 4 HowItWorks corner icons (mono 01-04 numbers carry the cards) and the
   4 TrustSection icons (titles carry the tiles). Header chevrons/menu + in-demo working-state
   checks stay (functional).
3. Two-tone section H2s (second clause text-ink-3): tour, how-it-works, proof, trust.
4. Proof panel: cap content width (currently a wide empty card), tighten min-height.
5. Fix H2 orphan wraps ("...already run." breaking badly) via max-w tuning.
6. CTA ring composition (pending Alex pick, see shortlist).

**P2 (Round 2, product + solutions pages):**
7. ValueList restyle to the same text-rail grammar (hairline rows, active dot, drop the
   checkmarks; expansion panel stays).
8. Quote band on product pages (agents + payments get the Geoff Pence / FG quote as a full-width
   tinted band, Ramp/STUDS pattern).
9. Quiet cross-sell row above the CTA band on product pages ("One platform" 3-link text row,
   Mercury cross-sell grammar minus the cards).
10. Solutions FeatureGrid: keep text-only cells but swap boxed grid for hairline rows at lg.

**P3 (Round 3, customers):**
11. Story body kickers ("The problem" / "What Payve runs" style) above H2s.
12. Sticky fact sidebar on story detail (Company / Industry / Size / What they run on Payve),
    absorbing the current chips block.
13. Hub card tag line styled as caps INDUSTRY / SIZE pair (we have industryTag; split visually).

## Closing-CTA copy shortlist (lens 8)

Reference verbatims: Ramp "Time is money. Save both." (= its hero, ring composition) + email
capture; Mercury "Banking – redesigned from the ground up."; Brex "See what Brex can do for
you."; HappyRobot repeats its hero "Put agents to work in complex environments" + Book a demo.

Candidates for our CtaBand H2 (current: "See Payve on your own data."):
A. "The money and the busywork, handled."  <- RECOMMENDED: ring composition with our hero,
   the pattern 2 of 4 references use; sub + button unchanged carry the demo specifics.
B. Keep "See Payve on your own data." (specific, demo-led; defensible).
C. "Run the back office on one platform."
D. "Less busywork. Faster money."
E. "See it working on your own data."
MidCta keeps "See it on your own data." either way (mid-page demo ask stays specific).

---

# Appendix: full frame-cited evidence report (agent walk, 2026-07-08)

(50 frames read across 10 valid pages; citations like "ramp-home-02.jpg" refer to
design-context/reference-r3/.)

## 1. Iconography
Mercury (home smallIcons 14/95 svg): product-areas section is a text-only accordion (bold title +
body, hairlines, small dot on active row; mercury-home-02/-03); feature sections are media tile +
bold heading + gray body, iconless (mercury-home-04); small icons live inside app mockups and
footer socials. mercury-treasury's 39 small icons are arrow-in-circle navigational glyphs on the
cross-sell grid (mercury-treasury-07) and inline external-link arrows, not category icons.
Ramp (16/32): platform cards have zero icons; two-tone type + corner arrow + mockup
(ramp-home-02); small icons only in live ticker chips and inside UI mockups; ramp-ap value cards
use product-screenshot fragments as visuals (ramp-ap-06). Brex (18): 5-column product row =
heading + body + mini mockup, no icons (brex-home-01); UI-chip badges live inside mockups.
HappyRobot (20): the single icon-on-card usage in the corpus (3 "Optimized for impact" cards,
happyrobot-home-05); otherwise numbered 01-03 rows with hairlines (happyrobot-home-02) and an
annotated platform diagram (happyrobot-home-03).

## 2. Multi-product presentation
Mercury: sticky text accordion + persistent media panel on a full-bleed near-black band
(mercury-home-02/-03): H2 "Everything you do with money. All in one place."; four product areas
hairline-separated; active = dot + expanded description; below, underlined "Launch demo"; right, a
large dark dashboard mockup that swaps per selection. Ramp: bento card grid, all visible at once
(ramp-home-02), H2 pair "One platform for all of finance." / "Agents for every workflow, working
24/7."; cards = two-tone heading + corner arrow + cropped mockup on faint dot-grid. Brex: 5-column
card row under a center H2 ("The card is just the start.") then depth via alternating splits
(brex-home-01/-03/-04). HappyRobot: numbered definition list then a left sticky text rail + right
architecture diagram on cream (happyrobot-home-02/-03). Nobody uses literal tabs; media panels
always contain product UI, never illustration.

## 3. Type scale + hierarchy
Mercury: H1 ~64-72px over photo; H2 ~40-48px; H3 ~20px semibold + 16px gray body; separates with
value/color more than weight; sections open with H2 directly (no eyebrow). Ramp: most aggressive
scale (hub H1 ~180px full-width, ramp-customers-00); signature two-tone headline (lead near-black
+ mid-gray same size); tiny ALL-CAPS live-data eyebrows. Brex: heavier geometric sans (H1 ~80px);
every heading ends with a period; serif appears exactly once, for customer quotes (brex-home-06).
HappyRobot: serif display for all headlines over navy/cream; sans body; small caps eyebrows.
Ramp story body: ~70ch sans, kicker above ~44px H2, ~28px semibold indented pull quotes.

## 4. Section rhythm
Mercury: banded chapters — photo hero -> DARK product band -> light features -> light split ->
DARK stats band -> dark close + footer; hairline rules discipline text stacks. Ramp: warm
off-white + ink-black full-bleed interludes (ramp-ap-02 black "Fewer clicks. Faster close." stat
band); sections open eyebrow -> H2 -> subline; full-bleed photographic quote bands. Brex: white /
light-gray alternation, no dark band until footer; center H2 + one-line gray subline openers.
HappyRobot: strongest color blocking (dark hero -> white wall -> navy manifesto -> cream platform
-> dark story cards -> cream close). All four: very generous section padding (~120-200px), media
bleeds to viewport edges, text in ~1280px container.

## 5. Social proof
Brex: "Trusted by 35,000+ top companies." over 2x6 gray logo grid right after the hero.
HappyRobot: "TRUSTED BY 150+ ENTERPRISES" caps label over 4x5 grid. Ramp: proof sentence with a
number ("Join 70,000 of the world's most ambitious companies growing 3.2x faster...") over a logo
grid whose cells hover-flip to stat cards ("Vanta / 3 Days / Faster close"); ramp-ap uses "Join
70,000+ businesses running on Ramp." Mercury: NO logo wall; giant stat band (300K+ / 1 in 3 /
$20B+ / 4.9) + founder quote (Supabase CEO) + press headlines. Quote treatments: Brex serif quote
+ headshot video tile + tab switcher; Ramp full-bleed photo band with huge white quote. Stats:
giant thin numeral + small unit + gray caption.

## 6. Case-study anatomy
Ramp hub: viewport H1 "Customer Stories"; featured photo mosaic (logo top-left, white outcome
headline overlaid, caps "INDUSTRY / SIZE" tags); outcome-sentence headlines with numbers; mid-hub
full-bleed quote band + scrolling stat-card rail; then "All stories" with Search + Company size +
Industry + Product filters over simpler logo-tile cards + "Load more". Two card tiers on one page.
Ramp story (hingham): hero photo w/ logo + white H1 + 3-up stat band IN the hero (bold claim +
explainer each); lead quote + name/title + circular headshot; customer video; two-column body with
sticky fact sidebar (share icons; Company name / Industry / Company size / Pain point / Ramp
product used as links / About); body = kicker -> H2 -> paras -> indented bold pull quote (4+
quotes, 2 named execs) -> product screenshot on soft tile; H3 takeaway; related stories; standard
close. HappyRobot hub: serif "Our customers"; uniform 3-up gradient tiles with centered logos,
serif name, report-style one-liner with the number in the title, "Read more ->" — no tags/filters.

## 7. Product-page IA
ramp-ap order: hero w/ email capture + metric subline + demo pill + mockup -> logo strip ->
how-it-works (eyebrow -> H2 "Drag, drop, done." -> hairline step accordion + animated mockup) ->
film banner -> DARK stat band ("Fewer clicks. Faster close." + three "Up to..." cards) ->
customization H3 trio -> full-bleed customer quote band -> "Payments" 3-up value cards (mini
mockup + bold claim + 2-line body) -> 1099 3-step -> cross-sell tile -> video course rail -> FAQ
accordion (14 q) -> closing band. ramp-expense: same skeleton + old-way/new-way comparison + 3-up
text-only benefit rows with inline arrow links. mercury-treasury: centered hero + full dashboard
screenshot under it -> allocation split with arrow-bulleted fund list -> plain hairline rate table
-> premium upsell split -> 6-card cross-sell grid -> FAQ -> "Realize your capital's full
potential" close. Common IA: hero+capture -> how-it-works accordion+mockup -> dark/tinted stat
band -> quote band -> benefit cards -> cross-sell -> FAQ -> close. Value props alternate splits
and 3-up rows; long lists are hairline accordions, never icon grids.

## 8. Closing CTA copy (verbatim)
Ramp (every page): "Time is money. Save both." + "What's your work email?" + "Get started for
free" (+ accounting-firm demo subline; footer repeats capture; expense adds "Limited time: Get
$150 when you take a Ramp demo."). Mercury home: "Banking – redesigned from the ground up." +
"Open account" + "Contact sales"; treasury: "Realize your capital's full potential". Brex: "See
what Brex can do for you." + "Get started" / "See a demo". HappyRobot: repeats hero verbatim "Put
agents to work in complex environments" + "Book a demo"; customers page "Power your operations
with an AI workforce". Pattern: short band, distinct background, 1-2 actions; 2 of 4 sites repeat
the hero headline verbatim (ring composition).
