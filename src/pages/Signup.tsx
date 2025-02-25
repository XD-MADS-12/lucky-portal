
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen bg-casino-background text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-casino-secondary/30 p-8 rounded-xl backdrop-blur-md border border-casino-muted/20">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <Trophy className="w-8 h-8 text-casino-accent" />
            <span className="text-2xl font-bold">CasinoX</span>
          </Link>
          <h2 className="text-3xl font-bold">Create an account</h2>
          <p className="text-gray-400 mt-2">Start your gaming journey today</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                className="bg-casino-muted/10 border-casino-muted/20 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-casino-muted/10 border-casino-muted/20 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                className="bg-casino-muted/10 border-casino-muted/20 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <Button className="w-full bg-casino-primary hover:bg-casino-primary/80">
            Create Account
          </Button>

          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-casino-accent hover:text-casino-accent/80">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-casino-secondary via-casino-background to-casino-secondary opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-casino-primary/20 via-transparent to-transparent"></div>
      </div>
    </div>
  );
};

export default Signup;
