import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * Strict allowlist of internal paths that are safe redirect targets
 * after Discord OAuth completes. Absolute URLs, protocol-relative URLs,
 * backslash tricks, and any path not in this list are rejected.
 */
const ALLOWED_RETURN_PATHS = new Set([
  "/apply",
  "/apply/",
]);

/**
 * Validates a returnTo value from sessionStorage.
 * Returns the path if it is safe, or "/apply" as the fallback.
 */
function sanitizeReturnTo(raw: string | null): string {
  if (!raw) return "/apply";

  const trimmed = raw.trim();

  if (!trimmed) return "/apply";

  // Reject protocol-relative URLs (//evil.com)
  if (/^\/\//u.test(trimmed)) return "/apply";
  // Reject backslash-prefixed paths (\\evil.com)
  if (/^[\\]/u.test(trimmed)) return "/apply";
  // Reject URLs with a scheme (http://, javascript:, data:, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/u.test(trimmed)) return "/apply";

  // Reject encoded bypass attempts (e.g. %2F%2F → //, %5C → \)
  const decoded = (() => {
    try {
      return decodeURIComponent(trimmed);
    } catch {
      return "";
    }
  })();
  if (!decoded) return "/apply";
  if (/^\/\//u.test(decoded)) return "/apply";
  if (/^[\\]/u.test(decoded)) return "/apply";
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/u.test(decoded)) return "/apply";

  // Only navigate to explicitly allowed internal paths
  if (ALLOWED_RETURN_PATHS.has(trimmed)) return trimmed;

  return "/apply";
}

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

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

    // Read and sanitize the return path immediately — before any async work —
    // so an attacker cannot race the removal to influence the redirect target.
    const rawReturnTo = sessionStorage.getItem("discord_oauth_return");
    const returnTo = sanitizeReturnTo(rawReturnTo);

    sessionStorage.removeItem("discord_oauth_state");
    sessionStorage.removeItem("discord_oauth_return");

    if (state !== savedState) {
      setError("Invalid OAuth state. Possible CSRF attempt. Please try again.");
      setTimeout(() => navigate("/apply"), 3000);
      return;
    }

    const exchangeCode = async () => {
      let res: Response;

      try {
        res = await fetch("/api/auth/discord/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
      } catch (networkErr) {
        setError("Network error — could not reach the authentication endpoint.");
        setDetail(
          "The POST request to /api/auth/discord/callback failed before receiving a response. " +
          "Check that the Cloudflare Pages Function is deployed and that the functions/ directory " +
          "is at the repository root (not inside Belladonna_RP_Website/)."
        );
        setTimeout(() => navigate("/apply"), 6000);
        return;
      }

      const contentType = res.headers.get("content-type") ?? "";
      const rawText = await res.text().catch(() => "");

      if (!rawText || rawText.trim() === "") {
        setError("Authentication endpoint returned an empty response.");
        setDetail(
          `HTTP ${res.status}. The endpoint at /api/auth/discord/callback returned no body. ` +
          "This usually means the Cloudflare Pages Function was not found (404/405) or the " +
          "deployment did not include the functions/ directory. " +
          "Verify the function file exists at functions/api/auth/discord/callback.ts relative " +
          "to the Cloudflare Pages build root."
        );
        setTimeout(() => navigate("/apply"), 6000);
        return;
      }

      if (!contentType.includes("application/json")) {
        setError(
          res.ok
            ? "Authentication endpoint returned an unexpected response format."
            : `Authentication endpoint error (HTTP ${res.status}).`
        );
        setDetail(
          "The response Content-Type was not application/json. " +
          "The server likely returned an HTML error page instead of the Cloudflare Pages Function. " +
          "Raw response (first 300 chars): " + rawText.slice(0, 300)
        );
        setTimeout(() => navigate("/apply"), 6000);
        return;
      }

      let data: Record<string, unknown>;
      try {
        data = JSON.parse(rawText);
      } catch {
        setError("Failed to parse the authentication response.");
        setDetail("Raw response: " + rawText.slice(0, 300));
        setTimeout(() => navigate("/apply"), 6000);
        return;
      }

      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : "Authentication failed. Please try again.";
        setError(msg);

        if (res.status === 503) {
          setDetail(
            "The Cloudflare Pages Function is running but a required environment variable " +
            "(DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, or SESSION_SECRET) is missing. " +
            "Set them in Cloudflare Pages → Settings → Environment Variables and redeploy."
          );
        }

        setTimeout(() => navigate("/apply"), 5000);
        return;
      }

      if (
        typeof data.user !== "object" ||
        !data.user ||
        typeof data.session_token !== "string"
      ) {
        setError("Authentication response was missing required fields.");
        setTimeout(() => navigate("/apply"), 4000);
        return;
      }

      sessionStorage.setItem("discord_user", JSON.stringify(data.user));
      sessionStorage.setItem("discord_token", data.session_token as string);

      // Navigate to the validated, allowlisted internal path only
      navigate(returnTo, { replace: true });
    };

    exchangeCode();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <div className="text-center max-w-lg">
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
            {detail && (
              <div
                className="rounded-sm p-4 mb-4 text-left"
                style={{
                  background: "hsl(0 60% 10% / 0.4)",
                  border: "1px solid hsl(0 60% 28% / 0.4)",
                }}
              >
                <p className="font-body text-xs text-muted-foreground leading-relaxed break-words">{detail}</p>
              </div>
            )}
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
