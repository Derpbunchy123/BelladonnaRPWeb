
interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_JWT_SECRET: string;
  DISCORD_BOT_TOKEN: string;
  DISCORD_GUILD_ID: string;
  DISCORD_WHITELIST_ROLE_ID: string;
}

interface Application {
  id: string;
  status: string;
  applicant_discord?: string | null;
  applicant_name?: string | null;
}

interface DiscordResult {
  ok: boolean;
  error?: string;
  skipped?: boolean;
}

async function verifyAdminToken(
  token: string,
  secret: string
): Promise<{ admin_id: number; username: string; role: string } | null> {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64 || !secret) return null;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signature = Uint8Array.from(
      atob(sigB64),
      c => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      encoder.encode(payloadB64)
    );

    if (!valid) return null;

    const payload = JSON.parse(atob(payloadB64));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

async function discordRequest(
  token: string,
  url: string,
  method: string,
  body?: unknown
): Promise<DiscordResult & { data?: any }> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Discord API error:", response.status, details);

      return {
        ok: false,
        error: `Discord returned HTTP ${response.status}`,
      };
    }

    if (response.status === 204) return { ok: true };

    return { ok: true, data: await response.json() };
  } catch (error) {
    console.error("Discord request failed:", error);
    return { ok: false, error: "Could not reach Discord" };
  }
}

async function sendDiscordDM(
  env: Env,
  discordUserId: string,
  message: string
): Promise<DiscordResult> {
  const channel = await discordRequest(
    env.DISCORD_BOT_TOKEN,
    "https://discord.com/api/v10/users/@me/channels",
    "POST",
    { recipient_id: discordUserId }
  );

  if (!channel.ok || !channel.data?.id) {
    return {
      ok: false,
      error: channel.error ?? "Could not open a DM",
    };
  }

  return discordRequest(
    env.DISCORD_BOT_TOKEN,
    `https://discord.com/api/v10/channels/${channel.data.id}/messages`,
    "POST",
    { content: message }
  );
}

async function assignWhitelistedRole(
  env: Env,
  discordUserId: string
): Promise<DiscordResult> {
  return discordRequest(
    env.DISCORD_BOT_TOKEN,
    `https://discord.com/api/v10/guilds/${env.DISCORD_GUILD_ID}/members/${discordUserId}/roles/${env.DISCORD_WHITELIST_ROLE_ID}`,
    "PUT"
  );
}

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const env = context.env;
  const token = (
    context.request.headers.get("Authorization") ?? ""
  ).replace(/^Bearer\s+/, "");

  const admin = await verifyAdminToken(token, env.ADMIN_JWT_SECRET);

  if (!admin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers,
    });
  }

  const appId = context.params.id;

  if (!appId) {
    return new Response(JSON.stringify({ error: "Application ID required" }), {
      status: 400,
      headers,
    });
  }

  let body: {
    status?: string;
    assigned_reviewer?: string | null;
    staff_notes?: string | null;
  };

  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers,
    });
  }

  const allowedStatuses = [
    "Pending",
    "Under Review",
    "Accepted",
    "Denied",
    "More Information Required",
  ];

  if (
    body.status !== undefined &&
    !allowedStatuses.includes(body.status)
  ) {
    return new Response(JSON.stringify({ error: "Invalid status value" }), {
      status: 400,
      headers,
    });
  }

  // Load the application first so Discord decisions use its saved user ID.
  const lookup = await fetch(
    `${env.SUPABASE_URL}/rest/v1/applications?id=eq.${encodeURIComponent(appId)}&select=*`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );

  if (!lookup.ok) {
    console.error("Supabase lookup error:", await lookup.text());

    return new Response(
      JSON.stringify({ error: "Could not load application" }),
      { status: 500, headers }
    );
  }

  const rows = await lookup.json() as Application[];
  const application = rows[0];

  if (!application) {
    return new Response(JSON.stringify({ error: "Application not found" }), {
      status: 404,
      headers,
    });
  }

  const decision = body.status;
  const isDecision = decision === "Accepted" || decision === "Denied";

  // Prevent an already-decided application from being decided again.
  if (
    isDecision &&
    (application.status === "Accepted" || application.status === "Denied")
  ) {
    return new Response(
      JSON.stringify({
        error: "This application already has a final decision.",
      }),
      { status: 409, headers }
    );
  }

  const updates: Record<string, unknown> = {};

  if (body.status !== undefined) updates.status = body.status;

  if (body.assigned_reviewer !== undefined) {
    updates.assigned_reviewer = body.assigned_reviewer;
  }

  if (body.staff_notes !== undefined) {
    updates.staff_notes = body.staff_notes;
  }

  if (Object.keys(updates).length === 0) {
    return new Response(
      JSON.stringify({ error: "No valid fields to update" }),
      { status: 400, headers }
    );
  }

  const update = await fetch(
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

  if (!update.ok) {
    console.error("Supabase update error:", await update.text());

    return new Response(
      JSON.stringify({ error: "Failed to update application" }),
      { status: 500, headers }
    );
  }

  const updatedRows = await update.json();
  const updatedApplication = Array.isArray(updatedRows)
    ? updatedRows[0]
    : updatedRows;

  // Other statuses do not trigger Discord messages or role changes.
  if (!isDecision) {
    return new Response(
      JSON.stringify({
        success: true,
        application: updatedApplication,
        discord: { ok: true, skipped: true },
      }),
      { status: 200, headers }
    );
  }

  if (!application.applicant_discord) {
    return new Response(
      JSON.stringify({
        success: true,
        application: updatedApplication,
        discord: {
          ok: false,
          error:
            "No applicant Discord ID is saved. The decision was saved, but Discord actions were skipped.",
        },
      }),
      { status: 200, headers }
    );
  }

  let role: DiscordResult = { ok: true, skipped: true };
  let dm: DiscordResult;

  const applicantName = application.applicant_name || "there";

  if (decision === "Accepted") {
    role = await assignWhitelistedRole(
      env,
      application.applicant_discord
    );

    dm = await sendDiscordDM(
      env,
      application.applicant_discord,
      `Hi ${applicantName}! Your BelladonnaRP application has been accepted. Welcome to the city!`
    );
  } else {
    dm = await sendDiscordDM(
      env,
      application.applicant_discord,
      `Hi ${applicantName}, thank you for applying to BelladonnaRP. Unfortunately, your application has not been accepted at this time.`
    );
  }

  const discordSuccess = dm.ok && role.ok;

  return new Response(
    JSON.stringify({
      success: true,
      application: updatedApplication,
      discord: {
        success: discordSuccess,
        role,
        dm,
        note: discordSuccess
          ? "Discord actions completed."
          : "The application decision was saved, but one or more Discord actions failed. Review the results before retrying.",
      },
    }),
    { status: 200, headers }
  );
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
