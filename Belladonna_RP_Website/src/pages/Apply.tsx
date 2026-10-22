import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Shield,
  Briefcase,
  Flame,
  FlaskConical,
  Users,
  Lock,
} from "lucide-react";
import { serverConfig } from "@/config/serverConfig";
import ApplicationForm from "@/components/ApplicationForm";
import { useDiscordAuth } from "@/hooks/useDiscordAuth";

interface ApplicationType {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  available: boolean;
  comingSoon?: boolean;
}

const applicationTypes: ApplicationType[] = [
  {
    id: "whitelist",
    icon: <FileText className="h-5 w-5" />,
    title: "Server Whitelist Application",
    desc: "Apply for whitelist access to join the BelladonnaRP server. Required for all new players.",
    available: true,
  },
  {
    id: "staff",
    icon: <Shield className="h-5 w-5" />,
    title: "Staff Application",
    desc: "Apply to join the BelladonnaRP moderation and administration team.",
    available: true,
  },
  {
    id: "beta",
    icon: <FlaskConical className="h-5 w-5" />,
    title: "Beta Testing Application",
    desc: "Apply for early access to unreleased features. Help shape the future of Belladonna.",
    available: true,
  },
  {
    id: "business",
    icon: <Briefcase className="h-5 w-5" />,
    title: "Business Owner Application",
    desc: "Register a business within Belladonna. Applications reviewed by the Business Management division.",
    available: false,
    comingSoon: true,
  },
  {
    id: "gang",
    icon: <Flame className="h-5 w-5" />,
    title: "Gang / Organization Application",
    desc: "Register a criminal organization under the Gang Management framework.",
    available: false,
    comingSoon: true,
  },
];

