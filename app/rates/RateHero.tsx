"use client";

/**
 * The rate dashboard: two-sided quote, change line, pair selector, timeframe tabs, chart.
 *
 * Layout follows the reference frames exactly. Desktop puts the quote, the change, the pair
 * and the tabs on one row above a wide chart; mobile stacks them and the chart goes last. Both
 * carry the same task hierarchy, which is the design system's responsive rule.
 *
 * Type and colour come from the canonical Payve Design System: semantic tokens only, `numeric`
 * for every rate, shadows none, and direction carried by a glyph AND a sign, never by colour
 * alone. Nothing here hardcodes a hex.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Flag, type CountryCode } from "../components/Flag";
import { formatRate } from "@/lib/chart";
import { RateChart, type RatePoint } from "./RateChart";

const WINDOWS = ["1D", "1W", "1M", "6M", "1Y", "5Y"] as const;
type Window = (typeof WINDOWS)[number];

const PAIRS = [
  { pair: "usd_to_mxn", code: "MXN", name: "Mexican peso", to: "MX" as CountryCode },
  { pair: "usd_to_cop", code: "COP", name: "Colombian peso", to: "CO" as CountryCode },
  { pair: "usd_to_brl", code: "BRL", name: "Brazilian real", to: "BR" as CountryCode },
  { pair: "usd_to_eur", code: "EUR", name: "Euro", to: "EU" as CountryCode },
  { pair: "usd_to_gbp", code: "GBP", name: "Pound sterling", to: "GB" as CountryCode },
] as const;

/** Matches the rail's ~30s refresh and the server cache. */
const POLL_MS = 30_000;

interface LiveRow {
  code: string;
  buy: number | null;
  sell: number | null;
  live: boolean;
}

interface HistoryRes {
  available: boolean;
  points: RatePoint[];
  changeAbs: number | null;
  changePct: number | null;
  reconstructedBefore: number | null;
}

const WINDOW_LABEL: Record<Window, string> = {
  "1D": "Today",
  "1W": "Past week",
  "1M": "Past month",
  "6M": "Past 6 months",
  "1Y": "Past year",
  "5Y": "Past 5 years",
};

export default function RateHero() {
  const [pairIdx, setPairIdx] = useState(0);
  const [win, setWin] = useState<Window>("1D");
  const [live, setLive] = useState<LiveRow | null>(null);
  const [history, setHistory] = useState<HistoryRes | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const reqId = useRef(0);

  const active = PAIRS[pairIdx]!;

  const loadLive = useCallback(async () => {
    try {
      const res = await fetch("/api/rates", { cache: "no-store" });
      if (!res.ok) return;
      const body = (await res.json()) as { rates: LiveRow[] };
      setLive(body.rates?.find((r) => r.code === active.code) ?? null);
    } catch {
      /* keep the previous render; the unavailable state below covers it */
    }
  }, [active.code]);

  const loadHistory = useCallback(async () => {
    // Sequence guard: switching pair and window quickly can land responses out of order, and
    // the loser would overwrite the winner with a chart for a pair nobody is looking at.
    const id = ++reqId.current;
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/rates/history?pair=${active.pair}&window=${win}`, {
        cache: "no-store",
      });
      const body = (await res.json()) as HistoryRes;
      if (id === reqId.current) setHistory(body);
    } catch {
      if (id === reqId.current) setHistory(null);
    } finally {
      if (id === reqId.current) setLoadingHistory(false);
    }
  }, [active.pair, win]);

  useEffect(() => {
    void loadLive();
    const t = setInterval(() => void loadLive(), POLL_MS);
    return () => clearInterval(t);
  }, [loadLive]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const change = useMemo(() => {
    if (!history?.available || history.changePct == null || history.changeAbs == null) return null;
    return { pct: history.changePct, abs: history.changeAbs, up: history.changePct >= 0 };
  }, [history]);

  const hasQuote = live?.live === true && live.buy != null && live.sell != null;

  return (
    <section className="bg-r-bg text-r-fg">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* ---- quote + controls: one row on desktop, stacked on mobile ---- */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-10">
            <Quote label="Buy 1 USD" value={live?.buy ?? null} code={active.code} live={hasQuote} />
            <Quote label="Sell 1 USD" value={live?.sell ?? null} code={active.code} live={hasQuote} />

            {change && (
              <p className="r-num flex items-center gap-2 whitespace-nowrap pb-1 text-sm" data-change>
                {/* Direction is carried by the glyph and the sign as well as the colour: a
                    colour-only signal fails for a colour-blind reader and in print. */}
                <span className={change.up ? "text-r-success" : "text-r-destructive"}>
                  {change.up ? "↗" : "↘"} {change.up ? "+" : ""}
                  {change.pct.toFixed(2)}%
                </span>
                <span className="text-r-muted-fg">
                  ({change.up ? "+" : ""}
                  {formatRate(change.abs, active.code)}) {WINDOW_LABEL[win]}
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="flex -space-x-1.5" aria-hidden>
                <Flag country="US" size={22} />
                <Flag country={active.to} size={22} />
              </span>
              <span className="sr-only">Currency pair</span>
              <select
                value={pairIdx}
                onChange={(e) => setPairIdx(Number(e.target.value))}
                data-pair-select
                className="h-control rounded-r-sm border border-r-border bg-r-card px-3 text-sm font-medium text-r-fg outline-none focus-visible:ring-2 focus-visible:ring-r-ring"
              >
                {PAIRS.map((p, i) => (
                  <option key={p.pair} value={i}>
                    USD/{p.code}
                  </option>
                ))}
              </select>
            </label>

            {/* A period picker, so pill toggles with aria-pressed rather than tabs: there is
                no panel to label and nothing to count. */}
            <div role="group" aria-label="Timeframe" className="flex items-center gap-0.5">
              {WINDOWS.map((w) => (
                <button
                  key={w}
                  type="button"
                  aria-pressed={w === win}
                  data-window={w}
                  onClick={() => setWin(w)}
                  className={`r-num min-h-control rounded-full px-3.5 text-sm transition-colors ${
                    w === win
                      ? "bg-r-primary text-r-primary-fg"
                      : "text-r-muted-fg hover:bg-r-muted hover:text-r-fg"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---- chart ---- */}
        <div className="mt-8" data-rate-chart>
          <RateChart
            points={history?.available ? history.points : []}
            code={active.code}
            window={win}
            loading={loadingHistory}
            reconstructedBefore={history?.reconstructedBefore ?? null}
          />
        </div>

        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-r-subtle">
          The rate we pay your suppliers at, per 1 US dollar, refreshed every 30 seconds. An
          estimate, not a quote. No rate lock exists.
        </p>
      </div>
    </section>
  );
}

function Quote({
  label,
  value,
  code,
  live,
}: {
  label: string;
  value: number | null;
  code: string;
  live: boolean;
}) {
  return (
    <div data-quote={label}>
      <p className="text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">{label}</p>
      {live && value != null ? (
        <p className="r-num mt-1 flex items-baseline gap-2">
          <span
            className="text-r-fg"
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
              fontWeight: 500,
              lineHeight: 0.95,
              letterSpacing: "-0.045em",
            }}
          >
            {formatRate(value, code)}
          </span>
          {/* Currency is explicit because several can appear on this surface. */}
          <span className="text-lg font-medium text-r-muted-fg">{code}</span>
        </p>
      ) : (
        // Never a placeholder number. An unavailable rate says so.
        <p
          className="mt-1 text-r-muted-fg"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 500, lineHeight: 1.05 }}
        >
          Unavailable
        </p>
      )}
    </div>
  );
}
