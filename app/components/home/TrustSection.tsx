import Link from "next/link";
import Reveal from "./Reveal";
import { notABankDisclosure } from "../site/config";

/**
 * r3 icon diet (docs/design-review-r3.md lens 1): type-led trust tiles, a
 * hairline top rule per tile instead of an icon.
 */
const items = [
  {
    title: "Approval gate",
    body: "Every automation runs behind a human review gate. Nothing posts to your books on its own.",
  },
  {
    title: "Audit trail",
    body: "Every read, match, and write is logged and traceable to the person who approved it.",
  },
  {
    title: "Per-customer isolation",
    body: "Your data lives in its own isolated environment, never pooled with anyone else's.",
  },
  {
    title: "Credentials vaulted",
    body: "System credentials are vaulted and encrypted, never exposed.",
  },
];

export default function TrustSection() {
  return (
    <section className="border-t border-hairline bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <span className="t-eyebrow">Built to be checked</span>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-display text-ink-1 sm:text-4xl">
            Trust is <span className="text-ink-3">a design requirement.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.title} delayIndex={i}>
              <div className="h-full border-t-2 border-sage-600 pt-4">
                <h3 className="text-sm font-semibold text-ink-1">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <p className="max-w-3xl text-xs leading-relaxed text-ink-3">
            {notABankDisclosure}{" "}
            <Link href="/security" className="font-medium text-ink-2 hover:text-ink-1">
              More on security
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
