# goal-loop: r3 — benefits-first customer voice, iterate to a higher essence of the material

## Goal (behavioral outcomes)
On branch `site/network-rebrand`, per `.goal-loop/PLAN.md`: the site's copy speaks to customers in benefits, not mechanics. "Corridor" disappears from customer-facing copy (countries stay). The network's theme reads as: payments sent on the network are received instantly ("send it, it's there"), members are connected to global liquidity so suppliers get the capital they need quicker, and that builds stronger supplier relationships that win more business. Fee talk leaves heros/eyebrows (facts survive in detail lists). Then iterate review rounds on the material (copy read in-context + screenshots) until it reaches a higher essence: every headline/eyebrow/blurb answers "what do I get / what problem disappears," in words a produce buyer or grower would actually say.

## Acceptance criteria
- [ ] `docs/network-rebrand.md`: §0 voice rules (corridor banned in copy; benefits-first test; canonical instant/liquidity/relationships lines; fee claims down-page only), §5 retitled Countries, §9 heading note
- [ ] `scripts/verify-rebrand.mjs`: `/corridor/i` added to copy-banned checks (comments exempt, same mechanism as em-dash check)
- [ ] `/products/network`: canvas-band eyebrow → "Send it. It's there."; hero sub rewritten benefits-first (instant + global liquidity + relationships); metadata matches; "Fast supplier receipt" → "Received in minutes, not days"; Move-money body not fee-forward in sentence one
- [ ] `NetworkCanvas` aria-label reworded without "corridors" (internal identifiers exempt)
- [ ] `ProductTour` Network blurb → benefits voice (send-and-it's-there + suppliers connected to capital)
- [ ] `app/layout.tsx` site description → benefits voice
- [ ] `public/llms.txt` → no "corridor", benefits framing, country list kept
- [ ] Grep-audit: zero "corridor" hits in app/ copy + llms.txt; solutions/customers/company stragglers fixed
- [ ] Review loop: screenshot pass (network page + homepage minimum, full site on final round) + in-context copy read appended to `.goal-loop/REVIEW.md` as round 5+; iterate fix→review until a POST-CHANGE round has zero must-fix critiques and carries `VERDICT: HIGHER ESSENCE — SHIP`
- [ ] Pushed to origin; Render preview deploy live (service srv-d96hquv7f7vs73dm7930, auto-deploys on push; confirm via API); smoke-check new copy on payve-site-preview.onrender.com

## Verify gate (objective definition of done)
`node scripts/verify-rebrand.mjs` — must exit 0 every iteration (build; walk 1440/390 zero console errors; redirects; banned-words + free-claim + em-dash + operating-account + corridor greps).

## Guardrails
- **NEVER** delete, skip, or weaken the gate; never fake success; a `<promise>` only when unequivocally true; one meaningful thing per iteration, committed.
- If the gate fails the same way 3 times, diagnose root cause or go BLOCKED; never lie to escape.
- Rebrand-locked: color tokens untouched; no absolute "free"/"$0" claims; never name technical vendors; cascade stated max ONCE per page; homepage keeps its section arc; site/pr16-solutions-content untouched; NetworkCanvas visualization itself unchanged (heading/aria only) unless a review round demands a must-fix.
- Copy voice: no em dashes; no "corridor"; countries and currencies are welcome; customer quotes never edited.

## Completion
Emit `<promise>GOAL-LOOP COMPLETE</promise>` only when every box is checked AND the gate exits 0.
Emit `<promise>GOAL-LOOP BLOCKED</promise>` if genuinely stuck (write why in PROGRESS.md).
