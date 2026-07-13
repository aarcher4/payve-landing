goal-loop iteration (Payve Network rebrand, repo C:\Users\Alex Archer\Desktop\payve-landing, branch site/network-rebrand). Goal, criteria, gate, guardrails: .goal-loop/GOAL.md; frozen plan: .goal-loop/PLAN.md; design critique log: .goal-loop/REVIEW.md.

1. Read C:\Users\Alex Archer\Desktop\payve-landing\.goal-loop\GOAL.md and the tail of .goal-loop/PROGRESS.md.
2. If the last ~3 PROGRESS entries are the same failure with no progress -> write "## BLOCKED" in PROGRESS.md and emit <promise>GOAL-LOOP BLOCKED</promise>.
3. Do the SINGLE most important unchecked acceptance item (or its next sub-step). Search before assuming it's missing. Once all build items are done, the remaining item is the design-review loop: screenshot every rebranded page at 1440+390, critique ruthlessly in REVIEW.md (clarity, credibility, craft), fix the top must-fix critiques — repeat until a post-change pass earns VERDICT: EXTRAORDINARY — SHIP.
4. Run `node scripts/verify-rebrand.mjs`; capture exit code.
5. Append to .goal-loop/PROGRESS.md: "## iteration <n> — <title>" / "- did: ..." / "- GATE: PASS|FAIL <sig>" / "- next: ...".
6. git add -A && git commit -m "goal-loop iter <n>: <title>" (payve-landing, site/network-rebrand).
7. If ALL acceptance items checked AND gate exited 0 -> emit <promise>GOAL-LOOP COMPLETE</promise>. Otherwise end your turn.

GUARDRAILS: never delete/skip/weaken tests or the gate; never fake success; only emit a <promise> when unequivocally true; one thing per iteration; locked color tokens untouched; no absolute "free"/"$0" claims; never name technical vendors; cascade stated in max ONE sentence per page; homepage keeps its section arc; site/pr16-solutions-content stays untouched.
