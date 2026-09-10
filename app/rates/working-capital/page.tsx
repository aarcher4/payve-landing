import type { Metadata } from "next";
import { ProductCtaBand } from "../../components/site/ProductPage";
import { RatesChrome } from "../RatesChrome";

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
          Early Pay releases cash to your suppliers sooner, on the terms you already agreed. Pay
          Later keeps your vendor network paid on the date you promised while your own cash
          leaves later. Same network, opposite directions.
        </p>

        <div className="mt-8">
          <a
            href="https://zcal.co/payve"
            className="inline-flex h-control items-center rounded-r-sm bg-r-primary px-5 text-sm font-semibold text-r-primary-fg"
          >
            Schedule time with us
          </a>
        </div>
      </section>

      <ProductCtaBand />
    </main>
  );
}
