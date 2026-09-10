import type { Metadata } from "next";
import Reveal from "../../components/home/Reveal";
import { ProductCtaBand } from "../../components/site/ProductPage";
import { RatesChrome } from "../RatesChrome";
import { RateLadder } from "./RateLadder";
import { TimelineCaption, WorkingCapitalTimeline } from "./WorkingCapitalTimeline";

export const metadata: Metadata = {
  title: "Working capital",
  description:
    "Two ways to move a payment date without moving the other side's. Early Pay releases cash to your suppliers sooner. Pay Later keeps your vendor network paid on time while your own cash leaves later.",
  // rates.getpayve.com is the canonical home. Without this the page self-canonicalises onto
  // www via the root metadataBase and competes with itself, the same trap /rates has.
  alternates: { canonical: "https://rates.getpayve.com/working-capital" },
};

export default function WorkingCapitalPage() {
  return (
    <main className="bg-r-bg text-r-fg">
      <RatesChrome />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
            Working capital
          </p>
          <h1
            className="mt-3 max-w-3xl text-r-fg"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            Move one payment date without moving the other.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-r-muted-fg">
            Early Pay releases cash to your suppliers sooner, on the terms you already agreed.
            Pay Later keeps your vendor network paid on the date you promised while your own
            cash leaves later. Same network, opposite directions.
          </p>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------- Early Pay */}
      <section
        className="border-t border-r-border bg-r-card"
        id="early-pay"
        data-product="early-pay"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-primary">
              Early Pay
            </p>
            <h2
              className="mt-3 max-w-2xl text-r-fg"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
              }}
            >
              Your growers reach the cash sooner. You still pay on your terms.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-r-muted-fg">
              A supplier who is waiting on a 30 day invoice can take the money on day 2 instead.
              They choose, invoice by invoice, and they see the exact dollars before they decide.
              Nothing about your own payment date changes.
            </p>
          </Reveal>

          <Reveal delayIndex={1}>
            <div className="mt-10">
              <div className="rounded-r-md border border-r-border bg-r-bg px-4 py-6 sm:px-8">
                <WorkingCapitalTimeline variant="early-pay" />
              </div>
              {/* Caption OUTSIDE the frame: inside it collided with the marker labels. */}
              <div className="mt-4 max-w-2xl">
                <TimelineCaption variant="early-pay" />
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal delayIndex={2}>
              <RateLadder />
            </Reveal>

            <Reveal delayIndex={3}>
              <div className="flex h-full flex-col gap-4 rounded-r-md border border-r-border bg-r-bg p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
                  What your supplier gets
                </p>
                {/*
                  The locked three-layer ladder, in order: paid faster, then certainty and
                  visibility, then the relationship. Stated as the supplier would say it.
                */}
                <ul className="flex flex-col gap-4">
                  {[
                    {
                      h: "Paid faster",
                      b: "Cash lands the next business day, not at the end of your terms.",
                    },
                    {
                      h: "Certainty and visibility",
                      b: "They see the exact dollars first and choose each invoice. Nothing is automatic.",
                    },
                    {
                      h: "A stronger relationship",
                      b: "Suppliers who can plan their cash take more of your volume, and price it better.",
                    },
                  ].map((row) => (
                    <li key={row.h}>
                      <p className="text-sm font-semibold text-r-fg">{row.h}</p>
                      <p className="mt-1 text-sm leading-relaxed text-r-muted-fg">{row.b}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-2 text-xs text-r-subtle">
                  Suppliers enroll at no cost. The invited party never pays to join.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal>
          <a
            href="https://zcal.co/payve"
            className="inline-flex h-control items-center rounded-r-sm bg-r-primary px-5 text-sm font-semibold text-r-primary-fg"
          >
            Schedule time with us
          </a>
        </Reveal>
      </section>

      <ProductCtaBand />
    </main>
  );
}
