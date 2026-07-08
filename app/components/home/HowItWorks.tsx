"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeftRight, Bot, Eye, Link2 } from "lucide-react";
import { useState } from "react";
import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Connect",
    Icon: Link2,
    body: (
      <>
        We securely link your ERP and bank data.{" "}
        <span className="font-semibold text-sage-700">No rip and replace</span>
        , nothing to install.
      </>
    ),
    proof:
      "Fortune Growers connected the ERP it has run for two decades. Nothing was replaced, and nothing was installed on their side.",
  },
  {
    n: "02",
    title: "See everything",
    Icon: Eye,
    body: "Your data unified daily. Ask questions in plain English (or Spanish), get answers with the numbers behind them.",
    proof:
      "The owner of SL Produce asks the business questions at any hour and gets answers with the numbers behind them. What started with the owner now briefs the CFO and the receivables team every morning.",
  },
  {
    n: "03",
    title: "Automate with approval",
    Icon: Bot,
    body: "Agents do the entry, matching, and drafting. A person on your team approves every write.",
    proof:
      "At Fortune Growers, agents enter 800 vouchers a month, work that took about 3 minutes each by hand. The team approves every batch and gets about 40 hours a month back.",
  },
  {
    n: "04",
    title: "Move the money",
    Icon: ArrowLeftRight,
    body: "Pay every supplier from one place and offer early pay on approved invoices.",
    proof:
      "Suppliers in Mexico and Colombia receive local currency at a competitive exchange rate, and any supplier can choose early payment on an approved invoice. Suppliers with liquidity on open invoices stay closer to the buyers who offer it.",
  },
] as const;

export default function HowItWorks() {
  const [active, setActive] = useState<(typeof steps)[number]["n"]>("01");
  const reduced = useReducedMotion() ?? false;
  const selected = steps.find((s) => s.n === active) ?? steps[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <h2 className="max-w-2xl font-display text-3xl font-extrabold tracking-display text-ink-1 sm:text-4xl">
          Built around the systems you already run.
        </h2>
      </Reveal>
      <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => {
          const on = s.n === active;
          return (
            <Reveal key={s.n} delayIndex={i}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setActive(s.n)}
                onMouseEnter={() => setActive(s.n)}
                onFocus={() => setActive(s.n)}
                className="relative h-full w-full cursor-pointer rounded-[10px] border border-hairline bg-paper-elev p-5 text-left shadow-elev-2 transition-all duration-200 ease-out hover:-translate-y-[3px] hover:border-sage-200 hover:bg-sage-50 hover:shadow-elev-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {on && (
                  <span
                    className="pointer-events-none absolute inset-0 rounded-[10px] border-[1.5px] border-sage-500"
                    aria-hidden
                  />
                )}
                <div className="flex items-center justify-between">
                  <span className="t-num font-mono text-xs font-semibold text-sage-600">
                    {s.n}
                  </span>
                  <s.Icon className="h-5 w-5 text-ink-3" aria-hidden />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-ink-1">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.body}</p>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* Proof layer: what the selected step looked like for a real customer */}
      <div className="mt-9">
        <span className="t-eyebrow mb-4 block text-sage-600">
          What that looked like
        </span>
        <div className="flex min-h-[104px] items-center rounded-[10px] border border-hairline bg-paper-elev px-7 py-6 shadow-elev-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected.n}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-5"
            >
              <span className="t-num flex-none pt-0.5 font-mono text-xs font-semibold text-sage-600">
                {selected.n}
              </span>
              <div>
                <div className="mb-1.5 text-[15px] font-semibold text-ink-1">
                  {selected.title}
                </div>
                <p className="max-w-3xl text-[15px] leading-relaxed text-ink-2">
                  {selected.proof}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
