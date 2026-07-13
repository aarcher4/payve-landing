"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* NetworkCanvas (r2, Dakota grammar — docs/network-rebrand.md §9)     */
/* ------------------------------------------------------------------ */

type Corridor = { id: string; full: string; short: string; ccy: string; x: number; y: number };

const CORRIDOR_NODES: Corridor[] = [
  { id: "us", full: "United States", short: "US", ccy: "USD", x: 0.26, y: 0.3 },
  { id: "eu", full: "European Union", short: "EU", ccy: "EUR", x: 0.84, y: 0.22 },
  { id: "mx", full: "Mexico", short: "MX", ccy: "MXN", x: 0.13, y: 0.66 },
  { id: "co", full: "Colombia", short: "CO", ccy: "COP", x: 0.46, y: 0.8 },
  { id: "br", full: "Brazil", short: "BR", ccy: "BRL", x: 0.72, y: 0.66 },
];

const CORRIDOR_ARCS = [
  { a: "us", b: "mx", dur: 6.0, phase: 0.0 },
  { a: "us", b: "co", dur: 7.2, phase: 0.35 },
  { a: "us", b: "br", dur: 8.0, phase: 0.62 },
  { a: "us", b: "eu", dur: 6.8, phase: 0.18 },
  { a: "mx", b: "eu", dur: 9.0, phase: 0.8 },
];

/**
 * The corridor visualization: dotted sage arcs between boxed mono corridor
 * chips, sage-500 pulses traveling the arcs (accent only where money moves),
 * faint particle field for depth. 2D canvas, dpr-aware, rAF pauses
 * off-screen, reduced motion renders one static frame. This is the network
 * page's ONE ambient element.
 */
