import type { Metadata } from "next";
import PageIntro from "../../components/site/PageIntro";

export const metadata: Metadata = {
  title: "Fresh produce",
  description:
    "Payve for growers, shippers, and distributors moving perishables across the US, Mexico, and Colombia.",
};

export default function FreshProducePage() {
  return (
    <PageIntro eyebrow="Solutions" title="Built for the pace of perishables.">
      <p>
        Produce runs on tight margins, cross-border supply, and systems that
        were never built to share. Payve pays your growers and suppliers from
        one place, gives them the option to be paid early, and puts agents on
        the data entry and reconciliation your team does by hand today.
      </p>
    </PageIntro>
  );
}
