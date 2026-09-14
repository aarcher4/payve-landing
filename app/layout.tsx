import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    url: "https://www.getpayve.com",
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
      <body className="bg-white text-slate-600 antialiased">{children}</body>
    </html>
  );
}
