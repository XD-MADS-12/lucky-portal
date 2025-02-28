
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Index from "@/pages/Index";
import AdminPanel from "@/pages/AdminPanel";
import NotFound from "@/pages/NotFound";
import DemoGame from "@/pages/DemoGame";
import SlotsGame from "@/pages/SlotsGame";
import LiveGames from "@/pages/LiveGames";
import BlackjackGame from "@/pages/BlackjackGame";
import AdminRoute from "@/components/AdminRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-black to-casino-secondary pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/demo-game" element={<DemoGame />} />
            <Route path="/slots" element={<SlotsGame />} />
            <Route path="/live-games" element={<LiveGames />} />
            <Route path="/blackjack" element={<BlackjackGame />} />
            
            {/* Admin Routes - Protected by AdminRoute */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPanel />} />
              {/* Add any other admin routes here */}
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </Router>
  );
}

export default App;
