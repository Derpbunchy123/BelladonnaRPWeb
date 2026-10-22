import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  Lock,
  Loader2,
} from "lucide-react";
import { useDiscordAuth } from "@/hooks/useDiscordAuth";

interface Props {
  type: string;
  onBack: () => void;
}

const FORM_CONFIG: Record<string, {
  title: string;
  eyebrow: string;
  desc: string;
  questions: { id: string; label: string; placeholder: string; long: boolean; required: boolean }[];
}> = {
  whitelist: {
    title: "Server Whitelist Application",
    eyebrow: "Join the City",
    desc: "Complete all 15 questions honestly and in detail. We review every application personally.",
    questions: [
      { id: "q1", label: "Question 1", placeholder: "Your answer…", long: true, required: true },
      { id: "q2", label: "Question 2", placeholder: "Your answer…", long: true, required: true },
      { id: "q3", label: "Question 3", placeholder: "Your answer…", long: true, required: true },
      { id: "q4", label: "Question 4", placeholder: "Your answer…", long: true, required: true },
      { id: "q5", label: "Question 5", placeholder: "Your answer…", long: true, required: true },
      { id: "q6", label: "Question 6", placeholder: "Your answer…", long: true, required: true },
      { id: "q7", label: "Question 7", placeholder: "Your answer…", long: true, required: true },
      { id: "q8", label: "Question 8", placeholder: "Your answer…", long: true, required: true },
      { id: "q9", label: "Question 9", placeholder: "Your answer…", long: true, required: true },
      { id: "q10", label: "Question 10", placeholder: "Your answer…", long: true, required: true },
      { id: "q11", label: "Question 11", placeholder: "Your answer…", long: true, required: true },
      { id: "q12", label: "Question 12", placeholder: "Your answer…", long: true, required: true },
      { id: "q13", label: "Question 13", placeholder: "Your answer…", long: true, required: true },
      { id: "q14", label: "Question 14", placeholder: "Your answer…", long: true, required: true },
      { id: "q15", label: "Question 15", placeholder: "Your answer…", long: true, required: true },
    ],
  },
  staff: {
    title: "Staff Application",
    eyebrow: "Join the Team",
    desc: "Complete all 12 questions. Staff accounts are managed by the Super Admin.",
    questions: [
      { id: "q1", label: "Question 1", placeholder: "Your answer…", long: true, required: true },
      { id: "q2", label: "Question 2", placeholder: "Your answer…", long: true, required: true },
      { id: "q3", label: "Question 3", placeholder: "Your answer…", long: true, required: true },
      { id: "q4", label: "Question 4", placeholder: "Your answer…", long: true, required: true },
      { id: "q5", label: "Question 5", placeholder: "Your answer…", long: true, required: true },
      { id: "q6", label: "Question 6", placeholder: "Your answer…", long: true, required: true },
      { id: "q7", label: "Question 7", placeholder: "Your answer…", long: true, required: true },
      { id: "q8", label: "Question 8", placeholder: "Your answer…", long: true, required: true },
      { id: "q9", label: "Question 9", placeholder: "Your answer…", long: true, required: true },
      { id: "q10", label: "Question 10", placeholder: "Your answer…", long: true, required: true },
      { id: "q11", label: "Question 11", placeholder: "Your answer…", long: true, required: true },
      { id: "q12", label: "Question 12", placeholder: "Your answer…", long: true, required: true },
    ],
  },
  beta: {
    title: "Beta Testing Application",
    eyebrow: "Early Access",
    desc: "Apply to help test unreleased features and systems before they go live in Belladonna.",
    questions: [
      { id: "q1", label: "Question 1 — Discord username and how long have you been a member of BelladonnaRP", placeholder: "Your answer…", long: false, required: true },
      { id: "q2", label: "Question 2 — Describe your roleplay experience", placeholder: "Your answer…", long: true, required: true },
      { id: "q3", label: "Question 3 — Which testing areas interest you most and why", placeholder: "Your answer…", long: true, required: true },
      { id: "q4", label: "Question 4 — How do you write a bug report", placeholder: "Your answer…", long: true, required: true },
      { id: "q5", label: "Question 5 — How many testing sessions per week can you commit to", placeholder: "Your answer…", long: false, required: true },
      { id: "q6", label: "Question 6 — Do you agree to maintain confidentiality about unreleased content", placeholder: "Yes / No — explain", long: false, required: true },
    ],
  },
};

const isClientIdConfigured = () => {
  const id = import.meta.env.VITE_DISCORD_CLIENT_ID;
  return id && id !== "undefined" && id.trim() !== "";
};

