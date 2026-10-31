# AOMA CodeFlow — QA Sweep visual front door

Stage 1 (free): paste a public GitHub repo link or upload a repo .zip and see the
codebase drawn as a structure + flow diagram (folders, files, import arrows,
circular dependencies, unconnected files). All parsing runs in the visitor's
browser — uploaded code never leaves their machine.

Stage 2 ($299 AI Code Risk Scan): the same diagram returns with expert-reviewed
issue pointers pinned to it (code & concurrency, security, logic, structure).
Findings render from a scan-report JSON; the ordered fix steps are visible only
when the report's "paid" flag is true.

Single self-contained `index.html`. No build step, no dependencies.
