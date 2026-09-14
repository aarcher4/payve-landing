"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * The argument of the whole page, in one component.
 *
 * Early Pay and Pay Later are the same mechanism pointed in opposite directions, so they share
 * a timeline and the contrast carries itself rather than needing a paragraph:
 *
 *   Pay Later   the VENDOR's marker is PINNED to the invoice due date. YOUR repayment marker
 *               slides RIGHT to the term you pick: 30, 45 or 60 days after the vendor is paid.
 *   Early Pay   the SUPPLIER's marker slides LEFT, to day 1. Your payment date does not move.
 *
 * Movement communicates causality (docs/motion-system.md rule 7): the marker travels along the
 * axis to the date it lands on, and nothing bounces.
 *
 * TWO AXES, ON PURPOSE. Early Pay counts from the invoice date (day 0 → due on day 30), because
 * the story is "the supplier does not have to wait out your terms". Pay Later counts from the
 * DUE DATE, because Payve pays the vendor on whatever day the invoice is due, not on "day 30",
 * and the term starts that day (`payment_date = financed_on + term_days` in the payments app).
 * Drawing Pay Later on the absolute axis would have implied every invoice is net 30.
 *
 * LAYOUT NOTE, learned from the first render. Both markers begin on the same day, because that
 * is the true starting position for both products. That overlap is the point being made, but
 * stacked on one line it just looked like two labels colliding. So the pinned party lives ABOVE
 * the axis and the moving party BELOW it, and a dashed trail shows the distance travelled. The
 * movement is then legible even in a still screenshot, which is what the gate and any shared
 * image actually capture.
 *
 * REDUCED MOTION RENDERS THE END STATE. With motion off, Early Pay sits at its destination and
 * Pay Later sits at the selected term with the chips still working, instantly. Both verify
 * scripts run with `reducedMotion: "reduce"`, so anything whose meaning depended on being
 * mid-animation would be invisible to the gate.
 */

const DAY_SPAN = 60;
const TICKS = [0, 30, 60];

export type TimelineVariant = "early-pay" | "pay-later";

interface Spec {
  from: number;
  /** A single destination (Early Pay) or a selectable set of terms (Pay Later). */
  to: number | readonly number[];
  movingLabel: string;
  pinnedLabel: string;
  pinnedDay: number;
  caption: string;
  /** Axis tick text: absolute ("Day 30") or relative to the due date ("+30 days"). */
  tickLabel: (d: number) => string;
  /** The moving marker's own day text. */
  dayLabel: (d: number) => string;
}

const SPEC: Record<TimelineVariant, Spec> = {
  "early-pay": {
    from: 30,
    to: 1,
    movingLabel: "Supplier paid",
    pinnedLabel: "You pay",
    pinnedDay: 30,
    caption: "Your supplier reaches the cash on day 1. Your own payment date does not move.",
    tickLabel: (d) => `Day ${d}`,
    dayLabel: (d) => `Day ${d}`,
  },
  "pay-later": {
    from: 0,
    to: [30, 45, 60],
    movingLabel: "You repay",
    pinnedLabel: "Vendor paid",
    pinnedDay: 0,
    caption:
      "Payve pays your vendor the full invoice on its due date, whatever day that is. Your repayment lands 30, 45 or 60 days after that, on the term you pick.",
    tickLabel: (d) => (d === 0 ? "Invoice due" : `+${d} days`),
    dayLabel: (d) => (d === 0 ? "Due date" : `+${d} days`),
  },
};

/**
 * In-view loop driver for the single-destination variant. Mirrors `useLoopStep` in
 * app/components/home/demos.tsx: it never starts a timer for a section nobody is looking at.
 *
 * The hold is asymmetric on purpose. The moved state is the state worth reading, so it holds
 * roughly twice as long as the origin.
 */
