
import { Button } from "@/components/ui/button";
import { Trophy, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-casino-background text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Balance Card */}
          <div className="bg-casino-secondary/30 p-6 rounded-xl backdrop-blur-md border border-casino-muted/20">
            <h2 className="text-xl font-bold mb-4">Balance</h2>
            <div className="text-3xl font-bold text-casino-accent mb-4">$0.00</div>
            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Wallet className="mr-2" />
                Deposit
              </Button>
              <Button variant="outline" className="bg-casino-muted/10 border-casino-accent/20 hover:bg-casino-muted/20">
                <ArrowUpRight className="mr-2" />
                Withdraw
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-casino-secondary/30 p-6 rounded-xl backdrop-blur-md border border-casino-muted/20">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="text-gray-400">No recent activity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
