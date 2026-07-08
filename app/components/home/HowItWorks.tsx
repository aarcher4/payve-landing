"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Connect",
    body: (
      <>
        We securely link your ERP and bank data.{" "}
        <span className="font-semibold text-sage-700">No rip and replace</span>
        , nothing to install.
      </>
    ),
    proof:
      "Fortune Growers connected the ERP it has run for two decades. Nothing was replaced, and nothing was installed on their side.",
    logo: "/logos/fortune-growers.png",
    company: "Fortune Growers",
    descriptor: "Grower-shipper · US & Mexico",
    link: { href: "/customers/fortune-growers", label: "Read the story" },
  },
  {
    n: "02",
    title: "See everything",
    body: "Your data unified daily. Ask questions in plain English (or Spanish), get answers with the numbers behind them.",
    proof:
      "The owner of SL Produce asks the business questions at any hour and gets answers with the numbers behind them. What started with the owner now briefs the CFO and the receivables team every morning. Loops check what matters on a schedule the family sets, and every Payve customer runs them.",
    logo: "/logos/sl-produce.png",
    company: "SL Produce",
    descriptor: "Grower family · Sinaloa & US",
    link: { href: "/customers/sl-produce", label: "Read the story" },
  },
  {
    n: "03",
    title: "Automate with approval",
    body: "Agents do the entry, matching, and drafting. A person on your team approves every write.",
    proof:
      "At Fortune Growers, agents enter 800 vouchers a month, work that took about 3 minutes each by hand. The team approves every batch and gets about 40 hours a month back.",
    logo: "/logos/fortune-growers.png",
    company: "Fortune Growers",
    descriptor: "Grower-shipper · US & Mexico",
    link: { href: "/customers/fortune-growers", label: "Read the story" },
  },
  {
    n: "04",
    title: "Move the money",
    body: "Pay every supplier from one place and offer early pay on approved invoices.",
    proof:
      "Suppliers in Mexico and Colombia receive local currency at a competitive exchange rate, and any supplier can choose early payment on an approved invoice. Suppliers with liquidity on open invoices stay closer to the buyers who offer it.",
    logo: null,
    company: "Across the platform",
    descriptor: "Suppliers in the US, Mexico & Colombia",
    link: { href: "/products/early-pay", label: "Explore early pay" },
  },
] as const;

export default function HowItWorks() {
  const [active, setActive] = useState<(typeof steps)[number]["n"]>("01");
  const reduced = useReducedMotion() ?? false;
  const selected = steps.find((s) => s.n === active) ?? steps[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <h2 className="max-w-3xl font-display text-3xl font-extrabold tracking-display text-ink-1 sm:text-4xl">
          Built around the systems{" "}
          <span className="text-ink-3">you already run.</span>
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
                <span className="t-num font-mono text-xs font-semibold text-sage-600">
                  {s.n}
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-ink-1">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.body}</p>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* Proof layer: a mini case study for the selected step (logo + company
          + outcome + story link), full grid width (r4b, Alex). */}
      <div className="mt-9">
        <span className="t-eyebrow mb-4 block text-sage-600">
          What that looked like
        </span>
        <div className="min-h-[148px] rounded-[10px] border border-hairline bg-paper-elev px-7 py-6 shadow-elev-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected.n}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10"
            >
              <div className="w-48 flex-none border-l-2 border-sage-600 pl-4">
                {selected.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selected.logo}
                    alt={selected.company}
                    className="h-9 w-auto"
                  />
                ) : (
                  <span className="font-display text-base font-bold tracking-h2 text-ink-1">
                    {selected.company}
                  </span>
                )}
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                  {selected.descriptor}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="max-w-3xl text-[15px] leading-relaxed text-ink-2">
                  {selected.proof}
                </p>
                <Link
                  href={selected.link.href}
                  className="mt-3 inline-block text-sm font-semibold text-sage-700 hover:underline"
                >
                  {selected.link.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
