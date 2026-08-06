"use client";

import { useState } from "react";

/**
 * Wire-fee savings calculator.
 *
 * Deliberately models FEES ONLY. It does not model the FX spread, which is by far the
 * larger cost — the FSB measures B2B cross-border payments at ~1.6% of a $20,000 transfer,
 * of which ~1.4pp is currency-conversion margin and ~0.2pp is explicit fees. The rate table
 * directly above this component is where that argument lives.
 *
 * Two rules this component exists to honour, both drawn from ASA rulings against
 * TransferWise (2016) and FXcompared (2025), which were upheld over savings calculators:
 *
 *  1. It is a POTENTIAL saving vs a bank average, never an absolute promise. Every input is
 *     editable and the assumptions are on screen, not buried.
 *  2. The buyer's fee and the supplier's fee are borne by DIFFERENT parties. They are shown
 *     separately and the combined figure is explicitly labelled as spanning both sides.
 *
 * The per-corridor defaults and the footnote wording are researched and legally
 * load-bearing — see docs/rates-page-substantiation.md. Do not adjust them casually.
 */

interface Corridor {
  code: string;
  label: string;
  /** US bank's outgoing international wire fee, USD-denominated, initiated online. */
  outgoing: number;
  /** Beneficiary bank's inbound fee plus correspondent deductions taken in transit. */
  receiving: number;
  /** Why the receiving figure is what it is — shown on screen, not hidden in the footnote. */
  note: string;
}

const CORRIDORS: Corridor[] = [
  {
    code: "MX",
    label: "Mexico (MXN)",
    outgoing: 35,
    receiving: 35,
    note: "Mexican bank inbound fee plus correspondent deductions taken from the principal in transit.",
  },
  {
    code: "CO",
    label: "Colombia (COP)",
    outgoing: 35,
    receiving: 35,
    note: "Colombian bank inbound fee plus correspondent deductions. Some banks advertise free receipt but pass on correspondent charges.",
  },
  {
    code: "BR",
    label: "Brazil (BRL)",
    outgoing: 35,
    receiving: 35,
    note: "Exchange-contract fee, charged per contract regardless of amount, plus correspondent deductions.",
  },
  {
    code: "EU",
    label: "Eurozone (EUR)",
    outgoing: 35,
    receiving: 0,
    note: "Receiving a SEPA credit transfer is free under EU law, and the amount may not be reduced in transit.",
  },
  {
    code: "GB",
    label: "United Kingdom (GBP)",
    outgoing: 35,
    receiving: 8,
    note: "UK bank inbound international payment fee. Domestic Faster Payments are free to receive.",
  },
];

