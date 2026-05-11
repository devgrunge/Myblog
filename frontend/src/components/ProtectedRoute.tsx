import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../stores/adminAuthStore";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
