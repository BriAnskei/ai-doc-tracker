// components/receiver/ReceiverMetrics.tsx
import { ArrowUpIcon, ArrowDownIcon } from "../../icons";
import Badge from "../ui/badge/Badge";

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  badge?: {
    color: "success" | "error" | "warning" | "info";
    text: string;
    up?: boolean;
  };
  iconBg: string;
}

function MetricCard({ label, value, icon, badge, iconBg }: MetricCardProps) {
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

// ── Icons ────────────────────────────────────────────────────────────────────

function UploadIcon({ className }: { className?: string }) {
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
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"
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

function XCircleIcon({ className }: { className?: string }) {
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
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReceiverMetrics() {
  const metrics: MetricCardProps[] = [
    {
      label: "Total Uploaded",
      value: 120,
      icon: <UploadIcon className="size-6 text-primary dark:text-secondary" />,
      iconBg: "bg-primary/10 dark:bg-secondary/10",
      badge: { color: "success", text: "12.5%", up: true },
    },
    {
      label: "Pending Validation",
      value: 15,
      icon: <ClockIcon className="size-6 text-warning dark:text-warning" />,
      iconBg: "bg-warning/10 dark:bg-warning/10",
      badge: { color: "warning", text: "3 new" },
    },
    {
      label: "Approved",
      value: 100,
      icon: (
        <CheckCircleIcon className="size-6 text-success dark:text-success" />
      ),
      iconBg: "bg-success/10 dark:bg-success/10",
      badge: { color: "success", text: "83.3%", up: true },
    },
    {
      label: "Rejected",
      value: 5,
      icon: <XCircleIcon className="size-6 text-danger dark:text-danger" />,
      iconBg: "bg-danger/10 dark:bg-danger/10",
      badge: { color: "error", text: "4.2%", up: false },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}
