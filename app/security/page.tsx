import type { Metadata } from "next";
import PageIntro from "../components/site/PageIntro";
import { notABankDisclosure } from "../components/site/config";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Payve safeguards funds and data: approval gates, audit trails, per-customer isolation, and vaulted credentials.",
};

export default function SecurityPage() {
  return (
    <PageIntro eyebrow="Company" title="Built to be checked.">
      <p>
        Every automation runs behind a human approval gate. Every read,
        match, and write is logged and traceable to the person who approved
        it. Each customer's data lives in its own isolated environment, and
        system credentials are vaulted and encrypted.
      </p>
      <p className="text-sm text-ink-3">{notABankDisclosure}</p>
    </PageIntro>
  );
}
