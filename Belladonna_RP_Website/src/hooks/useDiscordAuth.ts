import { useState, useEffect } from "react";

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
}

export function useDiscordAuth() {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("discord_user");
    const token = sessionStorage.getItem("discord_token");
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem("discord_user");
        sessionStorage.removeItem("discord_token");
      }
    }
    setLoading(false);
  }, []);

  const login = (returnPath = "/apply") => {
    // Read the client ID — must be set as VITE_DISCORD_CLIENT_ID in Cloudflare Pages
    // environment variables so Vite embeds it at build time.
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;

    if (!clientId || clientId === "undefined" || clientId.trim() === "") {
      console.error(
        "[BelladonnaRP] Discord OAuth is not configured.\n" +
        "Set VITE_DISCORD_CLIENT_ID in Cloudflare Pages → Settings → Environment Variables,\n" +
        "then trigger a new deployment so Vite embeds the value at build time."
      );
      alert(
        "Discord login is not yet configured on this deployment.\n\n" +
        "If you are the site owner: set VITE_DISCORD_CLIENT_ID in Cloudflare Pages environment variables and redeploy."
      );
      return;
    }

    const state = crypto.randomUUID();
    sessionStorage.setItem("discord_oauth_state", state);
    sessionStorage.setItem("discord_oauth_return", returnPath);

    // The redirect URI must exactly match one of the URIs registered in
    // the Discord Developer Portal under your application → OAuth2 → Redirects.
    // For Cloudflare Pages it should be: https://yourdomain.pages.dev/auth/callback
    // (and your production domain if you have a custom one).
    const redirectUri = `https://www.belladonnarp.com/auth/callback`;
    const scope = encodeURIComponent("identify email");

    const url =
      `https://discord.com/api/oauth2/authorize` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&state=${encodeURIComponent(state)}`;

    window.location.href = url;
  };

  const logout = () => {
    sessionStorage.removeItem("discord_user");
    sessionStorage.removeItem("discord_token");
    setUser(null);
  };

  const getToken = () => sessionStorage.getItem("discord_token") ?? "";

  return { user, loading, login, logout, getToken };
}
