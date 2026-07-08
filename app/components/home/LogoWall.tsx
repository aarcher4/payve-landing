import Reveal from "./Reveal";

/**
 * Customer logo wall: real normalized logos (public/logos/, 120px-height
 * sources), logos only per Alex 2026-07-07, no company names as text.
 * Grayscale at rest, full color on hover.
 */
const customers = [
  { slug: "fortune-growers", name: "Fortune Growers" },
  { slug: "sl-produce", name: "SL Group" },
  { slug: "tierra-suelta", name: "Tierra Suelta" },
  { slug: "dal-campo", name: "Dal Campo" },
  { slug: "ph-distribution", name: "PH Distribution" },
  { slug: "miranda-brands", name: "Miranda" },
  { slug: "royal-fresh", name: "Royal Fresh" },
];

export function LogoRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
      {customers.map((c, i) => (
        <Reveal key={c.slug} delayIndex={i % 5}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos/${c.slug}.png`}
            alt={c.name}
            className="h-10 w-auto opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
          />
        </Reveal>
      ))}
    </div>
  );
}

export default function LogoWall() {
  return (
    <section className="border-y border-hairline bg-paper-elev">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Reveal>
          <p className="t-eyebrow pb-8 text-center">
            Trusted by supply chain leaders
          </p>
        </Reveal>
        <LogoRow />
      </div>
    </section>
  );
}
