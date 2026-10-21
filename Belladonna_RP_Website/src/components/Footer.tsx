import { Link } from "react-router-dom";
import { serverConfig } from "@/config/serverConfig";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const cfxCode = serverConfig.gameServer.cfxCode;
  const hasValidCfxCode =
    cfxCode &&
    cfxCode !== "placeholder" &&
    cfxCode.trim().length > 0;
  const fivemConnectUrl = hasValidCfxCode
    ? `https://cfx.re/join/${cfxCode}`
    : "https://cfx.re";

  return (
    <footer
      className="border-t py-14"
      style={{ borderColor: "hsl(312 18% 16%)", background: "hsl(312 22% 7%)" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <p
                className="font-display text-xl font-light tracking-[0.18em] uppercase"
                style={{ color: "hsl(345 40% 93%)" }}
              >
                Belladonna
              </p>
              <p
                className="font-body text-xs tracking-[0.5em] uppercase"
                style={{ color: "hsl(340 30% 54%)" }}
              >
                Roleplay
              </p>
            </div>
            <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-xs">
              A serious FiveM roleplay community set in Los Santos. Quality storytelling, active departments, and a city full of secrets.
            </p>
            <p className="font-display italic text-sm mt-4" style={{ color: "hsl(344 47% 40%)" }}>
              "Every city has a secret."
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-5">
              Navigate
            </p>
            <nav className="space-y-3" aria-label="Footer navigation">
              {[
                { name: "Home", path: "/" },
                { name: "About the City", path: "/about" },
                { name: "Factions", path: "/departments" },
                { name: "City Rules", path: "/rules" },
                { name: "Applications", path: "/apply" },
                { name: "Store", path: "/store" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wide"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Community */}
          <div>
            <p className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-5">
              Community
            </p>
            <div className="space-y-3">
              <a
                href={serverConfig.discord.inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wide"
              >
                Discord Server
              </a>
              <a
                href={fivemConnectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wide"
              >
                Connect via FiveM
              </a>
              <Link
                to="/rules"
                className="block font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wide"
              >
                Server Rules
              </Link>
              <Link
                to="/departments"
                className="block font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wide"
              >
                Factions
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-muted-foreground tracking-wider">
            &copy; {currentYear} BelladonnaRP. All rights reserved.
          </p>
          <p className="font-body text-xs text-muted-foreground tracking-wider">
            FiveM Roleplay Community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
