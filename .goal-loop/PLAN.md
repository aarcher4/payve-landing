# Payve Network Rebrand — r4: "Send it. It's there." Globe

## Context

r3 shipped the benefits voice. Alex's r4 ask: take another **canvas-driven** pass at the "Send it. It's there." band on `/products/network` and put a **globe under it** — a sphere of dots that makes it feel like you're sending money across a globe. Multiple passes; the bar is "absolutely incredible," highest standard. Reference remains Dakota's hero (particle globe, labeled chips, traveling arcs — screenshots already in `design-context/reference-dakota/`), translated into the light Industrial Confidence system.

## The scene (designed before code)

The band is promoted from an eyebrow + flat arc-map to a **statement section**:

- Centered display heading **"Send it. It's there."** (existing `font-display` H2 scale, two-tone pattern) with one short sub-line under it (benefits voice, e.g. "Any supplier, any country, paid in their own currency.").
- Beneath/behind it, the **upper hemisphere of a rotating particle globe** rising from the bottom edge of the band (Dakota's crop), drawn on 2D `<canvas>` — no new dependencies:
  - ~800 dots distributed by Fibonacci sphere, orthographic projection, slow Y-axis rotation (~24s/rev).
  - Depth: front-hemisphere dots larger/brighter (sage-300/500 by z), back hemisphere very faint — reads unmistakably as a 3D sphere on paper.
  - **Five country anchors** pinned to plausible lat/longs (US, MX, CO, BR, EU), rotating with the sphere. The existing boxed mono chips (region + currency) track their projected positions via per-frame DOM transforms, fading/scaling as they rotate toward the back limb.
  - **Payment arcs over the surface**: slerp between anchor pairs, lifted radially at mid-arc, projected; drawn dotted; sage-500 pulses travel them (accent only where money moves); chip dot flashes on arrival (existing `.chip-hit` mechanism). Arcs fade when an endpoint is back-facing.
  - Subtle paper-tone radial glow behind the sphere for atmosphere; keep the faint ambient particle drift.
- Craft requirements (unchanged from §9 + new): dpr-aware; rAF paused off-screen via IntersectionObserver; `prefers-reduced-motion` renders one static, well-composed frame (globe at a flattering rotation, arcs visible, no pulses); 390→1440 responsive (globe radius from container width; band ~540px desktop / ~380px mobile); frame budget comfortably 60fps (≤1k dots, no shadows/blur).

## Process — canvas-driven, multiple passes to "incredible"

1. **Proto v2** in `design-context/network-canvas-proto.html` (replace v1 contents; v1 is in git history): build the globe scene standalone with inline tokens.
2. **Critique loop on the proto** (this is where the passes happen): screenshot at 1440 + 390 with the repo's Playwright (`scripts/` pattern), review ruthlessly against the bar — sphere legibility, dot density/falloff, rotation speed, chip tracking smoothness, arc elegance, composition with the heading — fix, re-shoot. Minimum two full passes; iterate until a pass has zero must-fixes. Log passes in `.goal-loop/REVIEW.md` (round 6 series).
3. **Port** into `NetworkCanvas` in `app/components/site/network.tsx` (replace the flat arc-map implementation; keep the exported name and the chip/`.chip-hit` mechanism). Restructure the band in `app/products/network/page.tsx`: heading becomes the display H2 + sub-line, canvas below/behind; update `docs/network-rebrand.md` §9.
4. **Verify + ship**: `node scripts/verify-rebrand.mjs` (kill port 3100 first — known collision); in-app screenshots desktop/mobile + reduced-motion probe (computed static frame) + a quick rAF frame-time sample via CDP/evaluate; REVIEW.md final round with verdict; commit, push (auto-deploys preview), confirm deploy live via Render API, smoke-check, send Alex the link.

## Key files
`design-context/network-canvas-proto.html` (v2 proto) · `app/components/site/network.tsx` (NetworkCanvas rewrite) · `app/products/network/page.tsx` (band → statement section) · `docs/network-rebrand.md` §9 · `.goal-loop/REVIEW.md`

## Guardrails (carried)
Locked color tokens; no new dependencies; no absolute "free" claims; no "corridor"/em dashes in copy (gate-enforced); the globe band remains the page's ONE ambient element; homepage untouched.

## Verification
1. Proto passes logged with screenshots until zero must-fixes.
2. `node scripts/verify-rebrand.mjs` exit 0.
3. Reduced-motion renders a static composed frame (probe computed canvas + no rAF); rAF sample shows steady frame times.
4. Push → Render deploy live → smoke-check `/products/network` → send preview link.
