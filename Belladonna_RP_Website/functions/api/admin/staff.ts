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

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const env = context.env as Env;

  const authHeader = context.request.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  const admin = await verifyAdminToken(token, env.ADMIN_JWT_SECRET);

  if (!admin || (admin.role !== "super_admin" && admin.role !== "admin")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/staff_accounts?select=id,username,role&order=created_at.asc`, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  const data = res.ok ? await res.json() : [];
  return new Response(JSON.stringify(Array.isArray(data) ? data : []), { status: 200, headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const env = context.env as Env;

  const authHeader = context.request.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  const admin = await verifyAdminToken(token, env.ADMIN_JWT_SECRET);

  if (!admin || admin.role !== "super_admin") {
    return new Response(JSON.stringify({ error: "Only Super Admins may create staff accounts." }), {
      status: 403, headers: corsHeaders,
    });
  }

  const body = await context.request.json() as { username?: string; password?: string; role?: string };
  const { username, password, role } = body;

  const ALLOWED_ROLES = ["reviewer", "admin", "super_admin"];
  if (!username || !password || !role || !ALLOWED_ROLES.includes(role)) {
    return new Response(JSON.stringify({ error: "Username, password, and valid role are required." }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (password.length < 8) {
    return new Response(JSON.stringify({ error: "Password must be at least 8 characters." }), {
      status: 400, headers: corsHeaders,
    });
  }

  const passwordHash = await hashPassword(password);

  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/staff_accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({ username, password_hash: passwordHash, role }),
  });

  if (!res.ok) {
    const err = await res.text();
    if (err.includes("unique")) {
      return new Response(JSON.stringify({ error: "A staff account with that username already exists." }), {
        status: 409, headers: corsHeaders,
      });
    }
    return new Response(JSON.stringify({ error: "Failed to create staff account." }), {
      status: 500, headers: corsHeaders,
    });
  }

  const created = await res.json();
  const account = Array.isArray(created) ? created[0] : created;
  return new Response(JSON.stringify({ id: account?.id, username: account?.username, role: account?.role }), {
    status: 201, headers: corsHeaders,
  });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};