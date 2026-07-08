"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, CircleDollarSign } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Animated product demonstrations for the homepage tour.
 * Grammar per docs/motion-system.md: agents are shown working, steps
 * progress top to bottom, tabular numerics, reduced motion renders the
 * final state statically.
 */

function useLoopStep(stepCount: number, interval: number, active: boolean) {
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

const frame =
  "rounded-lg border border-hairline bg-paper-elev shadow-elev-3 overflow-hidden";
const frameHeader =
  "flex items-center justify-between border-b border-hairline bg-paper-2 px-4 py-2.5";

/* ------------------------------------------------------------------ */

const paymentRows = [
  { name: "Casa de Tortillas SA de CV", method: "International payment", amount: "$84,210.00", local: "≈ MX$1,557,885 · MXN" },
  { name: "Pacific Northwest Maple Co.", method: "Bank transfer", amount: "$23,847.50" },
  { name: "Café del Quindío SAS", method: "International payment", amount: "$41,062.75", local: "≈ CO$168,357,275 · COP" },
  { name: "Sycamore Mill & Lumber", method: "Bank transfer", amount: "$18,395.20" },
];

export function PaymentsDemo({ intl = false }: { intl?: boolean } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const step = useLoopStep(paymentRows.length + 1, 1400, inView);

  return (
    <div ref={ref} className={frame}>
      <div className={frameHeader}>
        <span className="text-xs font-semibold text-ink-2">Payment run</span>
        <span className="t-num text-xs text-ink-3">Jul 10, 2026</span>
      </div>
      <ul className="divide-y divide-hairline">
        {paymentRows.map((row, i) => (
          <li key={row.name} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink-1">{row.name}</span>
              <span className="block text-xs text-ink-3">{row.method}</span>
            </span>
            <span className="flex shrink-0 items-center gap-3">
              <span className="flex flex-col items-end gap-0.5">
                <span className="t-num text-sm font-semibold text-ink-1">{row.amount}</span>
                {intl && "local" in row && row.local && (
                  <span className="t-num font-mono text-[11px] text-ink-3">{row.local}</span>
                )}
              </span>
              <AnimatePresence mode="wait" initial={false}>
                {i < step ? (
                  <motion.span
                    key="sent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center gap-1 rounded-sm bg-positive-bg px-1.5 py-0.5 text-[11px] font-semibold text-positive"
                  >
                    <Check className="h-3 w-3" aria-hidden /> Sent
                  </motion.span>
                ) : (
                  <motion.span
                    key="queued"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-flex rounded-sm bg-paper-2 px-1.5 py-0.5 text-[11px] font-medium text-ink-3"
                  >
                    Queued
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">Total</span>
        <span className="t-num text-sm font-bold text-ink-1">$167,715.45</span>
      </div>
      <div className="border-t border-hairline bg-paper px-4 py-2.5 text-xs text-ink-3">
        One approval. Every supplier paid. No wire fees.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function EarlyPayDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const step = useLoopStep(2, 2600, inView);
  const accepted = step >= 2;

  return (
    <div ref={ref} className={frame}>
      <div className={frameHeader}>
        <span className="text-xs font-semibold text-ink-2">Early payment offer</span>
        <span className="t-num text-xs text-ink-3">Invoice PO-44829</span>
      </div>
      <div className="px-5 py-6">
        <p className="text-sm text-ink-2">Get</p>
        <p className="t-num mt-1 font-display text-3xl font-extrabold tracking-h1 text-ink-1">
          $127,264.46 today
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          instead of <span className="t-num font-semibold">$129,500.50</span> in 28 days
        </p>
        <p className="t-num mt-1 text-sm text-ink-3">$2,236.04 fee</p>

        <div className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            {accepted ? (
              <motion.div
                key="accepted"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-2 rounded-md bg-positive-bg px-4 py-3"
              >
                <Check className="h-4 w-4 text-positive" aria-hidden />
                <span className="text-sm font-semibold text-positive">
                  Accepted. Funds arrive within one business day.
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="offer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex rounded-md bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Accept early payment
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="border-t border-hairline bg-paper px-4 py-2.5 text-xs text-ink-3">
        The supplier chooses. The buyer earns each time.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const agentLines = [
  "Reading overnight orders and documents",
  "14 invoices matched to purchase orders",
  "2 count sheets read and itemized",
  "Morning briefing drafted",
];

export function AgentsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const step = useLoopStep(agentLines.length + 1, 1500, inView);

  return (
    <div ref={ref} className={frame}>
      <div className={frameHeader}>
        <span className="text-xs font-semibold text-ink-2">Payve agent</span>
        <span className="flex items-center gap-1.5 text-xs text-ink-3">
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-sage-400 opacity-50" />
            <span className="h-1.5 w-1.5 rounded-full bg-sage-600" />
          </span>
          Working
        </span>
      </div>
      <ul className="space-y-2.5 px-5 py-5 font-mono text-[13px]">
        {agentLines.map((line, i) => (
          <li key={line} className="flex items-center gap-2.5">
            <AnimatePresence mode="wait" initial={false}>
              {i < step ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <Check className="h-3.5 w-3.5 text-positive" aria-hidden />
                </motion.span>
              ) : i === step ? (
                <motion.span
                  key="dot"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="block h-3.5 w-3.5 text-center leading-none text-sage-600"
                >
                  ·
                </motion.span>
              ) : (
                <span key="idle" className="block h-3.5 w-3.5" />
              )}
            </AnimatePresence>
            <span className={i <= step ? "text-ink-1" : "text-ink-4"}>{line}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-hairline bg-paper px-4 py-2.5">
        <span className="text-xs text-ink-3">Nothing is written without your approval.</span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline-2 bg-paper-elev px-3 py-1.5 text-xs font-semibold text-ink-1">
          <CircleDollarSign className="h-3.5 w-3.5 text-sage-600" aria-hidden />
          Approve
        </span>
      </div>
    </div>
  );
}
