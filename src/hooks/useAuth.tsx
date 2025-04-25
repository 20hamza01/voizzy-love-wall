
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "@/components/ui/sonner";

// Dummy implementation - will be replaced with Supabase
const mockUsers = [
  {
    id: "1",
    email: "test@example.com",
    password: "password123",
    created_at: new Date().toISOString(),
    plan_type: "free" as const,
  }
];

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userName: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem("voizzy_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
    setLoading(false);
  }, []);

  // Mock sign in functionality (replace with Supabase)
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = foundUser;
      const userData = userWithoutPassword as User;
      
      setUser(userData);
      localStorage.setItem("voizzy_user", JSON.stringify(userData));
      toast.success("Signed in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock sign up functionality (replace with Supabase)
  const signUp = async (email: string, password: string, company_name: string) => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error("User already exists with this email");
      }
      
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        password,
        company_name,
        created_at: new Date().toISOString(),
        plan_type: "free" as const
      };
      
      mockUsers.push(newUser);
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = newUser;
      const userData = userWithoutPassword as User;
      
      setUser(userData);
      localStorage.setItem("voizzy_user", JSON.stringify(userData));
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("voizzy_user");
    toast.info("Signed out");
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
