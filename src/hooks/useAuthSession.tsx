
import { useState, useEffect } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface AuthSessionState {
  user: User | null;
  loading: boolean;
}

export function useAuthSession(): AuthSessionState {
  console.log('🔄 Initializing useAuthSession hook');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    console.log("🎭 Auth session initialized, setting up listeners");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔄 Auth state changed:", event);
        
        if (!mounted) {
          console.log("⏹️ Component unmounted, skipping update");
          return;
        }
        
        if (session?.user) {
          console.log("👤 Session exists, fetching user profile");
          // Use setTimeout to avoid potential race conditions with Supabase
          setTimeout(() => {
            if (!mounted) {
              console.log("⏹️ Component unmounted during timeout, skipping profile fetch");
              return;
            }
            
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
              .then(({ data: profile, error }) => {
                if (!mounted) {
                  console.log("⏹️ Component unmounted during profile fetch, skipping update");
                  return;
                }
                
                if (profile) {
                  console.log("✅ Profile fetched successfully");
                  const planType = profile.plan_type as 'free' | 'basic' | 'premium';
                  
                  setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    created_at: session.user.created_at,
                    plan_type: planType,
                    company_name: profile.company_name,
                    logo_url: profile.logo_url,
                    theme_color: profile.theme_color,
                    hide_branding: profile.hide_branding,
                  });
                } else if (error) {
                  console.error("❌ Error fetching profile:", error);
                  toast.error("Error loading user profile");
                }
                
                setLoading(false);
              });
          }, 0);
        } else {
          console.log("👻 No active session, clearing user state");
          setUser(null);
          setLoading(false);
        }
        
        setAuthInitialized(true);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("🔍 Initial session check:", session ? "Session exists" : "No session");
      
      if (!mounted) {
        console.log("⏹️ Component unmounted, skipping session check");
        return;
      }
      
      if (session?.user) {
        console.log("👤 Found existing session, fetching profile");
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (!mounted) {
              console.log("⏹️ Component unmounted during profile fetch, skipping update");
              return;
            }
            
            if (profile) {
              console.log("✅ Initial profile loaded successfully");
              const planType = profile.plan_type as 'free' | 'basic' | 'premium';
              
              setUser({
                id: session.user.id,
                email: session.user.email!,
                created_at: session.user.created_at,
                plan_type: planType,
                company_name: profile.company_name,
                logo_url: profile.logo_url,
                theme_color: profile.theme_color,
                hide_branding: profile.hide_branding,
              });
            } else if (error) {
              console.error("❌ Error fetching initial profile:", error);
            }
            
            setLoading(false);
            setAuthInitialized(true);
          });
      } else {
        console.log("👻 No existing session found");
        setLoading(false);
        setAuthInitialized(true);
      }
    });

    return () => {
      console.log("🧹 Cleaning up auth listeners");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        console.warn("⚠️ Auth timeout triggered - forcing loading to false");
        setLoading(false);
        setAuthInitialized(true);
      }
    }, 5000); // 5 second safety timeout
    
    return () => {
      console.log("🧹 Cleaning up timeout");
      clearTimeout(timeoutId);
    }
  }, [loading, authInitialized]);

  console.log("🔄 useAuthSession state update:", { 
    hasUser: !!user, 
    loading, 
    initialized: authInitialized 
  });
  
  return { user, loading };
}
