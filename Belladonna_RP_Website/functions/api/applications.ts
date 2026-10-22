// Cloudflare Pages Function: submit an application
// Validates the session token, then writes to Supabase via service-role key.

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SESSION_SECRET: string;
}

async function verifySessionToken(token: string, secret: string): Promise<{ discord_id: string; username: string } | null> {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return null;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret || "belladonna-session-secret-change-me");
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sigBytes = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payloadB64));
    if (!valid) return null;

    const payload = JSON.parse(atob(payloadB64));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { discord_id: payload.discord_id, username: payload.username };
  } catch {
    return null;
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const env = context.env as Env;

  try {
    const authHeader = context.request.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const session = await verifySessionToken(token, env.SESSION_SECRET);

    if (!session) {
      return new Response(JSON.stringify({ error: "Authentication required. Please sign in with Discord." }), {
        status: 401, headers: corsHeaders,
      });
    }

    const body = await context.request.json() as { type?: string; answers?: Record<string, string> };
    const { type, answers } = body;

    const ALLOWED_TYPES = ["whitelist", "staff", "beta"];
    if (!type || !ALLOWED_TYPES.includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid or unavailable application type." }), {
        status: 400, headers: corsHeaders,
      });
    }

    if (!answers || typeof answers !== "object") {
      return new Response(JSON.stringify({ error: "Answers are required." }), {
        status: 400, headers: corsHeaders,
      });
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Database is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." }), {
        status: 503, headers: corsHeaders,
      });
    }

    // Check for duplicate pending/under-review application
    const checkRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/applications?applicant_discord=eq.${encodeURIComponent(session.discord_id)}&type=eq.${encodeURIComponent(type)}&status=in.(Pending,Under Review)&select=id`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    if (checkRes.ok) {
      const existing = await checkRes.json() as unknown[];
      if (Array.isArray(existing) && existing.length > 0) {
        return new Response(JSON.stringify({
          error: "You already have an active application of this type. Please wait for a decision before reapplying.",
        }), { status: 409, headers: corsHeaders });
      }
    }

    // Insert the application
    const insertRes = await fetch(`${env.SUPABASE_URL}/rest/v1/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        applicant_discord: session.discord_id,
        applicant_name: session.username,
        type,
        answers,
        status: "Pending",
        submitted_at: new Date().toISOString(),
      }),
    });

    if (!insertRes.ok) {
      const err = await insertRes.text();
      console.error("Supabase insert error:", err);
      return new Response(JSON.stringify({ error: "Failed to save application. Please try again." }), {
        status: 500, headers: corsHeaders,
      });
    }

    const inserted = await insertRes.json();
    return new Response(JSON.stringify({ success: true, application: Array.isArray(inserted) ? inserted[0] : inserted }), {
      status: 201, headers: corsHeaders,
    });

  } catch (e) {
    console.error("Application submission error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: corsHeaders,
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};