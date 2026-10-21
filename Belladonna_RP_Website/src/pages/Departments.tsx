import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Skull, Moon, Sparkles, Flame, HelpCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { serverConfig } from "@/config/serverConfig";

const factions = [
  {
    id: "vampires",
    icon: <Skull className="h-5 w-5" />,
    tag: "Supernatural",
    name: "Vampires",
    description: `Vampires are supernatural beings with a thirst for blood and abilities that set them apart from mortals. They move through the city hiding their true nature, building their own lives, alliances, and rivalries. Their existence comes with strengths and weaknesses that make them different from ordinary humans.`,
    dossierNote: "This faction's dossier is currently under construction.",
  },
  {
    id: "werewolves",
    icon: <Moon className="h-5 w-5" />,
    tag: "Supernatural",
    name: "Werewolves",
    description: `Werewolves are supernatural beings with a powerful connection to their wolf nature. They possess heightened instincts and abilities that separate them from mortals, though learning to control their beast can be a challenge. Every werewolf has their own relationship with their nature and what it means to live between two worlds.`,
    dossierNote: "This faction's dossier is currently under construction.",
  },
  {
    id: "witches",
    icon: <Sparkles className="h-5 w-5" />,
    tag: "Supernatural",
    name: "Witches",
    description: `Witches are practitioners of magic who draw upon supernatural forces through their craft. Their abilities can involve rituals, spells, and other forms of magic, depending on their knowledge and experience. For witches, magic is a skill that must be understood and developed.`,
    dossierNote: "This faction's dossier is currently under construction.",
  },
  {
    id: "warlocks",
    icon: <Flame className="h-5 w-5" />,
    tag: "Supernatural",
    name: "Warlocks",
    description: `Warlocks are magic users who follow their own path in the supernatural world. Through practice, knowledge, and their connection to magic, they develop abilities that can shape how they live and interact with others. Their approach to magic is their own, and no two warlocks need to follow the same path.`,
    dossierNote: "This faction's dossier is currently under construction.",
  },
  {
    id: "hunters",
    icon: <Shield className="h-5 w-5" />,
    tag: "Organization",
    name: "The Hunters Brigade",
    description: `The Hunters Brigade is an organization dedicated to protecting the mortal population from the dangers of the supernatural world. Operating in secrecy, its members work to prevent supernatural beings from exposing their existence to the public. The Brigade does not answer to ordinary law enforcement, and its methods are not always bound by the law. To those who know the truth, the Hunters Brigade serves as a reminder that the supernatural world has consequences for those who expose it.`,
    dossierNote: "This faction's dossier is currently under construction.",
  },
  {
    id: "other",
    icon: <HelpCircle className="h-5 w-5" />,
    tag: "Other",
    name: "Other Supernatural Races",
    description: `BelladonnaRP currently supports vampires, werewolves, witches, and warlocks. Players interested in portraying another supernatural race must receive staff approval before creating or roleplaying that character. This helps ensure new races fit the city's lore and maintain a balanced roleplay experience.`,
    dossierNote: null,
  },
];

const Departments = () => {
  const [open, setOpen] = useState<string | null>("vampires");

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
            The Supernatural City
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
            Factions
          </h1>
          <div className="ornament-line h-px w-48 mx-auto mb-6" />
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Belladonna is home to more than ordinary people. Beneath the surface of city life, supernatural beings walk among the living — hiding in plain sight, building power, and shaping the city's fate.
          </p>
        </div>

        {/* Intro notice */}
        <div
          className="rounded-sm p-6 mb-8 border"
          style={{
            background: "hsl(344 47% 14% / 0.15)",
            borderColor: "hsl(344 47% 30% / 0.35)",
          }}
        >
          <p className="font-body text-sm text-muted-foreground leading-relaxed text-center">
            <span className="font-medium" style={{ color: "hsl(340 30% 60%)" }}>Supernatural Application Required: </span>
            All supernatural characters must have a staff-approved application before play begins. Review Section 06 of the server rules for full details on supernatural roleplay requirements.
          </p>
        </div>

        {/* Faction accordions */}
        <div className="space-y-2 mb-8">
          {factions.map((faction) => {
            const isOpen = open === faction.id;
            return (
              <div key={faction.id} className="stat-card-glow rounded-sm overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 p-6 text-left transition-colors duration-200 hover:bg-white/[0.02]"
                  onClick={() => setOpen(isOpen ? null : faction.id)}
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <span
                      className="flex-shrink-0 p-2 rounded-sm"
                      style={{ background: "hsl(344 47% 25% / 0.15)", color: "hsl(340 30% 54%)" }}
                    >
                      {faction.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <p className="font-body text-[9px] tracking-[0.4em] uppercase text-muted-foreground">
                          {faction.tag}
                        </p>
                      </div>
                      <h2 className="font-display text-xl font-medium text-foreground">
                        {faction.name}
                      </h2>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-300 flex-shrink-0",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-[800px]" : "max-h-0"
                  )}
                >
                  <div className="px-6 pb-8">
                    <div
                      className="h-px mb-6"
                      style={{ background: "hsl(312 18% 22%)" }}
                    />

                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                      {faction.description}
                    </p>

                    {faction.dossierNote && (
                      <>
                        <div
                          className="h-px mb-5"
                          style={{ background: "hsl(312 18% 18%)" }}
                        />
                        <p
                          className="font-display italic text-sm leading-relaxed"
                          style={{ color: "hsl(344 47% 40%)" }}
                        >
                          {faction.dossierNote}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info notice */}
        <div
          className="rounded-sm p-6 mb-6 border"
          style={{
            background: "hsl(344 47% 14% / 0.12)",
            borderColor: "hsl(344 47% 30% / 0.35)",
          }}
        >
          <p className="font-body text-xs text-muted-foreground leading-relaxed text-center">
            <span className="font-medium" style={{ color: "hsl(340 30% 60%)" }}>Note: </span>
            Faction dossiers are published as lore is established in the city. Mind control, memory alteration, and forced transformations require staff approval and follow a D20 challenge procedure. Review the applicable faction guide before play.
          </p>
        </div>

        {/* CTA */}
        <div
          className="stat-card-glow rounded-sm p-8 text-center"
          style={{ borderColor: "hsl(344 47% 30% / 0.35)" }}
        >
          <h2 className="font-display text-2xl font-medium text-foreground mb-3">
            Ready to step into the dark?
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
            Join the Discord and open a staff ticket to begin your supernatural application. Every faction requires approval before play begins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="western-gradient font-body text-sm tracking-widest uppercase px-8 py-5 border-0 text-foreground hover:opacity-90 transition-all hover:scale-105"
              onClick={() => window.open(serverConfig.discord.inviteLink, "_blank")}
            >
              Join Discord
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;
