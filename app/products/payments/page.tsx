import type { Metadata } from "next";
import PageIntro from "../../components/site/PageIntro";

export const metadata: Metadata = {
  title: "Payments",
  description:
    "Pay every supplier from one place. Domestic bank transfers, international payments to Mexico and Colombia, and scheduled payments without wire fees.",
};

export default function PaymentsPage() {
  return (
    <PageIntro eyebrow="Products" title="Pay every supplier from one place.">
      <p>
        Payve gives your finance team one place to pay domestic and
        international suppliers. Domestic suppliers receive bank transfers.
        Suppliers in Mexico and Colombia receive local currency at a
        competitive exchange rate, without wire fees.
      </p>
      <p>
        Invoices show what is due, and you choose to pay now or schedule a
        payment on a date you pick. Every payment is logged and traceable.
      </p>
    </PageIntro>
  );
}
