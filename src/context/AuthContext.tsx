// src/context/AuthContext.tsx
import { createContext, useContext } from "react";
import type { User, RegisterData, LoginCredentials } from "../types/auth";

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (payload: RegisterData) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context with undefined initial value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for easy access
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
