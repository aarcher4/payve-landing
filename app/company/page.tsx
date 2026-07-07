import type { Metadata } from "next";
import PageIntro from "../components/site/PageIntro";

export const metadata: Metadata = {
  title: "About",
  description:
    "Payve runs the money and the busywork for supply chain trade.",
};

export default function CompanyPage() {
  return (
    <PageIntro eyebrow="Company" title="Payve runs the money and the busywork.">
      <p>
        Payve is a payments and operations platform for supply chain trade.
        Buyers pay every supplier from one place. Suppliers can get paid
        early and receive international payments at a competitive exchange
        rate. Payve agents bring organizational intelligence and automate
        back office workflows.
      </p>
      <p>
        Reach us at{" "}
        <a href="mailto:alex@getpayve.com" className="text-sage-700 underline-offset-2 hover:underline">
          alex@getpayve.com
        </a>
        .
      </p>
    </PageIntro>
  );
}
