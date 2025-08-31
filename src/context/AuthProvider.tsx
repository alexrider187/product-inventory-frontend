import { type ReactNode, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { User, RegisterData, LoginCredentials } from "../types/auth";
import axiosClient from "../api/axiosClient";

interface Props {
  children: ReactNode;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Login function returns a typed User
  const login = async (credentials: LoginCredentials): Promise<User> => {
    const { data } = await axiosClient.post<User>("/auth/login", credentials);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  // Register function returns a typed User
  const register = async (payload: RegisterData): Promise<User> => {
    const { data } = await axiosClient.post<User>("/auth/register", payload);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  // Logout just clears the user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
