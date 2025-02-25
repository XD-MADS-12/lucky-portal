
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const DemoGame = () => {
  return (
    <div className="min-h-screen bg-casino-background text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Demo Game</h1>
          <p className="text-gray-400">Try our games without risking real money!</p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-casino-secondary/30 p-8 rounded-xl backdrop-blur-md border border-casino-muted/20">
          <div className="aspect-video bg-casino-muted/10 rounded-lg flex items-center justify-center mb-6">
            <Trophy className="w-16 h-16 text-casino-accent animate-pulse" />
          </div>
          
          <div className="text-center">
            <p className="mb-4">This is a demo version of our game. Ready to play with real money?</p>
            <Link to="/signup">
              <Button className="bg-casino-primary hover:bg-casino-primary/80">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoGame;
