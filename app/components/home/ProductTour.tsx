"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, CreditCard, DollarSign } from "lucide-react";
import { useState } from "react";
import Reveal from "./Reveal";
import { AgentsDemo, EarlyPayDemo, PaymentsDemo } from "./demos";

const modules = [
  { key: "payments", title: "Payments", Icon: CreditCard, Demo: PaymentsDemo },
  { key: "early-pay", title: "Early pay", Icon: DollarSign, Demo: EarlyPayDemo },
  { key: "agents", title: "Payve Agents", Icon: Bot, Demo: AgentsDemo },
] as const;

export default function ProductTour() {
  const [active, setActive] = useState<(typeof modules)[number]["key"]>("payments");
  const current = modules.find((m) => m.key === active) ?? modules[0];
  const Demo = current.Demo;

  return (
    <section className="border-y border-hairline bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <span className="t-eyebrow text-sage-600">One platform</span>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-display text-ink-1 sm:text-4xl">
            The same platform moves the money and runs the back office.
          </h2>
        </Reveal>

        <div className="mt-11 flex flex-wrap items-stretch gap-8">
          {/* Selector column, vertically centered against the demo panel */}
          <div className="flex min-w-[280px] flex-1 basis-80 flex-col justify-center lg:max-w-sm">
            {modules.map((m) => {
              const on = m.key === active;
              return (
                <div key={m.key}>
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => setActive(m.key)}
                    onMouseEnter={() => setActive(m.key)}
                    onFocus={() => setActive(m.key)}
                    className={`relative mb-2 flex w-full cursor-pointer items-center gap-3.5 rounded-[10px] border p-4 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600 ${
                      on
                        ? "border-sage-100 bg-sage-50 shadow-[inset_3px_0_0_var(--sage-600)]"
                        : "border-transparent bg-transparent hover:bg-sage-50"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg transition-colors duration-150 ${
                        on ? "bg-sage-700 text-white" : "bg-paper-2 text-ink-3"
                      }`}
                      aria-hidden
                    >
                      <m.Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span
                      className={`flex-1 text-base tracking-tight ${
                        on ? "font-bold text-sage-800" : "font-semibold text-ink-2"
                      }`}
                    >
                      {m.title}
                    </span>
                    {/* Connector rail from the active row into the demo panel */}
                    {on && (
                      <span
                        className="absolute left-full top-1/2 z-10 hidden h-0.5 w-8 -translate-y-1/2 items-center justify-end bg-sage-500 lg:flex"
                        aria-hidden
                      >
                        <span className="-mr-1 h-2 w-2 rounded-full bg-sage-600 shadow-[0_0_0_3px_var(--paper-elev)]" />
                      </span>
                    )}
                  </button>
                  {/* Demo inline on mobile */}
                  {on && (
                    <div className="mb-3 lg:hidden">
                      <m.Demo />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Demo panel, desktop */}
          <div className="hidden min-h-[452px] flex-1 basis-[520px] flex-col rounded-xl border border-hairline bg-paper-elev p-6 shadow-elev-3 lg:flex">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex h-full flex-col"
              >
                <Demo />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
