"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * The argument of the whole page, in one component.
 *
 * Early Pay and Pay Later are the same mechanism pointed in opposite directions, so they share
 * a timeline and the contrast carries itself rather than needing a paragraph:
 *
 *   Early Pay   the SUPPLIER's marker slides LEFT, to day 1. Your payment date does not move.
 *   Pay Later   the VENDOR's marker is PINNED to the due date. YOUR cash marker slides RIGHT.
 *
 * Movement communicates causality (docs/motion-system.md rule 7): the marker travels along the
 * axis to the date it lands on, and nothing bounces.
 *
 * LAYOUT NOTE, learned from the first render. Both markers begin on day 30, because that is the
 * true starting position for both products: without Early Pay the supplier also waits until day
 * 30. That overlap is the point being made, but stacked on one line it just looked like two
 * labels colliding. So the pinned party lives ABOVE the axis and the moving party BELOW it, and
 * a dashed trail shows the distance travelled. The movement is then legible even in a still
 * screenshot, which is what the gate and any shared image actually capture.
 *
 * REDUCED MOTION RENDERS THE END STATE. `useLoopStep` seeds from `useReducedMotion`, exactly as
 * the home-page demos do, so with motion off the marker sits at its destination. Both verify
 * scripts run with `reducedMotion: "reduce"`, so anything whose meaning depended on being
 * mid-animation would be invisible to the gate.
 */

const DAY_SPAN = 60;
const TICKS = [0, 30, 60];

export type TimelineVariant = "early-pay" | "pay-later";

interface Spec {
  from: number;
  to: number;
  movingLabel: string;
  pinnedLabel: string;
  pinnedDay: number;
  caption: string;
}

const SPEC: Record<TimelineVariant, Spec> = {
  "early-pay": {
    from: 30,
    to: 1,
    movingLabel: "Supplier paid",
    pinnedLabel: "You pay",
    pinnedDay: 30,
    caption: "Your supplier reaches the cash on day 1. Your own payment date does not move.",
  },
  "pay-later": {
    from: 30,
    to: 60,
    movingLabel: "Your cash leaves",
    pinnedLabel: "Vendor paid",
    pinnedDay: 30,
    caption: "Your vendor is paid on the date you promised. Your own cash leaves later.",
  },
};

/**
 * In-view loop driver. Mirrors `useLoopStep` in app/components/home/demos.tsx: seeded from
 * reduced motion so the completed frame renders statically, and it never starts a timer for a
 * section nobody is looking at.
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

export function WorkingCapitalTimeline({ variant }: { variant: TimelineVariant }) {
  const spec = SPEC[variant];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion() ?? false;
  const moved = useLoopStep(inView);

  const day = moved ? spec.to : spec.from;
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
            Day {spec.pinnedDay}
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
              Day {t}
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
            Day {day}
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
