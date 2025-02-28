
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Lock } from 'lucide-react';

// Dummy data for live casino games
const liveGames = [
  {
    id: 'roulette',
    title: 'Live Roulette',
    description: 'Play with real dealers in real-time',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    status: 'available',
    minBet: 5,
    players: 42
  },
  {
    id: 'blackjack',
    title: 'Live Blackjack',
    description: 'Join our tables with professional dealers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
    status: 'available',
    minBet: 10,
    players: 28
  },
  {
    id: 'baccarat',
    title: 'Live Baccarat',
    description: 'Experience the classic card game live',
    thumbnailUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    status: 'available',
    minBet: 5,
    players: 18
  },
  {
    id: 'poker',
    title: 'Live Poker',
    description: 'Texas Hold\'em with live dealers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
    status: 'available',
    minBet: 20,
    players: 12
  },
  {
    id: 'sic-bo',
    title: 'Sic Bo',
    description: 'Ancient dice game with modern twist',
    thumbnailUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    status: 'maintenance',
    minBet: 5,
    players: 0
  },
  {
    id: 'dragon-tiger',
    title: 'Dragon Tiger',
    description: 'Fast-paced card game with live dealers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    status: 'coming-soon',
    minBet: 10,
    players: 0
  },
];

const LiveGames = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleGameClick = (gameId: string) => {
    const game = liveGames.find(g => g.id === gameId);
    
    if (game?.status === 'available') {
      setSelectedGame(gameId);
      // In a real implementation, you would redirect to the game
      // For now, we'll just simulate it with a state change
    }
  };

  return (
    <div className="min-h-screen bg-casino-background text-white pt-20 px-4 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-casino-muted/20"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold">Live Casino Games</h1>
        </div>
        
        {selectedGame ? (
          <div className="bg-casino-secondary/30 rounded-xl backdrop-blur-md border border-casino-muted/20 p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Connecting to {liveGames.find(g => g.id === selectedGame)?.title}
            </h2>
            <div className="relative aspect-video bg-black rounded-lg mb-6 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-casino-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lg">Loading live stream...</p>
                </div>
              </div>
              <img 
                src={`https://images.unsplash.com/${liveGames.find(g => g.id === selectedGame)?.thumbnailUrl}`}
                alt="Game background"
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            <Button
              className="bg-casino-primary hover:bg-casino-primary/80"
              onClick={() => setSelectedGame(null)}
            >
              Back to Lobby
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveGames.map((game) => (
              <Card 
                key={game.id}
                className={`overflow-hidden bg-casino-secondary/30 border-casino-muted/20 hover:border-casino-accent/50 transition-all ${
                  game.status !== 'available' ? 'opacity-70' : 'cursor-pointer'
                }`}
                onClick={() => handleGameClick(game.id)}
              >
                <div className="relative aspect-video">
                  <img 
                    src={`https://images.unsplash.com/${game.thumbnailUrl}`}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  {game.status === 'maintenance' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <div className="text-center">
                        <Lock className="h-10 w-10 mx-auto mb-2 text-yellow-400" />
                        <p className="text-lg font-medium">Under Maintenance</p>
                      </div>
                    </div>
                  )}
                  {game.status === 'coming-soon' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <div className="text-center px-4">
                        <p className="text-lg font-medium text-casino-accent">Coming Soon</p>
                      </div>
                    </div>
                  )}
                  {game.status === 'available' && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      LIVE
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm">
                    <span>Min Bet: ${game.minBet}</span>
                    {game.players > 0 && <span>{game.players} players online</span>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    disabled={game.status !== 'available'}
                    className={`w-full ${
                      game.status === 'available' 
                        ? 'bg-casino-primary hover:bg-casino-primary/80' 
                        : 'bg-gray-600'
                    }`}
                  >
                    {game.status === 'available' ? (
                      <>
                        Join Table
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </>
                    ) : game.status === 'coming-soon' ? 'Coming Soon' : 'Unavailable'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveGames;
