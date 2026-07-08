import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "../components/home/Reveal";
import CtaBand from "../components/home/CtaBand";
import { stories } from "./customers-data";
import { LogoRow } from "../components/home/LogoWall";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "Supply chain businesses run on Payve: growers, shippers, distributors, and packhouses across the US, Mexico, and Colombia.",
};

export default function CustomersPage() {
  return (
    <main>
      <section className="border-b border-hairline bg-paper-elev">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6">
          <Reveal>
            <span className="t-eyebrow">Customers</span>
            <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-extrabold tracking-display text-ink-1 sm:text-5xl">
              Supply chains run on Payve.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
              Growers, shippers, distributors, and packhouses across the US,
              Mexico, and Colombia use Payve to pay suppliers, offer early
              pay, and put agents on their back office.
            </p>
          </Reveal>
          <div className="mt-12">
            <LogoRow />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {stories.map((s, i) => (
            <Reveal key={s.slug} delayIndex={i}>
              <Link
                href={`/customers/${s.slug}`}
                className="flex h-full flex-col rounded-lg border border-hairline bg-paper-elev p-7 transition-shadow hover:shadow-elev-3"
              >
                <p className="text-sm leading-relaxed text-ink-2">{s.blurb}</p>
                <p className="t-num mt-5 font-display text-3xl font-extrabold tracking-h1 text-ink-1">
                  {s.metric}
                </p>
                <p className="mt-1 text-sm text-ink-2">{s.metricSub}</p>
                <h2 className="mt-6 font-display text-lg font-bold leading-snug tracking-h2 text-ink-1">
                  {s.headline}
                </h2>
                <span className="mt-auto flex items-center gap-2 pt-6 text-xs text-ink-3">
                  {s.industryTag}
                  {s.draft && (
                    <span className="rounded-sm bg-paper-2 px-1.5 py-0.5 text-[11px] font-medium text-ink-3">
                      Draft
                    </span>
                  )}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
