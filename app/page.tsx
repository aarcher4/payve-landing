import { bookDemoUrl, signInUrl } from "./components/site/config";

/**
 * Interim homepage: β-styled hero carrying the current narrative.
 * The full homepage arc (logo wall, product tour, agents step-through,
 * customer proof, trust section) lands in the homepage build PR.
 */
export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('/hero.png')" }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex min-h-[80dvh] max-w-4xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <h1 className="text-balance font-display text-4xl font-extrabold tracking-display-xl text-ink-1 sm:text-5xl lg:text-6xl">
          Payments, early pay, and agents for supply chain trade.
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-ink-2 sm:text-lg">
          Payve runs the money and the busywork for supply chains. Buyers pay
          every supplier from one place and suppliers can get paid early.
          Payve agents bring organizational intelligence and automate back
          office workflows like orders, invoices, quality holds, and
          reconciliation.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={bookDemoUrl}
            className="rounded-md bg-sage-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-800"
          >
            Book a demo
          </a>
          <a
            href={signInUrl}
            className="rounded-md border border-hairline-2 bg-paper-elev px-6 py-3 text-sm font-medium text-ink-1 transition-colors hover:bg-paper-2"
          >
            Sign in
          </a>
        </div>
      </div>
    </main>
  );
}
