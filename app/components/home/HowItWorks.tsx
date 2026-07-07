import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Connect",
    body: "We securely link your ERP and bank data. No rip and replace, nothing to install.",
  },
  {
    n: "02",
    title: "See everything",
    body: "Your data unified daily. Ask questions in plain English, get answers with the numbers behind them.",
  },
  {
    n: "03",
    title: "Automate with approval",
    body: "Agents do the entry, matching, and drafting. A person on your team approves every write.",
  },
  {
    n: "04",
    title: "Move the money",
    body: "Pay every supplier from one place and offer early pay on approved invoices.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <span className="t-eyebrow">How it works</span>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-display text-ink-1 sm:text-4xl">
          Built around the systems you already run.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delayIndex={i} className="bg-paper-elev">
            <div className="h-full p-6">
              <span className="t-num font-mono text-xs text-sage-600">{s.n}</span>
              <h3 className="mt-3 font-display text-lg font-bold tracking-h2 text-ink-1">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
