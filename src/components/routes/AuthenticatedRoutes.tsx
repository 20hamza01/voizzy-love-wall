
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/layout/AppLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const AuthenticatedRoutes = () => {
  const { user, loading } = useAuth();
  
  console.log("AuthenticatedRoutes - loading:", loading, "user:", user ? "exists" : "null");

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
    console.log("AuthenticatedRoutes - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected layout and routes
  return (
    <AppLayout user={user} loading={false}>
      <Outlet />
    </AppLayout>
  );
};
