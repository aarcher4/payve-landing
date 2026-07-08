"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";
import { AgentsDemo, EarlyPayDemo, PaymentsDemo } from "./demos";

/**
 * r3 product tour: Mercury grammar on Payve tokens (docs/design-review-r3.md
 * lens 2). Full-bleed sage-900 chapter band; left rail of hairline text rows
 * (no icons, no boxes; active row = sage dot + description expansion); right
 * demo panel crossfades per selection; one quiet text link follows the
 * active product.
 */
const modules = [
  {
    key: "payments",
    title: "Payments",
    href: "/products/payments",
    blurb:
      "Every supplier in one payment run: bank transfers at home, local currency in Mexico and Colombia, no wire fees.",
    Demo: PaymentsDemo,
  },
  {
    key: "early-pay",
    title: "Early pay",
    href: "/products/early-pay",
    blurb:
      "Suppliers choose to be paid early on approved invoices and see the exact dollars and the fee before deciding.",
    Demo: EarlyPayDemo,
  },
  {
    key: "agents",
    title: "Payve Agents",
    href: "/products/agents",
    blurb:
      "Organizational intelligence and automated back office workflows, with a person approving every write.",
    Demo: AgentsDemo,
  },
] as const;

export default function ProductTour() {
  const [active, setActive] = useState<(typeof modules)[number]["key"]>("payments");
  const reduced = useReducedMotion() ?? false;
  const current = modules.find((m) => m.key === active) ?? modules[0];
  const Demo = current.Demo;

  return (
    <section className="bg-sage-900">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <span className="t-eyebrow !text-sage-300">One platform</span>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-display text-white sm:text-4xl">
            The same platform moves the money{" "}
            <span className="text-white/50">and runs the back office.</span>
          </h2>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-center gap-x-16 gap-y-10">
          {/* Text rail */}
          <div className="min-w-[280px] flex-1 basis-80 lg:max-w-md">
            <div className="border-t border-white/10">
              {modules.map((m) => {
                const on = m.key === active;
                return (
                  <div key={m.key} className="border-b border-white/10">
                    <button
                      type="button"
                      aria-expanded={on}
                      onClick={() => setActive(m.key)}
                      className="flex w-full cursor-pointer items-baseline gap-3 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-300"
                    >
                      <span
                        className={`h-1.5 w-1.5 flex-none translate-y-[-2px] rounded-full transition-colors duration-200 ${
                          on ? "bg-sage-400" : "bg-transparent"
                        }`}
                        aria-hidden
                      />
                      <span
                        className={`font-display text-lg font-bold tracking-h2 transition-colors duration-200 ${
                          on ? "text-white" : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        {m.title}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div
                          initial={reduced ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduced ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-sm pb-5 pl-[18px] text-sm leading-relaxed text-white/70">
                            {m.blurb}
                          </p>
                          {/* Demo inline on mobile */}
                          <div className="mb-5 pl-[18px] lg:hidden">
                            <m.Demo />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            <Link
              href={current.href}
              className="mt-6 inline-block text-sm font-semibold text-sage-300 underline underline-offset-4 transition-colors hover:text-sage-200"
            >
              Explore {current.title === "Payve Agents" ? "Payve Agents" : current.title.toLowerCase()}
            </Link>
          </div>

          {/* Demo panel, desktop */}
          <div className="hidden min-h-[452px] flex-1 basis-[520px] items-center lg:flex">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.key}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="w-full"
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
