# goal-loop: Payve Network rebrand — extraordinary, on branch site/network-rebrand

## Goal (behavioral outcomes)
The payve-landing site, on branch `site/network-rebrand` (based off site/pr16-solutions-content, which stays untouched), is rebranded around exactly two products — **The Payve Network** and **Agentic Intelligence** — per the frozen plan in `.goal-loop/PLAN.md`. A visitor experiences: a homepage with the same general structure/details as today but reframed to the two products; a `/products/network` page that merges payments + early-pay into the network story (enroll once → instant cross-border money movement across US/Mexico/Colombia/Brazil/EU presented uniformly → connected data → supplier liquidity cascade); a `/products/agentic-intelligence` page (reframed agents page); solutions pages in network-membership language; old product URLs redirect. The craft bar is not "good" — it is extraordinary: clear, credible, remarkable design that evolves (not replaces) the Industrial Confidence system and its motion rules.

## Acceptance criteria
- [ ] Positioning spec `docs/network-rebrand.md` written: two-product architecture, the ONE-sentence cascade, vocabulary (enroll/unlock/member; never lend/finance/factor), banned-words list, softer fee framing (no absolute "free"), five corridors uniform, design-evolution rules (accent only where money moves; one ambient element per page)
- [ ] New components built per docs/motion-system.md rules + prefers-reduced-motion: `FlowLine` (ambient traveling pulse), `CascadeFlow` (enroll→unlock→cascade visualization), `CorridorStrip` (five regions, uniform)
- [ ] `/products/network` page live with section arc: hero (category claim + the cascade sentence + softer fee line) → Enroll → Move money (CorridorStrip + ported PaymentsDemo content) → Unlock your suppliers (ported EarlyPayDemo + benefits ladder: paid faster → certainty/visibility → stronger relationships, win/secure more business; free-for-suppliers explicit) → Connected data (bridge to Agentic Intelligence) → QuoteBand → CtaBand
- [ ] `/products/agentic-intelligence` live: agents page moved/reframed — agents are powerful because the network's data is already connected; Loops + approval-gate content kept; cross-sell to Network
- [ ] `next.config.ts` redirects: /products/payments → /products/network, /products/early-pay → /products/network, /products/agents → /products/agentic-intelligence
- [ ] Nav + footer (`app/components/site/config.ts`): Products ▾ = The Payve Network · Agentic Intelligence (two only)
- [ ] Homepage: SAME section arc (Hero → LogoWall → ProductTour → HowItWorks → MidCta → Proof → TrustSection → CtaBand); hero subhead reframed to two products + cascade woven in; ProductTour 3 rows → 2; HowItWorks step 01 Connect → Enroll; links updated; Proof/Trust/LogoWall otherwise untouched
- [ ] Solutions pages (fresh-produce, seafood, packaging): supplier-liquidity sections reframed to network membership; product names/links updated; structure + stats kept
- [ ] Customers/company/security: label-level pass (Payve Agents → Agentic Intelligence, links); disclosure line kept everywhere
- [ ] Metadata (`app/layout.tsx`), `public/llms.txt`, `app/sitemap.ts` updated to two-product framing + new routes
- [ ] `scripts/walk.mjs` ROUTES updated: new product routes ADDED, old routes KEPT (they must resolve via redirect)
- [ ] Design review: `.goal-loop/REVIEW.md` contains a full-site critique pass (Playwright screenshots, 1440 + 390, every rebranded page) scored on clarity, credibility, craft; iterate until the LATEST pass has zero must-fix critiques and an explicit `VERDICT: EXTRAORDINARY — SHIP`. A pass may only carry that verdict if it was performed AFTER the last code change.
- [ ] Draft PR opened against `site/pr16-solutions-content` with before/after screenshots and a Render branch-preview note

## Verify gate (objective definition of done)
`node scripts/verify-rebrand.mjs`  — must exit 0. Run it every iteration once it exists (iteration 1 creates it; if an early iteration only touches docs, still run it).
The gate runs: (1) next build; (2) next start + scripts/walk.mjs (all routes incl. new ones, 1440/390, zero console errors); (3) redirect assertions for the three old product URLs; (4) banned-words grep over app/ + public/llms.txt (seamless, frictionless, revolutioniz, reimagin, ecosystem, next-generation, cutting-edge, empower, "network effects"); (5) absolute-free-claim grep ("for free", "$0", "zero fees", "no transaction costs").

## Guardrails
- **NEVER** delete, skip, `.skip`/`xit`/comment-out, or weaken tests to make the gate pass.
- **NEVER** hardcode expected outputs, stub/replace the verify command, or otherwise fake success.
- The `<promise>` may be emitted **only when the statement is completely and unequivocally true.** Do not lie to escape the loop, even if you feel stuck or it's taking long — use `<promise>GOAL-LOOP BLOCKED</promise>` instead.
- Do exactly **one** meaningful thing per iteration and commit it.
- If the gate keeps failing the same way, diagnose the root cause; do not retry the identical action hoping for a different result.
- Rebrand-specific: do not change the locked color token values in `app/globals.css` (Industrial Confidence β — adding new motion vars is fine); no absolute "free"/"$0" payment claims; never name technical vendors; the cascade recursion is stated in at most ONE sentence per page; homepage keeps its current section arc.

## Completion
Emit `<promise>GOAL-LOOP COMPLETE</promise>` only when every box above is checked AND `node scripts/verify-rebrand.mjs` exits 0.
Emit `<promise>GOAL-LOOP BLOCKED</promise>` if genuinely stuck (and write why in PROGRESS.md).
