import type { Metadata } from "next";
import {
  FeatureGrid,
  PageHero,
  ProductCtaBand,
  SplitSection,
} from "../../components/site/ProductPage";
import { EarlyPayDemo } from "../../components/home/demos";

export const metadata: Metadata = {
  title: "Early pay",
  description:
    "Suppliers choose to be paid early on approved invoices. They see the exact dollars they receive and the fee. Buyers earn income each time.",
};

export default function EarlyPayPage() {
  return (
    <main>
      <PageHero
        eyebrow="Products"
        title="Suppliers get paid early. Buyers earn on it."
        sub="When a purchase order is approved, the supplier can choose to be paid early. They see the exact dollars they receive today, the fee, and when the money arrives. Nothing changes about how the buyer pays."
      />

      <SplitSection
        eyebrow="The supplier's choice"
        title="An offer in dollars, not fine print."
        visual={<EarlyPayDemo />}
      >
        <p>
          Every offer reads the same way: the amount available today, the
          invoice amount at term, and the fee. No rates, no tables, no
          conditions to decode. If the supplier accepts, funds arrive within
          one business day.
        </p>
        <p>
          Suppliers who want to wait simply wait. The invoice pays at term
          like it always has.
        </p>
      </SplitSection>

      <FeatureGrid
        items={[
          {
            title: "Buyers earn income",
            body: "Each time a supplier chooses early pay, the buyer earns income on the payment. The program pays for itself as suppliers use it.",
          },
          {
            title: "No change to buyer cash flow",
            body: "The buyer's payment stays on its original terms. Offering early pay never pulls the buyer's cash forward.",
          },
          {
            title: "Stronger supplier relationships",
            body: "Suppliers with access to liquidity on open invoices stay closer, ship sooner, and prioritize the buyers who offer it.",
          },
          {
            title: "Suppliers see everything upfront",
            body: "The exact dollars received today, the fee, and the arrival time. The supplier decides with the whole picture in view.",
          },
          {
            title: "Works cross-border",
            body: "Suppliers in Mexico and Colombia receive early payments too, in local currency at a competitive exchange rate.",
          },
          {
            title: "Optional fee coverage",
            body: "Buyers can choose to cover part of a supplier's early pay fee for strategic relationships.",
          },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
