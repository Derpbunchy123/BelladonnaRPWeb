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
    const state = crypto.randomUUID();
    sessionStorage.setItem("discord_oauth_state", state);
    sessionStorage.setItem("discord_oauth_return", returnPath);

    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const scope = encodeURIComponent("identify email");
    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
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
