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
import ValudationQueue from "../pages/document/UploadQueue";
import InvalidDocumentsPage from "../pages/document/InvalidDocumentsPage";
import IncomingDocumentUploadPage from "../pages/document/IncomingDocumentUploadPage";
import UploadedIncomingDoc from "../pages/document/UploadedIncomingDocPage";
import UploadedIncomingDocPage from "../pages/document/UploadedIncomingDocPage";
import InvalidDocumentPage from "../pages/document/InvalidDocumentPage";
import UserManagementTable from "../components/tables/Administration/UserManagementTable";
import UserManagementPage from "../pages/Administration/UserManagementPage";
import AccessControlPage from "../pages/Administration/AcessControlPage";
import SystemLogsPage from "../pages/Logs/SystemLogsPage";
import ReceiverDashboard from "../pages/Dashboard/ReceiverDashboard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import StaleDocumentsPage from "../pages/Dashboard/StaleDocumentsPage";
import SuperAdminDashboard from "../pages/Dashboard/SuperAdminDashboard";
import PublicTrackingPage from "../pages/Public/PublicTrackingPage";

import AssignedDocumentPage from "../pages/Division/AssignedDocumentPage";

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
    path: "/upload-queue",
    element: (
      <RoleRoute allowedRoles={[1, 2]}>
        <ValudationQueue />
      </RoleRoute>
    ),
  },

  {
    path: "/upload-invalid",
    element: (
      <RoleRoute allowedRoles={[1, 2]}>
        <InvalidDocumentsPage />
      </RoleRoute>
    ),
  },
];

const SUPER_ADMIN_ROUTES: RouteType[] = [
  {
    path: "/super-admin/dashboard",
    element: (
      <RoleRoute allowedRoles={[1]}>
        <SuperAdminDashboard />
      </RoleRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <RoleRoute allowedRoles={[1]}>
        <UserManagementPage />
      </RoleRoute>
    ),
  },
  {
    path: "/access",
    element: (
      <RoleRoute allowedRoles={[1]}>
        <AccessControlPage />
      </RoleRoute>
    ),
  },
  {
    path: "/activities",
    element: (
      <RoleRoute allowedRoles={[1]}>
        <SystemLogsPage />
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
    element: (
      <RoleRoute allowedRoles={[2]}>
        <AdminDashboard />
      </RoleRoute>
    ),
  },
  {
    path: "/admin/stale-documents",
    element: (
      <RoleRoute allowedRoles={[2]}>
        <StaleDocumentsPage />
      </RoleRoute>
    ),
  },
];

const RECEIVING_OFFICER_ROUTES: RouteType[] = [
  {
    path: "/receiving-officer/dashboard",
    element: <ReceiverDashboard />,
  },
  {
    path: "/incoming-upload",
    element: <IncomingDocumentUploadPage />,
  },
  {
    path: "/uploads",
    element: <UploadedIncomingDocPage />,
  },
  {
    path: "/rejected-documents",
    element: <InvalidDocumentPage />,
  },
];

const DIVISION_ROUTE: RouteType[] = [
  {
    path: "/division/assigned-documents",
    element: <AssignedDocumentPage />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },

  {
    path: "/document/track",
    element: <PublicTrackingPage />,
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
      ...RECEIVING_OFFICER_ROUTES,
      ...DIVISION_ROUTE,
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
