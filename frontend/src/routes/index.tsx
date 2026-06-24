import { createBrowserRouter } from "react-router";
import SignIn from "../pages/AuthPages/SignIn";
import NotFound from "../pages/OtherPage/NotFound";
import ProtectedRoute from "./protectedRoute";
import Home from "../pages/Dashboard/Home";

import RoleRoute from "./RoleRoutes";
import NotificationPage from "../pages/notification/NotificationPage";
import IncomingDocPage from "../pages/document/IncomingDocPage";
import DocumentUploadPage from "../pages/document/DocumentUploadPage";
import AppLayout from "../layout/AppLayout";
import { DashboardRedirect, UploadRedirect } from "./Redirect";
import Unauthorized from "../pages/OtherPage/Unauthorized";
import OutgoingDocPage from "../pages/document/OutgoingDocPage";
import ValudationQueue from "../pages/document/ValidationQueue";
import IncomingDocumentUploadPage from "../pages/document/IncomingDocumentUploadPage";
import UploadedIncomingDoc from "../pages/document/UploadedIncomingDocPage";
import UploadedIncomingDocPage from "../pages/document/UploadedIncomingDocPage";

type RouteType = {
  path: string;
  element: React.JSX.Element;
};

const GLOBAL_ROUTES: RouteType[] = [
  {
    path: "/notification",
    element: <NotificationPage />,
  },
  {
    path: "/upload",
    element: <UploadRedirect />,
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
        <OutgoingDocPage />
      </RoleRoute>
    ),
  },

  // Upload Routes
  {
    path: "/upload-direct",
    element: (
      <RoleRoute allowedRoles={[1, 2]}>
        <DocumentUploadPage />
      </RoleRoute>
    ),
  },

  {
    path: "/validation-queue",
    element: (
      <RoleRoute allowedRoles={[1, 2]}>
        <ValudationQueue />
      </RoleRoute>
    ),
  },
];

const SUPER_ADMIN_ROUTES: RouteType[] = [
  {
    path: "/super-admin/dashboard",
    element: (
      <RoleRoute allowedRoles={[1]}>
        <>Super Admin Dashboard Overview</>
      </RoleRoute>
    ),
  },
  {
    path: "/user-management",
    element: (
      <RoleRoute allowedRoles={[1]}>
        <>Manage Users & Roles</>
      </RoleRoute>
    ),
  },
  {
    path: "/access",
    element: (
      <RoleRoute allowedRoles={[1]}>
        <>Access Control & Permissions</>
      </RoleRoute>
    ),
  },
  {
    path: "/activities",
    element: (
      <RoleRoute allowedRoles={[1]}>
        <>Audit Trail & Logs</>
      </RoleRoute>
    ),
  },
  {
    path: "/setting",
    element: (
      <RoleRoute allowedRoles={[1]}>
        <>System Configuration</>
      </RoleRoute>
    ),
  },
];

const ADMIN_ROUTES: RouteType[] = [
  {
    path: "/admin/dashboard",
    element: <>this is the admin dashboard</>,
  },
];

const RECEIVER_ROUTES: RouteType[] = [
  {
    path: "/receiver/dashboard",
    element: <>Receiver Dashboard</>,
  },
  {
    path: "/incoming-upload",
    element: <IncomingDocumentUploadPage />,
  },
  {
    path: "/uploads",
    element: <UploadedIncomingDocPage />,
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
