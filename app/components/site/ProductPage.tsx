import Reveal from "../home/Reveal";
import CtaBand from "../home/CtaBand";
import { bookDemoLabel, bookDemoUrl } from "./config";

/**
 * Shared scaffolding for product and solution pages:
 * hero band, alternating feature sections with an optional demo slot,
 * closing CTA band.
 */

export function PageHero({
  eyebrow,
  title,
  sub,
  image,
  imageAlt = "",
  atmosphere = false,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  image?: string;
  imageAlt?: string;
  /**
   * r2 hero grammar (variant B won the team A/B): the image is a FULL-BLEED
   * BACKGROUND behind the hero text, home-style (opacity 0.62 under paper +
   * sage gradient washes, headline left-aligned and AA-readable, no side
   * card). Used on security/company/solutions; product pages keep the
   * framed side-image style.
   */
  atmosphere?: boolean;
}) {
  if (atmosphere && image) {
    return (
      <section className="relative overflow-hidden border-b border-hairline bg-paper">
        <img
          src={image}
          alt={imageAlt}
          loading="eager"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.62]"
          style={{ objectPosition: "center 46%" }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(247,248,249,0.94) 0%, rgba(247,248,249,0.82) 30%, rgba(247,248,249,0.5) 58%, rgba(247,248,249,0.28) 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(247,248,249,0.6) 0%, rgba(247,248,249,0) 30%, rgba(247,248,249,0) 66%, rgba(247,248,249,0.78) 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "radial-gradient(120% 90% at 12% 12%, rgba(141,168,154,0.16) 0%, rgba(141,168,154,0) 60%)",
          }}
          aria-hidden
        />
        <div className="relative z-[2] mx-auto flex min-h-[420px] max-w-6xl items-center px-4 py-24 sm:px-6">
          <Reveal className="max-w-xl">
            <span className="t-eyebrow text-sage-700">{eyebrow}</span>
            <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-display text-ink-1 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-2 sm:text-lg">
              {sub}
            </p>
            <a
              href={bookDemoUrl}
              className="mt-8 inline-flex rounded-md bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white shadow-elev-2 transition-colors hover:bg-sage-800"
            >
              {bookDemoLabel}
            </a>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-hairline bg-paper-elev">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6">
        <div className={image ? "grid items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : undefined}>
          <Reveal>
            <span className="t-eyebrow">{eyebrow}</span>
            <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-extrabold tracking-display text-ink-1 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
              {sub}
            </p>
            <a
              href={bookDemoUrl}
              className="mt-8 inline-flex rounded-md bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sage-800"
            >
              {bookDemoLabel}
            </a>
          </Reveal>
          {image && (
            <Reveal delayIndex={1}>
              <img
                src={image}
                alt={imageAlt}
                loading="eager"
                className="aspect-[16/10] w-full rounded-lg border border-hairline object-cover shadow-elev-3"
              />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

export function SplitSection({
  eyebrow,
  title,
  children,
  visual,
  flip = false,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div
        className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
          flip ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <Reveal>
          {eyebrow && <span className="t-eyebrow">{eyebrow}</span>}
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-h1 text-ink-1 sm:text-3xl">
            {title}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-2 sm:text-base">
            {children}
          </div>
        </Reveal>
        <Reveal delayIndex={1}>{visual}</Reveal>
      </div>
    </section>
  );
}

export function FeatureGrid({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <section className="border-y border-hairline bg-paper-elev">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <Reveal key={f.title} delayIndex={i % 3} className="bg-paper">
              <div className="h-full p-6">
                <h3 className="text-sm font-semibold text-ink-1">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductCtaBand() {
  return <CtaBand />;
}
