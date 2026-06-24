import { Roles } from "../context/UserContext";
import {
  GridIcon,
  Notification,
  Upload,
  PieChartIcon,
  BoxCubeIcon,
  PlugInIcon,
  UserManagementIcon,
  AccessControlIcon,
  Document,
  SystemLogsIcon,
  SettingIcon,
  AdministrationIcon,
} from "../icons";

export interface NavItem {
  name: string;
  icon: React.ReactNode;
  path?: string;

  roles: Roles[];

  subItems?: (Omit<NavItem, "subItems" | "icon"> & { path: string })[];
}

// Super Admin
// Navigation Item	Sub-items
// Dashboard	–
// Documents	in, out, validation (queue) DONE
// User Management	– DONE
// Access Control	–DONE
// Notification	-DONE
// System Logs	–DONE
// Setting	–DONE

// Admin
// Navigation Item	Sub-items
// Dashboard	–
// Upload Queue	–
// Documents	in, out
// Notification	–

// Receiver
// Navigation Item	Sub-items
// Dashboard	–
// Document	upload, uploads
// Notification	–

const SUPER_ADMIN_ROUTES: NavItem[] = [
  {
    name: "System Logs",
    path: "/activities",
    icon: <SystemLogsIcon />, // consistent size/color
    roles: [1],
  },
  {
    name: "Setting",
    path: "/Seting",
    icon: <SettingIcon />, // consistent size/color
    roles: [1],
  },
];

export const NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    icon: <GridIcon />,
    path: "/",
    roles: [1, 2, 3],
  },

  {
    name: "Document",
    icon: <Document />,
    roles: [1, 2, 3],
    subItems: [
      {
        name: "Validation",
        path: "/validation-queue",
        roles: [1, 2],
      },
      {
        name: "Upload",
        path: "/upload-direct",
        roles: [1, 2],
      },

      {
        name: "Upload",
        path: "/upload",
        roles: [3],
      },

      // super admin, admin
      {
        name: "Incoming",
        path: "/incoming",
        roles: [1, 2],
      },
      {
        name: "Outgoing",
        path: "/outgoing",
        roles: [1, 2],
      },

      // receiver

      {
        name: "Uploads",
        path: "/uploads",
        roles: [3],
      },
    ],
  },

  {
    name: "Notification",
    icon: <Notification />,
    path: "/notification",
    roles: [1, 2, 3],
  },
];

export const OTHERS_NAV_ITEMS: NavItem[] = [
  {
    name: "Administration",
    icon: <AdministrationIcon />,
    roles: [1],
    subItems: [
      {
        name: "User Management",
        path: "/validate",
        roles: [1],
      },
      {
        name: "Access Control",
        path: "/access",
        roles: [1],
      },
    ],
  },
  ...SUPER_ADMIN_ROUTES,
];
