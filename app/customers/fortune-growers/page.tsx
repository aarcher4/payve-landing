import type { Metadata } from "next";
import { Kicker, StatBand, StoryBody, StoryHero } from "../StoryLayout";

export const metadata: Metadata = {
  title: "Fortune Growers customer story",
  description:
    "How Fortune Growers turned unused data into faster decisions, saving dozens of hours every week with Payve.",
};

export default function FortuneGrowersStory() {
  return (
    <main>
      <StoryHero
        name="Fortune Growers"
        industryTag="Grower-shipper · US & Mexico"
        headline="Fortune Growers turned unused data into faster decisions."
      />
      <StatBand
        stats={[
          {
            value: "Dozens of hours",
            sub: "saved every week, in the customer's own words",
          },
          {
            value: "800 vouchers a month",
            sub: "entered by agents, approved by the team",
          },
          {
            value: "About 40 hours a month",
            sub: "of manual entry work returned to the back office",
          },
        ]}
      />
      <StoryBody currentSlug="fortune-growers" runsOn={["Payments", "Early pay", "Payve Agents"]}>
        <p>
          Fortune Growers is a grower-shipper with two decades in fresh
          produce, operations in the Midwest, California, and South Texas,
          and supply relationships that reach across the border. Like most of
          the industry, the business ran on an ERP full of answers nobody had
          time to dig out.
        </p>
        <blockquote>
          &ldquo;Payve has been an absolute game changer for Fortune Growers.
          Partnering with Payve instantly felt like we added an entire crew
          of dedicated specialists to our workforce. Payve helped us harness
          an unbelievable amount of unused data to make decisions faster and
          earlier, saving dozens of hours and eliminating thousands of
          dollars in waste and inefficiency every week.&rdquo;
          <footer className="mt-3 text-sm font-semibold not-italic text-ink-1">
            Geoff Pence <span className="font-normal text-ink-3">· Fortune Growers</span>
          </footer>
        </blockquote>
        <Kicker>The problem</Kicker>
        <h2>The data was there. The hours were not.</h2>
        <p>
          Sales history, purchase orders, inventory, price lists, quality
          inspections, and market prices lived in systems that never talked.
          Answering a simple question meant someone exporting, cross
          referencing, and rebuilding the same spreadsheet every week.
        </p>
        <p>
          Payve agents connected to the systems Fortune Growers already ran
          and unified that data daily. Now the team asks questions in plain
          English and gets answers with the numbers behind them, and the
          questions they used to ask every morning arrive answered, as
          scheduled briefings: sales and receivables reports, market
          snapshots against USDA prices, and receivables-risk digests before
          the workday starts.
        </p>
        <Kicker>The solution</Kicker>
        <h2>The busywork moved to agents.</h2>
        <p>
          The same agents handle the entry work around the money: invoices
          itemized and reconciled, documents matched to the right orders, and
          customer complaints traced to the affected lots with a drafted
          root-cause analysis. A person at Fortune Growers approves every
          write before anything posts.
        </p>
        <p>
          The clearest example is voucher entry. Cold storage service
          invoices used to be keyed into the ERP by hand, about 800 entries a
          month at roughly 3 minutes each. Agents now read, itemize, and
          enter those vouchers in batches the team approves, returning about
          40 hours of entry work to the back office every month. When
          something in a load does not match, the agent flags it with the
          records attached, so problems get reported with evidence instead of
          found at reconciliation.
        </p>
        <p>
          Loops watch the rest: scheduled checks on sales pace and
          receivables that alert the team the moment something moves.
        </p>
        <p>
          Payments run through the same platform, so paying growers and
          suppliers on both sides of the border happens from one place, and
          suppliers can choose early payment on approved invoices.
        </p>
      </StoryBody>
    </main>
  );
}
