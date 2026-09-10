/**
 * Windowed rate history for the chart.
 *
 *   GET /api/rates/history?pair=usd_to_mxn&window=1D
 *
 * Returns ONE series — the published sell rate — plus the change across the window. Only the
 * sell side crosses the wire: a reconstructed point derives both sides from the same mid, so
 * publishing both would let anyone recover mid, and from mid the all-in spread. See
 * `lib/history.ts` for the full reasoning.
 *
 * Every failure mode returns a well-formed empty series rather than an error, because there is
 * a legitimate empty state the UI must render anyway: a corridor whose capture has not started
 * yet has no 1D points, and that is not a fault. `available: false` distinguishes "we have no
 * data" from "we have data and it is flat".
 */
import { cachedBridgeTriple, isPublishableEnvironment } from "@/lib/bridge";
import { isWindow, readSeries, WINDOWS } from "@/lib/history";
import {
  CURRENCY_PAIRS,
  codeFor,
  isPublishable,
  publishedPair,
  type CurrencyPair,
} from "@/lib/rates-math";
import { resolveSpreads } from "@/lib/spread";

function isPair(v: string): v is CurrencyPair {
  return (CURRENCY_PAIRS as readonly string[]).includes(v);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pairParam = url.searchParams.get("pair") ?? "";
  const windowParam = (url.searchParams.get("window") ?? "1D").toUpperCase();

  if (!isPair(pairParam)) {
    return Response.json(
      { error: "unknown_pair", allowed: CURRENCY_PAIRS },
      { status: 400 },
    );
  }
  if (!isWindow(windowParam)) {
    return Response.json({ error: "unknown_window", allowed: WINDOWS }, { status: 400 });
  }

  const spreads = await resolveSpreads();
  const spreadBps = spreads[pairParam]?.bps ?? null;

  // No established spread means no publishable rate, historical or live — the same rule the
  // live board follows. Publishing a line derived from a spread nobody configured would be
  // exactly the invented number this surface refuses to show.
  if (spreadBps == null) {
    return Response.json(
      { pair: pairParam, window: windowParam, available: false, points: [], spreadBps: null },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  // The live rate anchors a reconstructed series so the chart's last point equals the headline
  // number. Best-effort: if Bridge is unavailable the series is served unanchored rather than
  // not at all, and `anchorRatio: 1` tells the UI that happened.
  let liveSell: number | null = null;
  const apiKey = process.env.BRIDGE_API_KEY;
  if (apiKey && isPublishableEnvironment()) {
    const triple = await cachedBridgeTriple(codeFor(pairParam), apiKey);
    if (triple) {
      const published = publishedPair(triple, spreadBps);
      if (isPublishable(triple, published)) liveSell = published.sell;
    }
  }

  const series = await readSeries(pairParam, windowParam, spreadBps, liveSell);
  if (!series || series.points.length === 0) {
    return Response.json(
      {
        pair: pairParam,
        window: windowParam,
        available: false,
        points: [],
        spreadBps,
        reconstructedBefore: null,
        anchorRatio: 1,
        changeAbs: null,
        changePct: null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const first = series.points[0];
  const last = series.points[series.points.length - 1];
  const changeAbs = last.sell - first.sell;
  // A single point is a reading, not a change. Reporting 0% for it would render a confident
  // green "unchanged today" on a series with nothing to compare against.
  const comparable = series.points.length >= 2 && first.sell > 0;

  return Response.json(
    {
      pair: pairParam,
      window: windowParam,
      available: true,
      spreadBps,
      points: series.points,
      reconstructedBefore: series.reconstructedBefore,
      anchorRatio: series.anchorRatio,
      changeAbs: comparable ? changeAbs : null,
      changePct: comparable ? (changeAbs / first.sell) * 100 : null,
    },
    {
      // Intraday moves every 5 minutes; daily windows move once a day. A short shared cache is
      // enough to absorb a burst of tab-clicking without serving a visibly stale head.
      headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" },
    },
  );
}

export const dynamic = "force-dynamic";
