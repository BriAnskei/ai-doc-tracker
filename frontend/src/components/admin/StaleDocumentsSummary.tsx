// components/admin/StaleDocumentsSummary.tsx
import { useNavigate } from "react-router";
import { AlertIcon, ArrowRightIcon } from "../../icons";

export default function StaleDocumentsSummary() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/admin/stale-documents")}
      className="group flex w-full flex-col items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-error-500/30 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
          <AlertIcon className="size-5 text-warning" />
        </span>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Stale Documents
          </h3>
          <p className="text-theme-xs mt-1 text-gray-500 dark:text-gray-400">
            No status change for 11+ months
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        <span className="text-theme-sm font-semibold text-danger">2 Overdue</span>
        <span className="text-theme-sm font-semibold text-warning">3 Approaching</span>
      </div>

      <span className="text-theme-sm inline-flex items-center gap-1 font-medium text-brand-500 dark:text-brand-400">
        View Details
        <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}
