interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

async function verifyAdminToken(token: string, secret: string): Promise<{ admin_id: number; username: string; role: string } | null> {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return null;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret || "belladonna-admin-secret-change-me");
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sigBytes = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payloadB64));
    if (!valid) return null;
    const payload = JSON.parse(atob(payloadB64));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const env = context.env as Env;

  const authHeader = context.request.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  const admin = await verifyAdminToken(token, env.ADMIN_JWT_SECRET);

  if (!admin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const supaHeaders = {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  };

  const statuses = ["Pending", "Under Review", "Accepted", "Denied", "More Information Required"];
  const counts: Record<string, number> = {};

  await Promise.all(statuses.map(async (s) => {
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/applications?status=eq.${encodeURIComponent(s)}&select=id`,
      { headers: { ...supaHeaders, Prefer: "count=exact" } }
    );
    const cr = res.headers.get("Content-Range");
    if (cr) {
      const m = cr.match(/\/(\d+)$/);
      counts[s] = m ? parseInt(m[1]) : 0;
    } else {
      const data = await res.json() as unknown[];
      counts[s] = Array.isArray(data) ? data.length : 0;
    }
  }));

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return new Response(JSON.stringify({
    total,
    pending: counts["Pending"] ?? 0,
    under_review: counts["Under Review"] ?? 0,
    accepted: counts["Accepted"] ?? 0,
    denied: counts["Denied"] ?? 0,
    more_info: counts["More Information Required"] ?? 0,
  }), { status: 200, headers: corsHeaders });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};