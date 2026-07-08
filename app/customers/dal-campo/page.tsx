import type { Metadata } from "next";
import { StatBand, StoryBody, StoryHero } from "../StoryLayout";

export const metadata: Metadata = {
  title: "Dal Campo customer story",
  description:
    "How Dal Campo keeps high order complexity auditable with Payve: documents verified, orders reconciled, growers paid from one place.",
  robots: { index: false, follow: false },
};

export default function DalCampoStory() {
  return (
    <main>
      <StoryHero
        name="Dal Campo"
        industryTag="Wholesale produce · Miami"
        headline="Dal Campo keeps high order complexity auditable."
        draft
      />
      <StatBand
        stats={[
          {
            value: "Every order",
            sub: "reconciled, documented, and traceable",
          },
          {
            value: "Every document",
            sub: "verified and matched to the order it belongs to",
          },
          {
            value: "No wire fees",
            sub: "international suppliers receive local currency at a competitive rate",
          },
        ]}
      />
      <StoryBody currentSlug="dal-campo" runsOn={["Payments", "Early pay"]}>
        <p>
          Dal Campo is a Miami wholesale produce business buying from growers
          across the Americas. For its size it moves an unusual number of
          orders at once, each with its own paperwork, growers on both sides
          of the border, and money moving in both directions.
        </p>
        <h2>The complexity lives in the orders, not the org chart.</h2>
        <p>
          A high count of small orders means a high count of invoices, count
          sheets, and adjustments to keep straight. Payve agents read and
          verify the documents, match them to the right orders, and reconcile
          what was billed against what moved, so every order stays traceable
          when a question comes back weeks later. Loops recheck open orders
          on a schedule, so nothing waits for someone to remember to look.
        </p>
        <h2>One payment run, every grower.</h2>
        <p>
          With Payve, domestic growers receive bank transfers and
          international growers receive their own currency at a competitive
          exchange rate, from a single payment run with a single approval.
          Suppliers can choose early payment on approved invoices and see
          exactly what they receive and what it costs, in dollars.
        </p>
        <p className="text-sm text-ink-3">
          This story is a draft. Specific results publish after review with
          Dal Campo.
        </p>
      </StoryBody>
    </main>
  );
}
