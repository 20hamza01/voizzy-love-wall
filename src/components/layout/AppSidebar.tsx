
import { Home, BarChart, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar() {
  const { signOut } = useAuth();
  
  return (
    <Sidebar>
      <SidebarHeader className="h-14 flex items-center px-4">
        <div className="flex items-center">
          <span className="text-xl font-bold text-white">Voizzy</span>
        </div>
        <SidebarTrigger className="ml-auto h-8 w-8 text-white hover:bg-sidebar-accent" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) =>
                      cn("flex items-center gap-3", isActive && "bg-sidebar-accent")}
                  >
                    <Home size={18} />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/testimonials" 
                    className={({ isActive }) =>
                      cn("flex items-center gap-3", isActive && "bg-sidebar-accent")}
                  >
                    <BarChart size={18} />
                    <span>Testimonials</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/settings" 
                    className={({ isActive }) =>
                      cn("flex items-center gap-3", isActive && "bg-sidebar-accent")}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex items-center gap-3"
              onClick={signOut}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
