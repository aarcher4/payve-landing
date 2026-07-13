"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* NetworkCanvas (r4: particle globe — docs/network-rebrand.md §9)     */
/* ------------------------------------------------------------------ */

type GlobeAnchor = { id: string; full: string; short: string; ccy: string; lat: number; lon: number };

const GLOBE_ANCHORS: GlobeAnchor[] = [
  { id: "us", full: "United States", short: "US", ccy: "USD", lat: 38, lon: -97 },
  { id: "mx", full: "Mexico", short: "MX", ccy: "MXN", lat: 23, lon: -102 },
  { id: "co", full: "Colombia", short: "CO", ccy: "COP", lat: 4, lon: -74 },
  { id: "br", full: "Brazil", short: "BR", ccy: "BRL", lat: -4, lon: -55 },
  { id: "eu", full: "European Union", short: "EU", ccy: "EUR", lat: 50, lon: 10 },
];

const GLOBE_ARCS = [
  { a: "us", b: "mx", dur: 6.0, phase: 0.0 },
  { a: "us", b: "co", dur: 7.2, phase: 0.35 },
  { a: "us", b: "br", dur: 8.2, phase: 0.62 },
  { a: "us", b: "eu", dur: 7.0, phase: 0.18 },
  { a: "mx", b: "eu", dur: 9.2, phase: 0.8 },
  { a: "co", b: "eu", dur: 8.6, phase: 0.1 },
  { a: "br", b: "eu", dur: 7.6, phase: 0.48 },
  { a: "mx", b: "co", dur: 5.6, phase: 0.72 },
  { a: "co", b: "br", dur: 6.4, phase: 0.26 },
];

const TAU = Math.PI * 2;
const GLOBE = {
  dots: 1300,
  tilt: 0.3, // viewer looks slightly down at the globe (equator lifts into frame)
  // r5: the earth is STATIC (Alex) — a fixed mid-Atlantic composition puts all
  // five countries on the visible hemisphere so payment traffic never hides.
  // Rotation caused dead air: ~40% of each revolution had every anchor back-side.
  wStatic: -2.269, // lon ≈ -40° centered front
  staticT: 0, // time is only consumed by the pulses now
};

type V3 = { x: number; y: number; z: number };

