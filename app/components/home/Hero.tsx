"use client";

import { motion, useReducedMotion } from "framer-motion";
import { bookDemoLabel, bookDemoUrl } from "../site/config";

export default function Hero() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden">
      <link rel="preload" as="image" href="/images/hero-home.jpg" />
      {/* Atmosphere backdrop: Michoacán orchard mountains at sunrise (r2 regrade) */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover"
        style={{
          backgroundImage: "url('/images/hero-home.jpg')",
          backgroundPosition: "center 46%",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(247,248,249,0.76) 0%, rgba(247,248,249,0.56) 48%, rgba(247,248,249,0.8) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(247,248,249,0.72) 0%, rgba(247,248,249,0.42) 40%, rgba(247,248,249,0) 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[68dvh] max-w-6xl items-center px-4 py-28 sm:px-6">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="max-w-2xl"
        >
          <h1 className="text-balance font-display text-4xl font-extrabold tracking-display-xl text-ink-1 sm:text-6xl">
            The money and the busywork, handled.
          </h1>
          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-ink-2 sm:text-lg">
            Payve is the payment network for supply chain trade. When you
            enroll, every supplier you pay gains instant payment and
            on-demand working capital. When they enroll, so do theirs.
            Agents built on that connected network handle the back office
            work your team does by hand.
          </p>
          <div className="mt-9 flex">
            <a
              href={bookDemoUrl}
              className="rounded-md bg-sage-700 px-6 py-3 text-sm font-semibold text-white shadow-elev-2 transition-colors hover:bg-sage-800"
            >
              {bookDemoLabel}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
