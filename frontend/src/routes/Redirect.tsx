import { Navigate } from "react-router";
import { Roles, userUser } from "../context/UserContext";

function createRolePath(paths: {
  superAdmin?: string;
  admin?: string;
  receiver?: string;
}): Partial<Record<Roles, string>> {
  return {
    ...(paths.superAdmin && { 1: `/super-admin/${paths.superAdmin}` }),
    ...(paths.admin && { 2: `/admin/${paths.admin}` }),
    ...(paths.receiver && { 3: `/receiver/${paths.receiver}` }),
  };
}

export function DashboardRedirect() {
  const { role } = userUser();

  if (!role) return <Navigate to="/signin" />;

  const dashboardPath = createRolePath({
    superAdmin: "dashboard",
    admin: "dashboard",
    receiver: "dashboard",
  })[role];

  if (!dashboardPath) return <Navigate to="unauthorize" />;

  return <Navigate to={dashboardPath} />;
}

export function UploadRedirect() {
  const { role } = userUser();

  if (!role) return <Navigate to="/signin" />;

  console.log("user role:", role);

  if ([1, 2].includes(role)) return <Navigate to="/upload-direct" />;

  return <Navigate to="/incoming-upload" />;
}
