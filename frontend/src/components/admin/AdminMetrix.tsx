// components/admin/AdminMetrics.tsx
import { ArrowUpIcon, ArrowDownIcon } from "../../icons";
import Badge from "../ui/badge/Badge";

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  badge?: {
    color: "success" | "error" | "warning" | "info";
    text: string;
    up?: boolean;
  };
}

function MetricCard({ label, value, icon, iconBg, badge }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {value.toLocaleString()}
          </h4>
        </div>
        {badge && (
          <Badge color={badge.color}>
            {badge.up !== undefined ? (
              badge.up ? (
                <ArrowUpIcon />
              ) : (
                <ArrowDownIcon />
              )
            ) : null}
            {badge.text}
          </Badge>
        )}
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
      />
    </svg>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function OutboxIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminMetrics() {
  const metrics: MetricCardProps[] = [
    {
      label: "Total Documents",
      value: 1250,
      icon: <FolderIcon className="size-6 text-primary dark:text-secondary" />,
      iconBg: "bg-primary/10 dark:bg-secondary/10",
      badge: { color: "success", text: "8.2%", up: true },
    },
    {
      label: "Incoming",
      value: 800,
      icon: <InboxIcon className="size-6 text-blue-500" />,
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      badge: { color: "info", text: "64%" },
    },
    {
      label: "Outgoing",
      value: 450,
      icon: <OutboxIcon className="size-6 text-violet-500" />,
      iconBg: "bg-violet-50 dark:bg-violet-500/10",
      badge: { color: "info", text: "36%" },
    },
    {
      label: "Pending Validation",
      value: 120,
      icon: <ClockIcon className="size-6 text-warning" />,
      iconBg: "bg-warning/10",
      badge: { color: "warning", text: "9.6%", up: false },
    },
    {
      label: "On-Going",
      value: 300,
      icon: <RefreshIcon className="size-6 text-orange-500" />,
      iconBg: "bg-orange-50 dark:bg-orange-500/10",
      badge: { color: "warning", text: "24%" },
    },
    {
      label: "Completed",
      value: 830,
      icon: <CheckCircleIcon className="size-6 text-success" />,
      iconBg: "bg-success/10",
      badge: { color: "success", text: "66.4%", up: true },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 md:gap-6">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}
