/**
 * The rate time series behind the chart: capture, backfill, and windowed reads.
 *
 * Bridge has no history endpoint, so the series is assembled from two kinds of point:
 *
 *   intraday  — Bridge's own quote, recorded by us every 5 minutes. Real, first-party,
 *               and only exists from the moment capture was switched on.
 *   daily     — official daily closes, backfilled 5 years. ECB reference rates via
 *               Frankfurter for MXN/EUR/GBP/BRL; Banco de la República's TRM for COP,
 *               which the ECB does not publish.
 *
 * WHAT THE CHART PUBLISHES, AND WHY IT IS ONE LINE.
 *
 * Only the SELL series crosses the wire — the headline rate, the single line in the reference
 * design. Publishing both sides of the history would leak margin: a reconstructed point derives
 * both sides from the same mid, so (buy + sell) / 2 recovers mid exactly, and from that the
 * all-in spread. The live hero can show both sides because those come from Bridge's two
 * genuinely different sides, which do not straddle mid symmetrically. History does not have
 * that property, so history stays one-sided.
 *
 * HONESTY ABOUT RECONSTRUCTION. A daily point is not a rate we ever quoted — it is an official
 * mid with today's spread applied, so the shape of the market is true even though the point is
 * derived. Each point carries its `source`, and the API reports the timestamp before which
 * everything is reconstructed, so the UI can say so rather than implying we have five years of
 * our own quotes.
 */
import { getPool } from "./db";
import {
  FALLBACK_CONTRACT_SPREAD_BPS,
  CURRENCY_PAIRS,
  codeFor,
  type CurrencyPair,
} from "./rates-math";

export const WINDOWS = ["1D", "1W", "1M", "6M", "1Y", "5Y"] as const;
export type Window = (typeof WINDOWS)[number];

export function isWindow(v: string): v is Window {
  return (WINDOWS as readonly string[]).includes(v);
}

interface WindowSpec {
  days: number;
  granularity: "intraday" | "daily";
}

/**
 * 1D and 1W read our own 5-minute captures; everything longer reads daily closes. 1W at
 * 5-minute resolution is ~2000 rows, which downsamples to ~300 without losing shape.
 */
const WINDOW_SPEC: Record<Window, WindowSpec> = {
  "1D": { days: 1, granularity: "intraday" },
  "1W": { days: 7, granularity: "intraday" },
  "1M": { days: 30, granularity: "daily" },
  "6M": { days: 182, granularity: "daily" },
  "1Y": { days: 365, granularity: "daily" },
  "5Y": { days: 1826, granularity: "daily" },
};

/** Enough to draw a smooth line at 1440px without shipping thousands of points. */
const MAX_POINTS = 300;

export const INTRADAY_BUCKET_MS = 5 * 60_000;
/** Intraday is a chart detail, not a record. Daily is kept forever. */
export const INTRADAY_RETENTION_DAYS = 90;

export interface SnapshotRow {
  currency_pair: CurrencyPair;
  bucket_at: Date;
  granularity: "intraday" | "daily";
  mid_rate: number;
  bridge_sell_rate: number | null;
  bridge_buy_rate: number | null;
  source: "bridge" | "ecb" | "banrep";
}

export interface HistoryPoint {
  /** Epoch ms. */
  t: number;
  /** The published sell rate at that point. The only rate that crosses the wire. */
  sell: number;
  /** "bridge" = a rate we actually recorded; anything else = reconstructed from a daily close. */
  source: SnapshotRow["source"];
}

/** Floor a timestamp to its capture bucket. */
export function bucketFor(at: Date, granularity: "intraday" | "daily"): Date {
  if (granularity === "daily") {
    return new Date(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()));
  }
  return new Date(Math.floor(at.getTime() / INTRADAY_BUCKET_MS) * INTRADAY_BUCKET_MS);
}

/**
 * Derive the published sell rate for a stored point.
 *
 * A Bridge point carries the real two-sided quote, so the sell side is the one below mid with
 * our markup on top. A public daily close carries only a mid, so the whole spread — Bridge's
 * contract spread plus ours — is applied to it. Both are rendered at TODAY's spread, which is
 * what makes the line comparable end to end; the alternative, re-deriving each point at
 * whatever spread applied that day, would make the chart move when we re-price rather than
 * when the market does.
 */
