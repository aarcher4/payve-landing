import Reveal from "./Reveal";
import { bookDemoUrl } from "../site/config";

/** Quiet mid-page CTA (conversion checklist: CTA repeated at scroll points). */
export default function MidCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
      <Reveal>
        <h2 className="font-display text-2xl font-extrabold tracking-h1 text-ink-1">
          See it on your own data.
        </h2>
        <a
          href={bookDemoUrl}
          className="mt-6 inline-flex rounded-md bg-sage-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-800"
        >
          Book a demo
        </a>
      </Reveal>
    </section>
  );
}
