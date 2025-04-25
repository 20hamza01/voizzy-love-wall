import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, company_name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    console.log("Auth provider initialized, setting up listeners");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        
        if (!mounted) return;
        
        if (session?.user) {
          // Use setTimeout to avoid potential race conditions with Supabase
          setTimeout(() => {
            if (!mounted) return;
            
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
              .then(({ data: profile, error }) => {
                if (!mounted) return;
                
                if (profile) {
                  console.log("Profile fetched successfully");
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
                  console.error("Error fetching profile:", error);
                  toast.error("Error loading user profile");
                }
                
                setLoading(false);
              });
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
        
        // Mark auth as initialized regardless of result
        setAuthInitialized(true);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session exists" : "No session");
      
      if (!mounted) return;
      
      if (session?.user) {
        // Fetch user profile data
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (!mounted) return;
            
            if (profile) {
              console.log("Initial profile loaded");
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
              console.error("Error fetching initial profile:", error);
            }
            
            setLoading(false);
            setAuthInitialized(true);
          });
      } else {
        setLoading(false);
        setAuthInitialized(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        console.log("Auth timeout triggered - forcing loading to false");
        setLoading(false);
        setAuthInitialized(true);
      }
    }, 5000); // 5 second safety timeout
    
    return () => clearTimeout(timeoutId);
  }, [loading, authInitialized]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      toast.success("Signed in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      // Don't set loading false here as the auth state change will handle it
    }
  };

  const signUp = async (email: string, password: string, company_name: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name,
          },
        },
      });
      
      if (error) throw error;
      toast.success("Account created successfully! Please check your email to verify your account.");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.info("Signed out");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
