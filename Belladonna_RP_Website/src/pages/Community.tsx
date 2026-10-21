import { useState, useEffect } from "react";
import { MessageSquare, Bell, Link2, ExternalLink, ChevronRight, Users, Calendar, Megaphone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serverConfig } from "@/config/serverConfig";

interface Announcement {
  date: string;
  tag: string;
  title: string;
  body: string;
}

const announcements: Announcement[] = [
  {
    date: "2025-07-01",
    tag: "Server Update",
    title: "[PLACEHOLDER] City Launch — Phase 1 Complete",
    body: "Replace this announcement with your first city launch update. Include server highlights, what went well, and what is coming next.",
  },
  {
    date: "2025-06-20",
    tag: "Departments",
    title: "[PLACEHOLDER] LSPD Applications Now Open",
    body: "Replace this with your department recruitment announcement. Include how to apply, what is expected, and any rank openings.",
  },
  {
    date: "2025-06-12",
    tag: "Community",
    title: "[PLACEHOLDER] Welcome to BelladonnaRP",
    body: "Replace this with your community welcome message. Introduce the staff team, link to your Discord, and outline what new members should do first.",
  },
];

const tagColors: Record<string, { bg: string; text: string; border: string }> = {
  "Server Update": {
    bg: "hsl(210 60% 20% / 0.25)",
    text: "hsl(210 60% 65%)",
    border: "hsl(210 60% 35% / 0.4)",
  },
  "Departments": {
    bg: "hsl(142 50% 18% / 0.25)",
    text: "hsl(142 50% 60%)",
    border: "hsl(142 50% 30% / 0.4)",
  },
  "Community": {
    bg: "hsl(344 47% 18% / 0.2)",
    text: "hsl(340 30% 60%)",
    border: "hsl(344 47% 30% / 0.4)",
  },
};

const cfxCode = serverConfig.gameServer.cfxCode;
const hasValidCfxCode =
  cfxCode &&
  cfxCode !== "placeholder" &&
  cfxCode.trim().length > 0;
const fivemConnectUrl = hasValidCfxCode
  ? `https://cfx.re/join/${cfxCode}`
  : "https://cfx.re";

