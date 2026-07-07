import type { Metadata } from "next";
import PageIntro from "../../components/site/PageIntro";

export const metadata: Metadata = {
  title: "Seafood",
  description:
    "Payve for seafood importers and processors with cold chain operations and international suppliers.",
};

export default function SeafoodPage() {
  return (
    <PageIntro eyebrow="Solutions" title="Cold chain money and operations, handled.">
      <p>
        Seafood importers manage international suppliers, cold storage, and
        purchase orders with many moving parts. Payve handles supplier
        payments and early pay, and its agents draft purchase orders and
        keep cold storage paperwork moving with your team's approval.
      </p>
    </PageIntro>
  );
}
