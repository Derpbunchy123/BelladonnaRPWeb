interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function signAdminToken(payload: object, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret || "belladonna-admin-secret-change-me");
  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const payloadStr = btoa(JSON.stringify(payload));
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadStr));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${payloadStr}.${sigB64}`;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  const env = context.env as Env;

  try {
    const body = await context.request.json() as { username?: string; password?: string };
    const { username, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username and password are required." }), {
        status: 400, headers: corsHeaders,
      });
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Server is not configured." }), {
        status: 503, headers: corsHeaders,
      });
    }

    const passwordHash = await hashPassword(password);

    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/staff_accounts?username=eq.${encodeURIComponent(username)}&select=id,username,role,password_hash`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Authentication service unavailable." }), {
        status: 503, headers: corsHeaders,
      });
    }

    const accounts = await res.json() as Array<{ id: number; username: string; role: string; password_hash: string }>;

    if (!Array.isArray(accounts) || accounts.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid username or password." }), {
        status: 401, headers: corsHeaders,
      });
    }

    const account = accounts[0];
    if (account.password_hash !== passwordHash) {
      return new Response(JSON.stringify({ error: "Invalid username or password." }), {
        status: 401, headers: corsHeaders,
      });
    }

    const token = await signAdminToken({
      admin_id: account.id,
      username: account.username,
      role: account.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 28800, // 8h
    }, env.ADMIN_JWT_SECRET);

    return new Response(JSON.stringify({ token, role: account.role, username: account.username }), {
      status: 200, headers: corsHeaders,
    });

  } catch (e) {
    console.error("Admin login error:", e);
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