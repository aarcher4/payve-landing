"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion() ?? false;
  const [value, setValue] = useState(reduced ? to : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, reduced]);

  return (
    <span ref={ref} className="t-num">
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

const stats = [
  { to: 39000, suffix: "+", label: "records synced from customer systems every day", format: (n: React.ReactNode) => n },
  { to: 25, suffix: "+", label: "data domains unified across ERPs" },
  { to: 30, suffix: "+", label: "scheduled briefings delivered to teams" },
] as const;

export default function Proof() {
  return (
    <section className="border-y border-hairline bg-paper-elev">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <span className="t-eyebrow">Customer proof</span>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-display text-ink-1 sm:text-4xl">
            Dozens of hours back, every week.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <Reveal>
            <figure className="border-l-2 border-sage-300 pl-6">
              <blockquote className="text-lg leading-relaxed text-ink-2">
                &ldquo;Payve has been an absolute game changer for Fortune
                Growers. Partnering with Payve instantly felt like we added an
                entire crew of dedicated specialists to our workforce. Payve
                helped us harness an unbelievable amount of unused data to make
                decisions faster and earlier, saving dozens of hours and
                eliminating thousands of dollars in waste and inefficiency
                every week.&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-ink-1">
                Geoff Pence
                <span className="font-normal text-ink-3"> · Fortune Growers</span>
              </figcaption>
            </figure>
            <Link
              href="/customers"
              className="mt-6 inline-block text-sm font-semibold text-sage-700 hover:underline"
            >
              Read customer stories
            </Link>
          </Reveal>

          <div className="grid gap-6">
            {stats.map((s, i) => (
              <Reveal key={s.label} delayIndex={i}>
                <motion.div className="rounded-lg border border-hairline bg-paper p-5">
                  <p className="font-display text-3xl font-extrabold tracking-h1 text-ink-1">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-ink-2">{s.label}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
