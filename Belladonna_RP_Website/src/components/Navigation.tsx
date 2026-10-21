import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { serverConfig } from "@/config/serverConfig";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Departments", path: "/departments" },
    { name: "Rules", path: "/rules" },
    { name: "Community", path: "/community" },
    { name: "Apply", path: "/apply" },
    { name: "Store", path: "/store" },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname === path;

  return (
    <nav
      className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500", {
        "nav-scrolled": scrolled,
        "nav-transparent": !scrolled,
      })}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link
            to="/"
            className="flex flex-col items-start leading-none group shrink-0"
            aria-label="BelladonnaRP — Home"
          >
            <span
              className="font-display font-light tracking-[0.18em] uppercase transition-colors duration-200"
              style={{ fontSize: "1.25rem", color: "hsl(345 40% 93%)" }}
            >
              Belladonna
            </span>
            <span
              className="font-body font-light tracking-[0.5em] uppercase"
              style={{ fontSize: "0.6rem", color: "hsl(340 30% 54%)" }}
            >
              Roleplay
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6" role="list">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                role="listitem"
                aria-current={isActive(item.path) ? "page" : undefined}
                className={cn(
                  "font-body text-[10px] font-medium tracking-[0.22em] uppercase transition-all duration-200 relative nav-link pb-1",
                  isActive(item.path)
                    ? "text-bella-rose"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.name}
                {isActive(item.path) && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px opacity-70"
                    style={{ background: "hsl(344 47% 45%)" }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="sm"
              className="hidden lg:inline-flex western-gradient font-body text-[10px] tracking-[0.22em] uppercase px-5 border-0 text-foreground hover:opacity-90 transition-opacity"
              onClick={() => window.open(serverConfig.discord.inviteLink, "_blank")}
              aria-label="Join our Discord server (opens in new tab)"
            >
              Join Discord
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
          )}
          aria-hidden={!isOpen}
        >
          <div className="py-5 border-t border-border space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={cn(
                  "block py-3 px-1 font-body text-sm tracking-[0.22em] uppercase transition-colors duration-200",
                  isActive(item.path)
                    ? "text-bella-rose"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Button
                className="w-full western-gradient font-body text-xs tracking-[0.22em] uppercase border-0 text-foreground"
                onClick={() => {
                  setIsOpen(false);
                  window.open(serverConfig.discord.inviteLink, "_blank");
                }}
                aria-label="Join our Discord server (opens in new tab)"
              >
                Join Discord
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;