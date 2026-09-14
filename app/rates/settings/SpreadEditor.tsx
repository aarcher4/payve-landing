"use client";

/**
 * The spread editor.
 *
 * The point of this screen is that the number an operator types is never ambiguous. "16 bps"
 * on its own could mean the Payve markup or the all-in cost against mid-market, and those
 * differ by Bridge's contract spread. So the arithmetic is on screen while they type, along
 * with the exact Buy and Sell it will publish. The figure becomes checkable against the live
 * board the moment it is saved.
 */

import { useCallback, useEffect, useState } from "react";

interface PairSpread {
  pair: string;
  payveSpreadBps: number | null;
  bridgeContractBps: number;
  bridgeContractMeasured: boolean;
}

interface HistoryRow {
  id: number;
  currency_pair: string;
  payve_spread_bps: number;
  effective_from: string;
  reason: string;
  actor: string;
}

interface LiveRow {
  code: string;
  buy: number | null;
  sell: number | null;
}

const CODE: Record<string, string> = {
  usd_to_mxn: "MXN",
  usd_to_cop: "COP",
  usd_to_brl: "BRL",
  usd_to_eur: "EUR",
  usd_to_gbp: "GBP",
};

export default function SpreadEditor() {
  const [pairs, setPairs] = useState<PairSpread[] | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [live, setLive] = useState<LiveRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, r] = await Promise.all([
        fetch("/api/rates/spread", { cache: "no-store" }),
        fetch("/api/rates", { cache: "no-store" }),
      ]);
      if (s.status === 401) {
        window.location.href =
          window.location.pathname === "/settings" ? "/login" : "/rates/login";
        return;
      }
      const body = await s.json();
      if (!s.ok) {
        setError(body.detail ?? body.error ?? "Could not load spreads.");
        setPairs(null);
      } else {
        setPairs(body.pairs);
        setHistory(body.history ?? []);
        setError(null);
      }
      if (r.ok) setLive((await r.json()).rates ?? []);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <p className="text-sm text-r-muted-fg">Loading spreads…</p>;

  if (error) {
    return (
      <div className="rounded-lg border border-r-border bg-r-card p-5">
        <p className="text-sm font-medium text-r-fg">Spreads are not editable yet</p>
        <p className="mt-1 text-sm text-r-muted-fg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        {pairs?.map((c) => (
          <PairRow
            key={c.pair}
            spread={c}
            live={live.find((l) => l.code === CODE[c.pair]) ?? null}
            onSaved={load}
          />
        ))}
      </div>

      <section>
        <h2 className="text-sm font-semibold text-r-fg">Change log</h2>
        <p className="mt-1 text-xs text-r-muted-fg">
          Every re-price appends a row. Nothing is ever edited in place, so this is the record,
          not a copy of it.
        </p>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-r-muted-fg">No changes recorded yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-r-border">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-r-border bg-r-muted">
                  <th className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
                    When
                  </th>
                  <th className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
                    PairSpread
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
                    Markup
                  </th>
                  <th className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
                    Who
                  </th>
                  <th className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-b border-r-border last:border-b-0" data-history-row>
                    {/* Exact timestamps: an audit entry that says "2 hours ago" cannot be
                        reconciled against anything later. */}
                    <td className="r-num whitespace-nowrap px-4 py-2.5 text-r-muted-fg">
                      {new Date(h.effective_from).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="r-num px-4 py-2.5 text-r-fg">USD/{CODE[h.currency_pair]}</td>
                    <td className="r-num px-4 py-2.5 text-right text-r-fg">
                      {h.payve_spread_bps} bps
                    </td>
                    <td className="px-4 py-2.5 text-r-muted-fg">{h.actor}</td>
                    <td className="px-4 py-2.5 text-r-muted-fg">{h.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function PairRow({
  spread,
  live,
  onSaved,
}: {
  spread: PairSpread;
  live: LiveRow | null;
  onSaved: () => void;
}) {
  const code = CODE[spread.pair]!;
  const [bps, setBps] = useState(String(spread.payveSpreadBps ?? ""));
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const typed = Number(bps);
  const valid = /^\d{1,5}$/.test(bps) && Number.isInteger(typed) && typed >= 0 && typed <= 10_000;
  const changed = valid && typed !== spread.payveSpreadBps;
  const reasonOk = reason.trim().length >= 10;

  // Preview from the CURRENT published rate, walked back through the current spread to recover
  // the underlying quote, then forward through the typed one. Shows the real consequence
  // rather than a percentage of a percentage.
  const currentBps = spread.payveSpreadBps;
  const preview =
    valid && live?.sell != null && live?.buy != null && currentBps != null
      ? {
          sell: (live.sell / (1 - currentBps / 10_000)) * (1 - typed / 10_000),
          buy: (live.buy / (1 + currentBps / 10_000)) * (1 + typed / 10_000),
        }
      : null;

  const dp = code === "COP" ? 2 : 4;
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

  async function save() {
    setSaving(true);
    setErr(null);
    setOk(false);
    try {
      const res = await fetch("/api/rates/spread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pair: spread.pair, bps: typed, reason: reason.trim() }),
      });
      const body = await res.json();
      if (!res.ok) {
        setErr(body.detail ?? body.error ?? "Could not save.");
        return;
      }
      setOk(true);
      setReason("");
      onSaved();
    } catch {
      setErr("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-r-md border border-r-border bg-r-card p-5" data-pair={spread.pair}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="r-num text-base font-semibold text-r-fg">USD/{code}</h2>
        <p className="r-num text-xs text-r-muted-fg">
          Currently published:{" "}
          <span className="text-r-fg" data-current-bps>
            {spread.payveSpreadBps ?? "not set"} bps
          </span>
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[auto,1fr]">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
            Payve markup (bps)
          </label>
          <input
            inputMode="numeric"
            value={bps}
            data-bps-input
            onChange={(e) => {
              setBps(e.target.value.replace(/[^0-9]/g, "").slice(0, 5));
              setOk(false);
            }}
            className="r-num mt-1.5 h-control w-32 rounded-r-sm border border-r-border bg-r-bg px-3 text-lg text-r-fg outline-none focus-visible:ring-2 focus-visible:ring-r-ring"
          />
        </div>

        {/* The arithmetic, on screen while they type. This is what makes "16" unambiguous. */}
        <dl className="r-num grid content-end gap-1 text-sm" data-arithmetic>
          <Row
            k={spread.bridgeContractMeasured ? "Rail spread (measured)" : "Rail spread (estimate)"}
            v={`${spread.bridgeContractBps.toFixed(1)} bps`}
            sub
          />
          <Row k="Payve markup" v={valid ? `${typed} bps` : "not set"} />
          <Row
            k="All-in vs mid-market"
            v={valid ? `${(spread.bridgeContractBps + typed).toFixed(1)} bps` : "not set"}
            strong
          />
          {preview && (
            <Row
              k="Publishes as"
              v={`Sell ${fmt(preview.sell)} · Buy ${fmt(preview.buy)} ${code}`}
            />
          )}
        </dl>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.04em] text-r-muted-fg">
          Reason <span className="font-normal normal-case text-r-subtle">(required, 10+ characters)</span>
        </label>
        <input
          value={reason}
          data-reason-input
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why this spread is being re-priced"
          className="mt-1.5 h-control w-full rounded-r-sm border border-r-border bg-r-bg px-3 text-sm text-r-fg outline-none focus-visible:ring-2 focus-visible:ring-r-ring"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!changed || !reasonOk || saving}
          onClick={() => void save()}
          data-save
          className="h-control rounded-r-sm bg-r-primary px-4 text-sm font-semibold text-r-primary-fg transition-opacity disabled:opacity-40"
        >
          {/* Money-moving buttons name the consequence. */}
          {saving ? "Publishing…" : `Publish ${valid ? typed : "–"} bps for USD/${code}`}
        </button>
        {!changed && valid && <span className="text-xs text-r-subtle">No change to publish.</span>}
        {changed && !reasonOk && <span className="text-xs text-r-subtle">A reason is required.</span>}
        {err && (
          <span className="text-xs text-r-destructive" data-error>
            {err}
          </span>
        )}
        {ok && (
          <span className="text-xs text-r-success" data-saved>
            Published. The board is serving this rate now.
          </span>
        )}
      </div>
    </div>
  );
}

function Row({ k, v, sub, strong }: { k: string; v: string; sub?: boolean; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className={sub ? "text-r-subtle" : "text-r-muted-fg"}>{k}</dt>
      <dd className={strong ? "font-semibold text-r-fg" : "text-r-fg"}>{v}</dd>
    </div>
  );
}
