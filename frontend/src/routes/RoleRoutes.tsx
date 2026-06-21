import React from "react";
import { Roles, userUser } from "../context/UserContext";
import { Navigate } from "react-router";

interface Props {
  children: React.ReactNode;
  allowedRoles: Roles[];
}

export default function RoleRoute({ children, allowedRoles }: Props) {
  const { role } = userUser();

  if (!role) {
    return <Navigate to="/signin" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
