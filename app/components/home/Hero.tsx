"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, FileText, Landmark, Sparkles, Clock } from "lucide-react";
import { bookDemoLabel, bookDemoUrl } from "../site/config";

const chips = [
  {
    icon: FileText,
    label: "Matching invoice to PO-44829",
    state: "working",
    pos: "left-[6%] top-[22%]",
    delay: 0,
  },
  {
    icon: Sparkles,
    label: "Morning briefing drafted",
    sub: "Awaiting your approval",
    state: "ready",
    pos: "right-[5%] top-[18%]",
    delay: 1.1,
  },
  {
    icon: Landmark,
    label: "Early payment sent",
    sub: "$127,264.46",
    state: "done",
    pos: "left-[9%] bottom-[16%]",
    delay: 0.6,
  },
  {
    icon: Clock,
    label: "Payment scheduled",
    sub: "Jul 18, 2026",
    state: "info",
    pos: "right-[8%] bottom-[22%]",
    delay: 1.7,
  },
] as const;

function AgentChip({
  chip,
  reduced,
}: {
  chip: (typeof chips)[number];
  reduced: boolean;
}) {
  const Icon = chip.icon;
  const body = (
    <div className="flex items-start gap-2.5 rounded-lg border border-hairline bg-paper-elev/95 px-3.5 py-2.5 shadow-elev-3 backdrop-blur">
      {chip.state === "working" ? (
        <span className="relative mt-0.5 flex h-4 w-4 items-center justify-center">
          <span className="absolute h-2 w-2 animate-ping rounded-full bg-sage-500 opacity-60" />
          <span className="h-2 w-2 rounded-full bg-sage-600" />
        </span>
      ) : chip.state === "done" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 text-positive" aria-hidden />
      ) : (
        <Icon className="mt-0.5 h-4 w-4 text-ink-3" aria-hidden />
      )}
      <span>
        <span className="block text-xs font-semibold text-ink-1">{chip.label}</span>
        {"sub" in chip && chip.sub && (
          <span className="t-num block text-xs text-ink-3">{chip.sub}</span>
        )}
      </span>
    </div>
  );

  if (reduced) {
    return <div className={`absolute hidden lg:block ${chip.pos}`}>{body}</div>;
  }
  return (
    <motion.div
      className={`absolute hidden lg:block ${chip.pos}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.4 + chip.delay * 0.3 }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7 + chip.delay, repeat: Infinity, ease: "easeInOut", delay: chip.delay }}
      >
        {body}
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden">
      <link rel="preload" as="image" href="/images/hero-home.jpg" />
      {/* Atmosphere backdrop: Michoacán orchard mountains at sunrise */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-home.jpg')" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(247,248,249,0.84) 0%, rgba(247,248,249,0.72) 45%, rgba(247,248,249,0.88) 78%, var(--paper) 100%)",
        }}
        aria-hidden
      />

      {chips.map((chip) => (
        <AgentChip key={chip.label} chip={chip} reduced={reduced} />
      ))}

      <div className="relative mx-auto flex min-h-[82dvh] max-w-4xl flex-col items-center justify-center px-4 py-28 text-center sm:px-6">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <h1 className="text-balance font-display text-4xl font-extrabold tracking-display-xl text-ink-1 sm:text-6xl">
            The money and the busywork, handled.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-ink-2 sm:text-lg">
            Payve is the financial operating layer for supply chain trade. Pay
            every supplier from one place, give suppliers the option to be
            paid early, and put agents on the back office work your team does
            by hand.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href={bookDemoUrl}
              className="rounded-md bg-sage-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-800"
            >
              {bookDemoLabel}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
