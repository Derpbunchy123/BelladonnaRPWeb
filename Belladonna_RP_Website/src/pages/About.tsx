import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Building, Users, Shield, Briefcase, Star, MapPin, Heart, Gavel } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Page header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
            The City
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
            About Belladonna
          </h1>
          <div className="ornament-line h-px w-48 mx-auto mb-6" />
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A living, breathing city where every character has a story — and every story has consequences.
          </p>
        </div>

        <div className="space-y-6">
          {/* Our Story */}
          <div className="stat-card-glow rounded-sm p-8 card-hover">
            <h2 className="font-display text-2xl font-medium text-foreground mb-4">
              Our Story
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              BelladonnaRP was built by a group of veteran roleplayers who wanted something different — a city that demanded investment, rewarded patience, and punished shortcuts. Set in a richly developed Los Santos, Belladonna is a place where civilian life, law enforcement, criminal empires, and everything in between coexist in a way that feels genuinely real.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              We hold ourselves to a higher standard because we believe great roleplay is worth the effort. Every faction, every business, every character arc is shaped by the people who show up and invest in the world they share.
            </p>
          </div>

          {/* What Makes Belladonna Different */}
          <div className="stat-card-glow rounded-sm p-8 card-hover">
            <h2 className="font-display text-2xl font-medium text-foreground mb-6">
              What Makes Belladonna Different
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <Heart className="h-4 w-4" />,
                  title: "Character-First Roleplay",
                  desc: "We prioritize depth over action. Your character's history, relationships, and reputation shape how the city responds to you.",
                },
                {
                  icon: <Gavel className="h-4 w-4" />,
                  title: "Meaningful Consequences",
                  desc: "Actions carry real weight. Crime, conflict, and cooperation all leave marks — on characters, factions, and the city itself.",
                },
                {
                  icon: <Users className="h-4 w-4" />,
                  title: "Player-Driven Stories",
                  desc: "The best storylines come from within the community. Staff support player arcs rather than scripting them from the top down.",
                },
                {
                  icon: <Building className="h-4 w-4" />,
                  title: "Active Economy",
                  desc: "Run a legitimate business, work the underground, or build an empire. The economy rewards those who put in the work.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 mt-0.5 p-1.5 rounded-sm"
                    style={{ background: "hsl(344 47% 25% / 0.15)", color: "hsl(340 30% 54%)" }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-medium text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* City Features */}
          <div className="stat-card-glow rounded-sm p-8 card-hover">
            <h2 className="font-display text-2xl font-medium text-foreground mb-6">
              City Features
            </h2>
            <ul className="space-y-4">
              {[
                { icon: <MapPin className="h-4 w-4" />, text: "A fully realized Los Santos with custom interiors, neighborhoods, and points of interest" },
                { icon: <Briefcase className="h-4 w-4" />, text: "Custom economy scripts including legal businesses, underground markets, and property ownership" },
                { icon: <Building className="h-4 w-4" />, text: "Active government, judiciary, and civilian institutions that shape the city's direction" },
                { icon: <Shield className="h-4 w-4" />, text: "Structured law enforcement departments with real procedures and chain of command" },
                { icon: <Star className="h-4 w-4" />, text: "Regular city-wide events, story arcs, and spontaneous scenes driven by players" },
                { icon: <Users className="h-4 w-4" />, text: "A dedicated, experienced staff team available around the clock to support the community" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 mt-0.5 p-1.5 rounded-sm"
                    style={{ background: "hsl(344 47% 25% / 0.15)", color: "hsl(340 30% 54%)" }}
                  >
                    {item.icon}
                  </span>
                  <span className="font-body text-sm text-muted-foreground leading-relaxed">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Values */}
          <div className="stat-card-glow rounded-sm p-8 card-hover">
            <h2 className="font-display text-2xl font-medium text-foreground mb-4">
              Community Values
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
              Belladonna is built on a foundation of mutual respect and creative ambition. We believe in:
            </p>
            <ul className="space-y-3">
              {[
                "Quality over quantity — scenes that matter over content that fills time",
                "Accountability — characters face real consequences for real actions",
                "Collaboration — the best stories are written together, not at each other's expense",
                "Transparency — fair, consistent moderation that everyone can trust",
                "Community participation — your voice shapes the city you inhabit",
              ].map((value, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="text-xs mt-1 flex-shrink-0 font-body font-medium"
                    style={{ color: "hsl(344 47% 45%)" }}
                  >
                    ◆
                  </span>
                  <span className="font-body text-sm text-muted-foreground leading-relaxed">
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div
            className="stat-card-glow rounded-sm p-8 text-center"
            style={{ borderColor: "hsl(344 47% 30% / 0.35)" }}
          >
            <h2 className="font-display text-2xl font-medium text-foreground mb-3">
              Ready to join?
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Review the rules, check our departments, and submit your application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply">
                <Button
                  size="lg"
                  className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-8 py-5 border-0 text-foreground hover:opacity-90 transition-all"
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/departments">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-sm font-body font-medium tracking-widest uppercase px-8 py-5 bg-transparent transition-all"
                  style={{
                    borderColor: "hsl(344 47% 30% / 0.45)",
                    color: "hsl(345 40% 93%)",
                  }}
                >
                  View Departments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;