export function sellFor(
  row: SnapshotRow,
  payveSpreadBps: number,
  /** Measured contract spread for this corridor, when we have observed one. */
  contractBps?: number,
): number {
  if (row.source === "bridge" && row.bridge_sell_rate != null && row.bridge_buy_rate != null) {
    const below = Math.min(row.bridge_sell_rate, row.bridge_buy_rate);
    return below * (1 - payveSpreadBps / 10_000);
  }
  const contract = contractBps ?? FALLBACK_CONTRACT_SPREAD_BPS[row.currency_pair];
  return row.mid_rate * (1 - (contract + payveSpreadBps) / 10_000);
}

/**
 * Reduce to at most MAX_POINTS, always keeping the first and last. Even striding rather than
 * averaging: an averaged FX series flattens the spikes that are the whole reason someone looks
 * at the chart.
 */
export function downsample<T>(points: T[], max = MAX_POINTS): T[] {
  if (points.length <= max) return points;
  const step = (points.length - 1) / (max - 1);
  const out: T[] = [];
  for (let i = 0; i < max; i++) out.push(points[Math.round(i * step)]);
  // Rounding can repeat the final index; make sure the true last point is the one shown.
  out[out.length - 1] = points[points.length - 1];
  return out;
}

export interface HistorySeries {
  points: HistoryPoint[];
  /** Everything at or before this epoch-ms is reconstructed. Null when nothing is. */
  reconstructedBefore: number | null;
  /** Multiplier applied to level-match a reconstructed series to the live rate. 1 = untouched. */
  anchorRatio: number;
  /** True when the anchor was out of band and the series was withheld rather than published. */
  anchorRefused: boolean;
}

/**
 * Put the live quote on the end of a series that needs no rescaling.
 *
 * An intraday capture is at most 5 minutes old, so without this the chart's last point trails
 * the headline number by a tick — small, but it is the exact comparison a reader makes first,
 * and "the big number does not match the end of the line" reads as a broken page.
 */
export function appendLive(points: HistoryPoint[], liveSell: number): HistoryPoint[] {
  if (!Number.isFinite(liveSell) || liveSell <= 0) return points;
  return [...points, { t: Date.now(), sell: liveSell, source: "bridge" }];
}

/**
 * Level-match a reconstructed series to the live rate, and give it the live point as its last.
 *
 * WHY THIS IS NECESSARY. The public daily sources do not agree with Bridge about the level of
 * the market, and the disagreement is far larger than the thing the chart is drawing. Measured
 * on 10 Sep 2026: ECB's USD/MXN mid was 16.9025 against Bridge's 17.0011 (+0.58%), Banrep's TRM
 * 3099.48 against 3122.54 (+0.74%), BRL +1.18%. The ECB fixes once a day as a EUR-based cross,
 * Banrep's TRM is a previous-day average, and Bridge is live spot — three different
 * measurements of three different moments.
 *
 * A day's worth of movement is around 0.5%. So an unadjusted 1M chart would END at 16.85 while
 * the hero above it read 16.95: a step larger than any real move on the chart, reading as a
 * crash that never happened, on the one page whose entire purpose is being trustworthy about
 * rates.
 *
 * Scaling is MULTIPLICATIVE, so every percentage move in the series is preserved exactly — the
 * shape is untouched and only the level moves. Error is pushed into the distant past, where
 * 0.5% is invisible against years of real movement, and driven to zero at the right-hand edge,
 * which is the point a reader actually cross-checks against the headline number.
 *
 * This is the standard splice used for any chained index, and the API reports `anchorRatio` so
 * the UI can say the history is indexed rather than implying five years of our own quotes.
 */
