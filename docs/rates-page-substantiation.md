# /rates — substantiation

Every figure published on `/rates` traces to a row here. Sourcing was compiled **6 August 2026**
from institutions' own published schedules, not from aggregators or competitor blogs.

This document is the defence of the page. If a figure changes on the page, change it here in the
same commit — `npm run verify:rates` asserts that every dollar figure in the calculator's
`[data-substantiated]` region appears in this file, and will fail the build otherwise.

> **Short shelf life.** Bank fee schedules move. U.S. Bank repriced effective 10 Aug 2026, Citi's
> schedule changed twice in twelve months, and PNC's figures came from a single fetch that could
> not be repeated. **Re-verify this table before any republish.**

---

## 1. Outgoing international wire — US business accounts

USD-denominated, initiated online. This is the basis for the calculator's `$35` outgoing default
and for the bank list in the footnote.

| Bank | Fee | Schedule + effective date | Source |
|---|---|---|---|
| Navy Federal CU | **$25** | Schedule of Fees and Charges, business form NFCU 1284-B (7-26) | navyfederal.org |
| Citibank (CitiBusiness) | **$27** online ($65 branch) | CitiBusiness Standard Schedule of Fees and Charges, eff. 5 Feb 2026 | https://online.citi.com/JRS/popups/G108_CitiBusiness_Schedule_Fees_Charges_NY_ADA.pdf |
| Wells Fargo | **$30** digital ($40 branch) | Business Account Fees and Information Schedule, form BBG6788, eff. 28 Jul 2026 | https://www.wellsfargo.com/assets/pdf/small-business/information-schedule.pdf |
| Truist | **$36** Digital Treasury ($75 branch, $50 phone) | Business Deposit Accounts Fee Schedule, eff. 5 Jun 2026 | https://www.truist.com/content/dam/truist-bank/us/en/documents/rates-fees/small-business/business-deposit-accounts-fee-schedule.pdf |
| JPMorgan Chase | **$40** online ($50 branch) | Additional Banking Services and Fees for Business Accounts, eff. 14 Jun 2026 | https://www.chase.com/content/dam/chase-ux/documents/personal/checking/biz-how-your-transaction-will-work.pdf |
| Bank of America | **$45** | Business Schedule of Fees — Banking Solutions, eff. 20 Feb 2026 | https://www.bankofamerica.com/salesservices/smallbusiness/resources/business-schedule-fees/ |
| Regions | **$50** | Business Pricing Schedule, eff. 23 Jul 2026 | regions.com |
| U.S. Bank | **$75** (a $45 "Digital U.S. Dollar" rate takes effect **10 Aug 2026**) | Business Pricing Information, eff. 11 May 2026 | https://www.usbank.com/dam/documents/pdf/business-banking/business-pricing-information/deposit-products.pdf |

**Median $42.50 · mode $45 · mean $41.80.**

### Branch / banker-initiated, same schedules

The footnote's *"typically $50–$85"* range covers the bulk of the branch-initiated sample:

| Bank | Branch fee |
|---|---|
| Wells Fargo | $40 |
| Bank of America | $45 |
| Citi (CitiBusiness) | $65 |
| Regions | **$50** |
| Truist | $75 |
| U.S. Bank | $75 |
| Huntington | $80 |
| Fifth Third | **$85** |
| PNC | $110 cross-currency / $135 same-currency |

**Median $65.** PNC sits well above the stated range and is called out here rather than folded
into it — the footnote says "typically", not "at most".

**Why the calculator defaults to $35 and not $45.** $35 is below the median. Understating our own
saving is the safe direction to be wrong, and the field is user-editable. The footnote publishes
the real range so the page never implies $35 is typical.

**Two qualifiers are mandatory wherever this number appears:** USD-denominated, and channel
(branch-initiated costs materially more).

**The foreign-currency caveat, and why it is in the footnote.** Several of these banks charge
little or nothing for a wire sent in *foreign* currency — Chase $5 (waived at/above $5,000),
Bank of America $0, Wells Fargo $0 digital — because the cost is recovered through the
exchange-rate markup instead. Bank of America states it plainly: *"there are markups associated
with the currency conversion included in our exchange rate and we make money from the foreign
currency exchange."* Omitting this from the footnote would make the claim attackable.

---

## 2. Receiving side — per-corridor calculator defaults

