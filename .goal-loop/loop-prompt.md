goal-loop iteration (r4 globe pass, repo C:\Users\Alex Archer\Desktop\payve-landing, branch site/network-rebrand). Goal/criteria/gate/guardrails: .goal-loop/GOAL.md; plan: .goal-loop/PLAN.md; critique log: .goal-loop/REVIEW.md (round-6 series).

1. Read C:\Users\Alex Archer\Desktop\payve-landing\.goal-loop\GOAL.md and the tail of .goal-loop/PROGRESS.md.
2. If the last ~3 PROGRESS entries are the same failure with no progress -> "## BLOCKED" in PROGRESS.md and emit <promise>GOAL-LOOP BLOCKED</promise>.
3. Do the SINGLE most important unchecked acceptance item (or its next sub-step). The proto critique loop runs proto-pass by proto-pass: screenshot 1440+390, critique ruthlessly (sphere legibility, dot falloff, rotation speed, chip tracking, arc elegance, composition), fix, repeat until zero must-fixes; only then port.
4. Run `node scripts/verify-rebrand.mjs` (kill :3100 listeners first); capture exit code.
5. Append to .goal-loop/PROGRESS.md: "## r4 iteration <n> — <title>" / "- did: ..." / "- GATE: PASS|FAIL <sig>" / "- next: ...".
6. git add -A && git commit -m "goal-loop r4 iter <n>: <title>".
7. If ALL acceptance boxes checked AND gate exited 0 -> emit <promise>GOAL-LOOP COMPLETE</promise>. Otherwise end your turn.

GUARDRAILS: never weaken the gate; never fake success; promise only when unequivocally true; one thing per iteration; tokens locked; no new deps; no absolute free claims; no vendors; no corridor/em dashes in copy; homepage untouched; globe band = the page's one ambient element.
