import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FlaskConical,
  CheckCircle2,
  Zap,
  Users,
  Shield,
  AlertTriangle,
  Skull,
  Flame,
  Building2,
  Map,
  Briefcase,
  Calendar,
} from "lucide-react";
import { serverConfig } from "@/config/serverConfig";

const BETA_FORM_URL = "https://forms.gle/placeholder-beta";

const testingAreas = [
  {
    icon: <Skull className="h-4 w-4" />,
    title: "Supernatural Faction Mechanics",
    desc: "New ability systems, faction interactions, and D20 challenge flows for vampires, werewolves, witches, and warlocks.",
  },
  {
    icon: <Flame className="h-4 w-4" />,
    title: "Gang War System",
    desc: "Updated KP declaration and resolution flow, territory logic, and alliance mechanics under the revised gang framework.",
  },
  {
    icon: <Briefcase className="h-4 w-4" />,
    title: "Economy Scripts",
    desc: "New business ownership mechanics, underground market flows, and revised property earning structures.",
  },
  {
    icon: <Building2 className="h-4 w-4" />,
    title: "New Interior Zones",
    desc: "Custom interiors for upcoming faction safehouses, government buildings, and civilian businesses.",
  },
  {
    icon: <Shield className="h-4 w-4" />,
    title: "Department SOPs v2",
    desc: "Revised law enforcement procedures, updated arrest and processing scripts, and new EMS response systems.",
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    title: "Custom Event Framework",
    desc: "Staff-run event tooling including city-wide triggers, announcement systems, and dynamic scene management.",
  },
];

const steps = [
  {
    title: "Step 1: Join Our Discord",
    desc: "You must be an active member of the BelladonnaRP Discord before applying. Beta testers are verified through Discord only.",
  },
  {
    title: "Step 2: Submit Your Application",
    desc: "Fill out the beta testing application form below. Tell us about your roleplay experience and which areas you are most interested in testing.",
  },
  {
    title: "Step 3: Await Staff Whitelist",
    desc: "Staff will review applications and reach out via Discord. Selected testers will be whitelisted and briefed before the testing period begins.",
  },
];

const requirements = [
  "Active BelladonnaRP Discord member in good standing",
  "Agree to maintain confidentiality — do not share unreleased content publicly",
  "Provide detailed, structured bug reports via Discord tickets",
  "Available for at least two testing sessions per week during the active testing period",
  "Understand that beta features may be unstable, incomplete, or subject to change",
];

const BetaTesting = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
            Early Access
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
            Beta Testing
          </h1>
          <div className="ornament-line h-px w-48 mx-auto mb-6" />
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Help shape the future of Belladonna. Beta testers get early access to unreleased
            features and play a direct role in improving the city before changes go live.
          </p>
        </div>

        {/* Info notice */}
        <div
          className="rounded-sm p-6 mb-6 border"
          style={{
            background: "hsl(344 47% 14% / 0.18)",
            borderColor: "hsl(344 47% 30% / 0.45)",
          }}
        >
          <div className="flex items-start gap-4">
            <FlaskConical
              className="h-4 w-4 flex-shrink-0 mt-0.5"
              style={{ color: "hsl(340 30% 60%)" }}
            />
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium" style={{ color: "hsl(340 30% 60%)" }}>
                What is Beta Testing?{" "}
              </span>
              Beta testers receive early access to systems and content that have not yet been
              released to the full city. In exchange, testers are expected to report bugs, provide
              feedback, and maintain confidentiality about unreleased features. All reports are
              submitted through Discord tickets.
            </p>
          </div>
        </div>

        {/* What we're testing */}
        <div className="stat-card-glow rounded-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-5 w-5 text-bella-rose flex-shrink-0" />
            <h2 className="font-display text-2xl font-medium text-foreground">
              What We Are Testing
            </h2>
          </div>
          <p className="font-body text-sm text-muted-foreground mb-7 leading-relaxed">
            The current beta cycle covers six major feature areas. Testers may be invited to
            sessions for one or more of these depending on availability and experience.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {testingAreas.map((area, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-sm transition-all duration-200"
                style={{
                  background: "hsl(312 18% 10% / 0.45)",
                  border: "1px solid hsl(312 18% 22%)",
                }}
              >
                <span
                  className="flex-shrink-0 p-1.5 rounded-sm mt-0.5"
                  style={{
                    background: "hsl(344 47% 25% / 0.15)",
                    color: "hsl(340 30% 54%)",
                  }}
                >
                  {area.icon}
                </span>
                <div>
                  <h3 className="font-display text-base font-medium text-foreground mb-1">
                    {area.title}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    {area.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to apply */}
        <div className="stat-card-glow rounded-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-bella-rose flex-shrink-0" />
            <h2 className="font-display text-2xl font-medium text-foreground">
              How to Apply
            </h2>
          </div>
          <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
            The application process is straightforward. Follow these three steps to be considered
            for the beta testing programme.
          </p>

          <div className="space-y-6 mb-10">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <CheckCircle2
                    className="w-5 h-5 mt-0.5"
                    style={{ color: "hsl(344 47% 45%)" }}
                  />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            className="h-px mb-8"
            style={{ background: "hsl(312 18% 20%)" }}
          />

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-10 py-6 border-0 text-foreground hover:opacity-90 transition-all hover:scale-105"
              onClick={() => window.open(BETA_FORM_URL, "_blank")}
            >
              Apply for Beta Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-body text-sm tracking-widest uppercase px-10 py-6 bg-transparent transition-all hover:scale-105"
              style={{
                borderColor: "hsl(344 47% 30% / 0.45)",
                color: "hsl(345 40% 80%)",
              }}
              onClick={() => window.open(serverConfig.discord.inviteLink, "_blank")}
            >
              Join Discord First
            </Button>
          </div>
        </div>

        {/* Requirements */}
        <div
          className="rounded-sm p-6 mb-6 border"
          style={{
            background: "hsl(38 60% 14% / 0.18)",
            borderColor: "hsl(38 60% 32% / 0.45)",
          }}
        >
          <div className="flex items-start gap-4">
            <AlertTriangle
              className="h-4 w-4 flex-shrink-0 mt-0.5"
              style={{ color: "hsl(38 60% 60%)" }}
            />
            <div>
              <p
                className="font-body text-sm font-medium mb-4"
                style={{ color: "hsl(38 60% 65%)" }}
              >
                Tester Requirements
              </p>
              <ul className="space-y-2.5">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="font-body text-xs mt-1 flex-shrink-0"
                      style={{ color: "hsl(38 60% 48%)" }}
                    >
                      ◆
                    </span>
                    <span className="font-body text-sm text-muted-foreground leading-relaxed">
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer CTA card */}
        <div
          className="stat-card-glow rounded-sm p-8 text-center"
          style={{ borderColor: "hsl(344 47% 30% / 0.35)" }}
        >
          <h2 className="font-display text-2xl font-medium text-foreground mb-3">
            Ready to help build the city?
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
            Beta testers shape what Belladonna becomes. If you are committed, detail-oriented,
            and want to be part of what is coming next, we want to hear from you.
          </p>
          <Button
            size="lg"
            className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-10 py-6 border-0 text-foreground hover:opacity-90 transition-all hover:scale-105"
            onClick={() => window.open(https://forms.gle/XLcVX3W6Pr53gGBH7, "_blank")}
          >
            Submit Application
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

      </div>
    </div>
  );
};

export default BetaTesting;