export function anchorToLive(points: HistoryPoint[], liveSell: number): {
  points: HistoryPoint[];
  anchorRatio: number;
  refused: boolean;
} {
  if (points.length === 0 || !Number.isFinite(liveSell) || liveSell <= 0) {
    return { points, anchorRatio: 1, refused: false };
  }
  const last = points[points.length - 1];
  if (!(last.sell > 0)) return { points, anchorRatio: 1, refused: false };
  const anchorRatio = liveSell / last.sell;
  /**
   * A ratio this far from 1 is not a source disagreement, it is a bug or a broken upstream.
   *
   * REFUSING MEANS PUBLISHING NOTHING, not publishing the series unadjusted. Serving it
   * unanchored looks reasonable in isolation and is badly wrong in place: the headline is the
   * live rate, so a chart 20% away from it sits directly under a number it contradicts, with
   * nothing on screen to explain the gap. That is exactly the "a customer could price a
   * shipment against this" failure the whole surface is built to avoid. An empty chart with
   * its honest empty state is the correct output.
   */
  if (!Number.isFinite(anchorRatio) || anchorRatio <= 0.8 || anchorRatio >= 1.2) {
    return { points: [], anchorRatio: 1, refused: true };
  }
  const scaled = points.map((p) => ({ ...p, sell: p.sell * anchorRatio }));
  // The live quote is a real observation, so it joins the series as one — and it is what makes
  // the chart's last point equal the headline rate.
  scaled.push({ t: Date.now(), sell: liveSell, source: "bridge" });
  return { points: scaled, anchorRatio, refused: false };
}

export async function readSeries(
  pair: CurrencyPair,
  window: Window,
  payveSpreadBps: number,
  /** The live published sell rate, when one is available. Anchors a reconstructed series. */
  liveSell?: number | null,
): Promise<HistorySeries | null> {
  const pool = getPool();
  if (!pool) return null;
  const spec = WINDOW_SPEC[window];
  const since = new Date(Date.now() - spec.days * 86_400_000);
  try {
    const { rows } = await pool.query<SnapshotRow>(
      `select currency_pair, bucket_at, granularity, mid_rate, bridge_sell_rate,
              bridge_buy_rate, source
         from fx_rate_snapshot
        where currency_pair = $1 and granularity = $2 and bucket_at >= $3
        order by bucket_at asc`,
      [pair, spec.granularity, since],
    );
    if (rows.length === 0) {
      return { points: [], reconstructedBefore: null, anchorRatio: 1, anchorRefused: false };
    }

    const points: HistoryPoint[] = rows.map((r) => ({
      t: new Date(r.bucket_at).getTime(),
      // pg returns numeric as string to preserve precision; a rate is a multiplier, so a
      // float is the right destination once we are past storage.
      sell: sellFor(
        {
          ...r,
          mid_rate: Number(r.mid_rate),
          bridge_sell_rate: r.bridge_sell_rate == null ? null : Number(r.bridge_sell_rate),
          bridge_buy_rate: r.bridge_buy_rate == null ? null : Number(r.bridge_buy_rate),
        },
        payveSpreadBps,
      ),
      source: r.source,
    }));

    // The newest reconstructed point IS the boundary: everything at or before it is derived,
    // everything after it is a rate we recorded. Reporting the first REAL point instead would
    // be off by one and label a genuine observation as reconstructed.
    //
    // In practice a window is uniform — granularity decides the source, intraday is always
    // Bridge and daily is always a public close — so this is all-or-nothing today. It is
    // written to be correct for a mixed window anyway, because the day a window does mix is
    // not the day to discover the boundary was approximate.
    const lastReconstructed = [...points].reverse().find((p) => p.source !== "bridge");
    const reconstructedBefore = lastReconstructed ? lastReconstructed.t : null;

    const down = downsample(points);

    // Every window ends at the live rate, so the chart's last point always equals the headline
    // number above it. Only a RECONSTRUCTED series is additionally scaled: an intraday window
    // is already Bridge's own quotes, and rescaling real observations to match a different real
    // observation would be inventing data rather than splicing a source.
    let finalPoints = down;
    let anchorRatio = 1;
    let anchorRefused = false;
    if (liveSell != null) {
      if (lastReconstructed != null) {
        ({ points: finalPoints, anchorRatio, refused: anchorRefused } = anchorToLive(down, liveSell));
      } else {
        finalPoints = appendLive(down, liveSell);
      }
    }

    return { points: finalPoints, reconstructedBefore, anchorRatio, anchorRefused };
  } catch (err) {
    console.error("[history] read failed:", err instanceof Error ? err.message : String(err));
    return null;
  }
}

