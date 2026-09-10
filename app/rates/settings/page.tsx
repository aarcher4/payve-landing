import type { Metadata } from "next";
import { Wordmark } from "../../components/Wordmark";
import SpreadEditor from "./SpreadEditor";

export const metadata: Metadata = {
  title: "Rate settings",
  // Operational surface, never a search result. Belt and braces with the header set in
  // next.config.ts: a page nobody should find should be hard to find by more than one means.
  robots: { index: false, follow: false },
};

export default function RateSettingsPage() {
  return (
    <main className="min-h-screen bg-r-bg text-r-fg">
      <header className="border-b border-r-border bg-r-card">
        <div className="mx-auto flex max-w-4xl items-baseline justify-between gap-4 px-4 py-5 sm:px-6">
          <a href="/" aria-label="The Payve Rate">
            <Wordmark height={22} />
          </a>
          <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
            Rate settings
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-2xl font-medium tracking-h1 text-r-fg">
          Published spread
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-r-muted-fg">
          What each corridor publishes on rates.getpayve.com, in basis points on top of the
          rate our payment rail quotes. A change takes effect on the next request. The rail&apos;s
          own contract spread sits underneath yours and is shown for reference only.
        </p>
        <div className="mt-8">
          <SpreadEditor />
        </div>
      </div>
    </main>
  );
}