const usefulLinks = [
  {
    label: "Discord Server",
    desc: "Join the community, read announcements, and get support.",
    href: serverConfig.discord.inviteLink,
  },
  {
    label: "Connect via FiveM",
    desc: "Direct connection link — requires FiveM installed.",
    href: fivemConnectUrl,
  },
  {
    label: "Whitelist Application",
    desc: "Submit your application to gain access to the server.",
    href: "https://forms.gle/placeholder",
  },
  {
    label: "Ban Appeal Form",
    desc: "Submit a ban appeal if you believe your ban was in error.",
    href: "https://forms.gle/placeholder",
  },
  {
    label: "Player Report Form",
    desc: "Report a rule violation or player misconduct to staff.",
    href: "https://forms.gle/placeholder",
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const Community = () => {
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    if (!serverConfig.discord.enabled) return;
    const hasValidGuildId =
      serverConfig.discord.guildId &&
      serverConfig.discord.guildId !== "YOUR_DISCORD_SERVER_ID" &&
      serverConfig.discord.guildId.trim().length > 0;
    if (!hasValidGuildId) return;

    fetch(`https://discord.com/api/guilds/${serverConfig.discord.guildId}/widget.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.presence_count === "number") {
          setMemberCount(data.presence_count);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
            The Community
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
            Community Hub
          </h1>
          <div className="ornament-line h-px w-48 mx-auto mb-6" />
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Stay connected, read the latest updates, and find every link you need.
          </p>
        </div>

        <div className="space-y-6">
          {/* Discord CTA card */}
          <div
            className="stat-card-glow rounded-sm p-8"
            style={{ borderColor: "hsl(344 47% 30% / 0.45)" }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div
                className="flex-shrink-0 w-14 h-14 rounded-sm flex items-center justify-center"
                style={{ background: "hsl(344 47% 25% / 0.15)" }}
                aria-hidden="true"
              >
                <MessageSquare className="h-6 w-6" style={{ color: "hsl(340 30% 54%)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="font-display text-2xl font-medium text-foreground">
                    Discord Community
                  </h2>
                  {memberCount !== null && (
                    <span
                      className="inline-flex items-center gap-1.5 font-body text-[9px] tracking-[0.35em] uppercase px-2.5 py-1 rounded-sm"
                      style={{
                        background: "hsl(142 50% 18% / 0.25)",
                        color: "hsl(142 50% 60%)",
                        border: "1px solid hsl(142 50% 30% / 0.4)",
                      }}
                      aria-label={`${memberCount.toLocaleString()} members currently online`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" aria-hidden="true" />
                      {memberCount.toLocaleString()} online
                    </span>
                  )}
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                  Our Discord is the heart of the BelladonnaRP community. Get whitelisted, find your faction, read announcements, and connect with other players.
                </p>
                <Button
                  className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-8 py-5 border-0 text-foreground hover:opacity-90 transition-all hover:scale-105"
                  onClick={() => window.open(serverConfig.discord.inviteLink, "_blank")}
                  aria-label="Join our Discord server (opens in new tab)"
                >
                  Join Our Discord
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="stat-card-glow rounded-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Megaphone className="h-5 w-5" style={{ color: "hsl(340 30% 54%)" }} aria-hidden="true" />
              <h2 className="font-display text-2xl font-medium text-foreground">
                Announcements
              </h2>
            </div>

            <div
              className="rounded-sm p-4 mb-6 border flex items-start gap-3"
              style={{
                background: "hsl(38 60% 18% / 0.18)",
                borderColor: "hsl(38 60% 35% / 0.4)",
              }}
              role="note"
            >
              <Bell className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "hsl(38 60% 60%)" }} aria-hidden="true" />
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium" style={{ color: "hsl(38 60% 65%)" }}>Note: </span>
                These are placeholder announcements. Replace them with real server updates in the Community page component.
              </p>
            </div>

            <div className="space-y-5">
              {announcements.map((ann, i) => {
                const tagStyle = tagColors[ann.tag] ?? tagColors["Community"];
                return (
                  <article
                    key={i}
                    className="rounded-sm p-6 border transition-colors duration-200"
                    style={{
                      background: "hsl(312 18% 10% / 0.5)",
                      borderColor: "hsl(312 18% 22%)",
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className="font-body text-[9px] tracking-[0.3em] uppercase px-2 py-0.5 rounded-sm"
                        style={{ background: tagStyle.bg, color: tagStyle.text, border: `1px solid ${tagStyle.border}` }}
                      >
                        {ann.tag}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                        <time className="font-body text-xs text-muted-foreground" dateTime={ann.date}>
                          {formatDate(ann.date)}
                        </time>
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-medium text-foreground mb-2">
                      {ann.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      {ann.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Useful Links */}
          <div className="stat-card-glow rounded-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Link2 className="h-5 w-5" style={{ color: "hsl(340 30% 54%)" }} aria-hidden="true" />
              <h2 className="font-display text-2xl font-medium text-foreground">
                Useful Links
              </h2>
            </div>

            <nav aria-label="Useful community links">
              <div className="space-y-2">
                {usefulLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} — ${link.desc} (opens in new tab)`}
                    className="flex items-center justify-between gap-4 p-4 rounded-sm border transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-bella-rose"
                    style={{
                      background: "hsl(312 18% 10% / 0.4)",
                      borderColor: "hsl(312 18% 20%)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "hsl(344 47% 30% / 0.5)";
                      (e.currentTarget as HTMLElement).style.background = "hsl(344 47% 12% / 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "hsl(312 18% 20%)";
                      (e.currentTarget as HTMLElement).style.background = "hsl(312 18% 10% / 0.4)";
                    }}
                  >
                    <div className="min-w-0">
                      <p className="font-body text-sm font-medium text-foreground mb-0.5">
                        {link.label}
                      </p>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed">
                        {link.desc}
                      </p>
                    </div>
                    <ChevronRight
                      className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:translate-x-0.5 transition-transform"
                      style={{ color: "hsl(344 47% 45%)" }}
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </nav>
          </div>

          {/* Community Stats strip */}
          <div
            className="rounded-sm p-6 border grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
            style={{
              background: "hsl(344 47% 14% / 0.12)",
              borderColor: "hsl(344 47% 30% / 0.35)",
            }}
          >
            {[
              { icon: <Users className="h-5 w-5" aria-hidden="true" />, value: "500+", label: "Community Members" },
              { icon: <Shield className="h-5 w-5" aria-hidden="true" />, value: "4", label: "Active Departments" },
              { icon: <Calendar className="h-5 w-5" aria-hidden="true" />, value: "Weekly", label: "Community Events" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span style={{ color: "hsl(340 30% 54%)" }}>{stat.icon}</span>
                <p className="font-display text-3xl font-light text-foreground">
                  {stat.value}
                </p>
                <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;