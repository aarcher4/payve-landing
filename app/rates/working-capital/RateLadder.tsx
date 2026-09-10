"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

/**
 * The Early Pay price, stated the way it is actually charged.
 *
 * WHY THIS IS NOT A FLAT "1.85% PER 30 DAYS". The engine charges
 * `APR × actual_days / 360`, linear per day (see oatfiInvoiceMath.ts in the payments app). So
 * a 20-day invoice costs about 1.23% and a 45-day one about 2.78%. Publishing a flat per-period
 * rate would imply pricing the product does not do, and a supplier who took a short invoice
 * would find the page overstated their cost.
 *
 * The slider is therefore not decoration: it IS the disclosure. Moving it shows the linearity
 * directly, which is more honest than a footnote and easier to check.
 *
 * The three tiers are the partner's credit tiers, not a menu — a buyer does not choose one.
 *
 * WHOSE COST THIS IS. The supplier's, and the card has to say so in its heading rather than
 * leave it to a sentence further down. The engine nets the fee out of the early payment
 * (`principal = invoice − fee`, oatfiInvoiceMath.ts) and the buyer repays `total = invoice`,
 * the face value they already owed. A card headed "What it costs" on a buyer-facing page reads
 * as the buyer's cost, which is the opposite of the truth.
 */

const TIERS = [
  { name: "Tier 1", monthlyPct: 1.85 },
  { name: "Tier 2", monthlyPct: 2.25 },
  { name: "Tier 3", monthlyPct: 2.5 },
];

/** The rate is linear in day count: monthly figure / 30 days, applied to actual days. */
function costPct(monthlyPct: number, days: number): number {
  return (monthlyPct / 30) * days;
}

const DAY_STOPS = [15, 20, 30, 45, 60];

export function RateLadder() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  const reduced = useReducedMotion() ?? false;
  const [days, setDays] = useState(30);

  return (
    <div
      ref={ref}
      data-rate-ladder
      className="rounded-r-md border border-r-border bg-r-card p-5 sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
        What your supplier pays
      </p>

      {/* flex-wrap, so the suffix drops to its own line on a phone instead of crowding. */}
      <p
        className="r-num mt-3 flex flex-wrap items-baseline gap-x-2"
        data-early-pay-headline
      >
        <span
          className="text-r-fg"
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.045em",
          }}
        >
          From 1.85%
        </span>
        <span className="text-sm font-medium text-r-muted-fg">for a 30 day invoice</span>
      </p>

      <p className="mt-3 max-w-prose text-sm leading-relaxed text-r-muted-fg">
        Priced per day, not per month. A shorter invoice costs proportionally less, so the
        number above is a starting point rather than a flat fee.
      </p>

      {/*
        The single most misread thing on this page, so it gets its own panel rather than a
        clause. The supplier takes the fee out of their own early payment; the buyer repays the
        invoice face and nothing else, and earns a share back for paying on time.
      */}
      <div
        className="mt-5 rounded-r-sm border border-r-border bg-r-bg p-4"
        data-who-pays
      >
        <p className="text-sm leading-relaxed text-r-fg">
          <span className="font-semibold">Your supplier pays this rate, not you.</span> The fee
          comes out of the payment they choose to take early. You repay the invoice face on your
          original date, which is exactly what you already owed.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-r-muted-fg">
          It costs you nothing to offer, and you earn income on it. Pay on time and you receive a
          share of the rate back on every invoice your suppliers take early.
        </p>
      </div>

      {/* The linearity, shown rather than footnoted. */}
      <div className="mt-6">
        <label
          htmlFor="early-pay-days"
          className="text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg"
        >
          Days paid early
        </label>
        <input
          id="early-pay-days"
          type="range"
          min={5}
          max={60}
          step={1}
          value={days}
          data-days-input
          onChange={(e) => setDays(Number(e.target.value))}
          className="mt-2 w-full accent-[oklch(var(--r-primary))]"
        />
        <div className="r-num mt-1 flex justify-between text-[11px] text-r-subtle" aria-hidden>
          {DAY_STOPS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-2" data-tier-list>
        {TIERS.map((tier, i) => {
          const pct = costPct(tier.monthlyPct, days);
          return (
            <motion.li
              key={tier.name}
              data-tier={tier.name}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={inView || reduced ? { opacity: 1, y: 0 } : undefined}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: Math.min(i, 5) * 0.08 }
              }
              className="flex items-baseline justify-between gap-4 border-b border-r-border pb-2 last:border-b-0"
            >
              <span className="text-sm text-r-muted-fg">{tier.name}</span>
              <span className="r-num text-sm font-semibold text-r-fg" data-tier-cost>
                {pct.toFixed(2)}%{" "}
                <span className="font-normal text-r-subtle">over {days} days</span>
              </span>
            </motion.li>
          );
        })}
      </ul>

      <p className="mt-5 text-xs leading-relaxed text-r-subtle">
        Tiers are set by the capital partner against approved credit. The supplier sees the exact
        dollars before they accept anything, and the binding figures live in the agreement.
      </p>
    </div>
  );
}
