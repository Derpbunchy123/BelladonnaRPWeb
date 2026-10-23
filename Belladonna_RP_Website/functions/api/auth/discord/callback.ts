// Cloudflare Pages Function: handles Discord OAuth callback server-side
// Keeps DISCORD_CLIENT_SECRET out of the browser entirely.
//
// DEPLOYMENT REQUIREMENTS — set these in Cloudflare Pages → Settings → Environment Variables:
//   DISCORD_CLIENT_ID       — your Discord application Client ID (also set as VITE_DISCORD_CLIENT_ID)
//   DISCORD_CLIENT_SECRET   — your Discord application Client Secret (server-side only, no VITE_ prefix)
//   SESSION_SECRET          — a long random string (32+ chars) used to sign session tokens
//
// IMPORTANT: The functions/ directory must be at the Cloudflare Pages build root.
// If your site source lives inside Belladonna_RP_Website/, set the build root directory
// in Cloudflare Pages → Settings → Build & Deployments → Root Directory to
// "Belladonna_RP_Website" so that:
//   - Vite finds src/ and builds the frontend correctly
//   - Cloudflare finds functions/ and deploys these server-side functions
// Both src/ and functions/ must be siblings under that root directory.

interface Env {
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SESSION_SECRET: string;
}

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const env = context.env as Env;

    // Fail early with a clear 503 if required secrets are missing.
    // Do NOT fall back to a hardcoded default secret — that would silently
    // accept forged tokens in production.
    if (!env.DISCORD_CLIENT_ID || env.DISCORD_CLIENT_ID === "undefined") {
      return jsonResponse(
        {
          error:
            "Discord OAuth is not configured: DISCORD_CLIENT_ID is missing. " +
            "Set it in Cloudflare Pages → Settings → Environment Variables and redeploy.",
        },
        503
      );
    }

    if (!env.DISCORD_CLIENT_SECRET || env.DISCORD_CLIENT_SECRET === "undefined") {
      return jsonResponse(
        {
          error:
            "Discord OAuth is not configured: DISCORD_CLIENT_SECRET is missing. " +
            "Set it in Cloudflare Pages → Settings → Environment Variables (server-side, no VITE_ prefix).",
        },
        503
      );
    }

    if (!env.SESSION_SECRET || env.SESSION_SECRET === "undefined") {
      return jsonResponse(
        {
          error:
            "Session signing is not configured: SESSION_SECRET is missing. " +
            "Set it in Cloudflare Pages → Settings → Environment Variables.",
        },
        503
      );
    }

    // Parse and validate the request body
    let body: { code?: string };
    try {
      body = (await context.request.json()) as { code?: string };
    } catch {
      return jsonResponse({ error: "Request body is not valid JSON." }, 400);
    }

    const code = body?.code;
    if (!code || typeof code !== "string" || code.trim() === "") {
      return jsonResponse({ error: "Missing authorization code." }, 400);
    }

    // The redirect URI must exactly match what is registered in the Discord
    // Developer Portal under OAuth2 → Redirects.
    // We derive it from the incoming request origin so it works on any domain
    // (production, preview, custom domain) without hardcoding.
    const requestOrigin = new URL(context.request.url).origin;
    const redirectUri = `${requestOrigin}/auth/callback`;

    // Exchange the authorization code for an access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code.trim(),
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text().catch(() => "(no body)");
      console.error("Discord token exchange failed:", tokenRes.status, errText);
      return jsonResponse(
        {
          error:
            "Discord token exchange failed. The authorization code may have expired or already been used. Please try signing in again.",
        },
        400
      );
    }

    let tokenData: { access_token: string; token_type: string };
    try {
      tokenData = (await tokenRes.json()) as {
        access_token: string;
        token_type: string;
      };
    } catch {
      return jsonResponse(
        { error: "Discord returned an invalid token response." },
        502
      );
    }

    if (!tokenData.access_token) {
      return jsonResponse(
        { error: "Discord did not return an access token." },
        502
      );
    }

    // Fetch the authenticated user's Discord profile
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });

    if (!userRes.ok) {
      console.error("Discord user fetch failed:", userRes.status);
      return jsonResponse(
        { error: "Failed to retrieve your Discord profile. Please try again." },
        400
      );
    }

    let discordUser: {
      id: string;
      username: string;
      discriminator: string;
      avatar: string | null;
      email?: string;
      global_name?: string;
    };
    try {
      discordUser = await userRes.json();
    } catch {
      return jsonResponse(
        { error: "Discord returned an invalid user profile." },
        502
      );
    }

    if (!discordUser.id) {
      return jsonResponse(
        { error: "Discord user profile is missing required fields." },
        502
      );
    }

    // Build a signed session token (HMAC-SHA256 over a base64-encoded payload)
    const payload = {
      discord_id: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    };

    const encoder = new TextEncoder();
    const keyData = encoder.encode(env.SESSION_SECRET);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const payloadBytes = encoder.encode(JSON.stringify(payload));
const payloadBinary = Array.from(
  payloadBytes,
  (byte) => String.fromCharCode(byte)
).join("");
const payloadStr = btoa(payloadBinary);
    const sig = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payloadStr)
    );
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
    const sessionToken = `${payloadStr}.${sigB64}`;

    return jsonResponse(
      {
        user: {
          id: discordUser.id,
          username: discordUser.global_name || discordUser.username,
          discriminator: discordUser.discriminator,
          avatar: discordUser.avatar,
          email: discordUser.email || null,
        },
        session_token: sessionToken,
      },
      200
    );
  } catch (e) {
    console.error("Auth callback unexpected error:", e);
    return jsonResponse(
      { error: "An internal server error occurred during authentication." },
      500
    );
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
