goal-loop iteration (r3 benefits-voice pass, repo C:\Users\Alex Archer\Desktop\payve-landing, branch site/network-rebrand). Goal/criteria/gate/guardrails: .goal-loop/GOAL.md; plan: .goal-loop/PLAN.md; critique log: .goal-loop/REVIEW.md.

1. Read C:\Users\Alex Archer\Desktop\payve-landing\.goal-loop\GOAL.md and the tail of .goal-loop/PROGRESS.md.
2. If the last ~3 PROGRESS entries are the same failure with no progress -> write "## BLOCKED" in PROGRESS.md and emit <promise>GOAL-LOOP BLOCKED</promise>.
3. Do the SINGLE most important unchecked acceptance item (or its next sub-step). Once build items are done, the remaining work is the review loop: read the copy in-context (screenshots + rendered pages), critique against the benefits-first voice rules in REVIEW.md, fix must-fixes, repeat until a post-change round earns VERDICT: HIGHER ESSENCE — SHIP.
4. Run `node scripts/verify-rebrand.mjs`; capture exit code.
5. Append to .goal-loop/PROGRESS.md: "## iteration <n> — <title>" / "- did: ..." / "- GATE: PASS|FAIL <sig>" / "- next: ...".
6. git add -A && git commit -m "goal-loop r3 iter <n>: <title>".
7. If ALL acceptance boxes checked AND gate exited 0 -> emit <promise>GOAL-LOOP COMPLETE</promise>. Otherwise end your turn.

GUARDRAILS: never weaken the gate; never fake success; promise only when unequivocally true; one thing per iteration; tokens locked; no absolute free claims; no vendors; cascade max once per page; homepage arc locked; no em dashes; no "corridor" in copy; customer quotes untouched.
