import Reveal from "./Reveal";

/**
 * Signed customers, rendered as typographic wordmarks until the sourced
 * logo set lands (customers research PR). Names are real signed customers.
 */
const customers = [
  "Fortune Growers",
  "SL Produce",
  "Dal Campo",
  "PH Distribution",
  "Tierra Suelta",
  "Vitos Trading",
  "ASL Produce",
  "Market Value Packhouse",
];

export default function LogoWall() {
  return (
    <section className="border-y border-hairline bg-paper-elev">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Reveal>
          <p className="t-eyebrow text-center">
            Supply chain businesses across the US, Mexico, and Colombia
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
          {customers.map((name, i) => (
            <Reveal key={name} delayIndex={i % 4}>
              <span className="block text-center font-display text-sm font-bold tracking-wide text-ink-3">
                {name}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
