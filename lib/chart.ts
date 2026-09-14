/**
 * Pure chart math for the hand-rolled SVG rate chart. No React, no DOM.
 *
 * Ported from the payments app's `client/src/lib/chart.ts`, which has been drawing the buyer
 * and supplier balance charts in production. Copied rather than imported because this is a
 * different repository; the money-specific parts (a cents floor on the domain, compact dollar
 * formatting) are dropped, since a rate is a multiplier and lives in a much narrower band.
 *
 * TRUTH INVARIANT: the line uses MONOTONE cubic interpolation (Fritsch-Carlson), which cannot
 * overshoot the data — the drawn curve can never imply a rate the market never printed. Do not
 * swap in Catmull-Rom or naive beziers; they overshoot on direction changes, which on an FX
 * chart means inventing a high that never happened.
 */

export interface PlotPoint {
  x: number;
  y: number;
}

/**
 * Pad a raw [min, max] domain outward so the line does not kiss the plot edges.
 *
 * A flat series gets a band of ±0.05% of the value rather than the payments app's fixed cents
 * floor: rates sit anywhere from 0.73 (GBP) to 3,100 (COP), so any absolute floor would be
 * invisible on one and enormous on the other.
 */
export function padDomain(min: number, max: number, frac = 0.08): [number, number] {
  if (min === max) {
    const pad = Math.max(Math.abs(min) * 0.0005, Number.EPSILON);
    return [min - pad, max + pad];
  }
  const pad = (max - min) * frac;
  return [min - pad, max + pad];
}

/** Snap a raw step to the nearest "nice" value: 1/2/2.5/5 x 10^n. */
function niceStep(raw: number): number {
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const frac = raw / mag;
  let nice: number;
  if (frac <= 1) nice = 1;
  else if (frac <= 2) nice = 2;
  else if (frac <= 2.5) nice = 2.5;
  else if (frac <= 5) nice = 5;
  else nice = 10;
  return nice * mag;
}

/** Gridline values inside [lo, hi], evenly spaced on a nice step, ascending. */
export function niceTicks(lo: number, hi: number, count = 4): number[] {
  if (!(hi > lo)) return [lo];
  const step = niceStep((hi - lo) / count);
  const ticks: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) {
    ticks.push(Math.abs(t) < 1e-12 ? 0 : t);
  }
  return ticks;
}

/**
 * Monotone cubic interpolation (Fritsch-Carlson, 1980) emitted as an SVG path.
 * Tangents are clamped so the curve stays within the y-range of each segment's endpoints.
 */
export function monotonePath(points: PlotPoint[]): string {
  const n = points.length;
  if (n < 2) return "";

  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i]!;
    const p1 = points[i + 1]!;
    dx.push(p1.x - p0.x);
    m.push((p1.y - p0.y) / (p1.x - p0.x));
  }

  const t: number[] = new Array<number>(n).fill(0);
  t[0] = m[0]!;
  t[n - 1] = m[n - 2]!;
  for (let i = 1; i < n - 1; i++) {
    const mPrev = m[i - 1]!;
    const mNext = m[i]!;
    // Direction change (local extremum) or flat segment -> tangent 0.
    t[i] = mPrev * mNext <= 0 ? 0 : (mPrev + mNext) / 2;
  }

  // Clamp so no segment overshoots (alpha^2 + beta^2 <= 9).
  for (let i = 0; i < n - 1; i++) {
    const mi = m[i]!;
    if (mi === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i]! / mi;
    const b = t[i + 1]! / mi;
    const s = a * a + b * b;
    if (s > 9) {
      const scale = 3 / Math.sqrt(s);
      t[i] = scale * a * mi;
      t[i + 1] = scale * b * mi;
    }
  }

  const f = (v: number) => Number(v.toFixed(2));
  const first = points[0]!;
  let d = `M ${f(first.x)} ${f(first.y)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i]!;
    const p1 = points[i + 1]!;
    const h = dx[i]! / 3;
    d += ` C ${f(p0.x + h)} ${f(p0.y + h * t[i]!)} ${f(p1.x - h)} ${f(p1.y - h * t[i + 1]!)} ${f(p1.x)} ${f(p1.y)}`;
  }
  return d;
}

/** Close a line path down to the baseline for the gradient area fill. */
export function areaPath(linePath: string, x0: number, x1: number, yBase: number): string {
  if (!linePath) return "";
  const f = (v: number) => Number(v.toFixed(2));
  return `${linePath} L ${f(x1)} ${f(yBase)} L ${f(x0)} ${f(yBase)} Z`;
}

/** Index of the plotted x nearest the pointer, clamped to [0, n-1]. */
export function nearestIndex(xs: number[], px: number): number {
  const n = xs.length;
  if (n === 0) return -1;
  if (n === 1) return 0;
  const x0 = xs[0]!;
  const step = xs[1]! - x0;
  if (step > 0) {
    const i = Math.round((px - x0) / step);
    return Math.max(0, Math.min(n - 1, i));
  }
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < n; i++) {
    const d = Math.abs(xs[i]! - px);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

/**
 * Decimal places for a rate. COP prints at 2 (it is in the thousands, so the fourth decimal is
 * noise); everything else at 4, which is where FX quotes actually move.
 */
export function rateDecimals(code: string): number {
  return code === "COP" ? 2 : 4;
}

export function formatRate(value: number, code: string): string {
  const dp = rateDecimals(code);
  return value.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

/**
 * Decimal places for an AXIS TICK, chosen from the gap between ticks rather than from the
 * currency.
 *
 * The quote wants full precision — that is the number being agreed. An axis does not: over a
 * year MXN ticks land 0.1 apart, and printing them at the quote's 4 places gives "16.9000",
 * two dead zeros of noise on every gridline. Enough places to tell adjacent ticks apart, never
 * more than the quote itself, and at least 2 for a sub-100 rate so the column stays aligned.
 */
export function tickDecimals(step: number, code: string, magnitude: number): number {
  const max = rateDecimals(code);
  if (!(step > 0)) return max;
  const needed = Math.ceil(-Math.log10(step));
  const floor = magnitude < 100 ? 2 : 0;
  return Math.max(floor, Math.min(max, Math.max(0, needed)));
}

export function formatTick(value: number, code: string, step: number): string {
  const dp = tickDecimals(step, code, Math.abs(value));
  return value.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
}
