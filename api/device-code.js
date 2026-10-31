// AOMA CodeFlow — GitHub Device Flow forwarder (1 of 2).
// GitHub's device-code endpoint sends no CORS headers, so a browser page
// cannot call it directly. This function only forwards the request and
// returns GitHub's JSON. It stores nothing and logs nothing.
const CLIENT_ID = "Ov23liAmHxnl4XqBgTPy"; // public identifier, safe to embed

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  try { return JSON.parse(raw || "{}"); } catch { return {}; }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  // Body is ignored entirely — client_id is pinned server-side, so there is nothing to read or trust from it.
  const form = new URLSearchParams({ client_id: CLIENT_ID, scope: "repo read:user" });
  const gh = await fetch("https://github.com/login/device/code", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  const data = await gh.json().catch(() => ({}));
  return res.status(gh.status).json(data);
}
