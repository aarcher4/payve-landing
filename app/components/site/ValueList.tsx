"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import Reveal from "../home/Reveal";

/**
 * r2 product-page value list: left checklist of value props, the active item
 * (hover/click/focus, item 1 by default) expands its description into the
 * panel on the right. Replaces the six-box FeatureGrid on product pages;
 * solutions pages keep FeatureGrid.
 */
export default function ValueList({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: readonly { title: string; body: string }[];
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const current = items[active] ?? items[0];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <Reveal>
        <span className="t-eyebrow text-sage-600">{eyebrow}</span>
      </Reveal>
      <div className="mt-7 flex flex-wrap items-stretch gap-7">
        <div className="flex min-w-[280px] flex-1 basis-80 flex-col justify-center gap-1 lg:max-w-sm">
          {items.map((item, i) => {
            const on = i === active;
            return (
              <button
                key={item.title}
                type="button"
                aria-expanded={on}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600 ${
                  on
                    ? "border-sage-100 bg-sage-50 shadow-[inset_3px_0_0_var(--sage-600)]"
                    : "border-transparent bg-transparent hover:bg-sage-50"
                }`}
              >
                <Check
                  className="h-4 w-4 flex-none text-sage-500"
                  strokeWidth={2.5}
                  aria-hidden
                />
                <span
                  className={`text-[15px] tracking-tight ${
                    on ? "font-bold text-sage-800" : "font-semibold text-ink-2"
                  }`}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex min-h-[236px] flex-1 basis-[460px] items-center rounded-xl border border-hairline bg-paper-elev p-8 shadow-elev-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current?.title}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <h3 className="font-display text-xl font-bold tracking-h2 text-ink-1 sm:text-2xl">
                {current?.title}
              </h3>
              <p className="mt-3.5 max-w-lg text-[15px] leading-relaxed text-ink-2">
                {current?.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
