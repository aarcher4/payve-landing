goal-loop iteration (r3 polish wave, repo C:\Users\Alex Archer\Desktop\payve-landing, branch site/pr15-polish). Goal, criteria, gate, guardrails: .goal-loop/GOAL.md (payve-landing repo).

1. Read C:\Users\Alex Archer\Desktop\payve-landing\.goal-loop\GOAL.md and the tail of .goal-loop/PROGRESS.md.
2. If the last ~3 PROGRESS entries are the same failure with no progress -> write "## BLOCKED" in PROGRESS.md and emit <promise>GOAL-LOOP BLOCKED</promise>.
3. Do the SINGLE most important unchecked acceptance item (or its next sub-step for multi-iteration items like the reference walks). Search before assuming it's missing.
4. Run the verify command from GOAL.md; capture exit code.
5. Append to .goal-loop/PROGRESS.md: "## iteration <n> — <title>" / "- did: ..." / "- GATE: PASS|FAIL <sig>" / "- next: ...".
6. git add -A && git commit -m "goal-loop iter <n>: <title>" (payve-landing, site/pr15-polish).
7. If ALL acceptance items checked AND gate exited 0 -> emit <promise>GOAL-LOOP COMPLETE</promise>. Otherwise end your turn.

GUARDRAILS: never delete/skip/weaken tests; never fake success; only emit a <promise> when unequivocally true; one thing per iteration; NO CANVAS this run (Alex); docs before code; design-system tokens only; reference walks read-only.
