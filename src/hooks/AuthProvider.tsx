
import React, { createContext } from "react";
import { User } from "@/types";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSession } from "./useAuthSession";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, company_name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🔄 AuthProvider initialized');
  const { user, loading } = useAuthSession();

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Attempting to sign in user:', email);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in failed:', error.message);
        throw error;
      }
      console.log('✅ User signed in successfully');
      toast.success("Signed in successfully!");
    } catch (error: any) {
      console.error('💥 Sign in error:', error.message);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, company_name: string) => {
    console.log('📝 Attempting to create new account for:', email);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name,
          },
        },
      });
      
      if (error) {
        console.error('❌ Sign up failed:', error.message);
        throw error;
      }
      console.log('✅ Account created successfully');
      toast.success("Account created successfully! Please check your email to verify your account.");
    } catch (error: any) {
      console.error('💥 Sign up error:', error.message);
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  const signOut = async () => {
    console.log('🚪 Attempting to sign out user');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out failed:', error.message);
        throw error;
      }
      console.log('✅ User signed out successfully');
      toast.info("Signed out");
    } catch (error: any) {
      console.error('💥 Sign out error:', error.message);
      toast.error(error.message || "Failed to sign out");
    }
  };

  console.log('👤 Current auth state:', { user: user ? 'Logged in' : 'Not logged in', loading });
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
