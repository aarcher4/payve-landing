import type { Metadata } from "next";
import {
  FeatureGrid,
  PageHero,
  ProductCtaBand,
  SplitSection,
} from "../../components/site/ProductPage";
import { PaymentsDemo } from "../../components/home/demos";

export const metadata: Metadata = {
  title: "Payments",
  description:
    "Pay every supplier from one place. Domestic bank transfers, international payments to Mexico and Colombia at a competitive exchange rate, and no wire fees.",
};

export default function PaymentsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Products"
        title="Pay every supplier from one place."
        image="/images/hero-payments.jpg"
        imageAlt="Pallets of boxed produce loading into a refrigerated trailer at a busy dock"
        sub="Domestic and international suppliers, one payment run. Domestic suppliers receive bank transfers. Suppliers in Mexico and Colombia receive local currency at a competitive exchange rate, without wire fees."
      />

      <SplitSection
        eyebrow="One payment run"
        title="Every supplier, one approval."
        visual={<PaymentsDemo />}
      >
        <p>
          Build a payment run across all of your suppliers and approve it
          once. Payve routes each payment the right way: a bank transfer for
          domestic suppliers, an international payment for suppliers in
          Mexico and Colombia.
        </p>
        <p>
          Invoices show what is due. You choose to pay now or schedule a
          payment on a date you pick, and a scheduled payment stays
          cancellable until it runs.
        </p>
      </SplitSection>

      <FeatureGrid
        items={[
          {
            title: "No wire fees",
            body: "International suppliers receive local currency at a competitive exchange rate. The wire fee line disappears from your cost of doing business.",
          },
          {
            title: "Pay now or schedule",
            body: "A due invoice is just an amount due. You decide when it moves: pay now, or schedule a real, cancellable payment on a date you pick.",
          },
          {
            title: "Fast supplier receipt",
            body: "Domestic bank transfers arrive within one business day. Suppliers in Mexico and Colombia can withdraw to their local bank within an hour, around the clock.",
          },
          {
            title: "Operating Account",
            body: "Fund once and pay from your Payve balance. Available funds, pending deposits, and scheduled payments each stay visible and separate.",
          },
          {
            title: "Every payment logged",
            body: "Each payment carries its full history: who approved it, when it moved, and what it settled.",
          },
          {
            title: "Suppliers onboard themselves",
            body: "Suppliers finish a short form from a link on their phone. No accounts payable back-and-forth over bank details.",
          },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
