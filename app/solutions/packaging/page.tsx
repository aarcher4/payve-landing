import type { Metadata } from "next";
import {
  FeatureGrid,
  PageHero,
  ProductCtaBand,
} from "../../components/site/ProductPage";
import StatStrip from "../../components/site/StatStrip";

export const metadata: Metadata = {
  title: "Packaging",
  description:
    "Payve for packhouses and repack operations: consolidated payments, early pay, and agents on billing and reconciliation.",
};

export default function PackagingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Solutions"
        title="A packhouse back office that runs itself."
        image="/images/hero-packaging.jpg"
        imageAlt="A combine harvesting golden grain with a grain elevator in the distance"
        atmosphere
        sub="A repack operation sits between growers and retail with invoices moving in both directions, cold chain receiving standards rising, and a back office that is often one person deep. Payve consolidates the money movement and puts agents on the bookkeeping."
      />

      <StatStrip
        stats={[
          {
            value: "2,000 lbs",
            label: "buy or sell that much produce in a single day and you are a federally licensed dealer",
            source: "USDA PACA, 7 CFR 46.2",
          },
          {
            value: "10 days",
            label: "PACA's default payment deadline; written terms past 30 days void trust protection",
            source: "USDA PACA, 7 CFR 46.46",
          },
          {
            value: "July 20, 2028",
            label: "FDA deadline for lot-level traceability records on every case you pack",
            source: "FDA FSMA 204",
          },
        ]}
      />

      <FeatureGrid
        items={[
          {
            title: "Growers paid from one place",
            body: "Domestic and cross-border growers paid in one run, in their own currency, without wire fees.",
          },
          {
            title: "Cash sooner on receivables",
            body: "Choose early payment on your own approved invoices when a buyer offers it through Payve, and see the exact dollars before you decide.",
          },
          {
            title: "Billing entered by agents",
            body: "Repack, storage, and grading invoices itemized, reconciled, and entered in batches one back-office seat can approve.",
          },
          {
            title: "Receiving documents matched",
            body: "Inbound load paperwork, count sheets, and grading records matched to the right order automatically.",
          },
          {
            title: "Traceability that holds up",
            body: "Every case label, lot code, document, and payment stays attached to its order, ready when a retailer or auditor asks.",
          },
          {
            title: "Deductions answered with records",
            body: "When a retail program deducts for a case that arrived late or short, the invoice, receiving record, and payment history are already lined up to dispute it.",
          },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
