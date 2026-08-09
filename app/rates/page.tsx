import type { Metadata } from "next";
import { PageHero, FeatureGrid, ProductCtaBand, CrossSell } from "../components/site/ProductPage";
import MarketSection from "./MarketSection";

export const metadata: Metadata = {
  title: "The Payve Rate",
  description:
    "Live rates for supplier payments to Mexico, Colombia, Brazil, the Eurozone and the UK. No wire fee to send, nothing deducted on the way in. One rate, published.",
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
    <main>
      <PageHero
        eyebrow="Pricing"
        title="The Payve Rate."
        sub="The rate we pay your suppliers at, published live. No fee to send, nothing taken off the other end."
      />

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
