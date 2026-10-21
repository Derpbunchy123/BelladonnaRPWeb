import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles, Gift, ArrowRight } from "lucide-react";

const Store = () => {
  const handleStoreClick = () => {
    window.open("https://placeholder.tebex.io/", "_blank");
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
            Support Us
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
            City Store
          </h1>
          <div className="ornament-line h-px w-48 mx-auto mb-6" />
          <p className="font-body text-base text-muted-foreground">
            Support the server and unlock exclusive items
          </p>
        </div>

        {/* Main store card */}
        <div
          className="stat-card-glow rounded-sm p-8 md:p-12 mb-6"
        >
          <div className="flex flex-col items-center text-center mb-10">
            <div
              className="w-16 h-16 rounded-sm flex items-center justify-center mb-6"
              style={{ background: "hsl(344 47% 25% / 0.15)" }}
            >
              <ShoppingBag className="w-8 h-8 text-bella-rose" />
            </div>
            <h2 className="font-display text-3xl font-medium text-foreground mb-4">
              Visit Our Tebex Store
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xl mb-8">
              Browse cosmetic items, exclusive clothing, and supporter perks. Every purchase goes directly toward server development and keeping Belladonna running at its best.
            </p>

            <Button
              size="lg"
              className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-12 py-6 border-0 text-foreground hover:opacity-90 transition-all hover:scale-105"
              onClick={handleStoreClick}
            >
              Open Store
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div className="stat-card-glow rounded-sm p-8 card-hover">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center mb-5"
              style={{ background: "hsl(344 47% 25% / 0.15)" }}
            >
              <Sparkles className="w-5 h-5 text-bella-rose" />
            </div>
            <h3 className="font-display text-xl font-medium text-foreground mb-3">
              Cosmetic Items
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Customize your character with unique clothing, accessories, and vehicle liveries that distinguish you across the city.
            </p>
          </div>

          <div className="stat-card-glow rounded-sm p-8 card-hover">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center mb-5"
              style={{ background: "hsl(344 47% 25% / 0.15)" }}
            >
              <Gift className="w-5 h-5 text-bella-rose" />
            </div>
            <h3 className="font-display text-xl font-medium text-foreground mb-3">
              Supporter Perks
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Access exclusive features, priority queue placement, and special in-game recognition as a community supporter.
            </p>
          </div>
        </div>

        {/* Info card */}
        <div
          className="rounded-sm p-8 border"
          style={{
            background: "hsl(344 47% 14% / 0.12)",
            borderColor: "hsl(344 47% 30% / 0.35)",
          }}
        >
          <h2 className="font-display text-2xl font-medium text-foreground mb-5">
            Important Information
          </h2>
          <ul className="space-y-3">
            {[
              "All purchases are final — please review items carefully before buying",
              "Store items are cosmetic and do not provide gameplay advantages",
              "Your purchase supports server hosting and ongoing development",
              "Items are delivered automatically to your in-game character",
              "For support, contact us on Discord with your purchase details",
            ].map((info, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="font-body text-xs mt-1 flex-shrink-0"
                  style={{ color: "hsl(344 47% 45%)" }}
                >
                  ◆
                </span>
                <span className="font-body text-sm text-muted-foreground leading-relaxed">
                  {info}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Store;