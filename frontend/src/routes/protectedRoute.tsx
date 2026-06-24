import React from "react";
import { userUser } from "../context/UserContext";
import { Navigate } from "react-router";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = userUser();

  if (!user.role) {
    return <Navigate to="/signin" />;
  }

  return children;
}
