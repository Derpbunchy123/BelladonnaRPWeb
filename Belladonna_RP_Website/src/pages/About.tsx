import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Eye, Shield, Skull, Crown, Layers } from "lucide-react";

const sections = [
  {
    id: "overview",
    icon: <BookOpen className="h-4 w-4" />,
    number: "01",
    title: "City Lore",
    content: (
      <div className="space-y-4">
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Belladonna has always been a place where people come looking for something. For some, it's a fresh start. For others, it's money, power, or a chance to leave their past behind. Most people go about their lives without giving much thought to what might be happening around them.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          The truth is that Belladonna has a history most of its residents will never know. Supernatural beings have lived among humans for generations, finding ways to exist without drawing attention to themselves. To the average person, they're just another face in the crowd.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Keeping it that way matters. The supernatural world has its own rules, and those who know the truth understand why it cannot simply become common knowledge.
        </p>
      </div>
    ),
  },
  {
    id: "mortal",
    icon: <Eye className="h-4 w-4" />,
    number: "02",
    title: "Living as a Mortal",
    content: (
      <div className="space-y-4">
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          For most people, Belladonna is just home. They go to work, spend time with friends, start families, and try to make something of their lives. The supernatural world rarely crosses their minds because they've never had a reason to believe it exists.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Every so often, something happens that doesn't quite make sense. Most people find an explanation and move on. Others start asking questions.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Finding answers can change everything. There are people who will go to great lengths to keep the truth hidden, and getting too close can put more than your own life at risk.
        </p>
      </div>
    ),
  },
  {
    id: "factions",
    icon: <Layers className="h-4 w-4" />,
    number: "03",
    title: "The Supernatural Factions",
    content: (
      <div className="space-y-4">
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          The supernatural community has existed in Belladonna long before most of its current residents arrived. Different species have developed their own customs and ways of life, and each faction has its own leadership.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Relations between factions depend on their history and the people involved. Some are willing to work together, while others have little interest in trusting anyone outside their own kind. Disagreements are common, and old tensions don't always stay buried.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Despite their differences, the factions share a reason to keep their existence hidden from the mortal population. What happens when that secrecy is threatened can have consequences for everyone involved.
        </p>
        <div className="pt-2">
          <Link to="/departments">
            <Button
              size="sm"
              variant="outline"
              className="font-body text-xs tracking-widest uppercase bg-transparent transition-all hover:scale-105"
              style={{
                borderColor: "hsl(344 47% 30% / 0.45)",
                color: "hsl(345 40% 80%)",
              }}
            >
              View All Factions
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    ),
  },
  {
    id: "hunters",
    icon: <Shield className="h-4 w-4" />,
    number: "04",
    title: "The Hunters Brigade",
    content: (
      <div className="space-y-4">
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          The Hunters Brigade works behind the scenes to keep the supernatural world hidden from mortals. Most people have never heard of the organization, and ordinary law enforcement has no idea what it really does.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          The Brigade deals with situations that threaten the separation between humans and supernatural beings. Its members don't always follow the law, and their methods can be difficult to justify. To them, protecting the secret matters more than maintaining a clean reputation.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          For supernatural beings, attracting the Brigade's attention can make an already difficult situation much worse. Even those who know the organization exists may know very little about who's involved or how far its reach extends.
        </p>
      </div>
    ),
  },
  {
    id: "triune",
    icon: <Crown className="h-4 w-4" />,
    number: "05",
    title: "The Triune",
    content: (
      <div className="space-y-4">
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Long before the supernatural factions established themselves, there were three beings whose existence predates the world as most know it. Three brothers who go by the name of The Will, The Vessel, and The Veil are known collectively as the Triune.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Their origins remain largely unknown. Connected to the Source, where the world's leylines are strongest, they played a part in shaping the laws that govern existence. Their influence reaches across the supernatural world, though even their power has its limits.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          The Triune cannot be killed, and their place in the supernatural order is unlike that of any faction leader. Those who lead the factions exist beneath them, helping maintain the balance between the supernatural world and mortal society.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Very few understand the full extent of the Triune's history. Even among supernatural beings, much of what is known about them has been passed down through stories rather than firsthand experience.
        </p>
      </div>
    ),
  },
  {
    id: "truth",
    icon: <Skull className="h-4 w-4" />,
    number: "06",
    title: "The Truth Beneath Belladonna",
    content: (
      <div className="space-y-4">
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Not everyone in Belladonna knows what they're living alongside. Some will spend their entire lives unaware, while others may eventually find themselves caught up in a world they never knew existed.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          What you discover depends on the choices you make and the people you meet. In Belladonna, learning the truth is only the beginning.
        </p>
      </div>
    ),
  },
];

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
            The World of Belladonna
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
            City Lore
          </h1>
          <div className="ornament-line h-px w-48 mx-auto mb-6" />
          <p className="font-body text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Belladonna is more than it appears. Behind the city's surface runs a history that most residents will never encounter.
          </p>
        </div>

        {/* Lore sections */}
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="stat-card-glow rounded-sm p-8">
              <div className="flex items-start gap-5 mb-5">
                <span
                  className="font-body text-xs font-medium tabular-nums flex-shrink-0 mt-0.5"
                  style={{ color: "hsl(344 47% 45%)" }}
                >
                  {section.number}
                </span>
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="flex-shrink-0 p-1.5 rounded-sm"
                    style={{
                      background: "hsl(344 47% 25% / 0.15)",
                      color: "hsl(340 30% 54%)",
                    }}
                  >
                    {section.icon}
                  </span>
                  <h2 className="font-display text-2xl font-medium text-foreground">
                    {section.title}
                  </h2>
                </div>
              </div>
              <div
                className="h-px mb-6"
                style={{ background: "hsl(312 18% 22%)" }}
              />
              <div className="pl-0 md:pl-9">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div
          className="rounded-sm p-8 mt-6 text-center border"
          style={{
            background: "hsl(344 47% 14% / 0.12)",
            borderColor: "hsl(344 47% 30% / 0.35)",
          }}
        >
          <h2 className="font-display text-2xl font-medium text-foreground mb-3">
            Ready to find your place in the city?
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
            Read the rules, explore the factions, and submit your application to join Belladonna.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply">
              <Button
                size="lg"
                className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-8 py-5 border-0 text-foreground hover:opacity-90 transition-all hover:scale-105"
              >
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/departments">
              <Button
                size="lg"
                variant="outline"
                className="text-sm font-body font-medium tracking-widest uppercase px-8 py-5 bg-transparent transition-all hover:scale-105"
                style={{
                  borderColor: "hsl(344 47% 30% / 0.45)",
                  color: "hsl(345 40% 93%)",
                }}
              >
                View Factions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
