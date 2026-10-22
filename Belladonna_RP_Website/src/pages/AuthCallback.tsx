import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("Discord authorization was cancelled or denied.");
      setTimeout(() => navigate("/apply"), 3000);
      return;
    }

    if (!code || !state) {
      setError("Invalid callback parameters.");
      setTimeout(() => navigate("/apply"), 3000);
      return;
    }

    const savedState = sessionStorage.getItem("discord_oauth_state");
    const returnTo = sessionStorage.getItem("discord_oauth_return") || "/apply";
    sessionStorage.removeItem("discord_oauth_state");
    sessionStorage.removeItem("discord_oauth_return");

    if (state !== savedState) {
      setError("Invalid OAuth state. Possible CSRF attempt. Please try again.");
      setTimeout(() => navigate("/apply"), 3000);
      return;
    }

    fetch("/api/auth/discord/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Authentication failed");
        sessionStorage.setItem("discord_user", JSON.stringify(data.user));
        sessionStorage.setItem("discord_token", data.session_token);
        navigate(returnTo, { replace: true });
      })
      .catch((e) => {
        setError(e.message || "Authentication failed. Please try again.");
        setTimeout(() => navigate("/apply"), 4000);
      });
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <div className="text-center max-w-md">
        {error ? (
          <>
            <p className="font-body text-xs tracking-[0.5em] uppercase mb-4" style={{ color: "hsl(0 84% 60%)" }}>
              Authentication Error
            </p>
            <h1 className="font-display text-3xl font-light text-foreground mb-4">
              Sign-In Failed
            </h1>
            <div className="ornament-line h-px w-32 mx-auto mb-6" />
            <p className="font-body text-sm text-muted-foreground mb-4">{error}</p>
            <p className="font-body text-xs text-muted-foreground opacity-60">
              Redirecting you back in a moment…
            </p>
          </>
        ) : (
          <>
            <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
              Please Wait
            </p>
            <h1 className="font-display text-3xl font-light text-foreground mb-4">
              Completing Sign-In
            </h1>
            <div className="ornament-line h-px w-32 mx-auto mb-6" />
            <p className="font-body text-sm text-muted-foreground">
              Verifying your Discord identity…
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;