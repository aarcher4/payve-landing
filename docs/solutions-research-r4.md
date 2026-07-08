# Solutions vertical research (r4a, 2026-07-08)

Persisted fact base for the three solutions pages (fixing the r1 gap where the original
"deep-research reports" were never committed). Sources: (a) web research with named-agency
citations, (b) the internal prospect corpus at
`Desktop\Payve-Work\customers\deep-research-reports\` (73 files; INSIGHT AND VOCABULARY ONLY —
no non-customer company is ever named in public copy), (c) product-claims check against
payve-fintech design-context/journey-map.md (supplier elects early pay; locked timing strings;
dollars-only financing; no rail names).

## Fresh produce (verification round)

Verdicts on the shipped StatStrip:
- "$35.6B imports forecast 2025 / USDA ERS" — **REPLACED.** The figure traces to a ProducePay
  aggregation (whose own components sum to $33.6B), not an ERS publication, and is superseded:
  USDA ERS/FAS Outlook AES-136 (May 2026) Table 5 puts FY2025 ACTUALS at $20.264B fresh fruit +
  $11.854B fresh vegetables = **$32.1B**. New stat: "$32B / US fresh fruit and vegetable imports
  in fiscal 2025 / USDA Economic Research Service, May 2026".
- "69% of US fresh vegetable imports come from Mexico / USDA ERS 2024" — **KEEP** (ERS chart of
  note Jan 2025, data 2023; ~69% stable through 2024 per ERS EB-48/Choices). Companion fact:
  Mexico supplies 51% of fresh fruit imports (2023).
- "30 to 45 days ... PACA's 30-day ceiling" — **SHARPENED.** No public produce DSO survey exists
  (Blue Book pay data is proprietary); the honest anchors: PACA default prompt payment = 10 days
  after acceptance (7 CFR 46.2(aa)); 30 days = the max written terms that keep PACA trust
  protection (7 CFR 46.46(e)); Blue Book pay ratings run AA (=14d) to F (60d+). New line:
  "30 to 45 days / typical wait for cash after shipping, three to four times PACA's 10-day
  default payment clock / USDA PACA regulations; industry payment-practice data".
Spare sourced candidates: 59% of US fresh fruit supply imported (35% vegetables) — ERS 2023;
90% of US tomato imports from Mexico, 3.9B lbs 2025 — USDA data.
Operator vocabulary (corpus): grower settlements (lot-level), commissions and advances,
re-packers, terminal market, custom packing/private label, fresh-cut, tropicals, PACA trust,
supplier-caused recalls/quality holds. Existing page language already matches well; light adds
only ("grower settlements").

## Seafood (species-broadening round; the shrimp-only lead was the complaint)

Chosen StatStrip:
1. "$25.5B / US seafood imports in 2024, second only to the EU worldwide / USDA Economic
   Research Service, 2025" (ERS chart 108451; stable vs 2023 Amber Waves figure).
2. "About 80% / of the seafood Americans eat is imported / NOAA Fisheries" (NOAA cites 70-85%,
   ~80% for 2023; "about 80%" is the defensible register).
3. "$6.0B and $5.9B / shrimp and salmon, the top two import lines, nearly tied, with tuna,
   tilapia, and crab close behind / NOAA Fisheries trade data, 2024" — makes broader-than-shrimp
   explicit while keeping the shrimp equity. NOTE: the old "$6.6B shrimp / US import data" was a
   usimportdata.com HS cut; the NOAA-linked shrimp figure is $6.04B.
Also citable: $20.6B seafood trade deficit 2024 (NOAA via CRS); SIMP covers ~1,100 species in
13 groups, roughly half of import value (NOAA/CRS 2025 — say "documentation requirements", not
"expanding" — an April 2025 EO directed Commerce to consider revising/rescinding expansions);
top suppliers Canada 14.1% / Chile 13.0% / India 10.0% / Indonesia 7.9% / Vietnam 6.4% (ERS
2024); open-account trade windows 30-90 days (US ITA trade.gov). NOT citable as stats: 8-10
week inventory cycles, cash-on-the-water weeks (narrative only).
Corpus insights: importers run multi-country container programs (50+ origins, multi-currency);
processors live on compressed seasons (6-week runs; settlement to harvesters can lag 8-10
months); **seafood has NO PACA trust — an unpaid seafood supplier is unsecured**, which makes
supplier liquidity read as insurance, not convenience; cold storage opex heavy; documentation
chained to payment (SIMP, HACCP, chain-of-custody, phytosanitary); factoring exists (1-5% fees)
but no platform early-pay in the vertical. Vocabulary: cash on the water, container programs,
fish tickets, retro payments, ex-vessel price, A/B seasons, IQF, chain of custody, first
receivers.

## Packhouse / repack (deepest round)

Chosen StatStrip:
1. "2,000 lbs / buy or sell that much produce in a single day and you are a federally licensed
   dealer / USDA PACA, 7 CFR 46.2" — FIXES the shipped phrasing: the rule is one ton bought or
   sold in ANY day ("wholesale or jobbing quantities"), not a "handling volume where rules kick
   in"; fresh AND frozen count.
2. "10 days / PACA's default payment deadline; written terms past 30 days void trust protection
   / USDA PACA, 7 CFR 46.46" — the payment-terms reality governing both grower payables and
   retail receivables.
3. "July 20, 2028 / FDA deadline for lot-level traceability records on every case you pack /
   FDA FSMA 204" (compliance date extended 30 months in Aug 2025 Federal Register; enforcement
   barred before 7/20/28).
Displaced qualitatives: "Both directions" and "One person" stay in copy (the hero sub already
carries both) — unsourced claims live in prose, not stat tiles.
Also citable: PTI case labels = GS1-128 with GTIN + lot + pack date, applied by the packer
(PTI best practices; major retailers require at DC); OTIF-style automatic chargebacks (3% of
cost of goods per non-compliant case under the largest retail program, 2024 — use genericized
in body copy, no retailer named on our site); PACA license $995/yr + $600/branch; deductions
5-15% of gross sales (CPG-wide vendor estimates — body copy at most, never a tile).
Corpus insights: the packhouse is squeezed from both sides (yield volatility inbound,
chargeback/shrink pressure outbound); pays 50+ small growers under PACA trust, sometimes
cross-border; invoices retail programs that pay on terms and deduct; deduction disputes are a
real headcount line ("Claims Specialist"); finance is often the owner + a bookkeeper.
Vocabulary: PTI case-level labeling, FSMA 204, PrimusGFS/SQF/GFSI audits, Blue Book rating,
DSD, retail programs, claims, loads/bills of lading, repack, cold chain receiving.

## Copy decisions applied (see marketing-copy-inventory.md r4a changelog)
- All three StatStrips replaced/sharpened per above; every tile now carries a named source.
- Seafood features: "Liquidity on open invoices" gains the no-PACA-trust insight;
  "Certifications tracked" broadened to catch documentation (SIMP register, program unnamed).
- Packaging features: "Compliance-ready records" becomes the chargeback-dispute card
  (deductions answered with records); "Billing entered by agents" carries the one-back-office-
  seat truth; traceability card gains case-label/lot-code vocabulary.
- Produce: feature 1 gains "grower settlements" vocabulary; everything else verified-in-place.
- Heroes, framework, section order, and voice unchanged (Alex).