function useLoopStep(active: boolean) {
  const reduced = useReducedMotion() ?? false;
  /**
   * Seeded false, NOT from `reduced`.
   *
   * `useReducedMotion()` is null on the server and true on a reduced-motion client, so seeding
   * state from it made the server render "Day 30" and the client "Day 1" — React error #418, a
   * hydration mismatch, for every visitor with the setting enabled. Both renders now agree on
   * the origin, and the effect below moves to the destination on the first client tick.
   *
   * The same latent bug lives in `useLoopStep` in app/components/home/demos.tsx
   * (`useState(reduced ? stepCount : 0)`); it is masked there because those demos are gated on
   * `useInView` and rarely mount above the fold.
   */
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    if (reduced) {
      setMoved(true);
      return;
    }
    if (!active) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const cycle = (next: boolean) => {
      if (cancelled) return;
      setMoved(next);
      timer = setTimeout(() => cycle(!next), next ? 3200 : 1600);
    };
    timer = setTimeout(() => cycle(true), 900);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [active, reduced]);
  return moved;
}

/**
 * The term-picker driver. Behaves like a buy-now-pay-later checkout: left alone and in view it
 * walks the terms (30 → 45 → 60 → 30) so a visitor sees the marker travel; the first click on
 * a chip hands control to the visitor for good. Seeded to the first term for the same
 * hydration reason as above, and with motion off it simply sits on the selection.
 */
function useTermStep(terms: readonly number[], active: boolean) {
  const reduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (reduced || touched || !active) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const cycle = (next: number) => {
      if (cancelled) return;
      setIndex(next);
      timer = setTimeout(() => cycle((next + 1) % terms.length), 2400);
    };
    timer = setTimeout(() => cycle(1 % terms.length), 900);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [active, reduced, touched, terms.length]);
  const select = (i: number) => {
    setTouched(true);
    setIndex(i);
  };
  return { term: terms[index] ?? terms[0], index, select };
}

