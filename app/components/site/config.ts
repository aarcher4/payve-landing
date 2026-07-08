/**
 * Site-wide navigation and CTA configuration.
 * bookDemoUrl: the Zcal scheduler (instant scheduling beats a contact form
 * per the conversion research; see docs/conversion-review.md).
 */

export const bookDemoUrl = "https://zcal.co/payve";

/**
 * Site-wide demo CTA label (Alex 2026-07-07 team critique: personal and
 * high-touch over generic; supersedes "Book a demo").
 */
export const bookDemoLabel = "Schedule time with us";

export const signInUrl = "https://app.getpayve.com";

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  items?: NavLink[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Products",
    items: [
      {
        label: "Payments",
        href: "/products/payments",
        description: "Pay every supplier from one place, domestic and international.",
      },
      {
        label: "Early pay",
        href: "/products/early-pay",
        description: "Suppliers get paid early on open invoices. Buyers earn on every election.",
      },
      {
        label: "Payve Agents",
        href: "/products/agents",
        description: "Organizational intelligence and automated back office workflows.",
      },
    ],
  },
  {
    label: "Solutions",
    items: [
      {
        label: "Fresh produce",
        href: "/solutions/fresh-produce",
        description: "Growers, shippers, and distributors moving perishables.",
      },
      {
        label: "Seafood",
        href: "/solutions/seafood",
        description: "Importers and processors with cold chain operations.",
      },
      {
        label: "Packaging",
        href: "/solutions/packaging",
        description: "Box plants, converters, and packaging manufacturers supplying the food chain.",
      },
    ],
  },
  {
    label: "Customers",
    href: "/customers",
  },
  {
    label: "Company",
    items: [
      {
        label: "About",
        href: "/company",
        description: "What Payve is and who builds it.",
      },
      {
        label: "Security",
        href: "/security",
        description: "Approval gates, audit trails, and how funds are safeguarded.",
      },
    ],
  },
];

export const footerColumns: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Products",
    links: [
      { label: "Payments", href: "/products/payments" },
      { label: "Early pay", href: "/products/early-pay" },
      { label: "Payve Agents", href: "/products/agents" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "Fresh produce", href: "/solutions/fresh-produce" },
      { label: "Seafood", href: "/solutions/seafood" },
      { label: "Packaging", href: "/solutions/packaging" },
    ],
  },
  {
    heading: "Customers",
    links: [{ label: "Customer stories", href: "/customers" }],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Security", href: "/security" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

/**
 * Company disclosure line (Alex 2026-07-06: keep the not-a-bank sentence,
 * drop the bank-deposit / FDIC clause on the marketing site).
 */
export const notABankDisclosure =
  "Payve is a financial technology company, not a bank.";
