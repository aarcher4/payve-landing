# Payve marketing site motion system

Distilled 2026-07-06 from live Playwright walks of mercury.com, ramp.com, happyrobot.ai, and giga.ai (DOM inspection + multi-frame captures), reconciled with the product app's motion tokens (`payve-fintech/design-context/motion.md`). This document gates the homepage build: every animated section names which pattern below it uses.

## What the reference sites actually do

### Mercury
- **Stack:** no GSAP/Lenis/framer on page. Tailwind utility classes (`motion-safe:opacity-0`, `translate-y-fadeIn`, `animate-container`) + IntersectionObserver. Six muted UI **videos** that play when scrolled into view (autoplay off, JS-triggered), plus an animated film-grain noise layer (`steps(1)` 0.2s loop).
- **Feel:** long, confident easing. Measured curves: `cubic-bezier(0.76, 0, 0.24, 1)` at 0.6 to 0.8s for section transitions, opacity+blur fades (`fadeOutBlur`), tab swaps at 0.3s.
- **Product tour:** dark full-bleed section, left accordion of product areas, right side plays the matching UI video with an animated cursor. One module expanded at a time.
- **Hero:** cinematic still landscape with type over it; the compliance line sits at the hero's bottom edge as a designed element.

### Ramp
- **Stack:** 7 live canvases + videos; no visible framework globals. The page is **always alive**: a real-time counter chip above the H1 ("US corporate payments processed by Ramp" ticking at the 7th decimal), and a bottom ticker strip cycling live-style metrics ("agents at work today", receipts processed, invoices processed). Confirmed by frame diffing 1.5s apart.
- **Hero:** benefit headline + email capture; below it an animated tableau of a card and floating work artifacts labeled with in-progress agent states ("Analyzing receipt", "Matching...", "Checking policy"). The product is depicted *working*, not posed.
- **Storytelling:** a "Systems that never spoke" chaos-collage section: disconnected receipts, spreadsheets, error forms, policy PDFs, unread-mail badges, connected by dashed lines. Problem rendered as a scene, then the product resolves it.
- **Positioning echo:** "One platform for the agentic era."

### HappyRobot
- **Stack:** one full-bleed ambient **looping video hero** (`HeroLoop` mp4, muted, autoplay), serif display type over near-black. Almost no scroll trickery; the motion budget is spent on the hero loop.
- **Structure:** manifesto interstitial (three serif lines on navy), numbered 01/02/03 concept rows, tracked-uppercase eyebrow labels with section color alternation (navy, paper, cream). Single gated CTA ("Book a demo") everywhere.

### Giga
- **Stack:** 3 videos, no canvas. Atmospheric landscape hero (dawn mountains) with serif display type, pill announcement chip above the H1, single rounded CTA.
- **Product presentation:** dark sections where **product UI panels float over atmospheric photography** inside cards; embedded product preview video (`hero-scout-preview.mp4`, autoplay loop). Eyebrow chips are small mono uppercase with a colored dot ("● SMART SUGGESTIONS"). Three-column icon feature strips.
- This is the closest model to Payve's chosen blend (product UI + cinematic real world).

## The shared grammar

1. Reveals are **opacity + small translate-y (16-32px), 0.5-0.8s, strong ease-out**, staggered ~80-120ms per sibling, triggered once via IntersectionObserver. Nobody re-animates on scroll-up.
2. The hero carries the motion budget: an ambient loop (video or canvas) that runs forever. Section reveals are quiet by comparison.
3. Product UI is shown **moving** (video or staged animation with in-progress agent states), never as a dead screenshot.
4. "Alive" indicators (tickers, counters, status labels) signal that agents are working right now.
5. Serif-over-atmosphere is the agentic-AI hero convention (HappyRobot, Giga); fintechs use product-first heroes (Mercury video, Ramp tableau). Payve's blend: atmosphere + working product UI.
6. `motion-safe:`/reduced-motion discipline throughout (Mercury literally ships `motion-safe:` classes).

## Payve motion vocabulary (the rules for this repo)

The product app's tokens stay authoritative for in-app feel; the marketing site extends the same philosophy with a slower, theatrical tier. Durations live as CSS vars in `globals.css` when implemented.

| Token | Value | Use |
|---|---|---|
| `--m-fast` | 150ms | hovers, nav dropdowns, link underlines |
| `--m-base` | 300ms | tab swaps, small UI state changes inside demos |
| `--m-reveal` | 600ms | scroll reveals (opacity + 24px translate-y) |
| `--m-scene` | 800ms | section-scale transitions, hero content entrance |
| `--m-ease` | cubic-bezier(0.2, 0.8, 0.2, 1) | default (same as app `--ease-out`) |
| `--m-ease-scene` | cubic-bezier(0.76, 0, 0.24, 1) | hero/section-scale moves (Mercury curve) |

Rules:

1. **One ambient element per page maximum.** Homepage hero gets the living tableau; every other section is reveal-on-enter only. No competing loops.
2. **Reveal once.** IntersectionObserver adds `.visible`, threshold ~0.2, never removes it. Stagger siblings 80-120ms, cap stagger chains at 5.
3. **Show agents working.** Product demonstrations use the existing framer-motion parts bin (AgentWorkflow terminal, BankConnectTerminal, StreamingText, MinutesCounter) restyled to β tokens, with in-progress state labels ("Matching invoice...", "Drafting briefing...") echoing Ramp's tableau. Real enum-free plain language only; no fake precision the lexicon forbids.
4. **Numbers count up** when a stat tile enters the viewport (MinutesCounter pattern), tabular numerics always.
5. **prefers-reduced-motion collapses everything** to 0.01ms globally (already in globals.css); ambient videos render their poster frame instead. Never re-enable motion per-component.
6. **No scroll hijacking, no parallax depth stacks, no smooth-scroll libraries.** The references ship none of them; the calm is the brand.
7. **Movement communicates causality** (app rule, kept): dropdowns fall from their trigger, demos progress top-to-bottom, nothing bounces.
8. Video assets: muted, loop, `playsInline`, poster set, lazy-loaded below the fold, play only when in view (Mercury pattern).

## Section-to-pattern map for the homepage build

| Homepage section | Pattern |
|---|---|
| Hero | Atmosphere backdrop (Midjourney #1 or graded gradient until then) + floating agent-state tableau chips + dual CTA. Ambient budget spent here. |
| Logo wall | Static, reveal-once stagger. |
| Product tour (Payments / Early pay / Agents) | Mercury accordion-left, animated-demo-right; demos from the parts bin, one active at a time. |
| Agents step-through | Giga pattern: numbered steps with product panels over atmosphere, reveal per step. |
| Proof / metrics | Count-up stat tiles + metric-headline cards. |
| Trust section | Quiet. Single reveal, no animation inside. |
| Final CTA band | Subtle texture (Midjourney #12), no motion. |
