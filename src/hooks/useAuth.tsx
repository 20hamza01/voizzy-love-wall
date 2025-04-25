
import { useContext } from "react";
import { AuthContext, AuthProvider, AuthContextType } from "./AuthProvider";

export { AuthProvider };
export type { AuthContextType };

export const useAuth = () => {
  console.log('🎯 useAuth hook called');
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('❌ useAuth must be used within an AuthProvider');
    throw new Error("useAuth must be used within an AuthProvider");
  }
  console.log('✅ useAuth hook returned context successfully');
  return context;
};
