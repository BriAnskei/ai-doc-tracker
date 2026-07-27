// components/admin/NeedsAttention.tsx
import { useNavigate } from "react-router";
import { AlertIcon, ArrowRightIcon } from "../../icons";

interface AttentionItem {
  label: string;
  value: number;
  to: string;
  valueClass: string;
  dotClass: string;
}

// Actionable, role-relevant items the admin should act on first.
// Everything else on the dashboard is just statistics.
const items: AttentionItem[] = [
  {
    label: "Pending Validation",
    value: 120,
    to: "/upload-queue",
    valueClass: "text-warning",
    dotClass: "bg-warning",
  },
  {
    label: "Pending OCR Extraction",
    value: 20,
    to: "/upload-queue",
    valueClass: "text-blue-500",
    dotClass: "bg-blue-500",
  },
  {
    label: "Stale Documents",
    value: 2,
    to: "/admin/stale-documents",
    valueClass: "text-error-500",
    dotClass: "bg-error-500",
  },
  {
    label: "Failed Uploads",
    value: 1,
    to: "/upload-queue",
    valueClass: "text-violet-500",
    dotClass: "bg-violet-500",
  },
];

export default function NeedsAttention() {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-warning/20 bg-warning/[0.04] p-5 dark:border-warning/20 dark:bg-warning/[0.04] sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
          <AlertIcon className="size-5 text-warning" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Needs Attention
          </h2>
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">
            Actionable items requiring your review
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.to)}
            className="group flex flex-col items-start rounded-xl border border-gray-100 bg-white p-4 text-left transition hover:border-warning/30 hover:bg-warning/[0.03] dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <span className={`mb-3 h-2 w-2 rounded-full ${item.dotClass}`} />
            <span className={`text-3xl font-bold leading-none ${item.valueClass}`}>
              {item.value}
            </span>
            <span className="text-theme-sm mt-2 font-medium text-gray-600 dark:text-gray-300">
              {item.label}
            </span>
            <span className="text-theme-xs mt-1 inline-flex items-center gap-1 text-gray-400 opacity-0 transition group-hover:opacity-100">
              View <ArrowRightIcon className="size-3" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
