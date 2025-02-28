
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import UserManagement from '@/components/admin/UserManagement';
import TransactionManagement from '@/components/admin/TransactionManagement';
import PaymentSettings from '@/components/admin/PaymentSettings';
import { ShieldCheck } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Check if user has admin role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
          navigate('/');
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive"
          });
        } else if (data) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate('/');
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-casino-background flex items-center justify-center">
        <div className="bg-casino-secondary/30 p-8 rounded-xl backdrop-blur-md border border-casino-muted/20 text-white">
          <p className="text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will navigate away in useEffect
  }

  return (
    <div className="min-h-screen bg-casino-background text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8 gap-3">
          <ShieldCheck className="h-10 w-10 text-casino-accent" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-casino-secondary/30 border border-casino-muted/20">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="transactions">Transaction Management</TabsTrigger>
            <TabsTrigger value="payment-settings">Payment Settings</TabsTrigger>
          </TabsList>
          
          <div className="bg-casino-secondary/30 p-6 rounded-xl backdrop-blur-md border border-casino-muted/20">
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="transactions">
              <TransactionManagement />
            </TabsContent>
            
            <TabsContent value="payment-settings">
              <PaymentSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
