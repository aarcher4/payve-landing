# goal-loop: r4 — "Send it. It's there." particle globe, iterate to absolutely incredible

## Goal (behavioral outcomes)
On branch `site/network-rebrand`, per `.goal-loop/PLAN.md`: the "Send it. It's there." band on `/products/network` becomes a statement section — centered display heading + one benefits sub-line over the upper hemisphere of a rotating particle globe (2D canvas, no new deps): ~800 Fibonacci-sphere dots with z-depth falloff, five country anchors whose boxed mono chips ride the rotation (fading toward the back limb), dotted payment arcs slerped over the surface with sage-500 pulses and chip-hit flashes. Dakota's hero grammar in light Industrial Confidence. The bar: absolutely incredible, highest standard — reached through repeated canvas-driven proto passes before porting.

## Acceptance criteria
- [x] Proto v2 globe scene in `design-context/network-canvas-proto.html` (inline tokens; rotation, depth falloff, chips tracking anchors, surface arcs + pulses, bottom-crop composition with the heading)
- [x] Proto critique loop: at least TWO full passes (screenshot 1440+390 → ruthless critique in `.goal-loop/REVIEW.md` round-6 series → fix) continuing until a pass has zero must-fixes
- [x] Port into `NetworkCanvas` (`app/components/site/network.tsx`): replace the flat arc-map, keep the exported name + chip/.chip-hit mechanism; dpr-aware; rAF paused off-screen; prefers-reduced-motion renders one static composed frame; band ~540px desktop / ~380px mobile
- [x] `app/products/network/page.tsx`: band → statement section (display H2 "Send it. It's there." two-tone + benefits sub-line, canvas below/behind); `docs/network-rebrand.md` §9 updated
- [x] In-app verification: screenshots 1440+390; reduced-motion probe (static frame, no rAF); rAF frame-time sample steady (comfortably 60fps)
- [x] REVIEW.md final round: zero must-fixes on a POST-CHANGE pass carrying `VERDICT: INCREDIBLE — SHIP`
- [ ] Gate green; pushed to origin; Render preview deploy live (srv-d96hquv7f7vs73dm7930, auto-deploy on push); smoke-check `/products/network` on payve-site-preview.onrender.com

## Verify gate (objective definition of done)
`node scripts/verify-rebrand.mjs` — must exit 0 every iteration (kill any :3100 listener first; known port-collision failure mode). Build; walk 1440/390 zero console errors; redirects; banned-words/free-claim/em-dash/operating-account/corridor greps.

## Guardrails
- **NEVER** weaken the gate; never fake success; a `<promise>` only when unequivocally true; one meaningful thing per iteration, committed.
- Same failure 3x → diagnose root cause or BLOCKED.
- Locked: color tokens; no new dependencies; no absolute "free" claims; no vendors; no "corridor"/em dashes in copy; cascade max once per page; homepage untouched; the globe band stays the network page's ONE ambient element; site/pr16-solutions-content untouched.

## Completion
Emit `<promise>GOAL-LOOP COMPLETE</promise>` only when every box is checked AND the gate exits 0.
Emit `<promise>GOAL-LOOP BLOCKED</promise>` if genuinely stuck (write why in PROGRESS.md).