const Apply = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const { user, loading: authLoading } = useDiscordAuth();

  if (activeForm) {
    return (
      <ApplicationForm
        type={activeForm}
        onBack={() => setActiveForm(null)}
      />
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
            Join the City
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
            Applications
          </h1>
          <div className="ornament-line h-px w-48 mx-auto mb-6" />
          <p className="font-body text-base text-muted-foreground">
            Start your Belladonna story today
          </p>
        </div>

        {/* How it works */}
        <div className="stat-card-glow rounded-sm p-8 md:p-10 mb-6">
          <div className="flex flex-col items-center text-center mb-10">
            <div
              className="w-16 h-16 rounded-sm flex items-center justify-center mb-6"
              style={{ background: "hsl(344 47% 25% / 0.15)" }}
            >
              <FileText className="w-8 h-8 text-bella-rose" />
            </div>
            <h2 className="font-display text-3xl font-medium text-foreground mb-4">
              How It Works
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xl">
              We review every application personally to maintain the quality of roleplay in Belladonna. The process typically takes 24 to 48 hours.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {[
              {
                title: "Step 1: Read the Rules",
                desc: "Make sure you have read and understood all server rules before applying. Applications that show no awareness of our standards are declined immediately.",
              },
              {
                title: "Step 2: Sign In with Discord",
                desc: "You must authenticate with your Discord account to apply. This verifies your identity and links your application to your Discord profile.",
              },
              {
                title: "Step 3: Submit Your Application",
                desc: "Complete the application form with honest and detailed information about yourself and your roleplay experience.",
              },
              {
                title: "Step 4: Wait for Review",
                desc: "Our staff will review your application and reach out via Discord. Once approved, you can apply to departments or factions if desired.",
              },
            ].map((step, i) => (
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-10 py-6 border-0 text-foreground hover:opacity-90 transition-all hover:scale-105"
              onClick={() => window.open(serverConfig.discord.inviteLink, "_blank")}
            >
              Join Discord First
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Discord auth status */}
        {!authLoading && !user && (
          <div
            className="rounded-sm p-5 mb-6 border flex items-center gap-4"
            style={{
              background: "hsl(38 60% 14% / 0.18)",
              borderColor: "hsl(38 60% 32% / 0.45)",
            }}
          >
            <Lock className="h-4 w-4 flex-shrink-0" style={{ color: "hsl(38 60% 60%)" }} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium" style={{ color: "hsl(38 60% 65%)" }}>
                  Discord Sign-In Required:{" "}
                </span>
                You must sign in with Discord to access and submit any application. Click an available application below to begin.
              </p>
            </div>
          </div>
        )}

        {!authLoading && user && (
          <div
            className="rounded-sm p-5 mb-6 border flex items-center gap-4"
            style={{
              background: "hsl(140 40% 12% / 0.2)",
              borderColor: "hsl(140 40% 28% / 0.45)",
            }}
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "hsl(140 40% 55%)" }} />
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium" style={{ color: "hsl(140 40% 60%)" }}>
                Signed in as {user.username}
              </span>
              {" "}— You may now access available application forms below.
            </p>
          </div>
        )}

        {/* Application types */}
        <div className="stat-card-glow rounded-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-bella-rose flex-shrink-0" />
            <h2 className="font-display text-2xl font-medium text-foreground">
              All Applications
            </h2>
          </div>
          <p className="font-body text-sm text-muted-foreground mb-7 leading-relaxed">
            You must be in our Discord before applying to any department, business, or organization.
          </p>

          <div className="space-y-3">
            {applicationTypes.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between gap-4 p-5 rounded-sm border transition-all duration-200"
                style={{
                  background: app.available
                    ? "hsl(312 18% 10% / 0.45)"
                    : "hsl(312 18% 8% / 0.3)",
                  borderColor: app.available
                    ? "hsl(312 18% 22%)"
                    : "hsl(312 18% 16%)",
                  opacity: app.available ? 1 : 0.55,
                }}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <span
                    className="flex-shrink-0 p-2 rounded-sm mt-0.5"
                    style={{
                      background: "hsl(344 47% 25% / 0.15)",
                      color: app.available ? "hsl(340 30% 54%)" : "hsl(312 12% 40%)",
                    }}
                  >
                    {app.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-base font-medium text-foreground mb-0.5">
                      {app.title}
                    </p>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                      {app.desc}
                    </p>
                  </div>
                </div>

                {app.available ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0 font-body text-[10px] tracking-[0.25em] uppercase bg-transparent transition-all hover:scale-105"
                    style={{
                      borderColor: "hsl(344 47% 30% / 0.45)",
                      color: "hsl(345 40% 80%)",
                    }}
                    onClick={() => setActiveForm(app.id)}
                  >
                    Apply Now
                    <ExternalLink className="ml-1.5 h-3 w-3" />
                  </Button>
                ) : (
                  <span
                    className="flex-shrink-0 font-body text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-sm whitespace-nowrap"
                    style={{
                      background: "hsl(38 60% 18% / 0.2)",
                      color: "hsl(38 60% 55%)",
                      border: "1px solid hsl(38 60% 30% / 0.3)",
                    }}
                  >
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tips card */}
        <div className="stat-card-glow rounded-sm p-8">
          <h2 className="font-display text-2xl font-medium text-foreground mb-6">
            Application Tips
          </h2>
          <ul className="space-y-3">
            {[
              "Be honest about your roleplay experience level",
              "Take time to write thoughtful, detailed responses",
              "Show your understanding of serious, immersive city roleplay",
              "Check your spelling and grammar before submitting",
              "Be patient — quality applications take time to review",
              "Review the Departments page before applying to a specific faction",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="font-body text-xs mt-1 flex-shrink-0"
                  style={{ color: "hsl(344 47% 45%)" }}
                >
                  ◆
                </span>
                <span className="font-body text-sm text-muted-foreground leading-relaxed">
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dept link */}
        <div className="mt-6 text-center">
          <p className="font-body text-sm text-muted-foreground mb-3">
            Not sure which department is right for you?
          </p>
          <Link to="/departments">
            <Button
              variant="outline"
              className="font-body text-xs tracking-widest uppercase bg-transparent transition-all hover:scale-105"
              style={{
                borderColor: "hsl(344 47% 30% / 0.45)",
                color: "hsl(345 40% 80%)",
              }}
            >
              View All Departments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Apply;
