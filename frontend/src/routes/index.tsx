import { createBrowserRouter } from "react-router";
import SignIn from "../pages/AuthPages/SignIn";
import NotFound from "../pages/OtherPage/NotFound";
import ProtectedRoute from "./protectedRoute";
import Home from "../pages/Dashboard/Home";

import RoleRoute from "./RoleRoutes";
import IncomingDocPage from "../pages/document/IncomingDocPage";
import DocumentUploadPage from "../pages/document/DocumentUploadPage";
import AppLayout from "../layout/AppLayout";
import DashboardRedirect from "./Redirect";
import Unauthorized from "../pages/OtherPage/Unauthorized";

type RouteType = {
  path: string;
  element: React.JSX.Element;
};

const GLOBAL_ROUTES: RouteType[] = [
  {
    path: "/notification",
    element: <>Notification Settings</>,
  },
];

const ADMINISTRATION_ROUTES: RouteType[] = [
  {
    path: "/incoming",
    element: (
      <RoleRoute allowedRoles={[1, 2]}>
        <IncomingDocPage />
      </RoleRoute>
    ),
  },

  {
    path: "/outgoing",
    element: (
      <RoleRoute allowedRoles={[1, 2]}>
        <IncomingDocPage />
      </RoleRoute>
    ),
  },

  // Upload Routes
  {
    path: "/incoming-upload-direct",
    element: (
      <RoleRoute allowedRoles={[1, 2]}>
        <>Upload Outgoing Documents</>{" "}
      </RoleRoute>
    ),
  },
  {
    path: "/outgoing-upload",
    element: (
      <RoleRoute allowedRoles={[1, 2]}>
        <>Direct Upload to Incoming</>
      </RoleRoute>
    ),
  },
];

const SUPER_ADMIN_ROUTES: RouteType[] = [
  {
    path: "/super-admin/dashboard",
    element: <>Super Admin Dashboard Overview</>,
  },
  {
    path: "/user-management",
    element: <>Manage Users & Roles</>,
  },
  {
    path: "/access",
    element: <>Access Control & Permissions</>,
  },

  {
    path: "/activities",
    element: <>Audit Trail & Logs</>,
  },
  {
    path: "setting",
    element: <>System Configuration</>,
  },
];

const ADMIN_ROUTES: RouteType[] = [
  {
    path: "/admin/dashboard",
    element: <>this is the admin dashboard</>,
  },
  {
    path: "/validation-queue",
    element: <>this is the admin dashboard</>,
  },
];

const RECEIVER_ROUTES: RouteType[] = [
  {
    path: "upload",
    element: <>System Configuration</>,
  },
  {
    path: "uploads",
    element: <>System Configuration</>,
  },
];

export const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },

  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      ...GLOBAL_ROUTES,
      ...ADMINISTRATION_ROUTES,
      ...SUPER_ADMIN_ROUTES,
      ...ADMIN_ROUTES,
      ...RECEIVER_ROUTES,
      {
        path: "/",
        element: <DashboardRedirect />,
      },
    ],
  },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
