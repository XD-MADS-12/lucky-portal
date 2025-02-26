
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Wallet } from "lucide-react";

const SYMBOLS = ["🎰", "💎", "7️⃣", "🍒", "🎲"];
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
  const [lastResults, setLastResults] = useState<{win: boolean, amount: number}[]>([]);

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

  const checkWinningLines = (grid: string[][]) => {
    let winningLines = 0;
    
    // Check rows
    for (let i = 0; i < ROWS; i++) {
      if (grid[i].every(symbol => symbol === grid[i][0])) {
        winningLines++;
      }
    }
    
    // Check diagonals
    const leftDiagonal = [grid[0][0], grid[1][1], grid[2][2]];
    const rightDiagonal = [grid[0][2], grid[1][1], grid[2][0]];
    
    if (leftDiagonal.every(symbol => symbol === leftDiagonal[0])) winningLines++;
    if (rightDiagonal.every(symbol => symbol === rightDiagonal[0])) winningLines++;

    return winningLines;
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
    const spinDuration = 2000;
    const intervals = 20;
    const intervalTime = spinDuration / intervals;
    
    for (let i = 0; i < intervals; i++) {
      await new Promise(resolve => setTimeout(resolve, intervalTime));
      initializeGrid();
    }

    // Generate final result
    const finalGrid = Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
    );
    setGrid(finalGrid);

    // Calculate winnings
    const winningLines = checkWinningLines(finalGrid);
    const multiplier = winningLines > 0 ? winningLines * 2 : 0;
    const winnings = bet * multiplier;
    
    // Update user balance
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newBalance = balance - bet + winnings;
    
    await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id);

    // Record transactions
    await supabase.from('transactions').insert({
      user_id: user.id,
      amount: bet,
      type: 'game_loss',
      status: 'completed'
    });

    if (winnings > 0) {
      await supabase.from('transactions').insert({
        user_id: user.id,
        amount: winnings,
        type: 'game_win',
        status: 'completed'
      });
    }

    setBalance(newBalance);
    setWinAmount(winnings);
    setLastResults(prev => [{win: winnings > 0, amount: winnings}, ...prev].slice(0, 5));
    setSpinning(false);

    toast({
      title: winnings > 0 ? "Winner! 🎉" : "Try again!",
      description: winnings > 0 ? `You won $${winnings}!` : "Better luck next time!",
      variant: winnings > 0 ? "default" : "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-casino-background text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-casino-secondary/30 p-6 rounded-xl backdrop-blur-md border border-casino-muted/20">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Demo Slot Machine</h1>
              <div className="flex items-center gap-2 text-casino-accent">
                <Wallet className="h-5 w-5" />
                <span className="text-lg font-semibold">${balance.toFixed(2)}</span>
              </div>
            </div>
            
            {winAmount > 0 && (
              <div className="flex items-center justify-center gap-2 mb-6 text-green-400 bg-green-400/10 p-3 rounded-lg">
                <Trophy className="h-5 w-5" />
                <span className="text-lg font-semibold">Won: ${winAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-6 bg-black/50 p-4 rounded-lg">
              {grid.map((row, i) => (
                row.map((symbol, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`aspect-square flex items-center justify-center text-4xl bg-black/30 rounded-lg border ${
                      spinning ? 'animate-pulse' : ''
                    } border-casino-muted/20 transition-all duration-200 hover:scale-105`}
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

            {lastResults.length > 0 && (
              <div className="mt-6 p-4 bg-black/30 rounded-lg">
                <h3 className="text-sm font-semibold mb-2">Last Results</h3>
                <div className="space-y-2">
                  {lastResults.map((result, index) => (
                    <div key={index} className={`text-sm ${result.win ? 'text-green-400' : 'text-red-400'}`}>
                      {result.win ? `Won $${result.amount}` : 'No win'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 text-sm text-center text-gray-400">
              Match symbols horizontally or diagonally to win! Each winning line multiplies your bet by 2x.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoGame;
