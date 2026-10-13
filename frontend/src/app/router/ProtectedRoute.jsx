import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

/**
 * Requires any authenticated (logged-in) user.
 * Staff (admin/mechanic) are redirected to their dashboards for customer-only surfaces.
 */
export function ProtectedRoute({ children, allowStaff = false }) {
  const location = useLocation();
  const { isAuthenticated, role, homePathForRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowStaff && (role === "admin" || role === "mechanic")) {
    return <Navigate to={homePathForRole()} replace />;
  }

  return children;
}

export default ProtectedRoute;