const ApplicationForm = ({ type, onBack }: Props) => {
  const { user, loading: authLoading, login, getToken } = useDiscordAuth();
  const config = FORM_CONFIG[type];

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!config) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="outline" size="sm" onClick={onBack}
            className="font-body text-xs tracking-widest uppercase bg-transparent mb-8"
            style={{ borderColor: "hsl(312 18% 22%)", color: "hsl(345 40% 70%)" }}>
            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
            Back
          </Button>
          <p className="font-body text-sm text-muted-foreground">Application type not found.</p>
        </div>
      </div>
    );
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    config.questions.forEach((q) => {
      if (q.required && !answers[q.id]?.trim()) {
        newErrors[q.id] = "This question is required.";
      } else if (answers[q.id] && answers[q.id].trim().length < 10 && q.long) {
        newErrors[q.id] = "Please provide a more detailed answer (at least 10 characters).";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated. Please sign in with Discord first.");

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, answers }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed. Please try again.");

      setSubmitted(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-sm flex items-center justify-center mx-auto mb-6"
              style={{ background: "hsl(140 40% 14% / 0.25)", border: "1px solid hsl(140 40% 26% / 0.4)" }}
            >
              <CheckCircle2 className="w-10 h-10" style={{ color: "hsl(140 40% 55%)" }} />
            </div>
            <p className="font-body text-xs tracking-[0.5em] uppercase mb-3" style={{ color: "hsl(140 40% 55%)" }}>
              Submitted Successfully
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
              Application Received
            </h1>
            <div className="ornament-line h-px w-48 mx-auto mb-5" />
          </div>

          <div className="stat-card-glow rounded-sm p-8 text-center">
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
              Your <strong className="text-foreground">{config.title}</strong> has been submitted successfully.
              Our staff will review it and contact you via Discord.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              The review process typically takes 24 to 48 hours.
            </p>
            <Button
              className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-8 py-5 border-0 text-foreground hover:opacity-90 transition-all hover:scale-105"
              onClick={onBack}
            >
              Back to Applications
              <ArrowLeft className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-3xl">

        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="font-body text-xs tracking-widest uppercase bg-transparent mb-8"
          style={{ borderColor: "hsl(312 18% 22%)", color: "hsl(345 40% 70%)" }}
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-2" />
          All Applications
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
            {config.eyebrow}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-5">
            {config.title}
          </h1>
          <div className="ornament-line h-px w-48 mx-auto mb-5" />
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {config.desc}
          </p>
        </div>

        {/* Auth gate */}
        {!authLoading && !user && (
          <div className="stat-card-glow rounded-sm p-10 text-center">
            <div
              className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-6"
              style={{ background: "hsl(344 47% 22% / 0.15)" }}
            >
              <Lock className="w-8 h-8 text-bella-rose" />
            </div>
            <h2 className="font-display text-2xl font-medium text-foreground mb-3">
              Discord Sign-In Required
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
              You must sign in with your Discord account to access this application form.
              This verifies your identity and links your application to your Discord profile.
            </p>
            <Button
              size="lg"
              className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-10 py-6 border-0 text-foreground hover:opacity-90 transition-all hover:scale-105"
              onClick={() => login("/apply")}
              disabled={!isClientIdConfigured()}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In with Discord
            </Button>
            {!isClientIdConfigured() && (
              <p className="font-body text-xs text-muted-foreground mt-6 opacity-60">
                Discord OAuth is not yet configured on this deployment. The site owner must set{" "}
                <code className="font-mono">VITE_DISCORD_CLIENT_ID</code> in Cloudflare Pages and redeploy.
              </p>
            )}
          </div>
        )}

        {/* Loading auth */}
        {authLoading && (
          <div className="stat-card-glow rounded-sm p-10 text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-4 text-bella-rose animate-spin" />
            <p className="font-body text-sm text-muted-foreground">Checking authentication…</p>
          </div>
        )}

        {/* Form */}
        {!authLoading && user && (
          <>
            {/* Auth badge */}
            <div
              className="rounded-sm p-4 mb-6 border flex items-center gap-3"
              style={{ background: "hsl(140 40% 10% / 0.2)", borderColor: "hsl(140 40% 24% / 0.4)" }}
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "hsl(140 40% 55%)" }} />
              <p className="font-body text-sm text-muted-foreground">
                Signed in as{" "}
                <span className="font-medium text-foreground">{user.username}</span>
                {" "}(Discord ID: {user.id})
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4 mb-6">
                {config.questions.map((q, i) => (
                  <div key={q.id} className="stat-card-glow rounded-sm p-6">
                    <Label className="font-display text-base font-medium text-foreground mb-3 block">
                      <span className="font-body text-[10px] tracking-[0.3em] uppercase mr-3"
                        style={{ color: "hsl(344 47% 45%)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {q.label}
                      {q.required && (
                        <span className="ml-1" style={{ color: "hsl(344 47% 45%)" }}>*</span>
                      )}
                    </Label>
                    {q.long ? (
                      <Textarea
                        id={q.id}
                        value={answers[q.id] ?? ""}
                        onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder={q.placeholder}
                        rows={4}
                        className="font-body text-sm bg-transparent resize-y mt-2"
                        style={{ borderColor: errors[q.id] ? "hsl(0 84% 45%)" : "hsl(312 18% 22%)" }}
                      />
                    ) : (
                      <Input
                        id={q.id}
                        value={answers[q.id] ?? ""}
                        onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder={q.placeholder}
                        className="font-body text-sm bg-transparent mt-2"
                        style={{ borderColor: errors[q.id] ? "hsl(0 84% 45%)" : "hsl(312 18% 22%)" }}
                      />
                    )}
                    {errors[q.id] && (
                      <p className="font-body text-xs mt-2" style={{ color: "hsl(0 84% 65%)" }}>
                        {errors[q.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {submitError && (
                <div
                  className="rounded-sm p-5 mb-5 border flex items-start gap-3"
                  style={{ background: "hsl(0 84% 14% / 0.2)", borderColor: "hsl(0 84% 30% / 0.4)" }}
                >
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "hsl(0 84% 60%)" }} />
                  <p className="font-body text-sm" style={{ color: "hsl(0 84% 68%)" }}>{submitError}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-10 py-6 border-0 text-foreground hover:opacity-90 transition-all hover:scale-105 disabled:opacity-60 disabled:scale-100"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="font-body text-sm tracking-widest uppercase px-10 py-6 bg-transparent transition-all hover:scale-105"
                  style={{ borderColor: "hsl(344 47% 30% / 0.45)", color: "hsl(345 40% 80%)" }}
                  onClick={onBack}
                >
                  Cancel
                </Button>
              </div>

              <p className="font-body text-xs text-muted-foreground text-center mt-5 opacity-60">
                Fields marked * are required. Your answers are saved and linked to your Discord account.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationForm;
