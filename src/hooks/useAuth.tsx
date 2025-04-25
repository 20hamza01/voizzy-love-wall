
import { useContext } from "react";
import { AuthContext, AuthProvider, AuthContextType } from "./AuthProvider";

export { AuthProvider };
export type { AuthContextType };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
