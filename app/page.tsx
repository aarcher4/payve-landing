export default function Home() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-white">
      {/* Background image at 20% opacity */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/hero.png')" }}
      />

      {/* Centered content */}
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-24">
        <h1 className="max-w-5xl text-center text-balance font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-slate-600 leading-tight tracking-tight">
          Orchestrated precision for supply chains that{" "}
          <span className="font-serif italic">feed the world</span>.
        </h1>

        {/* What Payve does (plain-language purpose) */}
        <p className="mt-8 max-w-2xl text-center font-light text-lg md:text-xl leading-relaxed text-slate-500">
          Payve runs the money and the busywork for food supply chains. Finance
          teams pay every supplier from one place and suppliers can get paid
          early. Payve agents bring organizational intelligence and automate
          back office workflows like orders, invoices, quality holds, and
          reconciliation.
        </p>

        {/* Three pillars */}
        <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
          <div>
            <h2 className="font-display text-base tracking-wide text-slate-600">
              Pay suppliers
            </h2>
            <p className="mt-2 font-light text-sm leading-relaxed text-slate-500">
              Domestic, instant, and cross border payouts from one place, across
              the US, Mexico, and Colombia.
            </p>
          </div>
          <div>
            <h2 className="font-display text-base tracking-wide text-slate-600">
              Get paid early
            </h2>
            <p className="mt-2 font-light text-sm leading-relaxed text-slate-500">
              Suppliers choose early payment on approved invoices. The buyer pays
              once at term either way.
            </p>
          </div>
          <div>
            <h2 className="font-display text-base tracking-wide text-slate-600">
              Agents for the back office
            </h2>
            <p className="mt-2 font-light text-sm leading-relaxed text-slate-500">
              Organizational intelligence that automates orders, invoices,
              quality holds, and reconciliation.
            </p>
          </div>
        </div>

        {/* Primary links */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg">
          <a
            href="https://app.getpayve.com"
            className="font-medium text-slate-600 hover:text-slate-800 motion-safe:transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Sign in
          </a>
          <a
            href="/fortune-case-study.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-700 motion-safe:transition-colors underline underline-offset-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Read case study
          </a>
        </div>
      </div>

      {/* Legal links - bottom left */}
      <div className="absolute bottom-6 left-6 pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] md:bottom-8 md:left-8 z-10 flex gap-5 text-sm text-slate-500">
        <a
          href="/privacy"
          className="py-1 hover:text-slate-700 motion-safe:transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          Privacy
        </a>
        <a
          href="/terms"
          className="py-1 hover:text-slate-700 motion-safe:transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          Terms
        </a>
      </div>

      {/* Contact info - bottom right with safe area */}
      <div className="absolute bottom-6 right-6 pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] md:bottom-8 md:right-8 z-10 text-right text-sm text-slate-500">
        <a
          href="mailto:jeff@getpayve.com"
          className="block py-1 hover:text-slate-700 motion-safe:transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          jeff@getpayve.com
        </a>
        <a
          href="mailto:alex@getpayve.com"
          className="block py-1 hover:text-slate-700 motion-safe:transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          alex@getpayve.com
        </a>
      </div>
    </main>
  );
}
