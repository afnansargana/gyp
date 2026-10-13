import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

/**
 * Strict RBAC gate. Example: <RoleRoute roles={['admin']}>...</RoleRoute>
 */
export function RoleRoute({ roles = [], children }) {
  const location = useLocation();
  const { isAuthenticated, role, homePathForRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!roles.includes(role)) {
    return <Navigate to={homePathForRole()} replace />;
  }

  return children;
}

export default RoleRoute;
