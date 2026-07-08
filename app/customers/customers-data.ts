/**
 * Customer story data. DRAFT STATUS: named stories are drafted for customer
 * sign-off (Alex gates publication before DNS cutover). Producer Pro naming
 * is additionally gated on the customer's consent to be named. Every number
 * traces to the customer's own words (Fortune Growers quote + the 2026-07-07
 * team call for the voucher figures), signed material, or measured platform
 * data. No invented metrics.
 */

export type CustomerStory = {
  slug: string;
  name: string;
  blurb: string;
  industryTag: string;
  metric: string;
  metricSub: string;
  headline: string;
  draft?: boolean;
};

export const stories: CustomerStory[] = [
  {
    slug: "fortune-growers",
    name: "Fortune Growers",
    blurb:
      "Fortune Growers is a grower-shipper with two decades in fresh produce and operations in the Midwest, California, and South Texas.",
    industryTag: "Grower-shipper · US & Mexico",
    metric: "Dozens of hours",
    metricSub: "back every week, in the customer's own words",
    headline:
      "How Fortune Growers turned unused data into faster decisions.",
  },
  {
    slug: "sl-produce",
    name: "SL Produce",
    blurb:
      "SL Produce is the US arm of the Selman family growing operation in Guasave, Sinaloa.",
    industryTag: "Grower family · Sinaloa & US",
    metric: "Any hour",
    metricSub: "the owner asks the business a question and gets an answer",
    headline: "How the Selman family put a pulse on the whole business.",
    draft: true,
  },
  {
    slug: "dal-campo",
    name: "Dal Campo",
    blurb:
      "Dal Campo is a Miami wholesale produce business buying from growers across the Americas.",
    industryTag: "Wholesale produce · Miami",
    metric: "Every order",
    metricSub: "reconciled, documented, and traceable",
    headline: "How Dal Campo keeps high order complexity auditable.",
    draft: true,
  },
  {
    slug: "producer-pro",
    name: "Producer Pro",
    blurb:
      "Producer Pro connected the systems it already ran. Nothing was ripped out.",
    industryTag: "Payments · Draft, publishes after customer review",
    metric: "One integration",
    metricSub: "payments running without replacing a single system",
    headline: "How a produce business added payments without a migration.",
    draft: true,
  },
];
