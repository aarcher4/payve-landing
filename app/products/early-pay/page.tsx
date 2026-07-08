import type { Metadata } from "next";
import {
  PageHero,
  CrossSell,
  ProductCtaBand,
  SplitSection,
} from "../../components/site/ProductPage";
import ValueList from "../../components/site/ValueList";
import { EarlyPayDemo } from "../../components/home/demos";

export const metadata: Metadata = {
  title: "Early pay",
  description:
    "Approved invoices become working capital. Suppliers choose to be paid faster and see the exact dollars, the fee, and the arrival time before they decide.",
};

export default function EarlyPayPage() {
  return (
    <main>
      <PageHero
        eyebrow="Products"
        title="Approved invoices become working capital."
        image="/images/hero-early-pay.jpg"
        imageAlt="Fresh green produce moving along a packing line in bright daylight"
        sub="Suppliers wait out payment terms while the money sits on approved invoices. With early pay, a supplier can choose to be paid faster and see the exact dollars received today, the fee, and when the money arrives. Nothing changes about how the buyer pays, and the buyer earns each time a supplier accepts."
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

      <ValueList
        eyebrow="How it adds up"
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

      <CrossSell
        links={[
          { label: "Payments", href: "/products/payments" },
          { label: "Payve Agents", href: "/products/agents" },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
