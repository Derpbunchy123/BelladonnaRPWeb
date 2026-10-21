import { Shield, Heart, Users, Briefcase, Flame, Camera, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { serverConfig } from "@/config/serverConfig";

type DeptStatus = "recruiting" | "coming-soon" | "active";

interface Department {
  icon: React.ReactNode;
  name: string;
  shortName: string;
  status: DeptStatus;
  tagline: string;
  description: string;
  roles: string[];
  applyPath?: string;
}

const departments: Department[] = [
  {
    icon: <Shield className="h-6 w-6" />,
    name: "Law Enforcement",
    shortName: "LSPD",
    status: "recruiting",
    tagline: "Protect and serve the city of Belladonna.",
    description:
      "The Los Santos Police Department is the primary law enforcement agency in Belladonna. Officers operate under realistic procedural standards — from traffic stops and investigations to high-stakes operations. A structured chain of command and active internal affairs ensure accountability at every rank.",
    roles: ["Patrol Officer", "Detective", "Sergeant", "Lieutenant", "Internal Affairs"],
    applyPath: "/apply",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    name: "Emergency Medical Services",
    shortName: "EMS",
    status: "recruiting",
    tagline: "First on scene. Last to leave.",
    description:
      "The EMS division responds to medical emergencies, trauma scenes, and player revives across the city. EMS personnel are expected to roleplay medical procedures realistically and coordinate closely with law enforcement. Certifications and rank progression are tied to active on-duty performance.",
    roles: ["EMT", "Paramedic", "Flight Medic", "EMS Supervisor", "Medical Director"],
    applyPath: "/apply",
  },
  {
    icon: <Users className="h-6 w-6" />,
    name: "Civilian Operations",
    shortName: "CIV",
    status: "active",
    tagline: "The backbone of city life.",
    description:
      "Civilian Operations encompasses all non-department character paths — from legal professionals and politicians to mechanics, chefs, and taxi drivers. CivOps provides structure for civilian roleplay, including business licensing, employment verification, and event coordination.",
    roles: ["Licensed Attorney", "Judge", "Taxi Driver", "Mechanic", "City Council Member"],
    applyPath: "/apply",
  },
  {
    icon: <Briefcase className="h-6 w-6" />,
    name: "Business Management",
    shortName: "BIZ",
    status: "recruiting",
    tagline: "Build something that lasts.",
    description:
      "Own and operate a business within Belladonna. The Business Management division handles business applications, licensing, and oversight. Owners are expected to actively roleplay their establishments, hire staff, and contribute to the city's economy. From restaurants to law firms, every business shapes the city.",
    roles: ["Business Owner", "Manager", "Employee", "Partner", "Investor"],
    applyPath: "/apply",
  },
  {
    icon: <Flame className="h-6 w-6" />,
    name: "Gang Management",
    shortName: "GANG",
    status: "coming-soon",
    tagline: "The underground has structure too.",
    description:
      "Gang Management provides an official framework for criminal organizations operating within Belladonna. Registered gangs receive territory guidelines, conflict resolution pathways, and direct staff liaisons to help story arcs develop organically without breaking server-wide balance.",
    roles: ["Organization Leader", "Lieutenant", "Soldier", "Associate", "Prospect"],
  },
  {
    icon: <Camera className="h-6 w-6" />,
    name: "Media Operations",
    shortName: "MEDIA",
    status: "coming-soon",
    tagline: "Tell the city's story.",
    description:
      "The Media Operations division supports journalists, photographers, streamers, and content creators embedded within Belladonna. Media characters can break stories, run in-city news channels, conduct interviews, and receive access credentials for major city-wide events.",
    roles: ["Reporter", "Photographer", "News Anchor", "Podcast Host", "Social Media Correspondent"],
  },
];

const statusConfig: Record<DeptStatus, { label: string; bg: string; text: string; border: string }> = {
  recruiting: {
    label: "Recruiting",
    bg: "hsl(142 50% 18% / 0.25)",
    text: "hsl(142 50% 60%)",
    border: "hsl(142 50% 30% / 0.4)",
  },
  "coming-soon": {
    label: "Coming Soon",
    bg: "hsl(38 60% 18% / 0.22)",
    text: "hsl(38 60% 62%)",
    border: "hsl(38 60% 32% / 0.4)",
  },
  active: {
    label: "Active",
    bg: "hsl(210 60% 20% / 0.25)",
    text: "hsl(210 60% 65%)",
    border: "hsl(210 60% 35% / 0.4)",
  },
};

const Departments = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
            Factions
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
            Departments
          </h1>
          <div className="ornament-line h-px w-48 mx-auto mb-6" />
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every role has a place in Belladonna. Explore the city's departments and find where your character belongs.
          </p>
        </div>

        {/* Status key */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {(Object.entries(statusConfig) as [DeptStatus, typeof statusConfig[DeptStatus]][]).map(([, cfg]) => (
            <span
              key={cfg.label}
              className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-sm"
              style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: cfg.text }}
              />
              {cfg.label}
            </span>
          ))}
        </div>

        {/* Department cards */}
        <div className="space-y-5">
          {departments.map((dept, i) => {
            const sc = statusConfig[dept.status];
            return (
              <div
                key={i}
                className={cn(
                  "stat-card-glow rounded-sm p-8 card-hover",
                  dept.status === "coming-soon" && "opacity-75"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-sm flex items-center justify-center"
                    style={{ background: "hsl(344 47% 25% / 0.15)", color: "hsl(340 30% 54%)" }}
                  >
                    {dept.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="font-display text-2xl font-medium text-foreground">
                        {dept.name}
                      </h2>
                      <span
                        className="font-body text-[9px] tracking-[0.35em] uppercase px-2 py-0.5 rounded-sm"
                        style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                      >
                        {sc.label}
                      </span>
                    </div>

                    <p
                      className="font-display italic text-sm mb-4"
                      style={{ color: "hsl(344 47% 42%)" }}
                    >
                      {dept.tagline}
                    </p>

                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                      {dept.description}
                    </p>

                    {/* Roles */}
                    <div className="mb-5">
                      <p className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">
                        Available Roles
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {dept.roles.map((role, ri) => (
                          <span
                            key={ri}
                            className="font-body text-xs px-3 py-1 rounded-sm"
                            style={{
                              background: "hsl(312 18% 16% / 0.6)",
                              color: "hsl(345 20% 72%)",
                              border: "1px solid hsl(312 18% 22%)",
                            }}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Apply link */}
                    {dept.applyPath && dept.status !== "coming-soon" && (
                      <Link to={dept.applyPath}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-body text-[10px] tracking-[0.3em] uppercase bg-transparent transition-all hover:scale-105 group"
                          style={{
                            borderColor: "hsl(344 47% 30% / 0.45)",
                            color: "hsl(345 40% 80%)",
                          }}
                        >
                          Apply for {dept.shortName}
                          <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </Link>
                    )}

                    {dept.status === "coming-soon" && (
                      <p
                        className="font-body text-xs"
                        style={{ color: "hsl(38 60% 55%)" }}
                      >
                        Applications will open when this department launches.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div
          className="rounded-sm p-8 mt-10 text-center border"
          style={{
            background: "hsl(344 47% 14% / 0.15)",
            borderColor: "hsl(344 47% 30% / 0.35)",
          }}
        >
          <h2 className="font-display text-2xl font-medium text-foreground mb-3">
            Not sure where you fit?
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
            Join our Discord and speak to a community guide. We will help you find the right path for your character.
          </p>
          <Button
            size="lg"
            className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-8 py-5 border-0 text-foreground hover:opacity-90 transition-all"
            onClick={() => window.open(serverConfig.discord.inviteLink, "_blank")}
          >
            Join Our Discord
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Departments;