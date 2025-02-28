
import { Button } from "@/components/ui/button";
import { Trophy, Gamepad2, Fish, Wallet, ShieldCheck, Slot } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } else if (data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsAdmin(false);
    }
  };

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
              <Slot className="w-5 h-5" />
              <span>Slots</span>
            </NavLink>
            <NavLink to="/blackjack">
              <Trophy className="w-5 h-5" />
              <span>Blackjack</span>
            </NavLink>
            <NavLink to="/demo-game">
              <Fish className="w-5 h-5" />
              <span>Demo Game</span>
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="hidden md:flex items-center space-x-2 bg-casino-muted/10 border-casino-accent/20 hover:bg-casino-muted/20">
                      <ShieldCheck className="w-4 h-4 text-casino-accent" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant="outline" className="hidden md:flex items-center space-x-2 bg-casino-muted/10 border-casino-accent/20 hover:bg-casino-muted/20">
                    <Wallet className="w-4 h-4 text-casino-accent" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  onClick={() => signOut()}
                  className="bg-casino-primary hover:bg-casino-primary/80"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-casino-primary hover:bg-casino-primary/80">
                  Sign In
                </Button>
              </Link>
            )}
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
