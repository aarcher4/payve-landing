"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Network-rebrand components (docs/network-rebrand.md §8).
 * - FlowLine: the ONE ambient element on a page — a thin sage path with a
 *   traveling pulse (money visibly moving). Decorative, aria-hidden.
 * - CascadeFlow: enroll → suppliers paid → a supplier enrolls → its own
 *   suppliers unlock. The network page's signature demonstration.
 * - CorridorStrip: the five corridors, uniform, type-led (icon diet).
 * Motion grammar per docs/motion-system.md: reveal-once, reduced motion
 * renders the final state statically, accent only where money moves.
 */

function useSteps(stepCount: number, interval: number, active: boolean) {
  const reduced = useReducedMotion() ?? false;
  const [step, setStep] = useState(reduced ? stepCount : 0);
  useEffect(() => {
    if (reduced || !active) return;
    const id = setInterval(() => {
      setStep((s) => (s >= stepCount ? 0 : s + 1));
    }, interval);
    return () => clearInterval(id);
  }, [stepCount, interval, active, reduced]);
  return step;
}

/* ------------------------------------------------------------------ */
/* FlowLine                                                            */
/* ------------------------------------------------------------------ */

export function FlowLine({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <svg
      className={className}
      viewBox="0 0 1200 48"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        id="flowline-path"
        d="M0 40 C 240 40, 320 8, 600 8 S 960 40, 1200 40"
        stroke="var(--sage-200)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      {!reduced && (
        <circle r="3" fill="var(--sage-500)">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M0 40 C 240 40, 320 8, 600 8 S 960 40, 1200 40"
          />
        </circle>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CascadeFlow                                                         */
/* ------------------------------------------------------------------ */

type CascadeNode = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  tier: 1 | 2 | 3;
};

const NODES: CascadeNode[] = [
  { id: "you", label: "Your company", sub: "Enrolled", x: 60, y: 130, tier: 1 },
  { id: "casa", label: "Casa de Tortillas", sub: "MX · paid today", x: 300, y: 40, tier: 2 },
  { id: "quindio", label: "Café del Quindío", sub: "CO · paid today", x: 300, y: 130, tier: 2 },
  { id: "maple", label: "Pacific NW Maple", sub: "US · paid today", x: 300, y: 220, tier: 2 },
  { id: "harina", label: "Harina del Bajío", sub: "MX · paid today", x: 540, y: 40, tier: 3 },
  { id: "empaques", label: "Empaques Anáhuac", sub: "MX · paid today", x: 540, y: 130, tier: 3 },
];

const EDGES: Array<{ from: string; to: string; appearAt: number }> = [
  { from: "you", to: "casa", appearAt: 1 },
  { from: "you", to: "quindio", appearAt: 1 },
  { from: "you", to: "maple", appearAt: 1 },
  { from: "casa", to: "harina", appearAt: 3 },
  { from: "casa", to: "empaques", appearAt: 3 },
];

/** Steps: 0 you enroll · 1 payment lines reach your suppliers · 2 a supplier
 *  enrolls · 3 its own suppliers unlock · 4 hold. */
export function CascadeFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const step = useSteps(4, 1800, inView);
  const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));

  const nodeActive = (n: CascadeNode) =>
    n.tier === 1 ? step >= 0 : n.tier === 2 ? step >= 1 : step >= 3;
  const nodeEnrolled = (n: CascadeNode) =>
    n.tier === 1 ? true : n.id === "casa" ? step >= 2 : false;

  return (
    <div
      ref={ref}
      className="rounded-lg border border-hairline bg-paper-elev shadow-elev-3 overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-hairline bg-paper-2 px-4 py-2.5">
        <span className="text-xs font-semibold text-ink-2">The Payve Network</span>
        <span className="flex items-center gap-1.5 text-xs text-ink-3">
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-sage-400 opacity-50" />
            <span className="h-1.5 w-1.5 rounded-full bg-sage-600" />
          </span>
          {step < 2 ? "Suppliers unlocked" : "Network growing"}
        </span>
      </div>

      <div className="px-4 py-5">
        <svg viewBox="0 0 700 260" className="w-full" role="img" aria-label="When your company enrolls, your suppliers are paid instantly; when a supplier enrolls, its own suppliers unlock too.">
          {EDGES.map((e) => {
            const a = nodeById[e.from];
            const b = nodeById[e.to];
            const on = step >= e.appearAt;
            return (
              <motion.path
                key={`${e.from}-${e.to}`}
                d={`M ${a.x + 96} ${a.y} C ${a.x + 160} ${a.y}, ${b.x - 64} ${b.y}, ${b.x} ${b.y}`}
                stroke={on ? "var(--sage-500)" : "var(--hairline)"}
                strokeWidth="1.25"
                fill="none"
                initial={false}
                animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              />
            );
          })}
          {NODES.map((n) => {
            const active = nodeActive(n);
            const enrolled = nodeEnrolled(n);
            return (
              <motion.g
                key={n.id}
                initial={false}
                animate={{ opacity: active ? 1 : 0.25 }}
                transition={{ duration: 0.5 }}
              >
                <rect
                  x={n.x}
                  y={n.y - 22}
                  width="96"
                  height="44"
                  rx="6"
                  fill={enrolled ? "var(--sage-50)" : "var(--paper-elev)"}
                  stroke={enrolled ? "var(--sage-500)" : "var(--hairline-2)"}
                  strokeWidth="1"
                />
                <text
                  x={n.x + 10}
                  y={n.y - 4}
                  fontSize="10.5"
                  fontWeight="600"
                  fill="var(--ink-1)"
                >
                  {n.label}
                </text>
                <text x={n.x + 10} y={n.y + 12} fontSize="9" fill={active ? "var(--sage-600)" : "var(--ink-3)"}>
                  {enrolled && n.tier !== 1 ? "Enrolled · paying its own" : n.sub}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="border-t border-hairline bg-paper px-4 py-2.5 text-xs text-ink-3">
        Suppliers enroll at no cost. Each one strengthens the network you trade in.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CorridorStrip                                                       */
/* ------------------------------------------------------------------ */

const CORRIDORS = [
  { region: "United States", currency: "USD" },
  { region: "Mexico", currency: "MXN" },
  { region: "Colombia", currency: "COP" },
  { region: "Brazil", currency: "BRL" },
  { region: "European Union", currency: "EUR" },
];

export function CorridorStrip() {
  return (
    <ul className="grid grid-cols-1 divide-y divide-hairline border-y border-hairline sm:grid-cols-5 sm:divide-x sm:divide-y-0">
      {CORRIDORS.map((c) => (
        <li key={c.region} className="flex flex-row items-center justify-between gap-1 px-5 py-4 sm:flex-col sm:items-start sm:justify-start sm:py-6">
          <span className="text-sm font-semibold text-ink-1">{c.region}</span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-ink-3">
            <Check className="h-3 w-3 text-sage-600" aria-hidden />
            {c.currency} · local settlement
          </span>
        </li>
      ))}
    </ul>
  );
}
