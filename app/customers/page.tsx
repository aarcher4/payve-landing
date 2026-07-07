import type { Metadata } from "next";
import PageIntro from "../components/site/PageIntro";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "Supply chain businesses run on Payve: growers, shippers, distributors, and packhouses across the US, Mexico, and Colombia.",
};

export default function CustomersPage() {
  return (
    <PageIntro eyebrow="Customers" title="Supply chain businesses run on Payve.">
      <p>
        Growers, shippers, distributors, and packhouses use Payve to pay
        suppliers, offer early pay, and put agents on their back office.
        Customer stories are being prepared for this page.
      </p>
    </PageIntro>
  );
}
