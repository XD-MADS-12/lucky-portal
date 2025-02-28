
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const { signIn, user, setAdminRole, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if redirected from a protected route
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromAdmin = params.get('from') === 'admin';
    
    if (fromAdmin) {
      toast.error("Admin access required", {
        description: "You need admin privileges to access the admin panel.",
        duration: 5000,
      });
    }
  }, [location]);

  useEffect(() => {
    // If user is already logged in and is admin, redirect to admin panel
    if (user && isAdmin && location.search.includes('from=admin')) {
      navigate('/admin');
    }
    // If user is already logged in, redirect to dashboard
    else if (user) {
      navigate('/dashboard');
    }
  }, [user, isAdmin, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await setAdminRole(user.id);
    } catch (error) {
      console.error("Error setting admin role:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-casino-secondary p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-casino-accent/30 bg-black/80 p-6 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Sign In</h1>
          <p className="mt-2 text-casino-muted">Welcome back to CasinoX</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-casino-muted/10 text-white"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-casino-muted/10 text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox
              id="show-admin"
              checked={showAdmin}
              onCheckedChange={(checked) => 
                setShowAdmin(checked as boolean)
              }
            />
            <Label 
              htmlFor="show-admin" 
              className="ml-2 text-sm text-casino-muted cursor-pointer"
            >
              Show admin options
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-casino-primary hover:bg-casino-primary/80"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {showAdmin && user && (
            <Button
              type="button"
              onClick={handleMakeAdmin}
              disabled={loading}
              className="w-full mt-4 bg-red-600 hover:bg-red-700"
            >
              Make This Account Admin
            </Button>
          )}
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-casino-muted">Don't have an account? </span>
          <Link
            to="/signup"
            className="font-medium text-casino-accent hover:text-casino-accent/80"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