The receiving-side figure is **not** a single published fee. It combines the beneficiary bank's
inbound charge with correspondent deductions taken from the principal in transit. The page and
the footnote both say so.

| Corridor | Calculator default | Basis |
|---|---|---|
| Mexico (MXN) | **$35** | HSBC México tarifario: inbound international transfer **USD 17.00 + IVA**; at 16% IVA ≈ **$19.72**. Remainder is correspondent deduction (not published — see §3). |
| Colombia (COP) | **$35** | Bancolombia's own T&Cs state receipt carries no commission, but that correspondent charges are *"por cuenta del beneficiario"* and deducted from the amount received. Scotiabank Colpatria publishes USD 40 (office) / USD 0 (web). |
| Brazil (BRL) | **$35** | Exchange-contract (câmbio) fee, charged **per contract regardless of amount**, from the Banco Central do Brasil mandated tariff registry: R$0 (Coinvalores, B&T online) to R$900 (Bradesco-Kirton), R$650 at Itaú. Plus correspondent deduction. |
| Eurozone (EUR) | **$0** | Receiving a SEPA credit transfer is free in practice and protected in law. Reg. (EC) 924/2009 Art. 3 (as amended by Reg. (EU) 2019/518) bars charging more for a cross-border euro payment than the comparable domestic one; PSD2 Art. 62(2) mandates SHA where both PSPs are in the Union, so **the transferred amount may not be reduced**. |
| United Kingdom (GBP) | **$8** | HSBC UK Business Price List (1 Jul 2025): incoming non-GBP **£6.00** at/above £100. NatWest/RBS: free in EUR, **£7** all other currencies. Domestic Faster Payments are free to receive. |

**US incoming international wires are $15–$21, never $35** — Chase $15, Bank of America $15,
Wells Fargo $0 (non-analyzed), U.S. Bank $20, Truist $20, PNC $21; median $15. The page therefore
**never** describes $35 as a US incoming wire fee. It is a foreign-beneficiary figure.

---

## 3. Correspondent deductions — mechanism sourced, magnitude not

The mechanism is confirmed by three primary sources:

- **Truist**, Business Deposit Accounts Fee Schedule (eff. 5 Jun 2026), footnote E — quoted on the
  page: *"For Incoming International Wire Transfers, intermediary financial institutions may
  deduct additional fees from incoming international wires, reducing the amount of proceeds
  credited to your account."*
- **Federal Reserve**, Fedwire ISO 20022 FAQ, on charge bearer CRED: *"all financial institutions
  in the payment chain may deduct fees, thereby reducing the payment amount to the
  beneficiary/creditor."*
- **FSB**, *G20 Roadmap for Cross-border Payments: Consolidated progress report for 2025*
  (Oct 2025): *"receiver-side costs may either be deducted from the nominal payment amounts
  received by customers or invoiced by intermediary PSPs directly to their counterparts in the
  payment chain."*

**The magnitude is not publishable.** The widely-quoted "$15–$50 per intermediary" figure appears
only in vendor blogs and has **no primary source**. The page publishes no per-hop figure, and
`verify-rates.mjs` asserts that it never does.

