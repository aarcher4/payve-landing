import type { Metadata } from "next";
import PageIntro from "../../components/site/PageIntro";

export const metadata: Metadata = {
  title: "Agents",
  description:
    "Payve agents bring organizational intelligence and automate back office workflows: orders, invoices, quality holds, reconciliation, and scheduled briefings.",
};

export default function AgentsPage() {
  return (
    <PageIntro
      eyebrow="Products"
      title="Agents that know your business and do the busywork."
    >
      <p>
        Payve agents connect to the systems you already run and bring
        organizational intelligence to your team: they answer questions about
        sales, receivables, inventory, and quality in plain English, and they
        deliver scheduled briefings so the day starts with answers.
      </p>
      <p>
        The same agents automate back office workflows: order entry, invoice
        and document matching, complaint root-cause analysis, and
        notifications when something needs attention. A person on your team
        approves every write.
      </p>
    </PageIntro>
  );
}
