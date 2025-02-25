
import { Button } from "@/components/ui/button";
import { Gamepad2, Trophy } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-casino-background">
      {/* Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-casino-secondary via-casino-background to-casino-secondary opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-casino-primary/20 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-casino-muted/10 px-4 py-2 rounded-full mb-8 animate-float">
            <Trophy className="w-5 h-5 text-casino-accent" />
            <span className="text-sm text-gray-300">Welcome Bonus up to $1,000</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Experience the Thrill of
            <span className="text-casino-primary block mt-2">Next-Gen Gaming</span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Join thousands of players in the most immersive online casino experience. Live games, slots, and more await you.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-casino-primary hover:bg-casino-primary/80 text-white px-8">
              Join Now
            </Button>
            <Button size="lg" variant="outline" className="bg-casino-muted/10 border-casino-accent/20 hover:bg-casino-muted/20">
              <Gamepad2 className="mr-2 h-5 w-5" />
              Play Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-casino-accent/50 to-transparent"></div>
    </div>
  );
};

export default Hero;
