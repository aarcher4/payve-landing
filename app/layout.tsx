import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Payve",
  description:
    "Payve is a B2B payments and operations platform for food supply chains. Finance teams pay suppliers across the US, Mexico, and Colombia from one place, suppliers can get paid early, and Payve agents automate back office workflows.",
  keywords: [
    "B2B payments",
    "supplier payments",
    "supplier financing",
    "accounts payable",
    "get paid early",
    "supply chain operations",
    "agentic automation",
  ],
  openGraph: {
    title: "Payve",
    description:
      "Pay suppliers from one place, let them get paid early, and automate back office workflows with Payve agents. Built for food supply chains across the US, Mexico, and Colombia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-custom-grey text-ivory antialiased">
        {children}
      </body>
    </html>
  );
}

