"use client";

/**
 * The rate chart: a hand-rolled SVG area chart, zero chart dependencies.
 *
 * Anatomy follows the payments app's BalanceChart, which has been in production on the buyer
 * and supplier dashboards: ResizeObserver-driven width, monotone-cubic line, gradient area,
 * `useId()` gradient ids so two charts on a page cannot collide, and a single transparent rect
 * owning all pointer events with `touchAction: "pan-y"` so a vertical swipe still scrolls the
 * page on a phone.
 *
 * The curve is monotone cubic specifically so it cannot overshoot: on an FX chart, an
 * overshoot is a high the market never printed.
 */

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  areaPath,
  formatRate,
  formatTick,
  monotonePath,
  nearestIndex,
  niceTicks,
  padDomain,
  type PlotPoint,
} from "@/lib/chart";

export interface RatePoint {
  t: number;
  sell: number;
  source: "bridge" | "ecb" | "banrep";
}

interface RateChartProps {
  points: RatePoint[];
  code: string;
  window: string;
  loading?: boolean;
  height?: number;
  /** Everything at or before this epoch-ms is reconstructed from an official daily close. */
  reconstructedBefore?: number | null;
}

const PAD = { top: 16, right: 8, bottom: 26, left: 52 };

export function RateChart({
  points,
  code,
  window: win,
  loading = false,
  height = 320,
  reconstructedBefore = null,
}: RateChartProps) {
  const gradientId = useId();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(720);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const plot = useMemo(() => {
    if (points.length < 2) return null;
    const xs = points.map((p) => p.t);
    const ys = points.map((p) => p.sell);
    const [lo, hi] = padDomain(Math.min(...ys), Math.max(...ys));
    const t0 = xs[0]!;
    const t1 = xs[xs.length - 1]!;
    const innerW = Math.max(1, width - PAD.left - PAD.right);
    const innerH = Math.max(1, height - PAD.top - PAD.bottom);
    const sx = (t: number) => PAD.left + ((t - t0) / Math.max(1, t1 - t0)) * innerW;
    const sy = (v: number) => PAD.top + (1 - (v - lo) / Math.max(1e-12, hi - lo)) * innerH;
    const pts: PlotPoint[] = points.map((p) => ({ x: sx(p.t), y: sy(p.sell) }));
    const line = monotonePath(pts);
    const ticks = niceTicks(lo, hi, 4).filter((v) => v >= lo && v <= hi);
    return {
      pts,
      line,
      area: areaPath(line, pts[0]!.x, pts[pts.length - 1]!.x, PAD.top + innerH),
      ticks,
      tickStep: ticks.length > 1 ? Math.abs(ticks[1]! - ticks[0]!) : 0,
      sy,
      xs: pts.map((p) => p.x),
      innerH,
    };
  }, [points, width, height]);

  if (loading) {
    return (
      <div
        ref={wrapRef}
        style={{ height }}
        className="w-full animate-pulse rounded-lg bg-r-muted"
        aria-hidden
      />
    );
  }

  // Fewer than two points is not a flat line, it is no line. Drawing one would imply a
  // stability the data does not claim.
  if (!plot) {
    return (
      <div
        ref={wrapRef}
        style={{ height }}
        className="flex w-full items-center justify-center rounded-lg border border-r-border bg-r-card px-6 text-center"
      >
        <p className="max-w-sm text-sm text-r-muted-fg">
          No rate history for this window yet. Intraday history begins when recording starts, and
          fills in from there.
        </p>
      </div>
    );
  }

  const active = hover != null ? points[hover] : null;
  const last = points[points.length - 1]!;
  const spansDays =
    new Date(points[0]!.t).toDateString() !== new Date(last.t).toDateString();

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`${code} rate over ${win}`}
        style={{ display: "block", touchAction: "pan-y" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(var(--r-primary))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(var(--r-primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {plot.ticks.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={plot.sy(v)}
              y2={plot.sy(v)}
              stroke="oklch(var(--r-border))"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            <text
              x={PAD.left - 10}
              y={plot.sy(v) + 4}
              textAnchor="end"
              className="r-num"
              fontSize="11"
              fill="oklch(var(--r-subtle))"
            >
              {formatTick(v, code, plot.tickStep)}
            </text>
          </g>
        ))}

        <path d={plot.area} fill={`url(#${gradientId})`} />
        <path
          d={plot.line}
          fill="none"
          stroke="oklch(var(--r-primary))"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Terminal dot: the current rate, the point the eye lands on. */}
        <circle
          cx={plot.pts[plot.pts.length - 1]!.x}
          cy={plot.pts[plot.pts.length - 1]!.y}
          r="4"
          fill="oklch(var(--r-primary))"
        />

        {active && hover != null && (
          <>
            <line
              x1={plot.xs[hover]}
              x2={plot.xs[hover]}
              y1={PAD.top}
              y2={PAD.top + plot.innerH}
              stroke="oklch(var(--r-border))"
              strokeWidth="1"
            />
            <circle
              cx={plot.xs[hover]}
              cy={plot.pts[hover]!.y}
              r="4"
              fill="oklch(var(--r-card))"
              stroke="oklch(var(--r-primary))"
              strokeWidth="2"
            />
          </>
        )}

        {/*
          Endpoint labels. A 1D window is a rolling 24 hours, so it usually straddles midnight:
          bare clock times then render as "09:40 ... 09:25" and read as though time runs
          backwards across the chart. When the two ends fall on different calendar days the
          label carries the date to disambiguate.
        */}
        <text
          x={PAD.left}
          y={height - 8}
          fontSize="11"
          fill="oklch(var(--r-subtle))"
          className="r-num"
        >
          {axisLabel(points[0]!.t, win, spansDays)}
        </text>
        <text
          x={width - PAD.right}
          y={height - 8}
          textAnchor="end"
          fontSize="11"
          fill="oklch(var(--r-subtle))"
          className="r-num"
        >
          {axisLabel(last.t, win, spansDays)}
        </text>

        {/* One transparent rect owns every pointer event: hit-testing each point would drop
            the gaps between them and make the crosshair flicker. */}
        <rect
          x={PAD.left}
          y={PAD.top}
          width={Math.max(1, width - PAD.left - PAD.right)}
          height={plot.innerH}
          fill="transparent"
          onPointerMove={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            setHover(nearestIndex(plot.xs, e.clientX - box.left + PAD.left));
          }}
          onPointerLeave={() => setHover(null)}
        />
      </svg>

      {active && hover != null && (
        <div
          className="pointer-events-none absolute rounded-md border border-r-border bg-r-card px-2.5 py-1.5 text-xs shadow-none"
          style={{
            left: plot.xs[hover]! > width / 2 ? undefined : plot.xs[hover]! + 12,
            right: plot.xs[hover]! > width / 2 ? width - plot.xs[hover]! + 12 : undefined,
            top: PAD.top,
          }}
        >
          <div className="r-num font-medium text-r-fg">
            {formatRate(active.sell, code)} {code}
          </div>
          <div className="r-num text-r-subtle">{tooltipDate(active.t, win)}</div>
          {active.source !== "bridge" && (
            <div className="mt-0.5 text-r-subtle">Indexed from the official close</div>
          )}
        </div>
      )}

      {reconstructedBefore != null && (
        <p className="mt-3 text-xs leading-relaxed text-r-subtle">
          History before we began recording is reconstructed from official daily closes and
          indexed to today&apos;s live rate, so the shape is the market&apos;s and the latest
          point is ours. Live quotes come from our payment rail.
        </p>
      )}
    </div>
  );
}

function axisLabel(t: number, win: string, spansDays: boolean): string {
  const d = new Date(t);
  if (win === "1D") {
    const time = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    if (!spansDays) return time;
    return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} ${time}`;
  }
  if (win === "1W" || win === "1M") {
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function tooltipDate(t: number, win: string): string {
  const d = new Date(t);
  if (win === "1D" || win === "1W") {
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
