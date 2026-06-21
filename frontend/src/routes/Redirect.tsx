import { Navigate } from "react-router";
import { Roles, userUser } from "../context/UserContext";

export default function DashboardRedirect() {
  const { role } = userUser();

  if (!role) return <Navigate to="/signin" />;

  const roleBasedPath: Record<Roles, string> = {
    1: "/super-admin/dashboard",
    2: "/admin/dashboard",
    3: "reciever/dashboard",
  };

  const dashboardPath = roleBasedPath[role];

  if (!dashboardPath) return <Navigate to="unauthorize" />;

  return <Navigate to={dashboardPath} />;
}
