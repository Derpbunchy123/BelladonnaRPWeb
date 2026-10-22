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

  const url = new URL(context.request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "10"), 50);
  const search = url.searchParams.get("search") ?? "";
  const typeFilter = url.searchParams.get("type") ?? "";
  const statusFilter = url.searchParams.get("status") ?? "";

  const offset = (page - 1) * limit;

  let query = `${env.SUPABASE_URL}/rest/v1/applications?select=id,applicant_discord,applicant_name,applicant_email,type,answers,status,submitted_at,created_at,assigned_reviewer,staff_notes&order=submitted_at.desc&limit=${limit}&offset=${offset}`;

  if (typeFilter) query += `&type=eq.${encodeURIComponent(typeFilter)}`;
  if (statusFilter) query += `&status=eq.${encodeURIComponent(statusFilter)}`;
  if (search) query += `&or=(applicant_name.ilike.*${encodeURIComponent(search)}*,applicant_discord.ilike.*${encodeURIComponent(search)}*)`;

  const headers = {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    Prefer: "count=exact",
  };

  const [res, countRes] = await Promise.all([
    fetch(query, { headers }),
    fetch(query.split("&limit=")[0] + "&select=id", { headers }),
  ]);

  const applications = res.ok ? await res.json() : [];
  const contentRange = res.headers.get("Content-Range");
  let total = 0;
  if (contentRange) {
    const match = contentRange.match(/\/(\d+)$/);
    if (match) total = parseInt(match[1]);
  }

  return new Response(JSON.stringify({ applications: Array.isArray(applications) ? applications : [], total }), {
    status: 200, headers: corsHeaders,
  });
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