/**
 * Measure the rail's own contract spread per corridor, from our own observations.
 *
 * Every intraday snapshot stores both the mid and the rail's sell side, so the spread the rail
 * actually charged is `(1 - sell / mid) * 10_000`. That is authoritative and self-correcting,
 * where a hardcoded table is neither: cross-checking the two written sources for these numbers
 * found them disagreeing on BRL and silent on EUR and GBP.
 *
 * Read from the newest observation rather than an average: this is a contractual rate, not a
 * market rate, so it steps when the contract changes and averaging would smear the step across
 * however long the window is.
 */
const CONTRACT_CACHE_TTL_MS = 5 * 60_000;
let contractCache: { at: number; value: Partial<Record<CurrencyPair, number>> } | null = null;

export async function measureContractBps(): Promise<Partial<Record<CurrencyPair, number>>> {
  const now = Date.now();
  if (contractCache && now - contractCache.at < CONTRACT_CACHE_TTL_MS) return contractCache.value;

  const pool = getPool();
  if (!pool) return {};
  try {
    const { rows } = await pool.query<{ currency_pair: CurrencyPair; bps: string }>(
      `select distinct on (currency_pair) currency_pair,
              ((1 - bridge_sell_rate / mid_rate) * 10000)::text as bps
         from fx_rate_snapshot
        where granularity = 'intraday' and source = 'bridge'
          and bridge_sell_rate is not null and mid_rate > 0
        order by currency_pair, bucket_at desc`,
    );
    const out: Partial<Record<CurrencyPair, number>> = {};
    for (const r of rows) {
      const bps = Number(r.bps);
      // A negative or absurd figure is not a contract spread; ignore it and fall back.
      if (Number.isFinite(bps) && bps >= 0 && bps < 1000) out[r.currency_pair] = bps;
    }
    contractCache = { at: now, value: out };
    return out;
  } catch (err) {
    console.error("[history] contract measure failed:", err instanceof Error ? err.message : String(err));
    return {};
  }
}

/** Upsert one bucket. The primary key makes a repeat a correction, never a duplicate. */
export async function writeSnapshots(rows: SnapshotRow[]): Promise<number> {
  const pool = getPool();
  if (!pool || rows.length === 0) return 0;
  let written = 0;
  for (const r of rows) {
    try {
      await pool.query(
        `insert into fx_rate_snapshot
           (currency_pair, bucket_at, granularity, mid_rate, bridge_sell_rate,
            bridge_buy_rate, source, captured_at)
         values ($1, $2, $3, $4, $5, $6, $7, now())
         on conflict (currency_pair, bucket_at, granularity) do update
            set mid_rate = excluded.mid_rate,
                bridge_sell_rate = excluded.bridge_sell_rate,
                bridge_buy_rate = excluded.bridge_buy_rate,
                source = excluded.source,
                captured_at = now()`,
        [
          r.currency_pair,
          r.bucket_at,
          r.granularity,
          r.mid_rate,
          r.bridge_sell_rate,
          r.bridge_buy_rate,
          r.source,
        ],
      );
      written++;
    } catch (err) {
      // Per-row isolation: one bad corridor must not cost the other four their capture.
      console.error(
        `[history] write failed for ${r.currency_pair} ${r.bucket_at.toISOString()}:`,
        err instanceof Error ? err.message : String(err),
      );
    }
  }
  return written;
}

export async function pruneIntraday(): Promise<number> {
  const pool = getPool();
  if (!pool) return 0;
  try {
    const { rowCount } = await pool.query(
      `delete from fx_rate_snapshot
        where granularity = 'intraday'
          and bucket_at < now() - ($1 || ' days')::interval`,
      [String(INTRADAY_RETENTION_DAYS)],
    );
    return rowCount ?? 0;
  } catch {
    return 0;
  }
}

// ---------------------------------------------------------------- public daily sources

