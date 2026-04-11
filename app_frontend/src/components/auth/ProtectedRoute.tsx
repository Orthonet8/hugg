import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../context/useAuthStore";

/**
 * Redirects to /login if user is not authenticated.
 * Renders child routes via <Outlet /> when authenticated.
 */
export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s: { isAuthenticated: boolean }) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