**Hop counts are also not publishable.** BIS-CPMI / Bank of England / National Bank of Belgium /
SWIFT analysis of live gpi traffic (*"SWIFT gpi data indicate drivers of fast cross-border
payments"*, 8 Feb 2022) finds cross-border payments involve *"on average, just over one
intermediary"*, and that *"payments with three or more intermediaries represent less than one per
cent of total payment volume."* The common "3–5 correspondent banks each take a cut" claim
describes almost no real payments. Do not write it.

---

## 4. Deliberately excluded from the page

| Excluded | Why |
|---|---|
| Any bank FX spread percentage | **Not one bank** in any of the six markets discloses its FX margin as a tariff line. Every "banks charge 2–3%" figure traces to a competitor's blog. |
| "2–4% UK SME FX spread" | Circulates attributed to the FCA/CMA; untraceable to either. |
| BBVA México "$30 to receive" | Contradicted by BBVA's own tarifario, which publishes **no** receiving line at all. |
| Per-hop correspondent fee figures | No primary source (§3). |
| The phrase **"SWIFT fee"** | SWIFT is a messaging cooperative that bills member banks, not payers. Its 2024 audited accounts show €473.7m traffic revenue across 13.4bn messages ≈ **€0.035 per message** — a $45 wire fee is ~1,000× what SWIFT earns carrying it. Calling these charges "SWIFT fees" is factually wrong. The page says *international wire fees* and *correspondent bank deductions*. |
| Wire tracer / recall fees | Not disclosed by any bank in the sample except PNC and Regions. "Not disclosed" is not "$0". |

---

## 5. Product claims

| Claim on page | Basis |
|---|---|
| "No outgoing fee… no minimum" | Payve's off-ramp is rate-only: `flat_fee_minor: 0`, `min_fee_minor: 0` (payve-fintech migration 043, `bridge/feeConfig.ts`). |
| "A real US routing and account number… ACH, wire or FedNow" | Bridge virtual account. Rails confirmed in `bridge/virtualAccounts.ts`: `ach_push`, `ach_same_day`, `wire`, `fednow`. **RTP is deliberately not claimed** — it is not in Bridge's documented USD routes. |
| "FedNow arrives 24/7, weekends included; ACH and wire settle on banking days" | FedNow operates 24/7/365. ACH and Fedwire are banking-day services. The page states this split precisely rather than claiming blanket 24/7. |
| "no international wire leg, so there is nothing for a correspondent bank to deduct" | Suppliers are paid over the destination country's own rail (SPEI in Mexico, Bre-B in Colombia, PIX in Brazil, SEPA, Faster Payments), not by SWIFT wire. |
| "Above $25M in annual volume the rate is negotiable" | Commercial policy. |
| Rates are an estimate, no rate lock | Bridge's documentation states it offers no quote and no rate-lock mechanism; the rate at settlement may differ. Flagged in `bridge/exchangeRates.ts` and repeated on the page. |
| The $15 → $0 story | A real Payve supplier incident in Mexico, reported by the supplier. Published anonymised — no name, no counterparty, no contact details. |

---

## 6. Advertising-compliance basis for the footnote

The footnote wording is modelled on rulings the ASA **upheld** against savings calculators:

- **TransferWise Ltd (A15-312197, 4 May 2016)** — *"You're saving £xx"* was read as an **absolute
  claim**; extrapolating one corridor's saving to all transfers made the figures *"artificial and
  based on a different scenario."*
- **FX Compared Ltd (A24-1271043, 23 Apr 2025)** — using *"an average from a range of banks as the
  basis to make a price comparison was misleading"* where charges varied widely. **The agreed
  remedy was relabelling "saved vs. banks" to "potential saving vs. bank average"** — which is
  why the footnote opens with exactly that phrase.

Under FTC practice, "up to $X" is **harder** to substantiate than "typically $X" (a typicality
standard applies). The page does not use "up to" as a hedge.

Three further devices, each competitor-tested: *"not independently validated"* (Airwallex),
*"illustrative of savings that could be achieved… not guaranteed"* (Revolut), and naming the
banks, the amount basis, the channel and the retrieval date (OFX).

---

## 7. Context figures (cited on request, not published as bank-specific claims)

- **FSB, 2025 consolidated progress report** (data: FXC Intelligence, Mar 2025): global average
  all-in cost of a **B2B** cross-border payment **1.6%** of value, measured on a USD 20,000
  transfer — of which **FX margin 1.4pp and explicit fees 0.2pp**, i.e. **87.1% of the cost is
  the spread, not the fee.**
- Same report, receiver side (262 PSPs, 48 jurisdictions): in the $20,000–100,000 band, global
  average receiver fee **0.1%** and FX margin **0.9%**; for **Latin America** the FX margin stays
  **1.4–1.7% at every payment size**.
- **CFPB Remittance Transfer Rule, 12 CFR § 1005.30**: a protected "sender" is a **consumer**
  transferring for personal, family or household purposes. A US **business** sending the identical
  wire gets no mandated disclosure of the exchange rate, third-party fees, or the amount that will
  actually land.

---

## 8. Working capital rates (/rates/working-capital)

Added 10 Sep 2026. Same standard as the wire-fee claims above: every published figure traces to
the system that charges it, and the page states the mechanism, not just the number.

| Claim on page | Basis |
|---|---|
| Early Pay "From 1.85% for a 30 day invoice" | Tier 1 of the capital partner's fee schedule. Stored as an annualized figure (2220 bps) in `services/oatfi/config.ts` in the payments app; 1.85% is that rate over 30 days. Tiers 2 and 3 are 2.25% and 2.50%. |
| Early Pay "Priced per day, not per month" | `oatfiInvoiceMath.ts`: `fee = invoice x annual_rate_bps x duration_days / (10_000 x 360)`. Linear in day count, so a 20 day invoice costs about 1.23% and a 45 day one about 2.78%. The slider on the page is this formula, which is why it is a control and not an illustration. |
| Pay Later "From 1.77% for a 30 day term" | The lowest rate observed on a real batch: Fortune Growers, 31 Aug 2026, $250,197.20 of payables at 1.77% (`payLaterFeeInvoice.ts`). Marked "from" because it is a floor, not a quote. |
| Pay Later "The rate is set by the capital partner, and Payve adds nothing on top of it" | `payLaterPricing.ts`: `retail = wholesale`, `spread = 0`. A previously configured Payve rate was deleted by migration `20260828_205_paylater_rates_are_partner_rates.sql`. |
| Pay Later "a 60 day term is not double a 30 day one" | The fee is a flat percentage of face for the whole term (`pctOfCentsHalfUp`), not a periodic rate. Each term is priced independently by the partner. |
| Pay Later "can move between batches" | Observed: 1.77% on 31 Aug and 2.30% on 3 Sep 2026, eleven days apart, same product. |
| "Terms available today are 30 and 60 days" | The selector renders whatever pricing plans the buyer's issued product carries. Two exist today. |
| "Suppliers enroll at no cost" | Locked commercial position: the invited party never pays to join. |

### Who bears the Early Pay rate

Added Sep 2026, because a card of percentages on a buyer-facing page reads as the buyer's cost
unless the page says otherwise, and here it is the opposite.

| Claim on the page | Basis |
|---|---|
| "Your supplier pays this rate, not you" | `oatfiInvoiceMath.ts` in the payments app: `principal = invoice - fee`. The fee is netted out of the early payment the supplier elects to take, so it is deducted from their proceeds. |
| "You repay the invoice face on your original date, which is exactly what you already owed" | Same file: `total = invoice`, documented as "what the buyer repays at term". The buyer's obligation is unchanged in both amount and date. |
| "It costs you nothing to offer" | Follows from the two rows above. Note this is the softer "no cost" framing, not an absolute free claim, which `verify-rebrand.mjs` bans. |
| "you earn income on it ... Pay on time and you receive a share of the rate back" | `services/ledger/revenueShare.ts`: the buyer reward `R` is a slice of Payve's revenue share `M`, expressed in bps per 30 days of invoice face, clamped to `M`. Worked example in that file: tier 1 on a $1,000 30 day invoice yields `R` = $1.00 against a base fee of $18.50. |
| The reward stated as conditional | `computeRevenueShareCents` takes a `timely` flag and returns `buyerRewardCents: 0` when it is false. The reward is forfeited on late repayment, so the page says "pay on time" rather than promising it unconditionally. |

**No buyer-reward percentage is published, deliberately.** The rate comes from `split_config`
(party type `buyer`) and resolves per tier and per org, with an org override outranking a tier
match (`services/ledger/splitConfig.ts`). There is no single platform default that would stay
true for every reader, so the page describes the mechanism and omits the number. Four gate
assertions in `verify-working-capital.mjs` hold the attribution and the condition in place.

### Why no APR appears

The page states period cost and the mechanism, never an annualized figure. That mirrors the
product's own locked rule: an APR belongs in the binding agreement, where CA SB 362 may
require it on commercial financing, and not in a marketing surface. The gate asserts the
absence (`no APR anywhere on the page`, `no annualized figure anywhere on the page`).

### Still open

This section has **not** had legal review, the same caveat that stands on the calculator
footnote in section 6. The buyer-reward claim added in Sep 2026 raises the bar again: telling a
buyer they will earn income is a revenue claim, even hedged by the timeliness condition, and the
reward rate itself is configurable per org rather than fixed.
Publishing financing rates is a higher bar than publishing an FX rate:
California's SB 362 and New York's Commercial Finance Disclosure Law both govern APR disclosure
on commercial financing **offers**. General advertising is not usually an offer, so this is
very likely fine, but it should get one pass by whoever reviews the footnote before the page is
promoted anywhere.
