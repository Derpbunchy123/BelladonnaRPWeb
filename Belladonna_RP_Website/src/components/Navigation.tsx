import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { serverConfig } from "@/config/serverConfig";
import { Menu, X, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  path: string;
  accent?: boolean;
}

const navItems: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Factions", path: "/departments" },
  { name: "Rules", path: "/rules" },
  { name: "Community", path: "/community" },
  { name: "Apply", path: "/apply" },
  { name: "Store", path: "/store" },
  { name: "Beta Testing", path: "/beta-testing", accent: true },
];

const Navigation = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300",
        scrolled ? "nav-scrolled" : "nav-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none group flex-shrink-0">
          <span
            className="font-display text-lg font-light tracking-[0.18em] uppercase transition-colors duration-200"
            style={{ color: "hsl(345 40% 93%)" }}
          >
            Belladonna
          </span>
          <span
            className="font-body text-[9px] tracking-[0.5em] uppercase transition-colors duration-200"
            style={{ color: "hsl(340 30% 54%)" }}
          >
            Roleplay
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => {
            if (item.accent) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "nav-link font-body text-xs tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm transition-all duration-200 flex items-center gap-1.5",
                    isActive(item.path)
                      ? "nav-link-active"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  style={{
                    border: "1px solid hsl(344 47% 30% / 0.4)",
                    background: isActive(item.path)
                      ? "hsl(344 47% 20% / 0.3)"
                      : "hsl(344 47% 15% / 0.2)",
                    color: isActive(item.path)
                      ? "hsl(344 47% 75%)"
                      : "hsl(344 47% 62%)",
                    boxShadow: "0 0 8px hsl(344 47% 25% / 0.25)",
                  }}
                >
                  <FlaskConical className="h-3 w-3 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "nav-link font-body text-xs tracking-[0.25em] uppercase px-4 py-2 rounded-sm transition-colors duration-200",
                  isActive(item.path)
                    ? "nav-link-active"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Discord CTA */}
        <div className="hidden lg:flex items-center flex-shrink-0">
          <Button
            size="sm"
            className="western-gradient font-body text-[10px] tracking-[0.25em] uppercase border-0 text-foreground hover:opacity-90 transition-all hover:scale-105 px-5"
            onClick={() => window.open(serverConfig.discord.inviteLink, "_blank")}
          >
            Join Discord
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-[600px]" : "max-h-0"
        )}
        style={{ background: "hsl(312 22% 7% / 0.97)", backdropFilter: "blur(16px)" }}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col gap-1" aria-label="Mobile navigation">
          {navItems.map((item) => {
            if (item.accent) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "font-body text-xs tracking-[0.3em] uppercase py-3 px-4 rounded-sm transition-colors duration-200 flex items-center gap-2",
                    isActive(item.path)
                      ? "nav-link-active"
                      : ""
                  )}
                  style={{
                    color: "hsl(344 47% 65%)",
                    border: "1px solid hsl(344 47% 28% / 0.4)",
                    background: "hsl(344 47% 14% / 0.2)",
                    marginTop: "4px",
                  }}
                >
                  <FlaskConical className="h-3.5 w-3.5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "font-body text-xs tracking-[0.3em] uppercase py-3 px-4 rounded-sm transition-colors duration-200",
                  isActive(item.path)
                    ? "nav-link-active"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid hsl(312 18% 18%)" }}>
            <Button
              size="sm"
              className="w-full western-gradient font-body text-[10px] tracking-[0.25em] uppercase border-0 text-foreground hover:opacity-90 transition-all"
              onClick={() => window.open(serverConfig.discord.inviteLink, "_blank")}
            >
              Join Discord
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
