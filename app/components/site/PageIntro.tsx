import { bookDemoUrl } from "./config";

/**
 * Interim page shell used while a section's full page is being built.
 * Eyebrow + headline + factual summary + demo CTA. Replaced section by
 * section as the PR train lands.
 */
export default function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <span className="t-eyebrow">{eyebrow}</span>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-display text-ink-1 sm:text-5xl">
        {title}
      </h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-2">
        {children}
      </div>
      <div className="mt-10">
        <a
          href={bookDemoUrl}
          className="inline-flex rounded-md bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sage-800"
        >
          Book a demo
        </a>
      </div>
    </main>
  );
}
