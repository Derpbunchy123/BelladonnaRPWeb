// ─────────────────────────────────────────────────────────────────────────────
// BelladonnaRP — Server Configuration
// Edit the values in this file to connect the site to your live server.
// ─────────────────────────────────────────────────────────────────────────────

export const serverConfig = {

  // ── Discord ───────────────────────────────────────────────────────────────
  //
  // INVITE LINK (already set):
  //   The invite link below is used for every "Join Discord" button on the site.
  //   It is already configured to https://discord.gg/8xj6Tjp25F.
  //   To change it, replace the value below.
  //
  // LIVE MEMBER COUNT WIDGET (optional):
  //   To display a live "Members Online" count in the Server Status section:
  //
  //   1. Open your Discord server → Server Settings → Widget.
  //   2. Toggle "Enable Server Widget" ON.
  //   3. Copy the Server ID shown on that page (a long number, e.g. "1234567890123456789").
  //   4. Paste it into guildId below, replacing "YOUR_DISCORD_SERVER_ID".
  //
  //   The widget endpoint is PUBLIC — no bot token, no API key, and no secrets
  //   are required or used. The site only reads the public presence_count field.
  //
  //   If guildId is left as the placeholder, or if the widget is disabled in
  //   Discord settings, the stat card will show a graceful "Stats unavailable"
  //   fallback and the "Join Discord" button will still work normally.
  //
  discord: {
    enabled: true,
    guildId: "YOUR_DISCORD_SERVER_ID",   // ← replace with your numeric Server ID to enable live stats
    inviteLink: "https://discord.gg/8xj6Tjp25F",
  },

  // ── FiveM / RedM Game Server ──────────────────────────────────────────────
  // How to find your CFX join code:
  //   1. Open the FiveM server list at https://servers.fivem.net and search for your server,
  //      OR open your txAdmin panel — the join code is shown on the overview page.
  //   2. The code is the short alphanumeric string after "cfx.re/join/" in your server's
  //      direct connect URL (e.g. if the URL is cfx.re/join/abc123, the code is "abc123").
  //   3. Paste it in cfxCode below.
  //
  // The stats are fetched from the public CFX API:
  //   https://servers-frontend.fivem.net/api/servers/single/<cfxCode>
  // No API key, backend, or environment variable is required.
  //
  // The "Join the City" button in the status widget will link to:
  //   https://cfx.re/join/<cfxCode>
  // It only appears when the server responds as online AND cfxCode is set to a real value.
  gameServer: {
    enabled: true,
    type: "fivem" as "fivem" | "redm",
    cfxCode: "placeholder",             // ← replace with your CFX join code (e.g. "abc123")
  },

  // ── Display Settings ──────────────────────────────────────────────────────
  display: {
    showOnHomePage: true,
    refreshInterval: 30000,             // milliseconds — 30 s is a safe default
  },
};