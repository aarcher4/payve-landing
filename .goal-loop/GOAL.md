# goal-loop: r5 — fully interconnected globe traffic, no dead air, iterate until fully satisfied

## Goal (behavioral outcomes)
On branch `site/network-rebrand`, per `.goal-loop/PLAN.md`: the "Send it. It's there." globe never goes quiet. The arc mesh becomes a proper network (everyone also pays Europe: CO↔EU, BR↔EU added; countries pay each other: MX↔CO, CO↔BR added; 9 arcs total, bidirectional flows interleaved) so at every moment payments are visibly moving. If the dense mesh doesn't look great on the ROTATING globe, the earth goes STATIC (no rotation, Americas+EU composed front) with payments moving through the network — Alex's explicit instruction; static is a first-class option. Iterate critique passes until zero must-fixes and the scene feels interconnected and alive at any moment.

## Acceptance criteria
- [x] Arc mesh 5 → 9 in `GLOBE_ARCS` (component) and proto `ARCS`, durations 5.5-9.5s with scattered phases; direction alternation kept
- [x] Rotating-vs-static decision made from evidence: two-moment screenshots (e.g. +3s, +12s) of the dense mesh on the rotating globe; if quiet windows or clutter remain, switch to static earth (rotation off, fixed flattering composition) with pulses running — decision + rationale logged in REVIEW.md round 7
- [x] No-dead-air proven: two-moment screenshots at 1440 + 390 each show multiple pulses in frame; no blank phase; EU chip-hit doesn't strobe (debounce lengthened if it does); arc clutter tuned if needed (static arc alpha)
- [x] Frame-time re-sample still ~16.7ms p95; reduced-motion static frame unaffected; zero pageerrors
- [ ] REVIEW.md round 7: zero must-fixes on a POST-CHANGE pass carrying `VERDICT: ALIVE — SHIP`
- [ ] Gate green; pushed; Render preview deploy live; smoke-checked

## Verify gate (objective definition of done)
`node scripts/verify-rebrand.mjs` — must exit 0 every iteration (kill :3100 listeners first).

## Guardrails
- **NEVER** weaken the gate; never fake success; `<promise>` only when unequivocally true; one meaningful thing per iteration, committed.
- Same failure 3x → root cause or BLOCKED.
- Locked: color tokens; no new deps; copy rules (no corridor/em dashes/absolute free/vendors); homepage untouched; globe band = the page's one ambient element; component and proto stay in lockstep.

## Completion
Emit `<promise>GOAL-LOOP COMPLETE</promise>` only when every box is checked AND the gate exits 0.
Emit `<promise>GOAL-LOOP BLOCKED</promise>` if genuinely stuck (write why in PROGRESS.md).
