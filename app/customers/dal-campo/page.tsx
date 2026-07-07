import type { Metadata } from "next";
import { StatBand, StoryBody, StoryHero } from "../StoryLayout";

export const metadata: Metadata = {
  title: "Dal Campo customer story",
  description:
    "How Dal Campo pays growers on both sides of the border from one place with Payve.",
  robots: { index: false, follow: false },
};

export default function DalCampoStory() {
  return (
    <main>
      <StoryHero
        name="Dal Campo"
        industryTag="Wholesale produce · Miami"
        headline="Dal Campo pays growers without the wire desk."
        draft
      />
      <StatBand
        stats={[
          {
            value: "One place",
            sub: "to pay domestic and international growers",
          },
          {
            value: "No wire fees",
            sub: "international suppliers receive local currency at a competitive rate",
          },
          {
            value: "Every payment",
            sub: "logged, traceable, and tied to its invoice",
          },
        ]}
      />
      <StoryBody currentSlug="dal-campo" runsOn={["Payments", "Early pay"]}>
        <p>
          Dal Campo is a Miami wholesale produce business buying from growers
          across the Americas. Paying that supplier base used to mean wire
          forms, wire fees, and a paper trail spread across banks.
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
