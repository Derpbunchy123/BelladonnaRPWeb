// Cloudflare Pages Function: handles Discord OAuth callback server-side
// Keeps DISCORD_CLIENT_SECRET out of the browser entirely.

interface Env {
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SESSION_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = await context.request.json() as { code?: string };
    const code = body?.code;

    if (!code) {
      return new Response(JSON.stringify({ error: "Missing authorization code" }), {
        status: 400, headers: corsHeaders,
      });
    }

    const env = context.env as Env;

    if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
      return new Response(JSON.stringify({
        error: "Discord OAuth is not configured. Please set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in Cloudflare Pages environment variables.",
      }), { status: 503, headers: corsHeaders });
    }

    // Exchange code for access token
    const redirectUri = new URL(context.request.url).origin + "/auth/callback";
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Discord token exchange failed:", err);
      return new Response(JSON.stringify({ error: "Discord token exchange failed. Please try signing in again." }), {
        status: 400, headers: corsHeaders,
      });
    }

    const tokenData = await tokenRes.json() as { access_token: string; token_type: string };

    // Fetch the user's Discord profile
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `${tokenData.token_type} ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      return new Response(JSON.stringify({ error: "Failed to retrieve Discord profile" }), {
        status: 400, headers: corsHeaders,
      });
    }

    const discordUser = await userRes.json() as {
      id: string;
      username: string;
      discriminator: string;
      avatar: string | null;
      email?: string;
      global_name?: string;
    };

    // Build a signed session token (simple HMAC-signed JWT-like token)
    const payload = {
      discord_id: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24h
    };

    const encoder = new TextEncoder();
    const keyData = encoder.encode(env.SESSION_SECRET || "belladonna-session-secret-change-me");
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const payloadStr = btoa(JSON.stringify(payload));
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadStr));
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
    const sessionToken = `${payloadStr}.${sigB64}`;

    return new Response(JSON.stringify({
      user: {
        id: discordUser.id,
        username: discordUser.global_name || discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar,
        email: discordUser.email || null,
      },
      session_token: sessionToken,
    }), { status: 200, headers: corsHeaders });

  } catch (e) {
    console.error("Auth callback error:", e);
    return new Response(JSON.stringify({ error: "Internal server error during authentication" }), {
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