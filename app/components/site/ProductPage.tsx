import Link from "next/link";
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
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <Reveal key={f.title} delayIndex={i % 3}>
              <div className="h-full border-t-2 border-sage-600 pt-4">
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

/**
 * r3 quote band (Ramp pattern, docs/design-review-r3.md lens 5): the signed
 * customer quote on a tinted full-width band. Used on product pages.
 */
export function QuoteBand() {
  return (
    <section className="border-y border-sage-100 bg-sage-50">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <Reveal>
          <p className="text-balance font-display text-xl font-semibold leading-relaxed tracking-h2 text-ink-1 sm:text-2xl">
            &ldquo;Partnering with Payve instantly felt like we added an entire
            crew of dedicated specialists to our workforce.&rdquo;
          </p>
          <p className="mt-6 text-sm font-semibold text-ink-1">
            Geoff Pence <span className="font-normal text-ink-3">· Fortune Growers</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * r3 cross-sell row (Mercury grammar minus the cards): quiet text links to
 * the rest of the platform above the closing CTA band.
 */
export function CrossSell({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <span className="t-eyebrow text-sage-600">One network</span>
        <div className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-lg font-bold tracking-h2 text-ink-2 underline decoration-hairline underline-offset-8 transition-colors hover:text-ink-1 hover:decoration-sage-500"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function ProductCtaBand() {
  return <CtaBand />;
}
