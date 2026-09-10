goal-loop iteration (r5 interconnected-globe pass, repo C:\Users\Alex Archer\Desktop\payve-landing, branch site/network-rebrand). Goal/criteria/gate/guardrails: .goal-loop/GOAL.md; plan: .goal-loop/PLAN.md; critique log: .goal-loop/REVIEW.md (round-7 series).

1. Read C:\Users\Alex Archer\Desktop\payve-landing\.goal-loop\GOAL.md and the tail of .goal-loop/PROGRESS.md.
2. If the last ~3 PROGRESS entries are the same failure with no progress -> "## BLOCKED" in PROGRESS.md and emit <promise>GOAL-LOOP BLOCKED</promise>.
3. Do the SINGLE most important unchecked acceptance item (or its next sub-step). Critique passes use two-moment screenshots (multiple pulses in every frame = no dead air); rotating-vs-static decision from evidence — static earth with moving payments is a first-class option (Alex).
4. Run `node scripts/verify-rebrand.mjs` (kill :3100 listeners first); capture exit code.
5. Append to .goal-loop/PROGRESS.md: "## r5 iteration <n> — <title>" / "- did: ..." / "- GATE: PASS|FAIL <sig>" / "- next: ...".
6. git add -A && git commit -m "goal-loop r5 iter <n>: <title>".
7. If ALL acceptance boxes checked AND gate exited 0 -> emit <promise>GOAL-LOOP COMPLETE</promise>. Otherwise end your turn (or run the goal-loop stop.js then emit if truly complete).

GUARDRAILS: never weaken the gate; never fake success; promise only when unequivocally true; one thing per iteration; tokens locked; no new deps; copy rules enforced; homepage untouched; globe band = one ambient element; component + proto in lockstep.
