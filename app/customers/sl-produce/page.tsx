import type { Metadata } from "next";
import { Kicker, StatBand, StoryBody, StoryHero } from "../StoryLayout";

export const metadata: Metadata = {
  title: "SL Produce customer story",
  description:
    "How the Selman family put a pulse on the whole business with Payve organizational intelligence.",
  robots: { index: false, follow: false },
};

export default function SlProduceStory() {
  return (
    <main>
      <StoryHero
        name="SL Produce"
        industryTag="Grower family · Sinaloa & US"
        headline="The Selman family put a pulse on the whole business."
        draft
      />
      <StatBand
        stats={[
          {
            value: "Any hour",
            sub: "the owner asks the business a question and gets an answer",
          },
          {
            value: "3 roles",
            sub: "what started with the owner now briefs the CFO and receivables",
          },
          {
            value: "6 days a week",
            sub: "collections briefed in Spanish before the workday",
          },
        ]}
      />
      <StoryBody currentSlug="sl-produce" runsOn={["Payments", "Payve Agents"]}>
        <p>
          SL Produce is the US arm of the Selman family growing operation
          based in Guasave, Sinaloa, moving green beans, cucumbers, and
          peppers into the US market. The business runs in two countries, two
          languages, and two time zones at once.
        </p>
        <Kicker>How it started</Kicker>
        <h2>It started with one person asking questions at night.</h2>
        <p>
          The owner began using a Payve agent the way owners actually think
          about their business: at odd hours, one question at a time. What
          sold this week. Which receivables moved. What changed since
          yesterday. Each answer came back with the numbers behind it, drawn
          from the family&apos;s own systems, without waiting for someone to
          build a report.
        </p>
        <p>
          What worked for the owner rolled out to the rest of the operation.
          The CFO gets the financial picture, the receivables team gets
          collections, and the questions the family used to carry in their
          heads now arrive as scheduled briefings.
        </p>
        <Kicker>What Payve runs</Kicker>
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
        <p>
          Loops carry the rhythm: a deterministic check runs collections
          every morning, and during the season an agentic loop watches crop
          movement and flags what changed.
        </p>
        <p className="text-sm text-ink-3">
          This story is a draft. Specific results publish after review with
          SL Produce.
        </p>
      </StoryBody>
    </main>
  );
}
