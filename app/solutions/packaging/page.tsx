import type { Metadata } from "next";
import PageIntro from "../../components/site/PageIntro";

export const metadata: Metadata = {
  title: "Packaging",
  description:
    "Payve for packhouses and packaging suppliers to the food industry.",
};

export default function PackagingPage() {
  return (
    <PageIntro eyebrow="Solutions" title="Packhouse operations without the paperwork.">
      <p>
        Packhouses and packaging suppliers sit between growers and retail,
        with invoices moving in both directions. Payve consolidates supplier
        payments, offers early pay on approved invoices, and automates the
        invoice and document handling around every load.
      </p>
    </PageIntro>
  );
}
