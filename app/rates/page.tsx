import type { Metadata } from "next";
import {
  PageHero,
  SplitSection,
  FeatureGrid,
  ProductCtaBand,
  CrossSell,
} from "../components/site/ProductPage";
import ValueList from "../components/site/ValueList";
import RateTable from "./RateTable";
import WireSavings from "./WireSavings";

export const metadata: Metadata = {
  title: "The Payve Rate",
  description:
    "Live exchange rates for supplier payments to Mexico, Colombia, Brazil, the Eurozone and the UK. No incoming wire fee, no outgoing fee, one rate — see it before you send.",
};

const PRICING = [
  {
    title: "No outgoing fee",
    body: "There is no per-payment charge and no minimum. The rate above is the whole price — what you see is what your supplier gets.",
  },
  {
    title: "No incoming wire fee",
    body: "Your USD account is a real US routing and account number. Money arrives by ACH, wire or FedNow without an inbound fee, and nothing is deducted from it in transit.",
  },
  {
    title: "One rate, stated up front",
    body: "A single number, published live on this page. Not a headline rate with a markup discovered later on the statement.",
  },
];

const HOW = [
  {
    title: "A real US account number",
    body: "You get a US routing and account number in your own name. Fund it however you already move money — ACH, wire, or FedNow. FedNow arrives 24/7, weekends included; ACH and wire settle on banking days.",
  },
  {
    title: "Your supplier is paid locally",
    body: "Payment reaches your supplier over their own country's payment rail, in their own currency, into the account they already use. There is no international wire leg, so there is nothing for a correspondent bank to deduct.",
  },
  {
    title: "The rate is the price",
    body: "No flat fee, no minimum, no separate charge on either side. The rate published on this page is the whole cost of the payment.",
  },
  {
    title: "Volume pricing",
    body: "Above $25M in annual volume the rate is negotiable. Tell us what you move and we will quote it.",
  },
];

export default function RatesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Pricing"
        title="The Payve Rate."
        sub="The live rate we pay your suppliers at, published here and updated every 30 seconds. No incoming wire fee, no outgoing fee, nothing deducted along the way — one rate, and you can see it before you send."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-extrabold tracking-h1 text-ink-1 sm:text-3xl">
          Today&rsquo;s rate
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2 sm:text-base">
          This is the rate your supplier is actually paid at — not a headline number with
          charges added later. There is no per-payment fee on top of it, no minimum, and
          nothing deducted from the amount in transit.
        </p>
        <div className="mt-8">
          <RateTable />
        </div>
      </section>

      <FeatureGrid items={PRICING} />

      <SplitSection
        eyebrow="Where the money goes"
        title="A $15 payment that arrived as nothing."
        visual={
          <div className="rounded-xl border border-hairline bg-paper-elev p-8 shadow-elev-2">
            <p className="font-display text-5xl font-extrabold tracking-h1 text-ink-1">$15.00</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-ink-3">sent</p>
            <div className="my-6 border-t border-hairline" />
            <p className="font-display text-5xl font-extrabold tracking-h1 text-critical">$0.00</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-ink-3">received</p>
          </div>
        }
      >
        <p>
          A supplier in Mexico was sent a small payment. It never showed up. Not delayed —
          absorbed. The fee on the US side, the receiving bank&rsquo;s charge, and what the
          correspondent bank took in transit added up to more than the payment itself.
        </p>
        <p>
          This is not unusual and it is not a mistake. Banks disclose it. One US bank&rsquo;s own
          published schedule warns that &ldquo;intermediary financial institutions may deduct
          additional fees from incoming international wires, reducing the amount of proceeds
          credited to your account.&rdquo;
        </p>
        <p>
          On a large invoice those charges are an irritation. On a small one they are the whole
          payment. Either way, nobody tells you the number in advance.
        </p>
      </SplitSection>

      <section className="border-y border-hairline bg-paper-elev">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <span className="t-eyebrow text-sage-600">What it costs you today</span>
          <h2 className="mt-3 max-w-2xl font-display text-2xl font-extrabold tracking-h1 text-ink-1 sm:text-3xl">
            Count the wires.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2 sm:text-base">
            Two fees are charged on every international wire: one your bank charges you to send
            it, and one taken off the other end before your supplier sees it. Change any
            assumption below — every figure is editable.
          </p>
          <div className="mt-8">
            <WireSavings />
          </div>
        </div>
      </section>

      <ValueList eyebrow="How it works" items={HOW} />

      <CrossSell
        links={[
          { label: "The Payve Network", href: "/products/network" },
          { label: "Intelligence", href: "/products/agentic-intelligence" },
          { label: "Security", href: "/security" },
        ]}
      />

      <ProductCtaBand />
    </main>
  );
}
