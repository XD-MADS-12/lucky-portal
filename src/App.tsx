
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import DemoGame from '@/pages/DemoGame';
import BlackjackGame from '@/pages/BlackjackGame';
import SlotsGame from '@/pages/SlotsGame';
import LiveGames from '@/pages/LiveGames';
import AdminPanel from '@/pages/AdminPanel';
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/demo-game" element={<DemoGame />} />
          <Route path="/blackjack" element={<BlackjackGame />} />
          <Route path="/slots" element={<SlotsGame />} />
          <Route path="/live-games" element={<LiveGames />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
