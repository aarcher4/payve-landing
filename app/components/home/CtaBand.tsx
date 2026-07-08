import Reveal from "./Reveal";
import { bookDemoLabel, bookDemoUrl } from "../site/config";

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-sage-900">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/images/cta-hills.jpg')" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(28,44,38,0.86) 0%, rgba(28,44,38,0.68) 100%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <Reveal>
          {/* Ring composition: the closing band repeats the hero headline
              (docs/design-review-r3.md lens 8; Alex pick 2026-07-08). */}
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-extrabold tracking-display text-white sm:text-4xl">
            The money and the busywork, handled.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-sage-200">
            A 30-minute walkthrough with your systems in mind. No rip and
            replace, nothing to install.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={bookDemoUrl}
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-sage-900 transition-colors hover:bg-sage-50"
            >
              {bookDemoLabel}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
