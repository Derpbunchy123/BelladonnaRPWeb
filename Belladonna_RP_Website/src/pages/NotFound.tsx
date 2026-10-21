import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p
          className="font-display text-8xl font-light mb-6"
          style={{ color: "hsl(344 47% 30% / 0.4)" }}
        >
          404
        </p>
        <h1 className="font-display text-4xl font-light text-foreground mb-4">
          Page Not Found
        </h1>
        <div className="ornament-line h-px w-32 mx-auto mb-6" />
        <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved. Perhaps it is one of the city's better-kept secrets.
        </p>
        <Link to="/">
          <Button
            className="western-gradient text-sm font-body font-medium tracking-widest uppercase px-8 py-5 border-0 text-foreground hover:opacity-90 transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;