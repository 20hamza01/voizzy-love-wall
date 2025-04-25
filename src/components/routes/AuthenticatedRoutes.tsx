
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/layout/AppLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const AuthenticatedRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.log(`📍 AuthenticatedRoutes - Path: ${location.pathname} - loading: ${loading}, user: ${user ? "exists" : "null"}`);

  // Show loading indicator while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
        <p className="ml-2 text-gray-500">Loading your account...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log(`🔒 AuthenticatedRoutes - Redirecting to login from ${location.pathname}`);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // User is authenticated, render the protected layout and routes
  console.log(`✅ AuthenticatedRoutes - User ${user.id} authenticated, rendering ${location.pathname}`);
  return (
    <AppLayout user={user} loading={false}>
      <Outlet />
    </AppLayout>
  );
};
