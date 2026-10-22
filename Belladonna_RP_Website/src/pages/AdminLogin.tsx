import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("bella_admin_token");
    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials. Please try again.");
        return;
      }

      sessionStorage.setItem("bella_admin_token", data.token);
      sessionStorage.setItem("bella_admin_role", data.role);
      sessionStorage.setItem("bella_admin_username", data.username);
      navigate("/admin", { replace: true });
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
            Restricted Area
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">
            Staff Portal
          </h1>
          <div className="ornament-line h-px w-32 mx-auto mb-4" />
          <p className="font-body text-sm text-muted-foreground">
            Authorized personnel only
          </p>
        </div>

        <div className="stat-card-glow rounded-sm p-8">
          <div className="flex justify-center mb-8">
            <div
              className="w-16 h-16 rounded-sm flex items-center justify-center"
              style={{ background: "hsl(344 47% 25% / 0.15)" }}
            >
              <Lock className="w-7 h-7 text-bella-rose" />
            </div>
          </div>

          {error && (
            <div
              className="rounded-sm p-4 mb-6 border flex items-start gap-3"
              style={{
                background: "hsl(0 84% 18% / 0.2)",
                borderColor: "hsl(0 84% 35% / 0.4)",
              }}
            >
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "hsl(0 84% 60%)" }} />
              <p className="font-body text-sm" style={{ color: "hsl(0 84% 70%)" }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                Username
              </Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
                className="font-body text-sm bg-transparent"
                style={{ borderColor: "hsl(312 18% 22%)" }}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="font-body text-sm bg-transparent pr-10"
                  style={{ borderColor: "hsl(312 18% 22%)" }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full western-gradient text-sm font-body font-medium tracking-widest uppercase py-5 border-0 text-foreground hover:opacity-90 transition-all mt-2"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="font-body text-xs text-muted-foreground text-center mt-6 opacity-50">
          Staff accounts are managed by the Super Admin only.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;