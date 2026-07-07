import Reveal from "./Reveal";
import { bookDemoUrl, signInUrl } from "../site/config";

export default function CtaBand() {
  return (
    <section className="bg-sage-900">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-extrabold tracking-display text-white sm:text-4xl">
            See Payve on your own data.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-sage-200">
            A 30-minute walkthrough with your systems in mind. No rip and
            replace, nothing to install.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={bookDemoUrl}
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-sage-900 transition-colors hover:bg-sage-50"
            >
              Book a demo
            </a>
            <a
              href={signInUrl}
              className="rounded-md border border-sage-700 px-6 py-3 text-sm font-medium text-sage-100 transition-colors hover:bg-sage-800"
            >
              Sign in
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
