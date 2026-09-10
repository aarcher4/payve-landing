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

const SUPPLIER_GETS = [
  { h: "Paid faster", b: "Cash lands the next business day, not at the end of your terms." },
  {
    h: "Certainty and visibility",
    b: "They see the exact dollars first and choose each invoice. Nothing is automatic.",
  },
  {
    h: "A stronger relationship",
    b: "Suppliers who can plan their cash take more of your volume, and price it better.",
  },
];

const NETWORK_GETS = [
  {
    h: "Paid on the promised date",
    b: "Not early, not late. The date on the invoice is the date the money lands.",
  },
  {
    h: "Nothing to sign up for",
    b: "Your vendor is paid the way they always are. Pay Later is your arrangement, not theirs.",
  },
  {
    h: "A reputation you can spend",
    b: "A buyer who always pays on time gets first call on supply when it is tight.",
  },
];

const COMPARISON = [
  {
    k: "early-pay",
    name: "Early Pay",
    moves: "Moves your supplier's money earlier",
    them: "Your growers reach liquidity without waiting out your terms.",
    you: "Your payment date is unchanged.",
    pick: "Pick this when a supplier needs cash sooner than your terms allow.",
  },
  {
    k: "pay-later",
    name: "Pay Later",
    moves: "Moves your own money later",
    them: "Your vendor is paid on the promised date, every time.",
    you: "Your cash leaves on a term you pick.",
    pick: "Pick this when you want to be reliable to your network and still hold cash.",
  },
];

function BenefitList({ items }: { items: { h: string; b: string }[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((row) => (
        <li key={row.h}>
          <p className="text-sm font-semibold text-r-fg">{row.h}</p>
          <p className="mt-1 text-sm leading-relaxed text-r-muted-fg">{row.b}</p>
        </li>
      ))}
    </ul>
  );
}

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
              A supplier who is waiting on a 30 day invoice can take the money on day 1 instead.
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
                <BenefitList items={SUPPLIER_GETS} />
                <p className="mt-auto pt-2 text-xs text-r-subtle">
                  Suppliers enroll at no cost. The invited party never pays to join.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Pay Later */}
      <section className="border-t border-r-border" id="pay-later" data-product="pay-later">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-primary">
              Pay Later
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
              Your vendors are paid on time. Every time.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-r-muted-fg">
              Your network is paid on the date you promised, whatever your own cash position
              looks like that week. You settle later, on a term you pick. The vendor never sees
              the difference, which is the entire point of being reliable to them.
            </p>
          </Reveal>

          <Reveal delayIndex={1}>
            <div className="mt-10">
              <div className="rounded-r-md border border-r-border bg-r-card px-4 py-6 sm:px-8">
                <WorkingCapitalTimeline variant="pay-later" />
              </div>
              <div className="mt-4 max-w-2xl">
                <TimelineCaption variant="pay-later" />
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal delayIndex={2}>
              <div className="rounded-r-md border border-r-border bg-r-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
                  What it costs
                </p>
                <p className="r-num mt-3 flex items-baseline gap-2" data-pay-later-headline>
                  <span
                    className="text-r-fg"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 2.75rem)",
                      fontWeight: 500,
                      lineHeight: 1,
                      letterSpacing: "-0.045em",
                    }}
                  >
                    From 1.77%
                  </span>
                  <span className="text-sm font-medium text-r-muted-fg">for a 30 day term</span>
                </p>
                {/*
                  A flat fee for the term, NOT a period rate: the 60 day plan is whatever the
                  partner prices it at, not double the 30. And the rate is the partner's, passed
                  through, so the page says "from" rather than pretending we can hold a number.
                */}
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-r-muted-fg">
                  A flat fee on the amount, for the whole term. Not a monthly rate, so a 60 day
                  term is not double a 30 day one. The rate is set by the capital partner, and
                  Payve adds nothing on top of it.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-r-muted-fg">
                  Your rate is fixed the moment you take a term, and it is the same number
                  written in your agreement.
                </p>
                <p className="mt-5 text-xs leading-relaxed text-r-subtle">
                  Terms available today are 30 and 60 days. Your own rate depends on the capital
                  partner and can move between batches, so treat this as a floor rather than a
                  quote.
                </p>
              </div>
            </Reveal>

            <Reveal delayIndex={3}>
              <div className="flex h-full flex-col gap-4 rounded-r-md border border-r-border bg-r-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
                  What your network gets
                </p>
                <BenefitList items={NETWORK_GETS} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- the difference */}
      <section className="border-t border-r-border bg-r-card" data-comparison>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <h2
              className="max-w-2xl text-r-fg"
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              Which one you want depends on whose cash you are trying to move.
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {COMPARISON.map((c, i) => (
              <Reveal key={c.k} delayIndex={i + 1}>
                <div
                  className="flex h-full flex-col gap-3 rounded-r-md border border-r-border bg-r-bg p-6"
                  data-compare={c.k}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-primary">
                    {c.name}
                  </p>
                  <p className="text-base font-semibold leading-snug text-r-fg">{c.moves}</p>
                  <dl className="mt-1 flex flex-col gap-2 text-sm">
                    <div>
                      <dt className="text-r-subtle">Them</dt>
                      <dd className="text-r-muted-fg">{c.them}</dd>
                    </div>
                    <div>
                      <dt className="text-r-subtle">You</dt>
                      <dd className="text-r-muted-fg">{c.you}</dd>
                    </div>
                  </dl>
                  <p className="mt-auto pt-3 text-sm leading-relaxed text-r-fg">{c.pick}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delayIndex={3}>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-r-muted-fg">
              They are not alternatives. Most buyers run both, on different suppliers, for
              different reasons, out of the same network.
            </p>
          </Reveal>
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
