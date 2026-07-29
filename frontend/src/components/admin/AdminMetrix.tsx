// components/admin/AdminMetrics.tsx

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  valueClass?: string;
}

function MetricCard({ label, value, icon, iconBg, valueClass }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${iconBg}`}>
          {icon}
        </div>
        <div className="flex-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <h4 className={`mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90 ${valueClass ?? ""}`}>
            {value.toLocaleString()}
          </h4>
        </div>
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────
// Only four KPIs — the rest of the breakdown lives inside the Analytics chart.
export default function AdminMetrics() {
  const metrics: MetricCardProps[] = [
    {
      label: "Total Documents",
      value: 1250,
      icon: <FolderIcon className="size-6 text-primary dark:text-secondary" />,
      iconBg: "bg-primary/10 dark:bg-secondary/10",
    },
    {
      label: "Pending Documents",
      value: 120,
      icon: <ClockIcon className="size-6 text-warning" />,
      iconBg: "bg-warning/10",
    },
    {
      label: "On-Going",
      value: 300,
      icon: <RefreshIcon className="size-6 text-orange-500" />,
      iconBg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      label: "Completed",
      value: 830,
      icon: <CheckCircleIcon className="size-6 text-success" />,
      iconBg: "bg-success/10",
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
