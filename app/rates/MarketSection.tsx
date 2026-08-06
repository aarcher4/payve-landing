"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bookDemoLabel, bookDemoUrl } from "../components/site/config";

/**
 * The market band: a $10,000 worked example, then the live rate board.
 *
 * One fetch serves both — polling twice for the same payload would double upstream load for
 * no reason. Poll cadence matches Bridge's ~30s refresh and the server cache TTL.
 *
 * Movement is REAL. Deltas and the tick history are only ever built from rates actually
 * observed in this browser session; nothing is seeded, back-filled, or invented. A visitor
 * who has been here 20 seconds sees one tick, because that is all that has happened.
 */

const POLL_MS = 30_000;
const STALE_AFTER_MS = 120_000;
/** Illustration size. Fixed on purpose — this is a worked example, not a calculator. */
const EXAMPLE_USD = 10_000;
/** Outgoing international wire fee, USD-denominated, initiated online. See docs/rates-page-substantiation.md. */
const WIRE_OUT = 35;
/** Beneficiary bank fee plus correspondent deductions taken from the principal in transit. */
const WIRE_IN = 35;
const MAX_TICKS = 40;

interface ApiRate {
  code: string;
  payveRate: number | null;
  asOf: string;
  live: boolean;
}

const META: Record<string, { name: string; dp: number }> = {
  MXN: { name: "Mexican peso", dp: 4 },
  EUR: { name: "Euro", dp: 4 },
  COP: { name: "Colombian peso", dp: 2 },
  BRL: { name: "Brazilian real", dp: 4 },
  GBP: { name: "Pound sterling", dp: 4 },
};
const ORDER = ["MXN", "EUR", "COP", "BRL", "GBP"];