/**
 * "Send it. It's there." — the upper hemisphere of a rotating particle globe
 * rising from the bottom of the band (proto: design-context/network-canvas-proto.html,
 * critique passes in .goal-loop/REVIEW.md round 6). Boxed mono country chips ride
 * the rotation; dotted payment arcs slerp over the surface with sage-500 pulses
 * (accent only where money moves). 2D canvas, dpr-aware, rAF pauses off-screen,
 * reduced motion renders one static composed frame. The page's ONE ambient element.
 * Fills its positioned parent (absolute inset-0); the parent supplies height + heading.
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

    const latlon = (lat: number, lon: number): V3 => {
      const la = (lat * Math.PI) / 180;
      const lo = (lon * Math.PI) / 180;
      return { x: Math.cos(la) * Math.cos(lo), y: -Math.sin(la), z: Math.cos(la) * Math.sin(lo) };
    };
    const hash = (i: number, k: number) => {
      const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
      return v - Math.floor(v);
    };
    const DOTS = Array.from({ length: GLOBE.dots }, (_, i) => {
      const y0 = 1 - (i / (GLOBE.dots - 1)) * 2;
      const y = Math.max(-1, Math.min(1, y0 + (hash(i, 1) - 0.5) * 0.045));
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = i * 2.399963229728653 + (hash(i, 2) - 0.5) * 0.14;
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r, sz: 0.78 + hash(i, 3) * 0.42 };
    });
    const A: Record<string, V3> = Object.fromEntries(
      GLOBE_ANCHORS.map((a) => [a.id, latlon(a.lat, a.lon)]),
    );

    const ct = Math.cos(GLOBE.tilt);
    const st = Math.sin(GLOBE.tilt);
    const rotate = (p: V3, w: number): V3 => {
      const cw = Math.cos(w);
      const sw = Math.sin(w);
      const x = p.x * cw + p.z * sw;
      const z = -p.x * sw + p.z * cw;
      return { x, y: p.y * ct - z * st, z: p.y * st + z * ct };
    };
    const slerp = (a: V3, b: V3, t: number): V3 => {
      const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
      const th = Math.acos(dot);
      if (th < 1e-4) return { ...a };
      const s = Math.sin(th);
      const ka = Math.sin((1 - t) * th) / s;
      const kb = Math.sin(t * th) / s;
      return { x: a.x * ka + b.x * kb, y: a.y * ka + b.y * kb, z: a.z * ka + b.z * kb };
    };

    let W = 0;
    let H = 0;
    let R = 0;
    let CX = 0;
    let CY = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = scene.clientWidth;
      H = scene.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(Math.max(W * 0.33, 210), H * 0.72);
      CX = W / 2;
      CY = H + R * 0.05; // upper hemisphere rises from the bottom edge (r5: raised so Brazil clears the crop)
      if (reduced) draw(GLOBE.staticT);
    };
    const proj = (p: V3) => ({ x: CX + p.x * R, y: CY + p.y * R, z: p.z });

    const hits: Record<string, boolean> = {};
    function draw(tSec: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const w = GLOBE.wStatic;

      // atmosphere glow
      const g = ctx.createRadialGradient(CX, CY, R * 0.2, CX, CY, R * 1.18);
      g.addColorStop(0, "rgba(238,243,239,0.5)");
      g.addColorStop(0.7, "rgba(238,243,239,0.18)");
      g.addColorStop(1, "rgba(238,243,239,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(CX, CY, R * 1.18, 0, TAU);
      ctx.fill();

      // sphere dots, back-to-front
      const pts: Array<{ x: number; y: number; z: number; sz: number }> = [];
      for (const d of DOTS) {
        const q = proj(rotate(d, w));
        if (q.y < H + 8) pts.push({ ...q, sz: d.sz });
      }
      pts.sort((a, b) => a.z - b.z);
      for (const q of pts) {
        const f = Math.max(0, q.z);
        ctx.globalAlpha = 0.1 + 0.72 * Math.pow(f, 1.35);
        ctx.fillStyle = f > 0.6 ? "#506B60" : "#A8C0B3";
        ctx.beginPath();
        ctx.arc(q.x, q.y, (0.8 + 1.3 * f) * q.sz, 0, TAU);
        ctx.fill();
      }

      // limb
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = "#C5D5CC";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, TAU);
      ctx.stroke();

      // surface arcs + pulses
      for (const arc of GLOBE_ARCS) {
        const a = A[arc.a];
        const b = A[arc.b];
        const steps = 44;
        for (let i = 1; i < steps; i++) {
          const t = i / steps;
          const s = slerp(a, b, t);
          const lift = 1 + 0.17 * Math.sin(Math.PI * t);
          const q = proj(rotate({ x: s.x * lift, y: s.y * lift, z: s.z * lift }, w));
          if (q.z < -0.05 || q.y > H + 4) continue;
          ctx.globalAlpha =
            (0.28 + 0.42 * Math.max(0, q.z)) * (0.55 + 0.45 * Math.sin(Math.PI * t));
          ctx.fillStyle = "#A8C0B3";
          ctx.beginPath();
          ctx.arc(q.x, q.y, 1.3, 0, TAU);
          ctx.fill();
        }
        if (!reduced) {
          const cycle = (tSec / arc.dur + arc.phase) % 1;
          const fwd = Math.floor(tSec / arc.dur + arc.phase) % 2 === 0;
          const t = fwd ? cycle : 1 - cycle;
          for (let k = 5; k >= 0; k--) {
            const tt = Math.max(0.02, Math.min(0.98, t - k * 0.014 * (fwd ? 1 : -1)));
            const s = slerp(a, b, tt);
            const lift = 1 + 0.17 * Math.sin(Math.PI * tt);
            const q = proj(rotate({ x: s.x * lift, y: s.y * lift, z: s.z * lift }, w));
            if (q.z < -0.02 || q.y > H + 4) continue;
            ctx.globalAlpha =
              (k === 0 ? 0.95 : 0.36 - k * 0.05) * (0.35 + 0.65 * Math.max(0, q.z));
            ctx.fillStyle = "#6F8D7C";
            ctx.beginPath();
            ctx.arc(q.x, q.y, k === 0 ? 2.6 : 1.6, 0, TAU);
            ctx.fill();
          }
          const destId = fwd ? arc.b : arc.a;
          if (cycle > 0.96 && !hits[destId]) {
            hits[destId] = true;
            const el = chipRefs.current[destId];
            el?.classList.add("chip-hit");
            setTimeout(() => {
              el?.classList.remove("chip-hit");
              hits[destId] = false;
            }, 600);
          }
        }
      }
      ctx.globalAlpha = 1;

      // chips ride the globe
      for (const a of GLOBE_ANCHORS) {
        const q = proj(rotate(A[a.id], w));
        const el = chipRefs.current[a.id];
        if (!el) continue;
        const vis = Math.max(0, Math.min(1, (q.z + 0.25) / 0.5));
        el.style.opacity = String(q.y > H - 6 ? 0 : vis);
        el.style.transform = `translate(${q.x}px, ${q.y}px) translate(-50%, -50%) scale(${
          0.82 + 0.18 * Math.max(0, q.z)
        })`;
        el.style.zIndex = q.z > 0 ? "3" : "1";
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(scene);

    let raf: number | null = null;
    let visible = true;
    const t0 = performance.now();
    const loop = (now: number) => {
      draw((now - t0) / 1000 + GLOBE.staticT);
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
    if (reduced) draw(GLOBE.staticT);
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
      className="absolute inset-0"
      role="img"
      aria-label="A globe of the Payve Network: payments traveling between the United States, Mexico, Colombia, Brazil, and the European Union, each settled in local currency."
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      {GLOBE_ANCHORS.map((n) => (
        <div
          key={n.id}
          ref={(el) => {
            chipRefs.current[n.id] = el;
          }}
          className="absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded border border-hairline-2 bg-paper-elev px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-ink-1 opacity-0 shadow-elev-1 will-change-transform sm:px-2.5 sm:py-1.5 sm:text-[10.5px]"
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
