import Reveal from "../home/Reveal";

/** Quantified context band for solutions pages. Keep sources honest. */
export default function StatStrip({
  stats,
}: {
  stats: { value: string; label: string; source?: string }[];
}) {
  return (
    <section className="border-y border-hairline bg-paper-elev">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
        {stats.map((s, i) => (
          <Reveal key={s.label} delayIndex={i}>
            <p className="t-num font-display text-3xl font-extrabold tracking-h1 text-ink-1">
              {s.value}
            </p>
            <p className="mt-1 text-sm leading-snug text-ink-2">{s.label}</p>
            {s.source && <p className="mt-1 text-xs text-ink-4">{s.source}</p>}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
