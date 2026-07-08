import type { Metadata } from "next";
import {
  PageHero,
  CrossSell,
  ProductCtaBand,
  QuoteBand,
  SplitSection,
} from "../../components/site/ProductPage";
import ValueList from "../../components/site/ValueList";
import { PaymentsDemo } from "../../components/home/demos";

export const metadata: Metadata = {
  title: "Payments",
  description:
    "Cross-border payments without the wire desk. Suppliers in Mexico, Colombia, Brazil, and Europe receive their own currency at a competitive exchange rate, from the same run that pays domestic suppliers.",
};

export default function PaymentsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Products"
        title="Cross-border payments, without the wire desk."
        image="/images/hero-payments.jpg"
        imageAlt="Pallets of boxed produce loading into a refrigerated trailer at a busy dock"
        sub="Pay suppliers in Mexico, Colombia, Brazil, and Europe in their own currency at a competitive exchange rate, with no wire fees, from the same payment run that pays your domestic suppliers by bank transfer. One run, one approval. More corridors are on the way."
      />

      <SplitSection
        eyebrow="One payment run"
        title="Every supplier, one approval."
        visual={<PaymentsDemo intl />}
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

      <ValueList
        eyebrow="What the run covers"
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

      <QuoteBand />

      <CrossSell
        links={[
          { label: "Early pay", href: "/products/early-pay" },
          { label: "Payve Agents", href: "/products/agents" },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
