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
    "The Payve Network for packaging manufacturers and converters: working capital on approved invoices, agents on order entry and statements, and cross-border payments without wire fees.",
};

export default function PackagingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Solutions"
        title="Built for the plants that supply the supply chain."
        image="/images/hero-packaging.jpg"
        imageAlt="Stacked corrugated cartons and paper rolls inside a sunlit packaging plant"
        atmosphere
        sub="The food chain is corrugated's largest customer, and the plants that serve it sell on terms while board prices move monthly and harvest orders arrive in surges. When your customers pay through the Payve Network, approved invoices become working capital you can take when you choose — and agents handle the order entry and statements."
      />

      <StatStrip
        stats={[
          {
            value: "$40.8B",
            label: "US corrugated industry shipments in 2024",
            source: "Fibre Box Association, 2024",
          },
          {
            value: "43%",
            label: "of US B2B invoiced sales are paid late",
            source: "Atradius Payment Practices Barometer, North America, 2025",
          },
          {
            value: "1,092",
            label: "US corrugated plants in 2024, and 634 of them are independent-scale sheet plants",
            source: "Fibre Box Association, 2024",
          },
        ]}
      />

      <FeatureGrid
        items={[
          {
            title: "Approved invoices become cash when you choose",
            body: "When a customer approves your invoice through the Payve Network, you can choose early payment per invoice, with the exact dollars and the fee in view before you decide.",
          },
          {
            title: "Releases entered by agents",
            body: "Blanket POs drawn down in releases, repeat specs, and emailed orders are drafted into your system by agents. A person approves every entry.",
          },
          {
            title: "Short-pays answered with records",
            body: "When a national account short-pays over counts, freight, or plate charges, the invoice, release, and delivery paperwork are already matched and lined up to dispute it.",
          },
          {
            title: "Statements kept current",
            body: "Hundreds of line items a month across accounts are itemized, reconciled, and entered in batches one back-office seat can approve.",
          },
          {
            title: "Cross-border without the wire desk",
            body: "Plants in Mexico are paid in pesos at a competitive exchange rate, with no US bank account required and no wire fees.",
          },
          {
            title: "Briefings before the workday",
            body: "What is due, what is late, and which accounts changed, delivered every morning with the numbers behind it.",
          },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
