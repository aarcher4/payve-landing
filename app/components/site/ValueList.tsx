"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import Reveal from "../home/Reveal";

/**
 * r3 product-page value list: hairline text rail (docs/design-review-r3.md
 * lens 1; no checkmarks, active row = sage dot + bold title), the active item
 * (hover/click/focus, item 1 by default) expands its description into the
 * panel on the right. Solutions pages keep FeatureGrid.
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
        <div className="min-w-[280px] flex-1 basis-80 self-center border-t border-hairline lg:max-w-sm">
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
                className="flex w-full cursor-pointer items-baseline gap-3 border-b border-hairline py-3.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-600"
              >
                <span
                  className={`h-1.5 w-1.5 flex-none translate-y-[-2px] rounded-full transition-colors duration-200 ${
                    on ? "bg-sage-500" : "bg-transparent"
                  }`}
                  aria-hidden
                />
                <span
                  className={`text-[15px] tracking-tight transition-colors duration-200 ${
                    on ? "font-bold text-sage-800" : "font-semibold text-ink-3 hover:text-ink-2"
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
