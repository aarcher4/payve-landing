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
        sub="A repack operation sits between growers and retail with invoices moving in both directions, cold chain receiving standards rising, and a back office that is often one person deep. Payve consolidates the money movement and puts agents on the bookkeeping."
      />

      <StatStrip
        stats={[
          {
            value: "2,000 lbs/day",
            label: "the handling volume where federal produce licensing rules kick in",
            source: "USDA PACA",
          },
          {
            value: "Both directions",
            label: "invoices owed to growers and receivables from retail, managed at once",
          },
          {
            value: "One person",
            label: "the size of many packhouse back offices. Agents make it enough.",
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
            body: "Repack and storage invoices itemized, reconciled, and entered in batches your bookkeeper approves.",
          },
          {
            title: "Receiving documents matched",
            body: "Inbound load paperwork, count sheets, and grading records matched to the right order automatically.",
          },
          {
            title: "Traceability that holds up",
            body: "Every document and payment stays attached to its lot and order, ready when a buyer or auditor asks.",
          },
          {
            title: "Compliance-ready records",
            body: "Terms, invoice trails, and payment history stay organized the way produce regulation expects.",
          },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
