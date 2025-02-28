
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AdminRoute = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // First check the context isAdmin value
        if (isAdmin) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Double-check admin status from the database directly
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        
        if (error) {
          console.error("Error checking admin status:", error);
          setHasAccess(false);
          toast.error("You don't have permission to access this page");
        } else if (data) {
          console.log("Admin access confirmed from database");
          setHasAccess(true);
        } else {
          console.error("Not an admin, redirecting");
          setHasAccess(false);
          toast.error("You don't have permission to access this page");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setHasAccess(false);
        toast.error("An error occurred while checking your permissions");
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, isAdmin]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-accent mx-auto"></div>
          <p className="mt-4 text-casino-muted">Checking access...</p>
        </div>
      </div>
    );
  }

  // If no user or not admin, redirect to dashboard instead of login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;
