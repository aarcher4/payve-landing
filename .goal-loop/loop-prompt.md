goal-loop iteration. Your goal, acceptance criteria, verify command, and guardrails are in .goal-loop/GOAL.md.

Repo: C:\Users\Alex Archer\Desktop\payve-landing (branch goal-loop/rates-page). Source plan: C:\Users\Alex Archer\.claude\plans\coulyyou-help-me-put-atomic-dawn.md

1. Read .goal-loop/GOAL.md and the tail of .goal-loop/PROGRESS.md.
2. If the last ~3 PROGRESS entries are the same failure with no progress → write a "## BLOCKED" note in PROGRESS.md and emit <promise>GOAL-LOOP BLOCKED</promise>.
3. Do the SINGLE most important unchecked acceptance item. Search before assuming it's missing.
4. Run `npm run verify:rates`; capture its exit code.
5. Append to .goal-loop/PROGRESS.md:
   "## iteration <n> — <title>" / "- did: ..." / "- GATE: PASS|FAIL <signature>" / "- next: ..."
6. git add -A && git commit -m "goal-loop iter <n>: <title>".
7. If ALL acceptance items are checked AND the verify command exited 0 → emit <promise>GOAL-LOOP COMPLETE</promise>. Otherwise end your turn (the loop continues).

GUARDRAILS: never delete/skip/weaken tests; never fake success or stub the gate; only emit a <promise> when it is unequivocally true; one thing per iteration. Do NOT push, deploy, or touch DNS. Do NOT modify payve-fintech or payve-monorepo. Never commit a Bridge API key. Footnote wording + per-corridor fee defaults must match the plan EXACTLY.
