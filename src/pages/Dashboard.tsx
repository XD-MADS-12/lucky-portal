
import { Button } from "@/components/ui/button";
import { Trophy, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

type Transaction = {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'game_win' | 'game_loss';
  status: string;
  created_at: string;
};

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
    loadTransactions();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setBalance(profile.balance);
      }
    }
  };

  const loadTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setTransactions(data as Transaction[]);
    }
  };

  const handleTransaction = async (type: 'deposit' | 'withdrawal') => {
    try {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid positive number",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      const numAmount = Number(amount);

      if (type === 'withdrawal' && numAmount > balance) {
        toast({
          title: "Insufficient balance",
          description: "You don't have enough funds for this withdrawal",
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount: numAmount,
        type: type,
        status: 'completed'
      });

      if (error) throw error;

      // Update profile balance
      const newBalance = type === 'deposit' ? balance + numAmount : balance - numAmount;
      await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', user.id);

      setBalance(newBalance);
      setAmount("");
      loadTransactions();

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} completed successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-casino-background text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Balance Card */}
          <div className="bg-casino-secondary/30 p-6 rounded-xl backdrop-blur-md border border-casino-muted/20">
            <h2 className="text-xl font-bold mb-4">Balance</h2>
            <div className="text-3xl font-bold text-casino-accent mb-6">${balance.toFixed(2)}</div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-casino-muted/10 border-casino-muted/20 text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleTransaction('deposit')}
                  disabled={loading}
                >
                  <Wallet className="mr-2" />
                  Deposit
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-casino-muted/10 border-casino-accent/20 hover:bg-casino-muted/20"
                  onClick={() => handleTransaction('withdrawal')}
                  disabled={loading}
                >
                  <ArrowUpRight className="mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-casino-secondary/30 p-6 rounded-xl backdrop-blur-md border border-casino-muted/20">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="capitalize">{tx.type.replace('_', ' ')}</TableCell>
                        <TableCell className={tx.type === 'withdrawal' || tx.type === 'game_loss' ? 'text-red-500' : 'text-green-500'}>
                          {tx.type === 'withdrawal' || tx.type === 'game_loss' ? '-' : '+'}${tx.amount}
                        </TableCell>
                        <TableCell className="capitalize">{tx.status}</TableCell>
                        <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-gray-400">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

