import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Payve — Orchestrated Precision for Supply Chains",
  description: "Orchestrated precision for supply chains that feed the world. Payve deploys agentic intelligence to transform complexity into clarity.",
  keywords: ["supply chain", "orchestration", "agentic", "operations", "logistics"],
  openGraph: {
    title: "Payve — Orchestrated Precision for Supply Chains",
    description: "Orchestrated precision for supply chains that feed the world.",
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

