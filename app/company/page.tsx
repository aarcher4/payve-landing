import type { Metadata } from "next";
import { PageHero, ProductCtaBand } from "../components/site/ProductPage";
import Reveal from "../components/home/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Payve is the financial operating layer for supply chain trade: payments, early pay, and agents in one platform.",
};

export default function CompanyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Company"
        title="The money and the busywork belong in one system."
        image="/images/hero-company.jpg"
        imageAlt="A wide valley of farms with irrigation running and mountains on the horizon"
        atmosphere
        sub="Supply chain businesses run on ERPs that do not talk, payments spread across banks and wire desks, and back offices that carry it all by hand. Payve was built on a simple idea: the platform that moves your money should also do the work around it."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="space-y-5 text-base leading-relaxed text-ink-2">
            <p>
              Payve gives buyers one place to pay every supplier, domestic
              and international. It gives suppliers the option to be paid
              early on approved invoices, with the cost stated in dollars
              before they decide. And it puts agents inside the operation:
              answering questions from the business's own data, delivering
              briefings before the workday, and doing the entry, matching,
              and reconciliation work that used to consume the week, with a
              person approving every write.
            </p>
            <p>
              We work with growers, shippers, distributors, importers, and
              packhouses across the US, Mexico, and Colombia.
            </p>
          </div>
        </Reveal>
      </section>

      <ProductCtaBand />
    </main>
  );
}
