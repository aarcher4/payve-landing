import type { Metadata } from "next";
import {
  PageHero,
  CrossSell,
  ProductCtaBand,
  QuoteBand,
  SplitSection,
} from "../../components/site/ProductPage";
import ValueList from "../../components/site/ValueList";
import { EarlyPayDemo, PaymentsDemo, AgentsDemo } from "../../components/home/demos";
import { CascadeFlow, NetworkCanvas } from "../../components/site/network";

export const metadata: Metadata = {
  title: "The Payve Network",
  description:
    "The payment network for the fresh supply chain. Enroll once: pay any supplier instantly across the US, Mexico, Colombia, Brazil, and the European Union with no wire fees. Enrolling unlocks on-demand working capital for every supplier you pay.",
};

export default function NetworkPage() {
  return (
    <main>
      <PageHero
        eyebrow="Products"
        title="The payment network for the fresh supply chain."
        image="/images/hero-payments.jpg"
        imageAlt="Pallets of boxed produce loading into a refrigerated trailer at a busy dock"
        sub="The network gives a member three things. Instant payments: any supplier in the US, Mexico, Colombia, Brazil, and the European Union, paid in their own currency with no wire fees, from one approval. Liquidity: every supplier you pay can elect early payment on approved invoices. And one operating account, where every payment lands as connected data your team and your agents can use."
      />

      <SplitSection
        eyebrow="Enroll"
        title="One enrollment. Your whole supplier base unlocked."
        visual={<CascadeFlow />}
      >
        <p>
          When you enroll, every supplier you pay gains instant payment and
          on-demand working capital. When they enroll, so do theirs.
        </p>
        <p>
          Suppliers enroll at no cost, from a short form on their phone. Each
          one joins the network you trade in: paid in their own currency,
          visible on every invoice, reachable in one payment run.
        </p>
      </SplitSection>

      <section className="mx-auto max-w-6xl px-4 pb-2 sm:px-6">
        <span className="t-eyebrow block">Five corridors, one network</span>
        <div className="mt-4">
          <NetworkCanvas />
        </div>
      </section>

      <SplitSection
        eyebrow="Move money"
        title="Every supplier, one approval."
        visual={<PaymentsDemo intl />}
      >
        <p>
          Build a payment run across all of your suppliers and approve it
          once. Payve routes each payment the right way: a bank transfer at
          home, local currency abroad, at a competitive exchange rate with no
          wire fees.
        </p>
        <p>
          Invoices show what is due. Pay now or schedule a payment on a date
          you pick. A scheduled payment stays cancellable until it runs.
        </p>
      </SplitSection>

      <SplitSection
        eyebrow="Unlock your suppliers"
        title="Approved invoices become working capital."
        visual={<EarlyPayDemo />}
        flip
      >
        <p>
          Suppliers wait out payment terms while money sits on approved
          invoices. On the network, a supplier can choose to be paid early
          and see the exact dollars received today, the fee, and when the
          money arrives, all before deciding. Nothing changes about how you
          pay.
        </p>
        <p>
          Suppliers with liquidity on open invoices ship sooner, stay closer,
          and prioritize the buyers who offer it. That is how members win
          more business on both sides of the invoice.
        </p>
      </SplitSection>

      <ValueList
        eyebrow="What membership covers"
        items={[
          {
            title: "No wire fees",
            body: "International suppliers receive local currency at a competitive exchange rate. The wire fee line disappears from your cost of doing business.",
          },
          {
            title: "Operating account",
            body: "Fund once and pay from your Payve balance. Available funds, pending deposits, and scheduled payments each stay visible and separate.",
          },
          {
            title: "Fast supplier receipt",
            body: "Domestic bank transfers arrive within one business day. Suppliers in Mexico and Colombia can withdraw to their local bank within an hour, around the clock.",
          },
          {
            title: "Suppliers see everything upfront",
            body: "An early-pay offer reads in dollars, not fine print: the amount today, the amount at term, the fee. The supplier decides with the whole picture in view.",
          },
          {
            title: "Buyers earn income",
            body: "Each time a supplier chooses early pay, the buyer earns income on the payment, with no change to the buyer's own cash flow or terms.",
          },
          {
            title: "Stronger supplier relationships",
            body: "Funded suppliers are reliable suppliers. Offering liquidity earns loyalty, priority when supply is short, and more business over time.",
          },
        ]}
      />

      <SplitSection
        eyebrow="Connected data"
        title="Every payment lands as data your agents can use."
        visual={<AgentsDemo />}
      >
        <p>
          A network payment is not a wire reference to chase. It carries its
          invoice, approval, and settlement as one connected record, so
          reconciliation stops being detective work, for your team and for
          your suppliers&rsquo; teams too.
        </p>
        <p>
          That connected record is what Agentic Intelligence runs on:
          briefings, document matching, and reconciliation, with a person
          approving every write.
        </p>
      </SplitSection>

      <QuoteBand />

      <CrossSell
        links={[{ label: "Agentic Intelligence", href: "/products/agentic-intelligence" }]}
      />

      <ProductCtaBand />
    </main>
  );
}
