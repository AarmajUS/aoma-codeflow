// AOMA CodeFlow — GitHub Device Flow token poll forwarder (2 of 2).
// GitHub's access-token endpoint sends no CORS headers, so a browser page
// cannot poll it directly. This function only forwards the poll and returns
// GitHub's JSON (including the access token, which goes straight back to the
// visitor's browser and is kept in page memory only). Stores/logs nothing.
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
  const body = (req.body && typeof req.body === "object") ? req.body : {};
  const q = new URL(req.url, "https://x").searchParams;
  const deviceCode = body.device_code || q.get("device_code") || "";
  if (!deviceCode) return res.status(400).json({ error: "device_code required" });
  const form = new URLSearchParams({
    client_id: CLIENT_ID,
    device_code: deviceCode,
    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
  });
  const gh = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  const data = await gh.json().catch(() => ({}));
  return res.status(gh.status).json(data);
}
