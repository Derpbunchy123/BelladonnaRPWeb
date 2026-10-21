import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ServerStats from "@/components/ServerStats";
import { Link } from "react-router-dom";
import { serverConfig } from "@/config/serverConfig";
import {
  Users,
  Shield,
  Building2,
  Star,
  ArrowRight,
  MapPin,
  Mic2,
  Briefcase,
  ChevronDown,
} from "lucide-react";

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const featuresRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const makeObs = (
      ref: React.RefObject<HTMLElement>,
      setter: (v: boolean) => void,
    ) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            obs.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      obs.observe(ref.current);
      observers.push(obs);
    };

    makeObs(featuresRef, setFeaturesVisible);
    makeObs(ctaRef, setCtaVisible);

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const features = [
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Immersive City Life",
      desc: "A breathing, living Los Santos with a thriving civilian population, dynamic businesses, and realistic economies.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Active Departments",
      desc: "LSPD, LSFD, the District Attorney's office, and more — each with structured hierarchies and dedicated members.",
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: "Career Paths",
      desc: "From corporate law to street-level hustle, every archetype has a place. Build your character's story from the ground up.",
    },
    {
      icon: <Mic2 className="h-5 w-5" />,
      title: "Quality Roleplay",
      desc: "A community that holds itself to a high standard. Meaningful scenes, real consequences, and collaborative storytelling.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Established Community",
      desc: "Hundreds of vetted members, active Discord, regular events, and a staff team that is always present.",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Custom Infrastructure",
      desc: "Hand-crafted server scripts, exclusive interiors, unique clothing, and a world built for serious roleplay.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Night city background — deep layered gradients */}
        <div className="absolute inset-0 hero-cinematic-bg" />

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 hero-noise-overlay pointer-events-none" />

        {/* City skyline silhouette */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: "clamp(200px, 30vh, 340px)", display: "block" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Far background buildings — lighter */}
            <path
              d="M0,320 L0,240 L50,240 L50,200 L70,200 L70,175 L90,175 L90,200 L110,200 L110,230 L150,230 L150,195 L170,195 L170,165 L185,165 L185,145 L195,145 L195,165 L210,165 L210,195 L240,195 L240,220 L280,220 L280,185 L300,185 L300,160 L315,160 L315,140 L325,140 L325,160 L340,160 L340,185 L380,185 L380,210 L420,210 L420,175 L440,175 L440,150 L455,150 L455,130 L465,130 L465,150 L480,150 L480,175 L520,175 L520,200 L560,200 L560,170 L580,170 L580,145 L595,145 L595,125 L605,125 L605,145 L620,145 L620,170 L660,170 L660,195 L700,195 L700,165 L720,165 L720,140 L735,140 L735,120 L745,120 L745,140 L760,140 L760,165 L800,165 L800,190 L840,190 L840,160 L860,160 L860,135 L875,135 L875,115 L885,115 L885,135 L900,135 L900,160 L940,160 L940,185 L980,185 L980,155 L1000,155 L1000,130 L1015,130 L1015,110 L1025,110 L1025,130 L1040,130 L1040,155 L1080,155 L1080,180 L1120,180 L1120,148 L1140,148 L1140,122 L1155,122 L1155,102 L1165,102 L1165,122 L1180,122 L1180,148 L1220,148 L1220,172 L1260,172 L1260,195 L1300,195 L1300,210 L1340,210 L1340,230 L1380,230 L1380,250 L1440,250 L1440,320 Z"
              fill="hsl(312 22% 6%)"
              opacity="0.7"
            />
            {/* Foreground buildings — darker */}
            <path
              d="M0,320 L0,270 L30,270 L30,245 L50,245 L50,220 L65,220 L65,200 L80,200 L80,220 L100,220 L100,250 L130,250 L130,225 L150,225 L150,205 L160,205 L160,185 L170,185 L170,205 L185,205 L185,225 L210,225 L210,248 L240,248 L240,228 L255,228 L255,210 L265,210 L265,190 L278,190 L278,210 L290,210 L290,228 L315,228 L315,250 L345,250 L345,232 L360,232 L360,215 L372,215 L372,198 L382,198 L382,215 L395,215 L395,232 L420,232 L420,255 L450,255 L450,235 L465,235 L465,218 L477,218 L477,200 L488,200 L488,218 L502,218 L502,235 L528,235 L528,258 L558,258 L558,238 L572,238 L572,220 L583,220 L583,202 L594,202 L594,220 L607,220 L607,238 L632,238 L632,260 L660,260 L660,242 L673,242 L673,225 L684,225 L684,208 L695,208 L695,225 L708,225 L708,242 L732,242 L732,262 L760,262 L760,245 L772,245 L772,228 L782,228 L782,212 L793,212 L793,228 L806,228 L806,245 L830,245 L830,265 L858,265 L858,248 L870,248 L870,232 L880,232 L880,215 L891,215 L891,232 L904,232 L904,248 L928,248 L928,268 L956,268 L956,250 L968,250 L968,234 L978,234 L978,218 L989,218 L989,234 L1002,234 L1002,250 L1026,250 L1026,270 L1054,270 L1054,252 L1066,252 L1066,236 L1076,236 L1076,220 L1087,220 L1087,236 L1100,236 L1100,252 L1124,252 L1124,272 L1152,272 L1152,255 L1164,255 L1164,238 L1174,238 L1174,222 L1185,222 L1185,238 L1198,238 L1198,255 L1222,255 L1222,275 L1260,275 L1260,290 L1310,290 L1310,275 L1340,275 L1340,285 L1380,285 L1380,295 L1440,295 L1440,320 Z"
              fill="hsl(312 22% 5%)"
              opacity="0.95"
            />

            {/* Window lights — scattered warm dots */}
            {[
              [73, 207], [78, 215], [155, 192], [162, 200], [170, 192],
              [263, 197], [270, 207], [278, 197], [362, 222], [370, 212],
              [378, 222], [466, 225], [475, 215], [484, 225], [572, 227],
              [580, 218], [590, 227], [672, 232], [680, 222], [690, 232],
              [770, 233], [778, 223], [787, 233], [869, 239], [877, 229],
              [886, 239], [967, 241], [975, 231], [985, 241], [1065, 243],
              [1073, 233], [1083, 243], [1163, 245], [1171, 235], [1181, 245],
              [52, 228], [62, 238], [152, 212], [262, 218], [462, 203],
            ].map(([x, y], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width="3"
                height="4"
                fill={i % 3 === 0 ? "hsl(344 60% 70%)" : "hsl(38 60% 80%)"}
                opacity={i % 4 === 0 ? "0.85" : i % 3 === 0 ? "0.5" : "0.25"}
              />
            ))}
          </svg>
        </div>

        {/* Horizontal glow at horizon line */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "clamp(160px, 22vh, 260px)",
            left: 0,
            right: 0,
            height: "120px",
            background:
              "radial-gradient(ellipse at 50% 100%, hsl(344 47% 22% / 0.30) 0%, hsl(312 22% 8% / 0.05) 60%, transparent 100%)",
          }}
        />

        {/* Dark vignette edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, transparent 30%, hsl(300 15% 4% / 0.55) 100%)",
          }}
        />

        {/* Hero content */}
        <div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "none" : "translateY(20px)",
            transition: "opacity 1s ease, transform 1s ease",
          }}
        >
          {/* Eyebrow line */}
          <div
            className="flex items-center justify-center gap-5 mb-10"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 1s ease 0.1s",
            }}
          >
            <div className="ornament-line h-px w-14" />
            <span className="font-body text-[10px] tracking-[0.5em] uppercase text-bella-muted">
              Los Santos — FiveM Roleplay
            </span>
            <div className="ornament-line h-px w-14" />
          </div>

          {/* Main title */}
          <h1
            className="font-display font-light text-bella-ivory text-shadow-western mb-3 tracking-tight hero-title"
            style={{
              fontSize: "clamp(4rem, 12vw, 9rem)",
              lineHeight: "0.92",
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 1s ease 0.2s",
            }}
          >
            Belladonna
          </h1>

          {/* Italic subtitle */}
          <p
            className="font-display italic text-bella-rose font-light mb-9 hero-subtitle"
            style={{
              fontSize: "clamp(1.35rem, 3.5vw, 2.25rem)",
              letterSpacing: "0.06em",
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 1s ease 0.35s",
            }}
          >
            Roleplay
          </p>

          {/* Divider ornament */}
          <div
            className="flex items-center justify-center gap-4 mb-6"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 1s ease 0.45s",
            }}
          >
            <div className="ornament-line h-px w-20" />
            <Star
              className="h-3 w-3 flex-shrink-0"
              style={{ color: "hsl(344 47% 40%)" }}
            />
            <div className="ornament-line h-px w-20" />
          </div>

          {/* Tagline */}
          <p
            className="font-body text-sm md:text-base text-muted-foreground mb-12 tracking-[0.3em] uppercase"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 1s ease 0.55s",
            }}
          >
            Every city has a secret.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 1s ease 0.7s",
            }}
          >
            <Link to="/apply">
              <Button
                size="lg"
                className="w-full sm:w-auto western-gradient text-sm font-body font-medium tracking-[0.2em] uppercase px-10 border-0 text-foreground hover:opacity-90 transition-all duration-300 hover:scale-105"
                style={{ paddingTop: "1.4rem", paddingBottom: "1.4rem" }}
              >
                Enter the City
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-sm font-body font-medium tracking-[0.2em] uppercase px-10 bg-transparent transition-all duration-300 hover:scale-105 hero-outline-btn"
              style={{ paddingTop: "1.4rem", paddingBottom: "1.4rem" }}
              onClick={() => window.open(serverConfig.discord.inviteLink, "_blank")}
            >
              Join Our Discord
            </Button>
          </div>
        </div>

        {/* Scroll caret */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            opacity: heroVisible ? 0.45 : 0,
            transition: "opacity 1.4s ease 1.2s",
          }}
        >
          <span className="font-body text-[9px] tracking-[0.45em] uppercase text-muted-foreground">
            Scroll
          </span>
          <ChevronDown
            className="h-4 w-4 text-muted-foreground animate-bounce-slow"
          />
        </div>
      </section>

      {/* ── Live Server Status ──────────────────────────────── */}
      <ServerStats />

      {/* ── Feature Cards ───────────────────────────────────── */}
      <section
        ref={featuresRef}
        className="py-28 px-4"
        style={{
          opacity: featuresVisible ? 1 : 0,
          transform: featuresVisible ? "none" : "translateY(28px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="font-body text-[10px] tracking-[0.55em] uppercase text-bella-rose mb-4">
              What Awaits You
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-5">
              Life in Belladonna
            </h2>
            <div className="ornament-line h-px w-40 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <div
                key={i}
                className="feature-card rounded-sm p-8"
                style={{
                  transitionDelay: featuresVisible
                    ? `${i * 60}ms`
                    : "0ms",
                  opacity: featuresVisible ? 1 : 0,
                  transform: featuresVisible
                    ? "none"
                    : "translateY(16px)",
                  transition:
                    "opacity 0.7s ease, transform 0.7s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <div className="feature-icon-wrap inline-flex items-center justify-center w-10 h-10 rounded-sm mb-6">
                  {feat.icon}
                </div>
                <h3 className="font-display text-xl font-medium text-foreground mb-3 tracking-wide">
                  {feat.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section divider ─────────────────────────────────── */}
      <div className="section-divider" />

      {/* ── Community / Discord CTA ──────────────────────────── */}
      <section
        ref={ctaRef}
        className="py-28 px-4 relative overflow-hidden"
        style={{
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? "none" : "translateY(24px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, hsl(344 47% 18% / 0.14) 0%, transparent 65%)",
          }}
        />

        <div className="relative container mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="ornament-line h-px w-10" />
            <Star
              className="h-3.5 w-3.5 flex-shrink-0"
              style={{ color: "hsl(344 47% 38%)" }}
            />
            <div className="ornament-line h-px w-10" />
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
            Ready to write your story?
          </h2>

          <p className="font-body text-base text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            Join hundreds of players building lives, running businesses, and
            uncovering what lies beneath the surface of Belladonna. Your
            chapter starts now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="w-full sm:w-auto western-gradient text-sm font-body font-medium tracking-[0.2em] uppercase px-10 border-0 text-foreground hover:opacity-90 transition-all duration-300 hover:scale-105"
              style={{ paddingTop: "1.4rem", paddingBottom: "1.4rem" }}
              onClick={() => window.open(serverConfig.discord.inviteLink, "_blank")}
            >
              Join Our Discord
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link to="/apply">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-sm font-body font-medium tracking-[0.2em] uppercase px-10 bg-transparent transition-all duration-300 hover:scale-105 hero-outline-btn"
                style={{ paddingTop: "1.4rem", paddingBottom: "1.4rem" }}
              >
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;