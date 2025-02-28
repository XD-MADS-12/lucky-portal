
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
        // Double-check admin status from the database directly
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        
        if (error || !data) {
          console.error("Not an admin, redirecting", error);
          setHasAccess(false);
        } else {
          setHasAccess(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

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

  // If no user or not admin, redirect to login
  if (!user || !hasAccess) {
    return <Navigate to="/login" replace />;
  }

  // If user is admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;