/**
 * ECB reference rates via Frankfurter. Free, no key, history to 1999.
 *
 * Business days only — no weekend or TARGET-holiday rows. The caller carries the previous
 * close forward, which is what a bank would quote on a Sunday anyway.
 *
 * COP IS NOT AVAILABLE HERE. The ECB publishes 30 currencies and Colombian peso is not one of
 * them; asking for it silently returns a response with the key absent rather than an error,
 * which is exactly the kind of quiet gap that produces an empty chart nobody can explain.
 * Colombia goes through Banrep below.
 */
export const FRANKFURTER_PAIRS: CurrencyPair[] = [
  "usd_to_mxn",
  "usd_to_eur",
  "usd_to_gbp",
  "usd_to_brl",
];

export async function fetchFrankfurter(
  start: string,
  end: string,
): Promise<Map<CurrencyPair, Map<string, number>>> {
  const symbols = FRANKFURTER_PAIRS.map((p) => codeFor(p)).join(",");
  const url = `https://api.frankfurter.dev/v1/${start}..${end}?base=USD&symbols=${symbols}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`frankfurter ${res.status}`);
  const body = (await res.json()) as { rates?: Record<string, Record<string, number>> };
  const out = new Map<CurrencyPair, Map<string, number>>();
  for (const pair of FRANKFURTER_PAIRS) out.set(pair, new Map());
  for (const [day, byCode] of Object.entries(body.rates ?? {})) {
    for (const pair of FRANKFURTER_PAIRS) {
      const v = byCode[codeFor(pair)];
      if (typeof v === "number" && Number.isFinite(v) && v > 0) out.get(pair)!.set(day, v);
    }
  }
  return out;
}

/**
 * Banco de la República's TRM, the official COP/USD rate, via Colombia's open-data portal.
 * Free, no key.
 *
 * Rows carry a validity RANGE (`vigenciadesde` .. `vigenciahasta`) rather than one date, and
 * the range already spans weekends and holidays — a Friday row is typically valid through
 * Sunday. Expanding the range is therefore the correct read, not a gap-fill heuristic.
 */
export async function fetchBanrepTrm(start: string, end: string): Promise<Map<string, number>> {
  const url =
    `https://www.datos.gov.co/resource/32sa-8pi3.json` +
    `?$where=vigenciadesde >= '${start}T00:00:00' and vigenciadesde <= '${end}T23:59:59'` +
    `&$order=vigenciadesde ASC&$limit=50000`;
  const res = await fetch(url, { signal: AbortSignal.timeout(45_000) });
  if (!res.ok) throw new Error(`banrep ${res.status}`);
  const body = (await res.json()) as Array<{
    valor?: string;
    vigenciadesde?: string;
    vigenciahasta?: string;
  }>;
  const out = new Map<string, number>();
  for (const row of body) {
    const value = Number.parseFloat(String(row.valor ?? ""));
    if (!Number.isFinite(value) || value <= 0) continue;
    const from = String(row.vigenciadesde ?? "").slice(0, 10);
    const to = String(row.vigenciahasta ?? from).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) continue;
    for (let d = new Date(`${from}T00:00:00Z`); ; d = new Date(d.getTime() + 86_400_000)) {
      const key = d.toISOString().slice(0, 10);
      out.set(key, value);
      if (key >= to) break;
      // Guard against a malformed range running away.
      if (out.size > 40_000) break;
    }
  }
  return out;
}

/** Carry the previous close forward across days a source does not publish. */
export function fillForward(
  byDay: Map<string, number>,
  start: string,
  end: string,
): Map<string, number> {
  const out = new Map<string, number>();
  let last: number | null = null;
  for (let d = new Date(`${start}T00:00:00Z`); ; d = new Date(d.getTime() + 86_400_000)) {
    const key = d.toISOString().slice(0, 10);
    const v = byDay.get(key);
    if (v != null) last = v;
    // Nothing is emitted before the first real observation — a chart must not open with a
    // flat invented run-in.
    if (last != null) out.set(key, last);
    if (key >= end) break;
  }
  return out;
}

export { CURRENCY_PAIRS, WINDOW_SPEC };
