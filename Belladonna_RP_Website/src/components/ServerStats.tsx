import { useEffect, useState } from "react";
import { Users, Server, Activity, Wifi, WifiOff, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { serverConfig } from "@/config/serverConfig";

interface DiscordStats {
  presence_count: number;
  approximate_member_count?: number;
  name: string;
}

interface GameServerStats {
  players: number;
  maxPlayers: number;
  hostname: string;
}

const ServerStats = () => {
  const [discordStats, setDiscordStats] = useState<DiscordStats | null>(null);
  const [discordError, setDiscordError] = useState(false);
  const [gameStats, setGameStats] = useState<GameServerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameOnline, setGameOnline] = useState(false);

  const hasValidGuildId =
    serverConfig.discord.guildId &&
    serverConfig.discord.guildId !== "YOUR_DISCORD_SERVER_ID" &&
    serverConfig.discord.guildId.trim().length > 0;

  const cfxCode = serverConfig.gameServer.cfxCode;
  const hasValidCfxCode =
    cfxCode &&
    cfxCode !== "placeholder" &&
    cfxCode.trim().length > 0;
  const fivemConnectUrl = hasValidCfxCode ? `https://cfx.re/join/${cfxCode}` : null;

  const fetchDiscordStats = async () => {
    if (!serverConfig.discord.enabled || !hasValidGuildId) return;
    try {
      const response = await fetch(
        `https://discord.com/api/guilds/${serverConfig.discord.guildId}/widget.json`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.presence_count === "number") {
          setDiscordStats(data);
          setDiscordError(false);
        } else {
          setDiscordStats(null);
          setDiscordError(true);
        }
      } else {
        setDiscordStats(null);
        setDiscordError(true);
      }
    } catch {
      setDiscordStats(null);
      setDiscordError(true);
    }
  };

  const fetchGameServerStats = async () => {
    if (!serverConfig.gameServer.enabled || !hasValidCfxCode) return;
    try {
      const response = await fetch(
        `https://servers-frontend.fivem.net/api/servers/single/${serverConfig.gameServer.cfxCode}`
      );
      if (response.ok) {
        const data = await response.json();
        setGameStats({
          players: data.Data?.clients || 0,
          maxPlayers: data.Data?.sv_maxclients || 0,
          hostname: data.Data?.hostname || "Belladonna RP",
        });
        setGameOnline(true);
      } else {
        setGameOnline(false);
      }
    } catch {
      setGameOnline(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      await Promise.all([fetchDiscordStats(), fetchGameServerStats()]);
      setLoading(false);
    };

    fetchStats();
    const interval = setInterval(fetchStats, serverConfig.display.refreshInterval);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!serverConfig.display.showOnHomePage) return null;
  if (!serverConfig.discord.enabled && !serverConfig.gameServer.enabled) return null;

  const discordLive = !loading && discordStats !== null;

  return (
    <section className="py-16 px-4 relative" aria-label="Live server status">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "hsl(312 20% 8% / 0.5)" }}
        aria-hidden="true"
      />

      <div className="relative container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-2">
            Live Status
          </p>
          <h2 className="font-display text-3xl font-light text-foreground">
            Server &amp; Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* FiveM Server */}
          {serverConfig.gameServer.enabled && (
            <div
              className="stat-card-glow rounded-sm p-6 card-hover"
              role="region"
              aria-label="FiveM server status"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 p-2.5 rounded-sm"
                  style={{ background: "hsl(344 47% 25% / 0.15)" }}
                  aria-hidden="true"
                >
                  <Server className="h-5 w-5 text-bella-rose" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-body text-sm font-medium text-foreground tracking-wide">
                      FiveM Server
                    </h3>
                    {!loading && (
                      <div className="flex items-center gap-1.5" aria-live="polite" aria-atomic="true">
                        {gameOnline ? (
                          <>
                            <span className="online-dot" aria-hidden="true" />
                            <span className="font-body text-xs text-green-400 tracking-wider">Online</span>
                          </>
                        ) : (
                          <>
                            <span className="offline-dot" aria-hidden="true" />
                            <span className="font-body text-xs text-muted-foreground tracking-wider">Offline</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="space-y-2 mt-2" aria-label="Loading server stats">
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-2.5 w-28 bg-muted/60 rounded animate-pulse" />
                    </div>
                  ) : !hasValidCfxCode ? (
                    <div>
                      <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">
                        CFX code not configured.
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
                        Set <code className="text-bella-rose">cfxCode</code> in <code className="text-bella-rose">serverConfig.ts</code>.
                      </p>
                    </div>
                  ) : gameStats && gameOnline ? (
                    <div aria-live="polite" aria-atomic="true">
                      <p className="font-display text-3xl font-light text-bella-rose">
                        {gameStats.players}
                        <span className="text-muted-foreground text-lg font-light">
                          /{gameStats.maxPlayers}
                        </span>
                      </p>
                      <p className="font-body text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
                        Players Online
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mt-2">
                        <WifiOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <p className="font-body text-sm text-muted-foreground">
                          Server unavailable
                        </p>
                      </div>
                    </div>
                  )}

                  {!loading && gameOnline && fivemConnectUrl && (
                    <div className="mt-4">
                      <Button
                        size="sm"
                        className="western-gradient font-body text-[10px] tracking-[0.25em] uppercase border-0 text-foreground hover:opacity-90 transition-all hover:scale-105"
                        onClick={() => window.open(fivemConnectUrl, "_blank")}
                        aria-label="Join the Belladonna city server in FiveM (opens FiveM)"
                      >
                        Join the City
                        <ExternalLink className="ml-1.5 h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Discord */}
          {serverConfig.discord.enabled && (
            <div
              className="stat-card-glow rounded-sm p-6 card-hover"
              role="region"
              aria-label="Discord community status"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 p-2.5 rounded-sm"
                  style={{ background: "hsl(344 47% 25% / 0.15)" }}
                  aria-hidden="true"
                >
                  <Users className="h-5 w-5 text-bella-rose" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-body text-sm font-medium text-foreground tracking-wide">
                      Discord Community
                    </h3>
                    {discordLive && (
                      <div className="flex items-center gap-1.5" aria-label="Live Discord data">
                        <span className="online-dot" aria-hidden="true" />
                        <span className="font-body text-xs text-green-400 tracking-wider">Live</span>
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="space-y-2 mt-2" aria-label="Loading Discord stats">
                      <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                      <div className="h-2.5 w-24 bg-muted/60 rounded animate-pulse" />
                    </div>
                  ) : discordStats ? (
                    <div aria-live="polite" aria-atomic="true">
                      <p className="font-display text-3xl font-light text-bella-rose">
                        {discordStats.presence_count.toLocaleString()}
                      </p>
                      <p className="font-body text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
                        Members Online
                      </p>
                    </div>
                  ) : discordError && !hasValidGuildId ? (
                    <div className="mt-2">
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        Join us on Discord
                      </p>
                    </div>
                  ) : discordError ? (
                    <div>
                      <div className="flex items-center gap-2 mt-2">
                        <Wifi className="h-4 w-4 text-bella-rose" aria-hidden="true" />
                        <p className="font-body text-sm text-muted-foreground">
                          Stats unavailable
                        </p>
                      </div>
                      <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
                        Enable the Server Widget in your Discord settings.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="font-body text-sm text-muted-foreground">
                        Join us on Discord
                      </p>
                    </div>
                  )}

                  {!loading && (
                    <div className="mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-body text-[10px] tracking-[0.25em] uppercase bg-transparent transition-all hover:scale-105"
                        style={{
                          borderColor: "hsl(344 47% 30% / 0.45)",
                          color: "hsl(345 40% 80%)",
                        }}
                        onClick={() => window.open(serverConfig.discord.inviteLink, "_blank")}
                        aria-label="Join our Discord server (opens in new tab)"
                      >
                        Join Discord
                        <ExternalLink className="ml-1.5 h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Refresh indicator */}
        <div className="text-center mt-6" aria-live="off">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground font-body tracking-widest uppercase opacity-50">
            <Activity className="h-3 w-3" aria-hidden="true" />
            <span>Updates every {serverConfig.display.refreshInterval / 1000}s</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServerStats;