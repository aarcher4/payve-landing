"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Live Payve Rate table. Polls /api/rates every 30s — the same cadence Bridge refreshes
 * at, and the same TTL the server cache uses, so the poll never outruns the data.
 *
 * The three states matter more than the happy path:
 *   live        — a real rate, with the time it was read
 *   stale       — last good value is older than STALE_AFTER_MS; kept but dimmed and labelled
 *   unavailable — no rate. The row says so.
 *
 * There is deliberately NO fallback number. payve-fintech keeps synthetic constants so a
 * real withdrawal degrades to a sane estimate instead of failing; a public page showing an
 * invented rate as if it were live is a different thing entirely, and never acceptable.
 *
 * Bridge offers no quote and no rate lock, so every figure here is an estimate — stated on
 * the page, not buried.
 */

const STALE_AFTER_MS = 120_000;
const POLL_MS = 30_000;

interface ApiRate {
  code: string;
  mid: number | null;
  payveRate: number | null;
  allInBps: number | null;
  asOf: string;
  live: boolean;
}

const CURRENCY_META: Record<string, { name: string; country: string; dp: number }> = {
  MXN: { name: "Mexican peso", country: "Mexico", dp: 4 },
  EUR: { name: "Euro", country: "Eurozone", dp: 4 },
  COP: { name: "Colombian peso", country: "Colombia", dp: 2 },
  BRL: { name: "Brazilian real", country: "Brazil", dp: 4 },
  GBP: { name: "Pound sterling", country: "United Kingdom", dp: 4 },
};
const ORDER = ["MXN", "EUR", "COP", "BRL", "GBP"];

function fmt(n: number, dp: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

type RowState = "live" | "stale" | "unavailable";

export default function RateTable() {
  const [rates, setRates] = useState<ApiRate[] | null>(null);
  const [lastGoodAt, setLastGoodAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/rates", { cache: "no-store" });
      if (!res.ok) return;
      const body = (await res.json()) as { rates: ApiRate[] };
      if (!Array.isArray(body.rates)) return;
      setRates(body.rates);
      if (body.rates.some((r) => r.live)) setLastGoodAt(Date.now());
    } catch {
      // Leave the previous render in place; the staleness clock below handles the rest.
    }
  }, []);

  useEffect(() => {
    void load();
    const poll = setInterval(() => void load(), POLL_MS);
    // Separate 1s tick so a row can go stale without waiting for the next poll.
    const tick = setInterval(() => setNow(Date.now()), 1_000);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [load]);

  const ordered = ORDER.map(
    (code) =>
      rates?.find((r) => r.code === code) ?? {
        code,
        mid: null,
        payveRate: null,
        allInBps: null,
        asOf: "",
        live: false,
      },
  );

  const isStale = lastGoodAt != null && now - lastGoodAt > STALE_AFTER_MS;
  const asOfLabel =
    lastGoodAt != null
      ? new Date(lastGoodAt).toLocaleTimeString("en-US", { hour12: false })
      : null;

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-hairline bg-paper-elev shadow-elev-2">
        <table className="w-full min-w-[540px] border-collapse text-left">
          <caption className="sr-only">
            Live mid-market rate and the Payve Rate, per US dollar
          </caption>
          <thead>
            <tr className="border-b border-hairline">
              <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-3">
                Currency
              </th>
              <th scope="col" className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-3">
                Mid-market
              </th>
              <th scope="col" className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-3">
                The Payve Rate
              </th>
              <th scope="col" className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-3">
                All-in cost
              </th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((r) => {
              const meta = CURRENCY_META[r.code];
              const state: RowState = !r.live ? "unavailable" : isStale ? "stale" : "live";
              const dim = state === "stale" ? "opacity-60" : "";
              return (
                <tr
                  key={r.code}
                  data-rate-row
                  data-currency={r.code}
                  data-state={state}
                  className="border-b border-hairline last:border-b-0"
                >
                  <th scope="row" className="px-5 py-4 font-normal">
                    <span className="font-mono text-sm font-semibold text-ink-1">USD/{r.code}</span>
                    <span className="mt-0.5 block text-xs text-ink-3">
                      {meta?.name} · {meta?.country}
                    </span>
                  </th>

                  {state === "unavailable" ? (
                    <td colSpan={3} className="px-5 py-4 text-right text-sm text-ink-3">
                      Rate temporarily unavailable
                    </td>
                  ) : (
                    <>
                      <td className={`px-5 py-4 text-right font-mono text-sm text-ink-2 ${dim}`}>
                        {fmt(r.mid as number, meta?.dp ?? 4)}
                      </td>
                      <td className={`px-5 py-4 text-right font-mono text-sm font-semibold text-ink-1 ${dim}`}>
                        {fmt(r.payveRate as number, meta?.dp ?? 4)}
                      </td>
                      <td className={`px-5 py-4 text-right font-mono text-sm text-ink-2 ${dim}`}>
                        {Math.round(r.allInBps as number)} bps
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-3" data-rate-status>
        {asOfLabel && !isStale && <>Live · read at {asOfLabel}. </>}
        {asOfLabel && isStale && <>Showing the last rate read at {asOfLabel} — this figure is stale. </>}
        {!asOfLabel && <>Rates are read live from our payments provider. </>}
        Rates shown per 1 US dollar and refresh every 30 seconds. They are an estimate, not a
        quote: no rate lock exists, and the rate applied when a payment settles may differ.
        &ldquo;All-in cost&rdquo; is the total difference between the mid-market rate and the
        Payve Rate, in basis points.
      </p>
    </div>
  );
}
