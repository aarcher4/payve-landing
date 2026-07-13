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
    default: "Payve. The payment network for supply chain trade.",
    template: "%s · Payve",
  },
  description:
    "Payve is the payment network for supply chain trade. Send a payment and it's there: any supplier in the US, Mexico, Colombia, Brazil, or the EU, paid instantly in their own currency. Members connect their suppliers to global liquidity, and agentic intelligence runs the back office.",
  keywords: [
    "B2B payment network",
    "supplier payments",
    "working capital network",
    "early payment",
    "accounts payable",
    "cross-border payments",
    "supply chain operations",
    "agentic intelligence",
  ],
  openGraph: {
    title: "Payve",
    description:
      "The payment network for supply chain trade. Send a payment and it's there. Connect your suppliers to the capital they need, and put agentic intelligence on the back office.",
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
