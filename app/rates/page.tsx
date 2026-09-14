import type { Metadata } from "next";
import { FeatureGrid, ProductCtaBand, CrossSell } from "../components/site/ProductPage";
import { canonical } from "@/lib/site";
import { RatesChrome } from "./RatesChrome";
import MarketSection from "./MarketSection";
import RateHero from "./RateHero";

export const metadata: Metadata = {
  title: "The Payve Rate",
  description:
    "Live rates for supplier payments to Mexico, Colombia, Brazil, the Eurozone and the UK. No wire fee to send, nothing deducted on the way in. One rate, published.",
  // rates.getpayve.com is the canonical home of this page. Without this it would
  // self-canonicalise onto www.getpayve.com via the root metadataBase and compete with itself.
  alternates: { canonical: canonical("/rates") },
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
      <RatesChrome />

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
