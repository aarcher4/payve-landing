import type { Metadata } from "next";
import {
  FeatureGrid,
  PageHero,
  ProductCtaBand,
} from "../../components/site/ProductPage";
import StatStrip from "../../components/site/StatStrip";

export const metadata: Metadata = {
  title: "Seafood",
  description:
    "Payve for seafood importers and processors: supplier payments, early pay on approved invoices, and agents on cold chain paperwork.",
};

export default function SeafoodPage() {
  return (
    <main>
      <PageHero
        eyebrow="Solutions"
        title="Cold chain operations, without the paper chase."
        image="/images/hero-seafood.jpg"
        imageAlt="A boat crane lifting insulated seafood totes onto a sunny quay"
        atmosphere
        sub="An importer's cash sits on the water for weeks while the cold chain runs on strict timing and paperwork. Payve handles the supplier payments and puts agents on the documentation."
      />

      <StatStrip
        stats={[
          {
            value: "$6.6B",
            label: "US shrimp imports in 2024",
            source: "US import data",
          },
          {
            value: "Weeks at sea",
            label: "inventory financed across ocean freight before cash comes back",
          },
          {
            value: "Every load",
            label: "temperature, certification, and traceability documents to keep straight",
          },
        ]}
      />

      <FeatureGrid
        items={[
          {
            title: "Suppliers paid their way",
            body: "Domestic suppliers get bank transfers; international suppliers receive local currency at a competitive exchange rate.",
          },
          {
            title: "Liquidity on open invoices",
            body: "Suppliers can choose early payment on approved invoices and see the exact dollars and the fee before they decide.",
          },
          {
            title: "Purchase orders drafted by agents",
            body: "Agents pre-fill species, grade, origin, temperature zone, and terms from your own history, ask only what they cannot infer, and hand you a draft to confirm.",
          },
          {
            title: "Cold storage paperwork, entered",
            body: "Stacks of cold storage invoices are itemized, reconciled, and entered into your ERP in approved batches.",
          },
          {
            title: "Certifications tracked",
            body: "Sustainability and origin certifications stay attached to the lots and orders they belong to.",
          },
          {
            title: "Briefings before the workday",
            body: "Inventory positions, receivables at risk, and open orders delivered to your team every morning.",
          },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
