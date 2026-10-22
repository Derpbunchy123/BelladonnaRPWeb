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

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const corsHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const env = context.env as Env;

  const authHeader = context.request.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  const admin = await verifyAdminToken(token, env.ADMIN_JWT_SECRET);

  if (!admin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const appId = context.params.id;
  if (!appId) {
    return new Response(JSON.stringify({ error: "Application ID required" }), { status: 400, headers: corsHeaders });
  }

  const ALLOWED_STATUSES = ["Pending", "Under Review", "Accepted", "Denied", "More Information Required"];
  const body = await context.request.json() as { status?: string; assigned_reviewer?: string | null; staff_notes?: string | null };

  const updates: Record<string, unknown> = {};
  if (body.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      return new Response(JSON.stringify({ error: "Invalid status value" }), { status: 400, headers: corsHeaders });
    }
    updates.status = body.status;
  }
  if (body.assigned_reviewer !== undefined) updates.assigned_reviewer = body.assigned_reviewer;
  if (body.staff_notes !== undefined) updates.staff_notes = body.staff_notes;

  if (Object.keys(updates).length === 0) {
    return new Response(JSON.stringify({ error: "No valid fields to update" }), { status: 400, headers: corsHeaders });
  }

  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/applications?id=eq.${encodeURIComponent(appId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(updates),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Supabase update error:", err);
    return new Response(JSON.stringify({ error: "Failed to update application" }), { status: 500, headers: corsHeaders });
  }

  const updated = await res.json();
  return new Response(JSON.stringify({ success: true, application: Array.isArray(updated) ? updated[0] : updated }), {
    status: 200, headers: corsHeaders,
  });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};