function TermPicker({
  terms,
  index,
  onSelect,
}: {
  terms: readonly number[];
  index: number;
  onSelect: (i: number) => void;
}) {
  // Arrow keys move between chips, so role="radiogroup" is a promise the widget keeps
  // (the same handler shape as the app's TermLadder).
  function onKeyDown(e: React.KeyboardEvent) {
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (delta === 0) return;
    e.preventDefault();
    onSelect((index + delta + terms.length) % terms.length);
  }
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2" data-term-picker>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.04em] text-r-muted-fg"
        id="pay-later-term-label"
      >
        Choose when to repay
      </p>
      <div
        role="radiogroup"
        aria-labelledby="pay-later-term-label"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1.5"
        data-term-selected={terms[index]}
      >
        {terms.map((t, i) => {
          const active = i === index;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(i)}
              data-term={t}
              className={`r-num h-8 rounded-r-sm border px-3 text-xs font-semibold transition-colors ${
                active
                  ? "border-r-primary bg-r-primary text-r-primary-fg"
                  : "border-r-border bg-transparent text-r-muted-fg hover:text-r-fg"
              }`}
            >
              {t} days
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WorkingCapitalTimeline({ variant }: { variant: TimelineVariant }) {
  const spec = SPEC[variant];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion() ?? false;

  // Both hooks run unconditionally (rules of hooks); each variant reads the one it owns.
  const terms: readonly number[] = Array.isArray(spec.to) ? spec.to : [];
  const moved = useLoopStep(inView && terms.length === 0);
  const picker = useTermStep(terms.length ? terms : [0], inView && terms.length > 0);

  const day = terms.length ? picker.term : moved ? (spec.to as number) : spec.from;
  const pct = (d: number) => (d / DAY_SPAN) * 100;

  // The dashed trail spans origin -> current, whichever direction that is.
  const trailLeft = Math.min(pct(spec.from), pct(day));
  const trailWidth = Math.abs(pct(day) - pct(spec.from));

  // --m-scene, the section-scale curve. Slow and certain: this is a payment date moving.
  const move = reduced ? { duration: 0 } : { duration: 0.9, ease: [0.76, 0, 0.24, 1] as const };

  /**
   * A label centred on a marker near either end of the track overhangs it.
   *
   * "Supplier paid" on day 1 hung off the left and, on a 360px phone, ran under the card's own
   * padding; "Your cash leaves" on day 60 does the same on the right at every width. Centring is
   * right in the middle of the track and wrong at the ends, so the label anchors to whichever
   * edge it is approaching instead.
   *
   * ONLY THE LABEL MOVES, NEVER THE DOT. Anchoring the whole marker stack was the obvious first
   * try and it was wrong: shifting the container slides the dot off the date it is naming, so
   * the page would draw "Supplier paid, day 1" against a dot sitting somewhere else. The date is
   * the one thing on this page that has to be exact. So the marker column is a 1px rail centred
   * on the date, and the shift below applies to the two text spans alone.
   */
  function labelShift(dayValue: number) {
    const p = pct(dayValue);
    if (p < 15) return "translate-x-1/2"; // left edge of the label sits on the date
    if (p > 85) return "-translate-x-1/2"; // right edge of the label sits on the date
    return "translate-x-0";
  }
  const movingShift = labelShift(day);
  const pinnedShift = labelShift(spec.pinnedDay);

  return (
    <div ref={ref} data-timeline={variant} className="w-full">
      {terms.length > 0 && (
        <div className="mb-6">
          <TermPicker terms={terms} index={picker.index} onSelect={picker.select} />
        </div>
      )}

      {/* Inset track, so the day-0 and day-60 labels cannot clip the container edge. */}
      <div className="relative mx-auto h-[212px] w-[calc(100%-2.5rem)] sm:h-[188px] sm:w-[calc(100%-5rem)]">
        {/* Pinned party, above the axis. */}
        <div
          className="absolute top-0 flex w-px flex-col items-center"
          style={{ left: `${pct(spec.pinnedDay)}%` }}
          data-marker="pinned"
          data-marker-day={spec.pinnedDay}
        >
          <span
            className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.04em] text-r-muted-fg ${pinnedShift}`}
          >
            {spec.pinnedLabel}
          </span>
          <span
            className={`r-num mt-0.5 whitespace-nowrap text-sm font-semibold text-r-fg ${pinnedShift}`}
          >
            {spec.dayLabel(spec.pinnedDay)}
          </span>
          <span className="mt-1.5 h-6 w-px bg-r-muted-fg" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-r-muted-fg" data-dot aria-hidden />
        </div>

        {/* The axis. */}
        <div className="absolute inset-x-0 top-[88px] h-px bg-r-border" aria-hidden />

        {/* The distance travelled, so a still frame still shows the movement. */}
        <motion.div
          className="absolute top-[87px] h-[3px] rounded-full"
          aria-hidden
          initial={false}
          animate={{ left: `${trailLeft}%`, width: `${trailWidth}%` }}
          transition={move}
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, oklch(var(--r-primary)) 0 6px, transparent 6px 12px)",
            opacity: 0.45,
          }}
        />

        {TICKS.map((t) => (
          <div
            key={t}
            className="absolute top-[92px] flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${pct(t)}%` }}
            aria-hidden
          >
            <span className="h-2 w-px bg-r-border" />
            <span className="r-num mt-1 hidden whitespace-nowrap text-[11px] text-r-subtle sm:inline">
              {spec.tickLabel(t)}
            </span>
          </div>
        ))}

        {/* Moving party, below the axis. */}
        <motion.div
          className="absolute top-[124px] flex w-px flex-col items-center"
          data-marker="moving"
          data-marker-day={day}
          /**
           * `initial` owns the origin, NOT a `style` prop.
           *
           * Passing style={{ left }} alongside animate={{ left }} looked equivalent and was not:
           * React re-applies the inline style on every re-render, clobbering the value framer is
           * animating. The label read "Day 1" while the marker still sat on day 30 — the text
           * and the position disagreed, which on this page is the one thing that must never
           * happen. Caught by asserting the bounding box, not just the attribute.
           */
          initial={{ left: `${pct(spec.from)}%` }}
          animate={{ left: `${pct(day)}%` }}
          transition={move}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-r-primary" data-dot aria-hidden />
          <span className="mt-1 h-5 w-px bg-r-primary" aria-hidden />
          <span
            className={`r-num mt-1 whitespace-nowrap text-sm font-semibold text-r-fg ${movingShift}`}
          >
            {spec.dayLabel(day)}
          </span>
          <span
            className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.04em] text-r-primary ${movingShift}`}
          >
            {spec.movingLabel}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

export function TimelineCaption({ variant }: { variant: TimelineVariant }) {
  return (
    <p className="text-sm leading-relaxed text-r-muted-fg" data-timeline-caption>
      {SPEC[variant].caption}
    </p>
  );
}
