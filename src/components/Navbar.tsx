
import { Button } from "@/components/ui/button";
import { Trophy, Gamepad2, Fish, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-casino-secondary/95 backdrop-blur-md border-b border-casino-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-casino-accent" />
            <span className="text-2xl font-bold text-white">CasinoX</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/live-games">
              <Gamepad2 className="w-5 h-5" />
              <span>Live Games</span>
            </NavLink>
            <NavLink to="/slots">
              <Trophy className="w-5 h-5" />
              <span>Slots</span>
            </NavLink>
            <NavLink to="/fishing">
              <Fish className="w-5 h-5" />
              <span>Fishing</span>
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden md:flex items-center space-x-2 bg-casino-muted/10 border-casino-accent/20 hover:bg-casino-muted/20">
              <Wallet className="w-4 h-4 text-casino-accent" />
              <span>Deposit</span>
            </Button>
            <Link to="/login">
              <Button className="bg-casino-primary hover:bg-casino-primary/80">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;
