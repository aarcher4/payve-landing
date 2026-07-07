/**
 * Site-wide navigation and CTA configuration.
 * bookDemoUrl: Zcal scheduling link goes here when Alex shares it.
 * Until then the CTA falls back to email.
 */

export const bookDemoUrl =
  "mailto:alex@getpayve.com?subject=Payve%20demo";

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
        label: "Agents",
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
        description: "Packhouses and packaging suppliers to the food industry.",
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
      { label: "Agents", href: "/products/agents" },
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
 * Not-a-bank disclosure. Base template per the Payve design system;
 * exact production wording is owned by legal.
 */
export const notABankDisclosure =
  "Payve is a financial technology company, not a bank. Payve accounts hold a U.S. dollar balance; they are not bank deposits and are not FDIC insured.";
