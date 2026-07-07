import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "./components/site/SiteHeader";
import SiteFooter from "./components/site/SiteFooter";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.getpayve.com"),
  title: {
    default: "Payve. Payments, early pay, and agents for supply chains.",
    template: "%s · Payve",
  },
  description:
    "Payve runs the money and the busywork for supply chain trade. Buyers pay every supplier from one place, suppliers can get paid early, and Payve agents automate back office workflows.",
  keywords: [
    "B2B payments",
    "supplier payments",
    "supplier financing",
    "early payment",
    "accounts payable",
    "cross-border payments",
    "supply chain operations",
    "agentic automation",
  ],
  openGraph: {
    title: "Payve",
    description:
      "Payments, early pay, and agents for supply chain trade. Pay every supplier from one place, let suppliers get paid early, and automate back office workflows.",
    type: "website",
    url: "https://www.getpayve.com",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 673 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-paper text-ink-1 antialiased">
        <SiteHeader />
        <div className="min-h-dvh">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
