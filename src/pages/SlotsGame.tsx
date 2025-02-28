
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Coins, ArrowLeft } from 'lucide-react';

// Slot machine symbols
const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '7️⃣', '💰', '⭐'];

const SlotsGame = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState(0);
  const [betAmount, setBetAmount] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState([
    [symbols[0], symbols[1], symbols[2]],
    [symbols[1], symbols[2], symbols[3]],
    [symbols[2], symbols[3], symbols[4]],
    [symbols[3], symbols[4], symbols[5]],
    [symbols[4], symbols[5], symbols[6]],
  ]);
  const [winAmount, setWinAmount] = useState(0);
  const [showWin, setShowWin] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchUserBalance();
  }, [user, navigate]);

  const fetchUserBalance = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      setUserBalance(data.balance);
    } catch (error) {
      console.error('Error fetching user balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your balance',
        variant: 'destructive',
      });
    }
  };

  const updateUserBalance = async (amount, isWin = false) => {
    try {
      const newBalance = userBalance + amount;
      
      // Update user balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          amount: Math.abs(amount),
          type: isWin ? 'game_win' : 'game_loss',
          status: 'completed',
          metadata: { game: 'slots' }
        });

      if (transactionError) {
        throw transactionError;
      }

      setUserBalance(newBalance);
    } catch (error) {
      console.error('Error updating balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to update your balance',
        variant: 'destructive',
      });
    }
  };

  const increaseBet = () => {
    if (betAmount < 10) {
      setBetAmount(betAmount + 1);
    }
  };

  const decreaseBet = () => {
    if (betAmount > 1) {
      setBetAmount(betAmount - 1);
    }
  };

  const getRandomSymbol = () => {
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  const spinReels = async () => {
    if (isSpinning) return;
    
    if (userBalance < betAmount) {
      toast({
        title: 'Insufficient Balance',
        description: 'Please deposit more funds to continue playing',
        variant: 'destructive',
      });
      return;
    }

    setIsSpinning(true);
    setShowWin(false);
    
    // Deduct bet amount from balance
    await updateUserBalance(-betAmount);

    // Animate spinning
    const spins = 20; // Number of visual spins
    const spinInterval = 50; // ms between spins
    
    for (let i = 0; i < spins; i++) {
      setTimeout(() => {
        // Generate new random symbols for each reel
        setReels(reels.map(() => {
          return [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        }));
        
        // On the last spin, check for wins
        if (i === spins - 1) {
          setTimeout(() => {
            checkWin();
            setIsSpinning(false);
          }, 300);
        }
      }, i * spinInterval);
    }
  };

  const checkWin = () => {
    // Get middle row (payline)
    const payline = reels.map(reel => reel[1]);
    
    // Count consecutive symbols from left to right
    let currentSymbol = payline[0];
    let count = 1;
    let maxCount = 1;
    let winningSymbol = currentSymbol;
    
    for (let i = 1; i < payline.length; i++) {
      if (payline[i] === currentSymbol) {
        count++;
        if (count > maxCount) {
          maxCount = count;
          winningSymbol = currentSymbol;
        }
      } else {
        currentSymbol = payline[i];
        count = 1;
      }
    }
    
    // Check if we have 3 or more matching symbols
    let win = 0;
    
    if (maxCount >= 3) {
      // Calculate win multiplier based on symbol and count
      const symbolIndex = symbols.indexOf(winningSymbol);
      const symbolMultiplier = symbolIndex + 1;
      
      win = betAmount * symbolMultiplier * (maxCount - 2);
      
      // Special jackpot for 5 '💰' symbols
      if (maxCount === 5 && winningSymbol === '💰') {
        win = betAmount * 100;
      }
      
      if (win > 0) {
        setWinAmount(win);
        setShowWin(true);
        updateUserBalance(win, true);
        
        toast({
          title: 'Winner!',
          description: `You won $${win.toFixed(2)}!`,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-casino-background text-white pt-20 px-4 pb-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-casino-muted/20"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center bg-casino-secondary/30 px-4 py-2 rounded-full">
            <Coins className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="font-bold">${userBalance.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="bg-casino-secondary/30 rounded-xl backdrop-blur-md border border-casino-muted/20 p-6 mb-6">
          <h1 className="text-3xl font-bold text-center mb-6">Mega Slots</h1>
          
          {/* Win Animation */}
          {showWin && (
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 text-center py-4 animate-bounce">
                <span className="text-2xl font-bold text-yellow-400">
                  WIN ${winAmount.toFixed(2)}!
                </span>
              </div>
            </div>
          )}
          
          {/* Slot Machine */}
          <div className="relative bg-gradient-to-b from-casino-primary/30 to-casino-secondary/30 rounded-lg border-4 border-yellow-600 p-6 mb-6">
            <div className={`grid grid-cols-5 gap-2 text-center ${isSpinning ? 'animate-pulse' : ''}`}>
              {reels.map((reel, reelIndex) => (
                <div key={reelIndex} className="bg-black/50 rounded p-2 border border-yellow-600/50">
                  {reel.map((symbol, symbolIndex) => (
                    <div 
                      key={symbolIndex} 
                      className={`text-4xl md:text-6xl p-2 ${symbolIndex === 1 ? 'bg-yellow-600/20 rounded' : ''}`}
                    >
                      {symbol}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Payline Indicator */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 border-t-2 border-dashed border-yellow-400/70 z-10 pointer-events-none"></div>
          </div>
          
          {/* Bet Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button 
                onClick={decreaseBet} 
                disabled={betAmount <= 1 || isSpinning}
                className="bg-casino-muted/20 hover:bg-casino-muted/30 text-xl font-bold h-12 w-12"
              >
                -
              </Button>
              
              <div className="bg-casino-primary/20 border border-casino-primary/40 rounded-md px-6 py-2 min-w-[100px] text-center">
                <div className="text-xs uppercase tracking-wide text-gray-400">Bet Amount</div>
                <div className="text-xl font-bold">${betAmount.toFixed(2)}</div>
              </div>
              
              <Button 
                onClick={increaseBet} 
                disabled={betAmount >= 10 || isSpinning}
                className="bg-casino-muted/20 hover:bg-casino-muted/30 text-xl font-bold h-12 w-12"
              >
                +
              </Button>
            </div>
            
            <Button
              onClick={spinReels}
              disabled={isSpinning || userBalance < betAmount}
              className="bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold text-lg py-6 px-10 rounded-full transform transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSpinning ? 'Spinning...' : 'SPIN'}
            </Button>
          </div>
        </div>
        
        {/* Paytable */}
        <div className="bg-casino-secondary/30 rounded-xl backdrop-blur-md border border-casino-muted/20 p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Paytable</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {symbols.map((symbol, index) => (
              <div key={index} className="bg-casino-muted/10 p-3 rounded-lg border border-casino-muted/20 text-center">
                <div className="text-3xl mb-2">{symbol}</div>
                <div className="text-sm">
                  <div>3x = ${(index + 1).toFixed(2)}</div>
                  <div>4x = ${((index + 1) * 2).toFixed(2)}</div>
                  <div>5x = ${((index + 1) * 3).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-400">
            Jackpot: 5x 💰 symbols pays 100x your bet!
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotsGame;