const fmt = (n: number, dp: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/**
 * Fees expressed as basis points of drag on the exchange rate — the whole point of the
 * illustration. The buyer outlays principal + the outgoing fee; the supplier is credited the
 * principal less what is deducted in transit. The ratio between those two, against the
 * headline rate, is the true cost of moving the money, and it is rate-independent.
 */
function feeDragBps(amount: number, out: number, inbound: number): number {
  const paid = amount + out;
  const delivered = amount - inbound;
  return (1 - delivered / paid) * 10_000;
}

type Tick = { t: number; v: number };

export default function MarketSection() {
  const [rates, setRates] = useState<ApiRate[] | null>(null);
  const [lastGoodAt, setLastGoodAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [ticks, setTicks] = useState<Record<string, Tick[]>>({});
  const prev = useRef<Record<string, number>>({});
  const [flash, setFlash] = useState<Record<string, "up" | "down">>({});

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/rates", { cache: "no-store" });
      if (!res.ok) return;
      const body = (await res.json()) as { rates: ApiRate[] };
      if (!Array.isArray(body.rates)) return;
      setRates(body.rates);
      if (body.rates.some((r) => r.live)) setLastGoodAt(Date.now());

      const nextFlash: Record<string, "up" | "down"> = {};
      setTicks((old) => {
        const next = { ...old };
        for (const r of body.rates) {
          if (!r.live || r.payveRate == null) continue;
          const before = prev.current[r.code];
          if (before != null && before !== r.payveRate) {
            nextFlash[r.code] = r.payveRate > before ? "up" : "down";
          }
          prev.current[r.code] = r.payveRate;
          next[r.code] = [...(next[r.code] ?? []), { t: Date.now(), v: r.payveRate }].slice(-MAX_TICKS);
        }
        return next;
      });
      if (Object.keys(nextFlash).length) {
        setFlash(nextFlash);
        setTimeout(() => setFlash({}), 900);
      }
    } catch {
      /* keep the previous render; the staleness clock handles the rest */
    }
  }, []);

  useEffect(() => {
    void load();
    const poll = setInterval(() => void load(), POLL_MS);
    const tick = setInterval(() => setNow(Date.now()), 1_000);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [load]);

  const isStale = lastGoodAt != null && now - lastGoodAt > STALE_AFTER_MS;
  const ordered = ORDER.map(
    (c) => rates?.find((r) => r.code === c) ?? { code: c, payveRate: null, asOf: "", live: false },
  );
  const mxn = ordered.find((r) => r.code === "MXN");
  const clock = lastGoodAt ? new Date(lastGoodAt).toLocaleTimeString("en-US", { hour12: false }) : null;

  const dragBps = feeDragBps(EXAMPLE_USD, WIRE_OUT, WIRE_IN);
  const buyerPays = EXAMPLE_USD + WIRE_OUT;
  const delivered = EXAMPLE_USD - WIRE_IN;

  return (
    <section className="bg-sage-900">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* ---------------- the illustration, leading ---------------- */}
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl font-extrabold tracking-h1 text-white sm:text-2xl">
            {usd(EXAMPLE_USD)} to a supplier
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-wider text-sage-300">
            Illustrative
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2" data-example>
          {[
            {
              key: "wire",
              label: "By international wire",
              pays: buyerPays,
              gets: delivered,
              drag: dragBps,
              tone: "text-white",
            },
            {
              key: "payve",
              label: "Through Payve",
              pays: EXAMPLE_USD,
              gets: EXAMPLE_USD,
              drag: 0,
              tone: "text-sage-200",
            },
          ].map((c) => (
            <div
              key={c.key}
              data-example-card={c.key}
              className={`rounded-lg border p-6 ${
                c.key === "payve" ? "border-sage-500 bg-sage-800" : "border-sage-700 bg-sage-900"
              }`}
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-sage-300">{c.label}</p>
              <dl className="mt-4 space-y-2.5 font-mono text-sm">
                <div className="flex justify-between">
                  <dt className="text-sage-300">Buyer pays</dt>
                  <dd className="tabular-nums text-white">{usd(c.pays)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sage-300">Reaches supplier</dt>
                  <dd className="tabular-nums text-white">{usd(c.gets)}</dd>
                </div>
              </dl>
              <div className="mt-5 border-t border-sage-700 pt-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-sage-300">
                  Fees on top of the rate
                </p>
                <p
                  data-example-bps={c.key}
                  className={`t-num mt-1 font-display text-4xl font-extrabold tracking-h1 ${
                    c.drag === 0 ? "text-sage-200" : "text-white"
                  }`}
                >
                  {c.drag === 0 ? "0" : Math.round(c.drag)} <span className="text-2xl">bps</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-sage-300">
          {usd(WIRE_OUT)} charged to send, {usd(WIRE_IN)} taken off the other end before it lands.
          On {usd(EXAMPLE_USD)} the two together cost {Math.round(dragBps)} basis points — on top of
          whatever exchange rate you were given. Payve adds nothing on top of the rate below.
          Fee assumptions and sources: see the pricing notes.
        </p>

        {/* ---------------- the live board ---------------- */}
        <div className="mt-14 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl font-extrabold tracking-h1 text-white sm:text-2xl">
            The Payve Rate
          </h2>
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-sage-300">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                clock && !isStale ? "animate-pulse bg-sage-300" : "bg-sage-600"
              }`}
              aria-hidden
            />
            {clock && !isStale ? `Live · ${clock}` : clock ? `Stale · ${clock}` : "Connecting"}
          </span>
        </div>

        <div className="mt-5 overflow-x-auto rounded-lg border border-sage-700">
          <table className="w-full min-w-[520px] border-collapse text-left font-mono">
            <caption className="sr-only">The Payve Rate, per US dollar</caption>
            <thead>
              <tr className="border-b border-sage-700 bg-sage-800">
                <th scope="col" className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-sage-300">
                  Pair
                </th>
                <th scope="col" className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-sage-300">
                  Rate
                </th>
                <th scope="col" className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-sage-300">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((r) => {
                const m = META[r.code];
                const state = !r.live ? "unavailable" : isStale ? "stale" : "live";
                const hist = ticks[r.code] ?? [];
                const first = hist[0]?.v;
                const delta = first != null && r.payveRate != null ? r.payveRate - first : null;
                const dir = flash[r.code];
                return (
                  <tr
                    key={r.code}
                    data-rate-row
                    data-currency={r.code}
                    data-state={state}
                    className={`border-b border-sage-800 transition-colors duration-700 last:border-b-0 ${
                      dir === "up" ? "bg-sage-700" : dir === "down" ? "bg-sage-800" : ""
                    }`}
                  >
                    <th scope="row" className="px-5 py-3 text-left font-normal">
                      <span className="text-sm font-semibold text-white">USD/{r.code}</span>
                      <span className="ml-2 text-[11px] text-sage-400">{m?.name}</span>
                    </th>
                    {state === "unavailable" ? (
                      <td colSpan={2} className="px-5 py-3 text-right text-xs text-sage-400">
                        Unavailable
                      </td>
                    ) : (
                      <>
                        <td
                          className={`px-5 py-3 text-right text-base tabular-nums ${
                            state === "stale" ? "text-sage-400" : "text-white"
                          }`}
                        >
                          {fmt(r.payveRate as number, m?.dp ?? 4)}
                        </td>
                        <td className="px-5 py-3 text-right text-xs tabular-nums">
                          {delta == null || delta === 0 ? (
                            <span className="text-sage-500">—</span>
                          ) : (
                            <span className={delta > 0 ? "text-sage-200" : "text-sage-400"}>
                              {delta > 0 ? "▲" : "▼"} {fmt(Math.abs(delta), m?.dp ?? 4)}
                            </span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-sage-400">
          Per 1 US dollar, refreshed every 30 seconds. Change is measured from the first rate seen
          since you opened this page. An estimate, not a quote — no rate lock exists.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={bookDemoUrl}
            className="inline-flex rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-sage-900 transition-colors hover:bg-sage-50"
          >
            {bookDemoLabel}
          </a>
          <span className="text-xs text-sage-300">Above $25M a year? Ask about volume pricing.</span>
        </div>
      </div>
    </section>
  );
}
