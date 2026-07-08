goal-loop iteration (landing-rebuild r2 wave, repo C:\Users\Alex Archer\Desktop\payve-landing). Your goal, acceptance criteria, verify command, and guardrails are in .goal-loop/GOAL.md (in the payve-landing repo, NOT payve-fintech).

1. Read C:\Users\Alex Archer\Desktop\payve-landing\.goal-loop\GOAL.md and the tail of .goal-loop/PROGRESS.md.
2. If the last ~3 PROGRESS entries are the same failure with no progress → write a "## BLOCKED" note in PROGRESS.md and emit <promise>GOAL-LOOP BLOCKED</promise>.
3. Do the SINGLE most important unchecked acceptance item (or its next sub-step for multi-iteration items like canvas batches). Search before assuming it's missing.
4. Run the verify command from GOAL.md; capture its exit code.
5. Append to .goal-loop/PROGRESS.md:
   "## iteration <n> — <title>" / "- did: ..." / "- GATE: PASS|FAIL <signature>" / "- next: ..."
6. git add -A && git commit -m "goal-loop iter <n>: <title>" (in payve-landing, on the wave branch for the current PR).
7. If ALL acceptance items are checked AND the verify command exited 0 → emit <promise>GOAL-LOOP COMPLETE</promise>. Otherwise end your turn (the loop continues).

GUARDRAILS: never delete/skip/weaken tests; never fake success or stub the gate; only emit a <promise> when it is unequivocally true; one thing per iteration; copy rules (no em dashes, no persuasion, no rail names, no %/rates) bind all shipped copy; canvas-driven rule per GOAL.md.
