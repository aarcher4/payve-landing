import type { Metadata } from "next";
import {
  FeatureGrid,
  PageHero,
  ProductCtaBand,
  SplitSection,
} from "../../components/site/ProductPage";
import StatStrip from "../../components/site/StatStrip";
import { EarlyPayDemo, AgentsDemo } from "../../components/home/demos";

export const metadata: Metadata = {
  title: "Fresh produce",
  description:
    "Payve for growers, shippers, distributors, and importers moving perishables across the US, Mexico, and Colombia.",
};

export default function FreshProducePage() {
  return (
    <main>
      <PageHero
        eyebrow="Solutions"
        title="Built for the pace of perishables."
        image="/images/hero-produce.jpg"
        imageAlt="A tractor hauling harvest crates through rows of leafy crops"
        atmosphere
        sub="Produce runs on 30-day terms, cross-border supply, and systems that were never built to share. Payve pays your growers and suppliers from one place, gives them liquidity on open invoices, and puts agents on the back office work that eats your team's week."
      />

      <StatStrip
        stats={[
          {
            value: "$35.6B",
            label: "US fresh fruit and vegetable imports forecast for 2025",
            source: "USDA Economic Research Service",
          },
          {
            value: "69%",
            label: "of US fresh vegetable imports come from Mexico",
            source: "USDA Economic Research Service, 2024",
          },
          {
            value: "30 to 45 days",
            label: "typical wait for cash after shipping, against PACA's 30-day ceiling",
            source: "Industry payment-practice data",
          },
        ]}
      />

      <SplitSection
        eyebrow="Supplier liquidity"
        title="Your growers wait weeks for cash. They don't have to."
        visual={<EarlyPayDemo />}
      >
        <p>
          A grower-shipper harvests, packs, and ships before a dollar comes
          back, then waits out the terms. With Payve, your suppliers can
          choose early payment on approved invoices and see exactly what they
          receive today and what it costs, in dollars.
        </p>
        <p>
          Cross-border suppliers in Mexico and Colombia receive local
          currency at a competitive exchange rate, without wire fees, and can
          move money to their bank within an hour once it is in their
          account.
        </p>
      </SplitSection>

      <SplitSection
        flip
        eyebrow="Organizational intelligence"
        title="Market prices, receivables, and quality, briefed daily."
        visual={<AgentsDemo />}
      >
        <p>
          Payve agents sync your sales, inventory, quality inspections, and
          USDA market prices every day, then deliver briefings your team
          actually reads: a morning market snapshot, receivables at risk, a
          collections report in Spanish for the Sinaloa office.
        </p>
        <p>
          When a customer complaint lands, an agent pulls the lot, the
          inspection, and the order history, and drafts the root-cause
          analysis before your quality team picks up the phone.
        </p>
      </SplitSection>

      <FeatureGrid
        items={[
          {
            title: "One place to pay",
            body: "Domestic growers get bank transfers, Mexican and Colombian suppliers get local currency. One payment run, one approval.",
          },
          {
            title: "Deductions and disputes, documented",
            body: "Every invoice, payment, and adjustment stays traceable, so chargebacks and short pays get answered with records instead of memory.",
          },
          {
            title: "Paperwork that keeps itself moving",
            body: "Invoices, bills of lading, and count sheets are read, matched, and entered by agents. Your team approves each batch.",
          },
          {
            title: "Terms handled by the system",
            body: "Due dates, scheduled payments, and early-pay offers all follow the terms on the invoice. Nothing depends on someone remembering.",
          },
          {
            title: "Cross-border without the wire desk",
            body: "Suppliers across the border receive payment in their own currency at a competitive rate. The wire fee line disappears.",
          },
          {
            title: "USDA market data in the loop",
            body: "Daily shipping-point and terminal-market prices land in your briefings next to your own sales numbers.",
          },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
