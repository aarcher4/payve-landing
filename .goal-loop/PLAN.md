# Payve Network Rebrand — r5: Fully Interconnected Globe Traffic

## Context

The r4 globe shipped and reads beautifully, but Alex spotted a liveliness gap: after the first send cycle the scene can go quiet — pulses hide on the back side or between cycles, so the second rotation feels blank. The ask: make it a proper interconnected network. Everyone also pays Europe, funds flow in both directions, and countries pay each other (Colombia→Brazil, Mexico→Colombia). Continue iterating with the loop skill until complete.

## The change (component + proto stay in lockstep)

1. **Arc mesh 5 → 9** in `GLOBE_ARCS` (`app/components/site/network.tsx`) and the proto's `ARCS` (`design-context/network-canvas-proto.html`):
   - Existing: US↔MX, US↔CO, US↔BR, US↔EU, MX↔EU
   - New: **CO↔EU, BR↔EU** (everyone pays Europe), **MX↔CO, CO↔BR** (countries paying each other)
   - Durations 5.5–9.5s with scattered phases so pulse directions and arrivals interleave; direction alternation per cycle already gives reverse flows — keep it.
2. **No-dead-air tuning** (judged in the critique pass, not blind): with 9 arcs, expect ~4-5 front-facing pulses at any moment. If quiet windows remain, add a second pulse per EU arc at +0.5 cycle offset. If the static dotted arcs now clutter the sphere, drop their base alpha one notch (0.28 → ~0.22). Chip-hit flash mechanism unchanged (EU will now flash often — verify it doesn't strobe; if it does, lengthen the flash debounce).
3. **Critique pass(es)**: screenshot the live band at 1440+390 at two different moments (e.g. +3s and +12s) to prove no blank phase; check clutter/legibility; log in REVIEW.md (round 7); iterate until zero must-fixes.
4. **Verification + ship**: frame-time re-sample (9 arcs still trivially 60fps), `node scripts/verify-rebrand.mjs` (kill :3100 first), REVIEW.md `VERDICT: SHIP` on a post-change pass, commit/push (auto-deploys preview), confirm deploy live, smoke-check, send link.

## Process

Run under the goal-loop skill (re-arm, max 10 iterations) with the same gate and guardrails as r4 (tokens locked, no new deps, copy rules gate-enforced, globe band = the page's one ambient element, homepage untouched).

## Key files
`app/components/site/network.tsx` (GLOBE_ARCS + any tuning) · `design-context/network-canvas-proto.html` (mirror) · `.goal-loop/{GOAL,PLAN,PROGRESS,REVIEW,loop-prompt}.md`

## Verification
1. Two-moment screenshots show pulses in every frame (no blank rotation phase) at both viewports.
2. Frame-time sample still ~16.7ms p95; reduced-motion static frame unaffected.
3. Gate exit 0; push → deploy live → smoke-check → send Alex the preview link.

## Addendum (Alex, at plan approval)
If the denser mesh doesn't look great on the rotating globe, make the earth STATIC (no rotation)
with the payments moving through the network. Evaluate both in the critique pass; static is a
first-class option, not a failure mode.