export function NetworkCanvas() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chipRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!scene || !canvas || !ctx) return;

    const byId = Object.fromEntries(CORRIDOR_NODES.map((n) => [n.id, n]));
    let W = 0;
    let H = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = scene.clientWidth;
      H = scene.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(scene);

    const px = (n: Corridor) => ({ x: n.x * W, y: n.y * H });
    const ctrl = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - Math.min(d * 0.3, H * 0.34) };
    };
    const qPoint = (
      a: { x: number; y: number },
      c: { x: number; y: number },
      b: { x: number; y: number },
      t: number,
    ) => ({
      x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
      y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
    });

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 0.9,
      a: 0.06 + Math.random() * 0.16,
      sp: 0.2 + Math.random() * 0.6,
      ph: Math.random() * Math.PI * 2,
    }));
    const hits: Record<string, boolean> = {};

    const draw = (tSec: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#A8C0B3";
      for (const p of particles) {
        const tw = 0.5 + 0.5 * Math.sin(tSec * p.sp + p.ph);
        ctx.globalAlpha = p.a * tw;
        const dx = Math.sin(tSec * 0.05 + p.ph) * 6;
        ctx.beginPath();
        ctx.arc(p.x * W + dx, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const arc of CORRIDOR_ARCS) {
        const a = px(byId[arc.a]);
        const b = px(byId[arc.b]);
        const c = ctrl(a, b);
        const steps = Math.max(24, Math.floor(Math.hypot(b.x - a.x, b.y - a.y) / 9));
        ctx.fillStyle = "#A8C0B3";
        for (let i = 1; i < steps; i++) {
          const t = i / steps;
          const p = qPoint(a, c, b, t);
          ctx.globalAlpha = 0.34 + 0.26 * Math.sin(t * Math.PI);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.15, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!reduced) {
        for (const arc of CORRIDOR_ARCS) {
          const a = px(byId[arc.a]);
          const b = px(byId[arc.b]);
          const c = ctrl(a, b);
          const cycle = (tSec / arc.dur + arc.phase) % 1;
          const fwd = Math.floor(tSec / arc.dur + arc.phase) % 2 === 0;
          const t = fwd ? cycle : 1 - cycle;
          for (let k = 5; k >= 0; k--) {
            const tt = Math.max(0, Math.min(1, t - k * 0.012 * (fwd ? 1 : -1)));
            const p = qPoint(a, c, b, tt);
            ctx.globalAlpha = k === 0 ? 0.95 : 0.36 - k * 0.05;
            ctx.fillStyle = "#6F8D7C";
            ctx.beginPath();
            ctx.arc(p.x, p.y, k === 0 ? 2.7 : 1.7, 0, Math.PI * 2);
            ctx.fill();
          }
          const dest = fwd ? arc.b : arc.a;
          if (cycle > 0.96 && !hits[dest]) {
            hits[dest] = true;
            const el = chipRefs.current[dest];
            el?.classList.add("chip-hit");
            setTimeout(() => {
              el?.classList.remove("chip-hit");
              hits[dest] = false;
            }, 600);
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf: number | null = null;
    let visible = true;
    const t0 = performance.now();
    const loop = (now: number) => {
      draw((now - t0) / 1000);
      raf = visible && !reduced ? requestAnimationFrame(loop) : null;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduced && raf === null) raf = requestAnimationFrame(loop);
      if (!visible && raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    });
    io.observe(scene);
    if (reduced) draw(3.7);
    else raf = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      io.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={sceneRef}
      className="relative h-[300px] overflow-hidden border-y border-hairline sm:h-[400px]"
      role="img"
      aria-label="The Payve Network: payments traveling between the United States, Mexico, Colombia, Brazil, and the European Union, each settled in local currency."
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      {CORRIDOR_NODES.map((n) => (
        <div
          key={n.id}
          ref={(el) => {
            chipRefs.current[n.id] = el;
          }}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded border border-hairline-2 bg-paper-elev px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-ink-1 shadow-elev-1 sm:px-2.5 sm:py-1.5 sm:text-[10.5px]"
          style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%` }}
        >
          <span className="chip-dot h-[5px] w-[5px] rounded-full bg-sage-500 transition-shadow duration-300" aria-hidden />
          <span className="hidden sm:inline">{n.full}</span>
          <span className="sm:hidden">{n.short}</span>
          <span className="font-medium text-ink-3">{n.ccy}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Network-rebrand components (docs/network-rebrand.md §8).
 * - FlowLine: the ONE ambient element on a page — a thin sage path with a
 *   traveling pulse (money visibly moving). Decorative, aria-hidden.
 * - CascadeFlow: enroll → suppliers paid → a supplier enrolls → its own
 *   suppliers unlock. The network page's signature demonstration.
 * - CorridorStrip: the five corridors, uniform, type-led (icon diet).
 * Motion grammar per docs/motion-system.md: reveal-once, reduced motion
 * renders the final state statically, accent only where money moves.
 */

function useSteps(stepCount: number, interval: number, active: boolean) {
  const reduced = useReducedMotion() ?? false;
  const [step, setStep] = useState(reduced ? stepCount : 0);
  useEffect(() => {
    if (reduced || !active) return;
    const id = setInterval(() => {
      setStep((s) => (s >= stepCount ? 0 : s + 1));
    }, interval);
    return () => clearInterval(id);
  }, [stepCount, interval, active, reduced]);
  return step;
}

/* ------------------------------------------------------------------ */
/* FlowLine                                                            */
/* ------------------------------------------------------------------ */

export function FlowLine({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <svg
      className={className}
      viewBox="0 0 1200 48"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        id="flowline-path"
        d="M0 40 C 240 40, 320 8, 600 8 S 960 40, 1200 40"
        stroke="var(--sage-200)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      {!reduced && (
        <circle r="3" fill="var(--sage-500)">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M0 40 C 240 40, 320 8, 600 8 S 960 40, 1200 40"
          />
        </circle>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CascadeFlow                                                         */
/* ------------------------------------------------------------------ */

type CascadeNode = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  tier: 1 | 2 | 3;
};

const NODES: CascadeNode[] = [
  { id: "you", label: "Your company", sub: "Enrolled", x: 40, y: 130, tier: 1 },
  { id: "casa", label: "Casa de Tortillas", sub: "MX · paid today", x: 300, y: 40, tier: 2 },
  { id: "quindio", label: "Café del Quindío", sub: "CO · paid today", x: 300, y: 130, tier: 2 },
  { id: "maple", label: "Pacific NW Maple", sub: "US · paid today", x: 300, y: 220, tier: 2 },
  { id: "harina", label: "Harina del Bajío", sub: "MX · paid today", x: 560, y: 40, tier: 3 },
  { id: "empaques", label: "Empaques Anáhuac", sub: "MX · paid today", x: 560, y: 130, tier: 3 },
];

const EDGES: Array<{ from: string; to: string; appearAt: number }> = [
  { from: "you", to: "casa", appearAt: 1 },
  { from: "you", to: "quindio", appearAt: 1 },
  { from: "you", to: "maple", appearAt: 1 },
  { from: "casa", to: "harina", appearAt: 3 },
  { from: "casa", to: "empaques", appearAt: 3 },
];

/** Steps: 0 you enroll · 1 payment lines reach your suppliers · 2 a supplier
 *  enrolls · 3 its own suppliers unlock · 4 hold. */
export function CascadeFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const step = useSteps(4, 1800, inView);
  const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));

  const nodeActive = (n: CascadeNode) =>
    n.tier === 1 ? step >= 0 : n.tier === 2 ? step >= 1 : step >= 3;
  const nodeEnrolled = (n: CascadeNode) =>
    n.tier === 1 ? true : n.id === "casa" ? step >= 2 : false;

  return (
    <div
      ref={ref}
      className="rounded-lg border border-hairline bg-paper-elev shadow-elev-3 overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-hairline bg-paper-2 px-4 py-2.5">
        <span className="text-xs font-semibold text-ink-2">The Payve Network</span>
        <span className="flex items-center gap-1.5 text-xs text-ink-3">
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-sage-400 opacity-50" />
            <span className="h-1.5 w-1.5 rounded-full bg-sage-600" />
          </span>
          {step < 1 ? "Enrolled" : step < 2 ? "Suppliers unlocked" : "Network growing"}
        </span>
      </div>

      {/* Desktop/tablet: the cascade as a left-to-right diagram */}
      <div className="hidden px-4 py-5 sm:block">
        <svg viewBox="0 0 700 260" className="w-full" role="img" aria-label="When your company enrolls, your suppliers are paid instantly; when a supplier enrolls, its own suppliers unlock too.">
          {EDGES.map((e) => {
            const a = nodeById[e.from];
            const b = nodeById[e.to];
            const on = step >= e.appearAt;
            return (
              <motion.path
                key={`${e.from}-${e.to}`}
                d={`M ${a.x + 118} ${a.y} C ${a.x + 178} ${a.y}, ${b.x - 60} ${b.y}, ${b.x} ${b.y}`}
                stroke={on ? "var(--sage-500)" : "var(--hairline)"}
                strokeWidth="1.25"
                fill="none"
                initial={false}
                animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              />
            );
          })}
          {NODES.map((n) => {
            const active = nodeActive(n);
            const enrolled = nodeEnrolled(n);
            return (
              <motion.g
                key={n.id}
                initial={false}
                animate={{ opacity: active ? 1 : 0.25 }}
                transition={{ duration: 0.5 }}
              >
                <rect
                  x={n.x}
                  y={n.y - 26}
                  width="118"
                  height="52"
                  rx="4"
                  fill={enrolled ? "var(--sage-50)" : "var(--paper-elev)"}
                  stroke={enrolled ? "var(--sage-500)" : "var(--hairline-2)"}
                  strokeWidth="1"
                />
                <text
                  x={n.x + 11}
                  y={n.y - 5}
                  fontSize="12"
                  fontWeight="600"
                  fill="var(--ink-1)"
                >
                  {n.label}
                </text>
                <text
                  x={n.x + 11}
                  y={n.y + 13}
                  fontSize="9"
                  fontFamily="var(--font-geist-mono), monospace"
                  letterSpacing="0.04em"
                  fill={active ? "var(--sage-600)" : "var(--ink-3)"}
                >
                  {enrolled && n.tier !== 1 ? "ENROLLED · PAYING ITS OWN" : n.sub.toUpperCase()}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Mobile: the same story as a stacked tree (SVG labels don't survive 390px) */}
      <ul className="space-y-2 px-4 py-5 sm:hidden">
        {NODES.map((n) => {
          const active = nodeActive(n);
          const enrolled = nodeEnrolled(n);
          return (
            <motion.li
              key={n.id}
              initial={false}
              animate={{ opacity: active ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
              className={
                n.tier === 1
                  ? ""
                  : n.tier === 2
                    ? "ml-4 border-l border-hairline pl-3"
                    : "ml-10 border-l border-hairline pl-3"
              }
            >
              <span
                className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2 ${
                  enrolled ? "border-sage-500 bg-sage-50" : "border-hairline-2 bg-paper-elev"
                }`}
              >
                <span className="min-w-0 truncate text-sm font-semibold text-ink-1">{n.label}</span>
                <span className={`shrink-0 font-mono text-[9.5px] uppercase tracking-wide ${active ? "text-sage-600" : "text-ink-3"}`}>
                  {enrolled && n.tier !== 1 ? "Enrolled · paying its own" : n.sub}
                </span>
              </span>
            </motion.li>
          );
        })}
      </ul>

      <div className="border-t border-hairline bg-paper px-4 py-2.5 text-xs text-ink-3">
        Suppliers enroll at no cost. Each one strengthens the network you trade in.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CorridorStrip                                                       */
/* ------------------------------------------------------------------ */

const CORRIDORS = [
  { region: "United States", currency: "USD" },
  { region: "Mexico", currency: "MXN" },
  { region: "Colombia", currency: "COP" },
  { region: "Brazil", currency: "BRL" },
  { region: "European Union", currency: "EUR" },
];

export function CorridorStrip() {
  return (
    <ul className="grid grid-cols-1 divide-y divide-hairline border-y border-hairline sm:grid-cols-5 sm:divide-x sm:divide-y-0">
      {CORRIDORS.map((c) => (
        <li key={c.region} className="flex flex-row items-center justify-between gap-1 px-5 py-4 sm:flex-col sm:items-start sm:justify-start sm:py-6">
          <span className="text-sm font-semibold text-ink-1">{c.region}</span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-ink-3">
            <Check className="h-3 w-3 text-sage-600" aria-hidden />
            {c.currency} · local settlement
          </span>
        </li>
      ))}
    </ul>
  );
}
