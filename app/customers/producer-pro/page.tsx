import type { Metadata } from "next";
import { Kicker, StatBand, StoryBody, StoryHero } from "../StoryLayout";

/**
 * GATED: customer naming pending consent. Ships draft + noindex + out of the
 * sitemap. If consent is declined, retitle around an unnamed produce
 * distributor or pull the page.
 */

export const metadata: Metadata = {
  title: "Producer Pro customer story",
  description:
    "How a produce business added payments without a migration: one integration, nothing replaced, one approval per run.",
  robots: { index: false, follow: false },
};

export default function ProducerProStory() {
  return (
    <main>
      <StoryHero
        name="Producer Pro"
        industryTag="Payments · US & Mexico"
        headline="Producer Pro added payments without a migration."
        draft
      />
      <StatBand
        stats={[
          {
            value: "One integration",
            sub: "payments running alongside the systems already in place",
          },
          {
            value: "Nothing replaced",
            sub: "the ERP, the bank, and the workflows stayed",
          },
          {
            value: "One approval",
            sub: "per payment run, domestic and international together",
          },
        ]}
      />
      <StoryBody currentSlug="producer-pro" runsOn={["Payments"]}>
        <p>
          Producer Pro is a produce business that had working systems and no
          appetite for a rip-and-replace project. The question was never
          whether to modernize payments; it was whether it could happen
          without touching everything else.
        </p>
        <Kicker>The solution</Kicker>
        <h2>The integration was the product.</h2>
        <p>
          Payve connected to the systems Producer Pro already ran. Supplier
          payments now go out from one place: domestic suppliers by bank
          transfer, cross-border suppliers in their own currency at a
          competitive exchange rate, one approval per run. The invoices, the
          terms, and the records stay where the team already looks for them.
        </p>
        <Kicker>The result</Kicker>
        <h2>Money movement came with its paper trail.</h2>
        <p>
          Every payment carries who approved it, when it moved, and what it
          settled, tied back to the invoice behind it. The back office
          reconciles from records, not memory.
        </p>
        <p className="text-sm text-ink-3">
          This story is a draft. Specific results publish after review with
          the customer.
        </p>
      </StoryBody>
    </main>
  );
}
