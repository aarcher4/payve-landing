import type { Metadata } from "next";
import {
  FeatureGrid,
  PageHero,
  ProductCtaBand,
} from "../components/site/ProductPage";
import Reveal from "../components/home/Reveal";
import { notABankDisclosure } from "../components/site/config";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Payve safeguards funds and data: human approval gates, full audit trails, per-customer isolation, and vaulted credentials.",
};

export default function SecurityPage() {
  return (
    <main>
      <PageHero
        eyebrow="Company"
        title="Built to be checked."
        image="/images/hero-security.jpg"
        imageAlt="A modern cold storage facility at the base of a granite mountain ridge"
        atmosphere
        sub="Payve moves money and writes to systems of record, so it is designed for scrutiny: every automation runs behind a human approval gate, every action is logged, and every customer's data is isolated."
      />

      <FeatureGrid
        items={[
          {
            title: "Human approval gates",
            body: "Agents prepare work; people approve it. Nothing posts to your books, your ERP, or your bank without a person on your team clicking approve.",
          },
          {
            title: "Complete audit trail",
            body: "Every read, match, write, and payment is logged and traceable to the person who approved it and the record it touched.",
          },
          {
            title: "Per-customer isolation",
            body: "Each customer's data lives in its own isolated environment with its own scoped credentials. A request from one customer's agent cannot reach another customer's data.",
          },
          {
            title: "Credentials vaulted",
            body: "ERP and system credentials are vaulted and encrypted, never exposed to agents or staff in plain text.",
          },
          {
            title: "Least-privilege access",
            body: "API keys carry narrow scopes. A key that can read invoices cannot move money; payment authority is granted separately and explicitly.",
          },
          {
            title: "Idempotent money movement",
            body: "Every payment instruction carries a unique key, so a retried request can never move money twice.",
          },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold tracking-h1 text-ink-1">
            About your funds
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-2">
            {notABankDisclosure} Funds held with Payve are safeguarded and
            always visible: your balance, pending deposits, and scheduled
            payments each show separately, and every movement is traceable to
            the invoice or payment behind it.
          </p>
          <p className="mt-4 text-sm text-ink-3">
            Security questions? Write to{" "}
            <a href="mailto:infosec@getpayve.com" className="font-medium text-ink-2 hover:text-ink-1">
              infosec@getpayve.com
            </a>
            .
          </p>
        </Reveal>
      </section>

      <ProductCtaBand />
    </main>
  );
}
