# goal-loop: r3 polish wave (reference-benchmarked, app-direct, NO canvas)

## Goal (behavioral outcomes)
Execute the approved plan at `C:\Users\Alex Archer\.claude\plans\continue-the-landing-rebuild-nested-thimble.md`
in `C:\Users\Alex Archer\Desktop\payve-landing` on branch `site/pr15-polish` (stacked on pr14).
When done: the logo is back to the transparent variant, the wall reads "Trusted by supply chain
leaders", a rigorous live-walk reference review of Mercury/Ramp/HappyRobot/Brex exists as
docs/design-review-r3.md with our 14 pages graded and a CTA-copy shortlist, and the ranked gaps
are implemented app-direct through the Payve design system (docs updated FIRST each round):
ProductTour rebuilt reference-informed and type-led, site-wide icon diet done, type/spacing and
products/solutions/customers gaps closed, all verified and live on the preview.

## Acceptance criteria
- [x] Phase 0 on site/pr15-polish: header+footer logo src -> /brand/payve-logo-transparent.png;
      LogoWall eyebrow -> "Trusted by supply chain leaders"; copy-inventory + design-system docs
      updated; build green; pushed; PR opened (base site/pr14-trust-imagery); preview
      srv-d96hquv7f7vs73dm7930 repointed to site/pr15-polish and live-walked clean.
- [x] Phase 1 research: live Playwright walks of mercury.com (home + 2 product + customer proof),
      ramp.com (home + 2 product + customers hub + 2 stories), happyrobot.ai (home + product +
      customers + 1 story), brex.com (home + 1 product, CTA lens); full-page screenshots saved to
      design-context/reference-r3/; docs/design-review-r3.md written with the 8 lenses
      (iconography, multi-product pattern, type scale, section rhythm, social proof, case-study
      anatomy, product/solution IA, closing-CTA copy incl. every reference CTA verbatim).
- [x] Phase 1 grading: all 14 Payve pages graded 1-10 per applicable lens in design-review-r3.md;
      ranked gap backlog written; CTA-copy shortlist (4-6 alternatives to "See Payve on your own
      data." + recommendation) included; checkpoint R posted to Alex (report; CTA swap and any
      judgment-call redesigns proceed on my recommendation if Alex hasn't replied, flagged for
      his review).
- [x] Round 1 homepage: ProductTour rebuilt per winning reference pattern (type-led selector, NO
      icon tiles, active-state + connector affordance kept, demos kept, motion grammar per
      docs/motion-system.md); icon diet applied (HowItWorks corner icons and TrustSection icons
      removed, cards restyled type-first; header chevrons + in-demo checks kept); home type/
      spacing gaps from the grading fixed; docs updated first.
- [x] CTA band + MidCta headline: swap shipped if Alex picked (or shipped on recommendation with
      a revert note if he hasn't answered by round 1 end).
- [x] Round 2 products+solutions: lens-7 gaps applied; ValueList checkmark fate per lens-1
      evidence; FeatureGrid parity.
- [x] Round 3 customers: lens-6 gaps applied to hub + 4 stories.
- [x] Each round verified: npm run build exit 0; walk.mjs CLEAN (16 routes x 1440/390);
      hover-check CLEAN (interactions survive the redesign); copy-rule grep clean; re-grade of
      touched pages >=8/10 on addressed lenses recorded in design-review-r3.md; preview deployed
      + live-walked after each round.
- [x] Follow-ups logged in PROGRESS + memory: canvas catch-up batch post-Friday (canvas debt from
      the no-canvas exception), packing-house upscale, merge train.
- [x] Memory updated: landing-rebuild memory extended with r3 state.

## Verify gate (objective definition of done)
`cd "C:\Users\Alex Archer\Desktop\payve-landing" && npm run build`  — must exit 0. Run it every iteration.

## Standing constraints
NO CANVAS this iteration (Alex, explicit; canvas-driven rule waived once; log the debt). Docs
stay source of truth: update marketing-design-system.md + marketing-copy-inventory.md BEFORE the
code each round. Industrial Confidence tokens only (never invent hex); motion per
docs/motion-system.md; copy rules (no em dashes, no persuasion beyond Alex-approved lines, no
rail names, no %/rates, every number traceable). Reference walks are read-only browsing; do not
log in to anything; screenshots only.

## Guardrails
- **NEVER** delete, skip, `.skip`/`xit`/comment-out, or weaken tests to make the gate pass.
- **NEVER** hardcode expected outputs, stub/replace the verify command, or otherwise fake success.
- The `<promise>` may be emitted **only when the statement is completely and unequivocally true.** Do not lie to escape the loop, even if you feel stuck or it's taking long — use `<promise>GOAL-LOOP BLOCKED</promise>` instead.
- Do exactly **one** meaningful thing per iteration and commit it.
- If the gate keeps failing the same way, diagnose the root cause; do not retry the identical action hoping for a different result.

## Completion
Emit `<promise>GOAL-LOOP COMPLETE</promise>` only when every box above is checked AND the verify gate exits 0.
Emit `<promise>GOAL-LOOP BLOCKED</promise>` if genuinely stuck (and write why in PROGRESS.md).
