import type { Metadata } from "next";
import PageIntro from "../../components/site/PageIntro";

export const metadata: Metadata = {
  title: "Early pay",
  description:
    "Suppliers get paid early on approved invoices. The supplier sees the exact dollar amount they receive and the fee. Buyers earn on every election.",
};

export default function EarlyPayPage() {
  return (
    <PageIntro eyebrow="Products" title="Suppliers get paid early. Buyers earn on it.">
      <p>
        When a purchase order is approved, the supplier can choose to be paid
        early. They see the exact dollars they receive today, the fee, and
        when the money arrives. No rates, no fine print, and no change to how
        the buyer pays.
      </p>
      <p>
        Buyers earn income each time a supplier elects early pay, and the
        supplier relationship gets stronger with every payment.
      </p>
    </PageIntro>
  );
}
