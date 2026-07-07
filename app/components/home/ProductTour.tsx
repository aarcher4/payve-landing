"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";
import { AgentsDemo, EarlyPayDemo, PaymentsDemo } from "./demos";

const modules = [
  {
    key: "payments",
    title: "Payments",
    href: "/products/payments",
    blurb:
      "Pay every supplier from one place. Domestic bank transfers, international payments to Mexico and Colombia at a competitive exchange rate, and no wire fees.",
    Demo: PaymentsDemo,
  },
  {
    key: "early-pay",
    title: "Early pay",
    href: "/products/early-pay",
    blurb:
      "Suppliers choose to be paid early on approved invoices. They see the exact dollars they receive and the fee. Buyers earn income each time a supplier takes it.",
    Demo: EarlyPayDemo,
  },
  {
    key: "agents",
    title: "Agents",
    href: "/products/agents",
    blurb:
      "Agents bring organizational intelligence and automate back office workflows: order entry, document matching, briefings, and notifications. A person approves every write.",
    Demo: AgentsDemo,
  },
] as const;

export default function ProductTour() {
  const [active, setActive] = useState<(typeof modules)[number]["key"]>("payments");
  const current = modules.find((m) => m.key === active) ?? modules[0];
  const Demo = current.Demo;

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <span className="t-eyebrow">One platform</span>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-display text-ink-1 sm:text-4xl">
          The same platform moves the money and runs the back office.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {/* Accordion */}
        <div className="divide-y divide-hairline border-y border-hairline">
          {modules.map((m) => {
            const openItem = m.key === active;
            return (
              <div key={m.key} className="py-1">
                <button
                  type="button"
                  aria-expanded={openItem}
                  onClick={() => setActive(m.key)}
                  className="flex w-full items-center justify-between px-1 py-4 text-left"
                >
                  <span
                    className={`font-display text-lg font-bold tracking-h2 transition-colors ${
                      openItem ? "text-ink-1" : "text-ink-3 hover:text-ink-2"
                    }`}
                  >
                    {m.title}
                  </span>
                  <span
                    className={`mr-1 h-1.5 w-1.5 rounded-full transition-colors ${
                      openItem ? "bg-sage-600" : "bg-ink-4"
                    }`}
                    aria-hidden
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openItem && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-1 pb-3 text-sm leading-relaxed text-ink-2">{m.blurb}</p>
                      <Link
                        href={m.href}
                        className="mb-4 ml-1 inline-block text-sm font-semibold text-sage-700 hover:underline"
                      >
                        Explore {m.title.toLowerCase()}
                      </Link>
                      {/* Demo inline on mobile */}
                      <div className="mb-4 px-1 lg:hidden">
                        <m.Demo />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Demo panel, desktop */}
        <div className="hidden lg:block">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Demo />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
