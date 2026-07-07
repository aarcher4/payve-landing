import type { Metadata } from "next";
import { StatBand, StoryBody, StoryHero } from "../StoryLayout";

export const metadata: Metadata = {
  title: "SL Produce customer story",
  description:
    "How a Sinaloa grower family runs collections across the border with Payve.",
  robots: { index: false, follow: false },
};

export default function SlProduceStory() {
  return (
    <main>
      <StoryHero
        name="SL Produce"
        industryTag="Grower family · Sinaloa & US"
        headline="A Sinaloa grower family runs collections across the border."
        draft
      />
      <StatBand
        stats={[
          {
            value: "6 days a week",
            sub: "collections briefed in Spanish before the workday",
          },
          {
            value: "Two countries",
            sub: "one view of sales, receivables, and crop movement",
          },
          {
            value: "Twice daily",
            sub: "crop accumulation reports during the season",
          },
        ]}
      />
      <StoryBody currentSlug="sl-produce" runsOn={["Payments", "Agents"]}>
        <p>
          SL Produce is the US arm of a family growing operation based in
          Guasave, Sinaloa, moving green beans, cucumbers, and peppers into
          the US market. The business runs in two countries, two languages,
          and two time zones at once.
        </p>
        <h2>Collections that follow the sun.</h2>
        <p>
          Payve agents deliver a collections report in Spanish six mornings a
          week, on Sinaloa time, so the team starts each day knowing who owes
          what and what changed overnight. During the season, crop
          accumulation reports land twice a day, and a weekly sales recap
          closes the loop.
        </p>
        <p>
          The same platform gives the family one view of receivables and
          sales on both sides of the border, without anyone rebuilding
          spreadsheets between offices.
        </p>
        <p className="text-sm text-ink-3">
          This story is a draft. Specific results publish after review with
          SL Produce.
        </p>
      </StoryBody>
    </main>
  );
}