const usd0 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function toNum(v: string, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export default function WireSavings() {
  const [corridorCode, setCorridorCode] = useState("MX");
  const [wires, setWires] = useState("10");
  const [avg, setAvg] = useState("");

  const corridor = CORRIDORS.find((c) => c.code === corridorCode) ?? CORRIDORS[0]!;
  // Per-corridor defaults seed the fields, but the user can override either one.
  const [outgoingOverride, setOutgoingOverride] = useState<Record<string, string>>({});
  const [receivingOverride, setReceivingOverride] = useState<Record<string, string>>({});

  const outgoingFee = toNum(outgoingOverride[corridorCode] ?? String(corridor.outgoing));
  const receivingFee = toNum(receivingOverride[corridorCode] ?? String(corridor.receiving));

  const n = Math.max(0, Math.floor(toNum(wires)));
  const buyerSavings = n * outgoingFee;
  const supplierSavings = n * receivingFee;
  const total = buyerSavings + supplierSavings;

  const avgNum = toNum(avg);
  const perPaymentFee = outgoingFee + receivingFee;
  const pct = avgNum > 0 ? (perPaymentFee / avgNum) * 100 : null;

  const field =
    "mt-1 w-full rounded-md border border-hairline-2 bg-paper-elev px-3 py-2 font-mono text-sm text-ink-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600";
  const label = "text-xs font-semibold uppercase tracking-wider text-ink-3";

  return (
    <div className="rounded-xl border border-hairline bg-paper-elev p-6 shadow-elev-2 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={label} htmlFor="calc-corridor">
            Paying suppliers in
          </label>
          <select
            id="calc-corridor"
            data-calc-corridor
            className={field}
            value={corridorCode}
            onChange={(e) => setCorridorCode(e.target.value)}
          >
            {CORRIDORS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={label} htmlFor="calc-wires">
            Wires per month
          </label>
          <input
            id="calc-wires"
            data-calc-wires
            className={field}
            type="number"
            min={0}
            inputMode="numeric"
            value={wires}
            onChange={(e) => setWires(e.target.value)}
          />
        </div>

        <div>
          <label className={label} htmlFor="calc-outgoing">
            Your bank&rsquo;s wire fee
          </label>
          <input
            id="calc-outgoing"
            data-calc-outgoing
            className={field}
            type="number"
            min={0}
            step="1"
            value={outgoingOverride[corridorCode] ?? String(corridor.outgoing)}
            onChange={(e) =>
              setOutgoingOverride({ ...outgoingOverride, [corridorCode]: e.target.value })
            }
          />
        </div>

        <div>
          <label className={label} htmlFor="calc-receiving">
            Deducted from your supplier
          </label>
          <input
            id="calc-receiving"
            data-calc-receiving
            className={field}
            type="number"
            min={0}
            step="1"
            value={receivingOverride[corridorCode] ?? String(corridor.receiving)}
            onChange={(e) =>
              setReceivingOverride({ ...receivingOverride, [corridorCode]: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="calc-avg">
          Average payment size <span className="font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="calc-avg"
          data-calc-avg
          className={`${field} max-w-xs`}
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="e.g. 20000"
          value={avg}
          onChange={(e) => setAvg(e.target.value)}
        />
      </div>

      {/* ---- results ---- */}
      <div className="mt-8 grid gap-6 border-t border-hairline pt-6 sm:grid-cols-3">
        <div>
          <p className={label}>You stop paying</p>
          <p data-calc-buyer className="t-num mt-1 font-display text-3xl font-extrabold tracking-h1 text-ink-1">
            {usd0(buyerSavings)}
          </p>
          <p className="mt-1 text-xs text-ink-3">per month, in outgoing wire fees</p>
        </div>
        <div>
          <p className={label}>Your supplier stops losing</p>
          <p data-calc-supplier className="t-num mt-1 font-display text-3xl font-extrabold tracking-h1 text-ink-1">
            {usd0(supplierSavings)}
          </p>
          <p className="mt-1 text-xs text-ink-3">per month, deducted before it lands</p>
        </div>
        <div>
          <p className={label}>Combined, both sides</p>
          <p data-calc-total className="t-num mt-1 font-display text-3xl font-extrabold tracking-h1 text-sage-700">
            {usd0(total)}
          </p>
          <p className="mt-1 text-xs text-ink-3">
            per month · <span data-calc-annual>{usd0(total * 12)}</span> a year
          </p>
        </div>
      </div>

      {pct != null && (
        <p className="mt-6 rounded-md bg-sage-50 px-4 py-3 text-sm text-ink-2">
          At an average payment of {usd0(avgNum)}, those fees are{" "}
          <span data-calc-pct className="font-mono font-semibold text-ink-1">
            {pct.toFixed(1)}%
          </span>{" "}
          of every payment you send. On small payments the fee is not a percentage — it can be
          the entire payment.
        </p>
      )}

      {/* ---- assumptions + footnote: everything here must trace to the substantiation doc ---- */}
      <div data-substantiated className="mt-8 border-t border-hairline pt-6">
        <p className="text-xs font-semibold text-ink-2">
          Assumption for {corridor.label}: {usd0(corridor.outgoing)} outgoing, {usd0(corridor.receiving)}{" "}
          on the receiving side.
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-3">{corridor.note}</p>

        <p data-calc-footnote className="mt-4 text-xs leading-relaxed text-ink-3">
          Potential saving vs. bank average. Outgoing figure based on published US
          business-account fee schedules for a US-dollar-denominated international wire
          initiated online — Navy Federal $25, Citi $27, Wells Fargo $30, Truist $36, Chase
          $40, Bank of America $45, Regions $50, U.S. Bank $75 (schedules effective Feb–Jul
          2026, retrieved 6 August 2026; median $42.50). Branch-initiated wires cost more,
          typically $50–$85. Wires sent in a foreign currency may cost less or nothing at some
          of these banks because the cost is instead recovered through the exchange-rate
          markup. Receiving figure combines the beneficiary bank&rsquo;s inbound fee — for
          example USD 17 plus 16% IVA at HSBC México — with correspondent bank deductions taken
          from the principal in transit, which no bank publishes. The two amounts are borne by
          different parties, the payer and the payee, and are shown combined. Payve&rsquo;s own
          research using publicly available fee schedules; not independently validated.
          Illustrative of savings that could be achieved; not guaranteed.
        </p>
      </div>
    </div>
  );
}
