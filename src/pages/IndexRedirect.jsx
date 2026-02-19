import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/Authprovider";

export default function IndexRedirect() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#64748B", fontWeight: 700 }}>
        Loading...
      </div>
    );
  }

  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}
