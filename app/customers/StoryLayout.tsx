import Link from "next/link";
import Reveal from "../components/home/Reveal";
import CtaBand from "../components/home/CtaBand";
import { stories } from "./customers-data";

export function StoryHero({
  name,
  industryTag,
  headline,
  draft,
}: {
  name: string;
  industryTag: string;
  headline: string;
  draft?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-sage-900">
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6">
        <Reveal>
          <span className="t-eyebrow !text-sage-300">{industryTag}</span>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-extrabold tracking-display text-white sm:text-5xl">
            {headline}
          </h1>
          <p className="mt-4 font-display text-sm font-bold tracking-wide text-sage-200">
            {name}
          </p>
          {draft && (
            <p className="mt-6 inline-block rounded-sm bg-sage-800 px-2.5 py-1 text-xs font-medium text-sage-200">
              Draft. Publishes after customer review.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function StatBand({
  stats,
}: {
  stats: { value: string; sub: string }[];
}) {
  return (
    <section className="border-b border-hairline bg-paper-elev">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        {stats.map((s, i) => (
          <Reveal key={s.value} delayIndex={i}>
            <p className="t-num font-display text-3xl font-extrabold tracking-h1 text-ink-1">
              {s.value}
            </p>
            <p className="mt-1 text-sm leading-snug text-ink-2">{s.sub}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function StoryBody({
  children,
  runsOn,
  currentSlug,
}: {
  children: React.ReactNode;
  runsOn: string[];
  currentSlug: string;
}) {
  const related = stories.filter((s) => s.slug !== currentSlug);
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="space-y-6 text-base leading-relaxed text-ink-2 [&_blockquote]:border-l-2 [&_blockquote]:border-sage-300 [&_blockquote]:pl-6 [&_blockquote]:text-lg [&_blockquote]:text-ink-1 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-h1 [&_h2]:text-ink-1">
          {children}
        </div>
        <div className="mt-12 rounded-lg border border-hairline bg-paper-elev p-6">
          <span className="t-eyebrow">What they run on Payve</span>
          <ul className="mt-3 flex flex-wrap gap-2">
            {runsOn.map((r) => (
              <li
                key={r}
                className="rounded-sm bg-paper-2 px-2.5 py-1 text-xs font-medium text-ink-2"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-hairline bg-paper-elev">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <span className="t-eyebrow">More stories</span>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/customers/${s.slug}`}
                className="rounded-lg border border-hairline bg-paper p-6 transition-shadow hover:shadow-elev-3"
              >
                <p className="t-num font-display text-xl font-extrabold tracking-h2 text-ink-1">
                  {s.metric}
                </p>
                <p className="mt-2 text-sm font-semibold leading-snug text-ink-1">
                  {s.headline}
                </p>
                <span className="mt-3 block text-xs text-ink-3">{s.industryTag}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
