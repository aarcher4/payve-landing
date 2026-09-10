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
    <div ref={ref} data-rate-ladder className="rounded-r-md border border-r-border bg-r-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
        What it costs
      </p>

      <p className="r-num mt-3 flex items-baseline gap-2" data-early-pay-headline>
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
        Tiers are set by the capital partner against approved credit. Your exact cost is shown in
        dollars before you accept anything, and the binding figures live in your agreement.
      </p>
    </div>
  );
}
