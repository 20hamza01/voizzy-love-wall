
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Testimonials from "./pages/Testimonials";
import Settings from "./pages/Settings";
import CollectTestimonial from "./pages/CollectTestimonial";
import ThankYou from "./pages/ThankYou";
import EmbedWidget from "./pages/EmbedWidget";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const AuthenticatedRoutes = () => {
  const { user, loading } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<AppLayout user={user} loading={loading} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/collect/:userId" element={<CollectTestimonial />} />
            <Route path="/collect/:userId/thank-you" element={<ThankYou />} />
            <Route path="/embed/:userId" element={<EmbedWidget />} />
            <Route path="/*" element={<AuthenticatedRoutes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
