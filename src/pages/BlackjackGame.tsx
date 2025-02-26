
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, X, Check, RotateCcw } from "lucide-react";

type Card = {
  suit: string;
  value: string;
  numericValue: number;
};

const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const BlackjackGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState("1");
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<"betting" | "playing" | "dealer-turn" | "complete">("betting");
  const [gameResult, setGameResult] = useState<"" | "win" | "lose" | "push">("");
  const [lastResults, setLastResults] = useState<{result: string, amount: number}[]>([]);

  useEffect(() => {
    loadUserBalance();
    initializeDeck();
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

  const initializeDeck = () => {
    const newDeck: Card[] = [];
    for (const suit of SUITS) {
      for (const value of VALUES) {
        const numericValue = value === "A" ? 11 : ["J", "Q", "K"].includes(value) ? 10 : parseInt(value);
        newDeck.push({ suit, value, numericValue });
      }
    }
    setDeck(shuffleDeck([...newDeck]));
  };

  const shuffleDeck = (deck: Card[]) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const drawCard = (): Card => {
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    setDeck(newDeck);
    return card;
  };

  const calculateHand = (hand: Card[]) => {
    let sum = 0;
    let aces = 0;
    
    for (const card of hand) {
      if (card.value === "A") {
        aces += 1;
      }
      sum += card.numericValue;
    }
    
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces -= 1;
    }
    
    return sum;
  };

  const startGame = async () => {
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

    const playerCards = [drawCard(), drawCard()];
    const dealerCards = [drawCard()];

    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameState("playing");
  };

  const hit = () => {
    const newHand = [...playerHand, drawCard()];
    setPlayerHand(newHand);
    
    if (calculateHand(newHand) > 21) {
      endGame("lose");
    }
  };

  const stand = () => {
    setGameState("dealer-turn");
    dealerPlay();
  };

  const dealerPlay = () => {
    let currentHand = [...dealerHand];
    while (calculateHand(currentHand) < 17) {
      currentHand.push(drawCard());
    }
    setDealerHand(currentHand);
    
    const dealerScore = calculateHand(currentHand);
    const playerScore = calculateHand(playerHand);
    
    if (dealerScore > 21 || playerScore > dealerScore) {
      endGame("win");
    } else if (dealerScore > playerScore) {
      endGame("lose");
    } else {
      endGame("push");
    }
  };

  const endGame = async (result: "win" | "lose" | "push") => {
    const bet = Number(betAmount);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let winnings = 0;
    if (result === "win") {
      winnings = bet * 2;
    } else if (result === "push") {
      winnings = bet;
    }

    const newBalance = balance - bet + winnings;
    
    await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id);

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
    setGameResult(result);
    setGameState("complete");
    setLastResults(prev => [{result, amount: winnings}, ...prev].slice(0, 5));

    toast({
      title: result === "win" ? "You won! 🎉" : result === "push" ? "Push - Bet returned" : "Better luck next time!",
      description: winnings > 0 ? `You won $${winnings}!` : "House wins this time",
      variant: result === "win" ? "default" : result === "push" ? "default" : "destructive",
    });
  };

  const resetGame = () => {
    if (deck.length < 20) {
      initializeDeck();
    }
    setGameState("betting");
    setGameResult("");
    setPlayerHand([]);
    setDealerHand([]);
  };

  const renderCard = (card: Card) => {
    const isRed = card.suit === "♥" || card.suit === "♦";
    return (
      <div className={`flex items-center justify-center p-3 bg-white rounded-lg border-2 border-gray-200 shadow-sm w-14 h-20 ${isRed ? 'text-red-600' : 'text-black'}`}>
        <div className="text-center">
          <div className="text-sm font-bold">{card.value}</div>
          <div className="text-lg">{card.suit}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-casino-background text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-casino-secondary/30 p-6 rounded-xl backdrop-blur-md border border-casino-muted/20">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Blackjack</h1>
              <div className="flex items-center gap-2 text-casino-accent">
                <Wallet className="h-5 w-5" />
                <span className="text-lg font-semibold">${balance.toFixed(2)}</span>
              </div>
            </div>

            {gameState === "betting" && (
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
                    />
                  </div>
                  <Button
                    onClick={startGame}
                    className="bg-casino-accent hover:bg-casino-accent/90 text-white px-8 h-10 mt-6"
                  >
                    Deal
                  </Button>
                </div>
              </div>
            )}

            {gameState !== "betting" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold">Dealer's Hand</h2>
                    {gameState !== "complete" && <span className="text-sm">({calculateHand(dealerHand)})</span>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {dealerHand.map((card, index) => (
                      <div key={index} className="animate-in fade-in slide-in-from-top-4 duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                        {renderCard(card)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold">Your Hand</h2>
                    <span className="text-sm">({calculateHand(playerHand)})</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {playerHand.map((card, index) => (
                      <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                        {renderCard(card)}
                      </div>
                    ))}
                  </div>
                </div>

                {gameState === "playing" && (
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={hit}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Hit
                    </Button>
                    <Button
                      onClick={stand}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Stand
                    </Button>
                  </div>
                )}

                {gameState === "complete" && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      {gameResult === "win" && <Check className="text-green-400" />}
                      {gameResult === "lose" && <X className="text-red-400" />}
                      {gameResult === "push" && "Push - Bet Returned"}
                    </div>
                    <Button
                      onClick={resetGame}
                      className="bg-casino-accent hover:bg-casino-accent/90"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Play Again
                    </Button>
                  </div>
                )}
              </div>
            )}

            {lastResults.length > 0 && (
              <div className="mt-6 p-4 bg-black/30 rounded-lg">
                <h3 className="text-sm font-semibold mb-2">Last Results</h3>
                <div className="space-y-2">
                  {lastResults.map((result, index) => (
                    <div key={index} className={`text-sm ${
                      result.result === "win" ? 'text-green-400' : 
                      result.result === "push" ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {result.result === "win" ? `Won $${result.amount}` : 
                       result.result === "push" ? "Push - Bet returned" :
                       "Loss"}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 text-sm text-center text-gray-400">
              Dealer must stand on 17 and draw to 16. Blackjack pays 2 to 1.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackjackGame;
