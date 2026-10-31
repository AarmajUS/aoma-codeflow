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

## Secure GitHub Connect (private repos)

"Connect GitHub securely" uses GitHub's Device Flow (OAuth app "AOMA CodeFlow",
public client ID only, no secret). GitHub's two device-flow endpoints send no
CORS headers, so `api/device-code.js` and `api/oauth-token.js` are tiny Vercel
serverless forwarders (project `aoma-codeflow`, production alias
`aoma-codeflow-aarmaj.vercel.app`) that relay only the sign-in handshake,
return CORS `*`, and store/log nothing. The access token lives only in the
page's memory; after connecting, the page lists the user's repos (private
badged) and loads the tapped repo through the authenticated contents API.
A read-only personal access token pasted into the token field is the fallback
path and is wired into the same loader.
