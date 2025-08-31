// src/components/ui/ProtectedRoute.tsx
import {  type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  children: ReactNode;
  requiredRole?: "admin" | "user"; // Optional role restriction
}

/**
 * ProtectedRoute
 * - Redirects to login if not authenticated
 * - Redirects to "/" if user role does not match requiredRole
 * - Otherwise renders children
 */
export const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Logged in but wrong role → redirect to root (could be /dashboard or /products)
    return <Navigate to="/" replace />;
  }

  // Authenticated and has required role (if any)
  return <>{children}</>;
};
