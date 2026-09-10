import type { Metadata } from "next";
import { FeatureGrid, ProductCtaBand, CrossSell } from "../components/site/ProductPage";
import { Wordmark } from "../components/Wordmark";
import MarketSection from "./MarketSection";
import RateHero from "./RateHero";

export const metadata: Metadata = {
  title: "The Payve Rate",
  description:
    "Live rates for supplier payments to Mexico, Colombia, Brazil, the Eurozone and the UK. No wire fee to send, nothing deducted on the way in. One rate, published.",
  // rates.getpayve.com is the canonical home of this page. Without this it would
  // self-canonicalise onto www.getpayve.com via the root metadataBase and compete with itself.
  alternates: { canonical: "https://rates.getpayve.com/" },
};

const PRICING = [
  {
    title: "Nothing to send",
    body: "No per-payment fee and no minimum. The rate is the whole price.",
  },
  {
    title: "Nothing deducted",
    body: "Your supplier is paid on their own country's rail, in their own currency. There is no wire leg for a correspondent bank to take a cut from.",
  },
  {
    title: "A real US account",
    body: "Fund from a US routing and account number in your name. FedNow lands 24/7, weekends included; ACH and wire on banking days.",
  },
];

export default function RatesPage() {
  return (
    <main className="bg-r-bg">
      {/*
        Minimal chrome, not the marketing nav. At rates.getpayve.com this page IS the site, so
        it carries a wordmark and the rate and nothing else above the fold. A tall marketing
        hero here would push the quote and the chart below the fold, which is the one thing a
        rate page must never do.

        The wordmark is the sanctioned asset from the design system, sized by height only so
        it cannot be stretched.
      */}
      <header className="border-b border-r-border bg-r-card">
        <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-4 px-4 py-5 sm:px-6">
          <a href="/" aria-label="Payve home">
            <Wordmark height={22} />
          </a>
          <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
            The Payve Rate
          </p>
        </div>
      </header>

      <RateHero />

      {/* Below the fold: what the rate means and what it replaces. */}
      <MarketSection />

      <FeatureGrid items={PRICING} />

      <CrossSell
        links={[
          { label: "The Payve Network", href: "/products/network" },
          { label: "Intelligence", href: "/products/agentic-intelligence" },
          { label: "Security", href: "/security" },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
