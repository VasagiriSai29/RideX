import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Authprovider";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  // ✅ wait ONLY for auth init
  if (authLoading) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#64748B", fontWeight: 700 }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
