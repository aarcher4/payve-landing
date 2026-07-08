import type { Metadata } from "next";
import {
  PageHero,
  CrossSell,
  ProductCtaBand,
  QuoteBand,
  SplitSection,
} from "../../components/site/ProductPage";
import ValueList from "../../components/site/ValueList";
import { AgentsDemo, LoopsDemo } from "../../components/home/demos";

export const metadata: Metadata = {
  title: "Payve Agents",
  description:
    "Payve Agents bring organizational intelligence and automate back office workflows: briefings, order entry, document matching, complaint root cause, and notifications. A person approves every write.",
};

export default function AgentsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Products"
        title="Payve Agents know your business and do the busywork."
        image="/images/hero-agents.jpg"
        imageAlt="Terraced green fields on Andean mountainsides with a farm truck on the road"
        sub="Payve Agents connect to the systems you already run, answer questions about your business in plain English or Spanish, and automate the back office work your team does by hand. A person on your team approves every write."
      />

      <SplitSection
        eyebrow="Organizational intelligence"
        title="The day starts with answers."
        visual={<AgentsDemo />}
      >
        <p>
          Agents sync your sales, receivables, inventory, quality, and market
          data daily, then deliver scheduled briefings to the people who need
          them: a morning market snapshot, a receivables risk report, a
          collections summary, in English or Spanish.
        </p>
        <p>
          Ask a question in plain English or Spanish and get the answer with
          the numbers behind it, drawn from your own systems.
        </p>
      </SplitSection>

      <SplitSection
        eyebrow="Loops"
        title="A live pulse on the business."
        visual={<LoopsDemo />}
        flip
      >
        <p>
          Loops are checks that agents run on a schedule you set: every
          fifteen minutes, every hour, every morning. Watch sales of a single
          product, a price threshold, receivables that matter, or an
          inventory position, and get told the moment something needs a
          person.
        </p>
        <p>
          Some loops are deterministic, the same check every time. Some are
          agentic, where the agent investigates what changed and why. Every
          Payve customer runs loops today.
        </p>
      </SplitSection>

      <ValueList
        eyebrow="What agents handle"
        items={[
          {
            title: "Order entry",
            body: "Agents take a stack of invoices, itemize and reconcile them, and enter them into your ERP in batches. Your team reviews and approves each batch.",
          },
          {
            title: "Document matching",
            body: "Invoices, bills of lading, and count sheets are read, validated, de-duplicated, and matched to the right order before anything posts.",
          },
          {
            title: "Complaint root cause",
            body: "When a customer complaint comes in, an agent pulls the related orders and inspection data and drafts a root-cause analysis for your review.",
          },
          {
            title: "Loops on a schedule",
            body: "Pick a cadence and a question: hourly sales on one product, a price threshold, receivables at risk. Deterministic checks and agentic investigations that alert only when something needs you.",
          },
          {
            title: "Scheduled briefings",
            body: "Daily and weekly reports arrive before the workday: market prices, receivables at risk, sales recaps, collections. Bilingual, per-person, per-timezone.",
          },
          {
            title: "Approval-gated writes",
            body: "Agents prepare the work; nothing is written to your systems until a person on your team approves it. Every action is logged and traceable.",
          },
        ]}
      />

      <QuoteBand />

      <CrossSell
        links={[
          { label: "Payments", href: "/products/payments" },
          { label: "Early pay", href: "/products/early-pay" },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
