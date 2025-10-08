// src/router/PrivateRoute.jsx

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../featured/auth/AuthContext";

// PrivateRoute to check if a user is logged in AND has active Subscription/Trial
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  // 1. Not Authenticated: Redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = user.canAccessServices;

  if (!hasAccess) {
    console.log("❌ [Guard] Access Denied: Redirecting to Pricing.");
    return <Navigate to="/" replace state={{ from: "/user-dashboard" }} />;
  }

  // 3. Logged in and has Access (Admin OR Active Paid/Trial): Grant Access
  return children;
};

// PrivateAdminRoute to check for admin role (No change needed)
const PrivateAdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  const isAdmin = user && user.role && user.role.toUpperCase() === "ADMIN";

  return isAdmin ? children : <Navigate to="/" replace />;
};

export { PrivateRoute, PrivateAdminRoute };
