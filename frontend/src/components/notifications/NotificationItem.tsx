import React from "react";
import { Link } from "react-router";

export type NotificationType =
  | "INCOMING_DOC_UPLOAD"
  | "OUTGOING_DOC_UPLOAD"
  | "DOCUMENT_APPROVED"
  | "DOCUMENT_VALIDATION"
  | "DOCUMENT_REJECTED"
  | "STATUS_CHANGED"
  | "DOCUMENT_UPDATE";

export interface NotificationProps {
  id: number;
  userName: string;
  role: "super-admin" | "admin" | "receiver";
  description: string;
  time: string;
  date: string;
  type: NotificationType;
  link?: string;
  isRead?: boolean;
  onMarkAsRead?: (id: number) => void;
  onRemove?: (id: number) => void;
}

const roleLabel: Record<NotificationProps["role"], string> = {
  "super-admin": "Super Admin",
  admin: "Admin",
  receiver: "Receiver",
};

export const typeLabel: Record<NotificationType, string> = {
  INCOMING_DOC_UPLOAD: "Incoming Upload",
  OUTGOING_DOC_UPLOAD: "Outgoing Upload",
  DOCUMENT_APPROVED: "Approved",
  DOCUMENT_VALIDATION: "Validation",
  DOCUMENT_REJECTED: "Rejected",
  STATUS_CHANGED: "Status Changed",
  DOCUMENT_UPDATE: "Document Update",
};

export const typeStyles: Record<NotificationType, string> = {
  INCOMING_DOC_UPLOAD:
    "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary",
  OUTGOING_DOC_UPLOAD:
    "bg-primary/10 text-primary dark:bg-primary/20 dark:text-secondary",
  DOCUMENT_APPROVED:
    "bg-success/10 text-success dark:bg-success/20 dark:text-success",
  DOCUMENT_VALIDATION:
    "bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning",
  DOCUMENT_REJECTED:
    "bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger",
  STATUS_CHANGED:
    "bg-info-500/10 text-info-500 dark:bg-info-500/20 dark:text-info-500",
  DOCUMENT_UPDATE:
    "bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-gray-400",
};

export const NotificationItem: React.FC<NotificationProps> = ({
  id,
  userName,
  role,
  description,
  time,
  type,
  link = "#",
  isRead = false,
  onMarkAsRead,
  onRemove,
}) => {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors
        ${
          isRead
            ? "border-gray-100 bg-white dark:border-white/[0.05] dark:bg-white/[0.02]"
            : "border-primary/20 bg-primary/[0.03] dark:border-secondary/20 dark:bg-secondary/[0.04]"
        }`}
    >
      {/* Unread dot */}
      <div className="mt-1 flex-shrink-0">
        <span
          className={`block w-2 h-2 rounded-full ${!isRead ? "bg-primary dark:bg-secondary" : "bg-transparent"}`}
        />
      </div>

      {/* Content */}
      <Link to={link} className="flex-1 min-w-0 group">
        <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-800 dark:text-white/90 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
            {userName}
          </span>{" "}
          <span className="text-theme-xs text-gray-400 dark:text-gray-500">
            ({roleLabel[role]})
          </span>{" "}
          <span>{description}</span>
        </span>

        <span className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-theme-xs font-medium ${typeStyles[type]}`}
          >
            {typeLabel[type]}
          </span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <span className="text-theme-xs text-gray-400 dark:text-gray-500">
            {time}
          </span>
        </span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 ml-1">
        {!isRead && (
          <button
            onClick={() => onMarkAsRead?.(id)}
            title="Mark as read"
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary dark:hover:text-secondary hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        )}
        <button
          onClick={() => onRemove?.(id)}
          title="Remove"
          className="p-1.5 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 dark:hover:bg-danger/10 transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
