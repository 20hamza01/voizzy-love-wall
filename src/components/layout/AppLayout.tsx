
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useNavigate, Outlet } from "react-router-dom";
import { User } from "@/types";

interface AppLayoutProps {
  user: User | null;
  loading: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ user, loading }) => {
  const navigate = useNavigate();

  // Redirect to login if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-voizzy-blue">Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
