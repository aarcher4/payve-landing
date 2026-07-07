/**
 * Customer story data. DRAFT STATUS: named stories are drafted for customer
 * sign-off (Alex gates publication before DNS cutover). Every number traces
 * to the customer's own words (Fortune Growers quote), signed material, or
 * measured platform data. No invented metrics.
 */

export type CustomerStory = {
  slug: string;
  name: string;
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
    industryTag: "Grower-shipper · US & Mexico",
    metric: "Dozens of hours",
    metricSub: "back every week, in the customer's own words",
    headline:
      "How Fortune Growers turned unused data into faster decisions.",
  },
  {
    slug: "sl-produce",
    name: "SL Produce",
    industryTag: "Grower family · Sinaloa & US",
    metric: "6 days a week",
    metricSub: "collections briefed in Spanish, before the workday",
    headline:
      "How a Sinaloa grower family runs collections across the border.",
    draft: true,
  },
  {
    slug: "dal-campo",
    name: "Dal Campo",
    industryTag: "Wholesale produce · Miami",
    metric: "One place",
    metricSub: "to pay growers on both sides of the border",
    headline: "How Dal Campo pays growers without the wire desk.",
    draft: true,
  },
];
