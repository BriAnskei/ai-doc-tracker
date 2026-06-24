import React, { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  NotificationItem,
  NotificationType,
  typeLabel,
} from "../../components/notifications/NotificationItem";
import { userUser } from "../../context/UserContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: number;
  userName: string;
  role: "super-admin" | "admin" | "receiver";
  description: string;
  time: string;
  date: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
}

// ─── Role-based visibility ────────────────────────────────────────────────────

// role 1 = super_admin, role 2 = admin, role 3 = receiver
const ALLOWED_TYPES_BY_ROLE: Record<number, NotificationType[]> = {
  1: [
    "INCOMING_DOC_UPLOAD",
    "OUTGOING_DOC_UPLOAD",
    "DOCUMENT_VALIDATION",
    "STATUS_CHANGED",
    "DOCUMENT_UPDATE",
  ],
  2: [
    "INCOMING_DOC_UPLOAD",
    "OUTGOING_DOC_UPLOAD",
    "DOCUMENT_VALIDATION",
    "STATUS_CHANGED",
    "DOCUMENT_UPDATE",
  ],
  3: ["DOCUMENT_APPROVED", "DOCUMENT_REJECTED"],
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allNotifications: Notification[] = [
  {
    id: 1,
    userName: "Terry Franci",
    role: "super-admin",
    description: "uploaded a new incoming document.",
    time: "5 min ago",
    date: "2024-02-01",
    type: "INCOMING_DOC_UPLOAD",
    link: "/incoming",
    isRead: false,
  },
  {
    id: 2,
    userName: "Alena Franci",
    role: "admin",
    description: "uploaded a new outgoing document.",
    time: "12 min ago",
    date: "2024-02-01",
    type: "OUTGOING_DOC_UPLOAD",
    link: "/outgoing",
    isRead: false,
  },
  {
    id: 3,
    userName: "Alena Franci",
    role: "admin",
    description: "approved your submitted document.",
    time: "30 min ago",
    date: "2024-02-01",
    type: "DOCUMENT_APPROVED",
    isRead: false,
  },
  {
    id: 4,
    userName: "Carlos Mendoza",
    role: "admin",
    description: "changed the status of INC-2024-004 to On-Going.",
    time: "1 hr ago",
    date: "2024-01-31",
    type: "STATUS_CHANGED",
    isRead: true,
  },
  {
    id: 5,
    userName: "Jocelyn Kenter",
    role: "admin",
    description: "rejected your submitted document.",
    time: "2 hrs ago",
    date: "2024-01-31",
    type: "DOCUMENT_REJECTED",
    isRead: false,
  },
  {
    id: 6,
    userName: "Maria Santos",
    role: "super-admin",
    description: "flagged INC-2024-006 for validation.",
    time: "3 hrs ago",
    date: "2024-01-31",
    type: "DOCUMENT_VALIDATION",
    isRead: true,
  },
  {
    id: 7,
    userName: "Ramon Garcia",
    role: "admin",
    description: "updated the details of document 2024-30-006.",
    time: "Yesterday",
    date: "2024-01-30",
    type: "DOCUMENT_UPDATE",
    isRead: false,
  },
  {
    id: 8,
    userName: "Ana Cruz",
    role: "admin",
    description: "approved the procurement of office supplies request.",
    time: "2 days ago",
    date: "2024-01-29",
    type: "DOCUMENT_APPROVED",
    isRead: true,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const NotificationPage: React.FC = () => {
  const { role } = userUser();

  // Filter mock data by role on mount
  const roleNotifications = allNotifications.filter((n) => {
    if (!role) return false;
    return ALLOWED_TYPES_BY_ROLE[role]?.includes(n.type) ?? false;
  });

  const [notifications, setNotifications] =
    useState<Notification[]>(roleNotifications);
  const [filterType, setFilterType] = useState<NotificationType | "All">("All");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Only show type options relevant to the current role
  const availableTypes: NotificationType[] = role
    ? (ALLOWED_TYPES_BY_ROLE[role] ?? [])
    : [];

  function handleMarkAsRead(id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }

  function handleRemove(id: number) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function handleMarkAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function handleRemoveAll() {
    setNotifications([]);
  }

  const filtered = notifications.filter((n) => {
    const matchesType = filterType === "All" || n.type === filterType;
    const date = new Date(n.date);
    const matchesFrom = !filterDateFrom || date >= new Date(filterDateFrom);
    const matchesTo = !filterDateTo || date <= new Date(filterDateTo);
    return matchesType && matchesFrom && matchesTo;
  });

  const hasFilters = filterType !== "All" || filterDateFrom || filterDateTo;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <PageMeta
        title="Notifications | Document Tracking System"
        description="View and manage all system notifications."
      />
      <PageBreadcrumb pageTitle="Notifications" />

      <div className="space-y-6">
        <ComponentCard
          title={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          headerRight={
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-theme-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.06] hover:text-primary dark:hover:text-secondary hover:border-primary/30 dark:hover:border-secondary/30 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleRemoveAll}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-theme-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] hover:bg-red-50 dark:hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove all
                </button>
              )}
            </div>
          }
        >
          {/* ── Filters ── */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as NotificationType | "All")
              }
              className="flex-1 min-w-[180px] px-3 py-2 text-theme-sm rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-200 transition"
            >
              <option value="All">All Types</option>
              {availableTypes.map((t) => (
                <option key={t} value={t}>
                  {typeLabel[t]}
                </option>
              ))}
            </select>

            <div className="flex flex-col gap-1">
              <label className="text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                From
              </label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="px-3 py-2 text-theme-sm rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-200 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
                To
              </label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="px-3 py-2 text-theme-sm rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-200 transition"
              />
            </div>

            {hasFilters && (
              <button
                onClick={() => {
                  setFilterType("All");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                }}
                className="px-3 py-2 text-theme-sm text-gray-500 hover:text-danger border border-gray-200 rounded-lg hover:border-danger/40 transition-colors dark:border-white/[0.08] dark:text-gray-400 dark:hover:text-danger whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>

          {/* ── List ── */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.03] px-5 py-10 text-center text-gray-400 text-theme-sm">
                {notifications.length === 0
                  ? "No notifications."
                  : "No notifications match your filters."}
              </div>
            ) : (
              filtered.map((n) => (
                <NotificationItem
                  key={n.id}
                  {...n}
                  onMarkAsRead={handleMarkAsRead}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>

          {/* ── Footer count ── */}
          {filtered.length > 0 && (
            <p className="text-theme-xs text-gray-400 dark:text-gray-500 text-right px-1">
              Showing{" "}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {notifications.length}
              </span>{" "}
              notifications
            </p>
          )}
        </ComponentCard>
      </div>
    </>
  );
};

export default NotificationPage;
