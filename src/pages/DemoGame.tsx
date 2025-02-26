
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const SYMBOLS = ["🍒", "🍋", "🍊", "7️⃣", "💎"];
const ROWS = 3;
const COLS = 3;

const DemoGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState("1");
  const [grid, setGrid] = useState<string[][]>([]);
  const [spinning, setSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);

  useEffect(() => {
    loadUserBalance();
    initializeGrid();
  }, []);

  const loadUserBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();

    if (profile) {
      setBalance(profile.balance);
    }
  };

  const initializeGrid = () => {
    const newGrid = Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
    );
    setGrid(newGrid);
  };

  const handleSpin = async () => {
    const bet = Number(betAmount);
    if (isNaN(bet) || bet <= 0) {
      toast({
        title: "Invalid bet",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    if (bet > balance) {
      toast({
        title: "Insufficient balance",
        description: "Your bet amount exceeds your balance",
        variant: "destructive",
      });
      return;
    }

    setSpinning(true);
    setWinAmount(0);

    // Simulate spinning animation
    const intervals = 10;
    for (let i = 0; i < intervals; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      initializeGrid();
    }

    // Calculate result
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const result = Math.random();
    const won = result > 0.6; // 40% win rate
    const multiplier = won ? (result > 0.9 ? 3 : 2) : 0; // 3x or 2x multiplier on wins
    const winnings = bet * multiplier;
    const newBalance = balance - bet + winnings;

    // Update user balance
    await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id);

    // Record transaction
    await supabase.from('transactions').insert({
      user_id: user.id,
      amount: bet,
      type: 'game_loss',
      status: 'completed'
    });

    if (won) {
      await supabase.from('transactions').insert({
        user_id: user.id,
        amount: winnings,
        type: 'game_win',
        status: 'completed'
      });
    }

    setBalance(newBalance);
    setWinAmount(winnings);
    setSpinning(false);

    toast({
      title: won ? "Winner! 🎉" : "Try again!",
      description: won ? `You won $${winnings}!` : "Better luck next time!",
      variant: won ? "default" : "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-casino-background text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-casino-secondary/30 p-6 rounded-xl backdrop-blur-md border border-casino-muted/20">
            <h1 className="text-2xl font-bold mb-6 text-center">Demo Slot Machine</h1>
            
            <div className="mb-6 text-center">
              <div className="text-lg font-semibold">Balance: ${balance.toFixed(2)}</div>
              {winAmount > 0 && (
                <div className="text-green-400 text-lg mt-2">Won: ${winAmount.toFixed(2)}</div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6 bg-black/50 p-4 rounded-lg">
              {grid.map((row, i) => (
                row.map((symbol, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="aspect-square flex items-center justify-center text-4xl bg-black/30 rounded-lg border border-casino-muted/20"
                  >
                    {symbol}
                  </div>
                ))
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="bet">Bet Amount</Label>
                  <Input
                    id="bet"
                    type="number"
                    min="1"
                    step="1"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-casino-muted/10 border-casino-muted/20"
                    disabled={spinning}
                  />
                </div>
                <Button
                  onClick={handleSpin}
                  disabled={spinning}
                  className="bg-casino-accent hover:bg-casino-accent/90 text-white px-8 h-10 mt-6"
                >
                  {spinning ? "Spinning..." : "Spin"}
                </Button>
              </div>
            </div>

            <div className="mt-6 text-sm text-center text-gray-400">
              Match symbols to win! 3x multiplier for jackpot wins, 2x for regular wins.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoGame;

