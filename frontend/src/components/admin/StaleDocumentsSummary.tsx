// components/admin/StaleDocumentsSummary.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { AlertIcon, ArrowRightIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { getStaleCounts } from "./staleDocumentsData";

export default function StaleDocumentsSummary() {
  const navigate = useNavigate();
  const { total, overdue, approaching } = useMemo(() => getStaleCounts(), []);

  return (
    <button
      onClick={() => navigate("/admin/stale-documents")}
      className="group flex w-full flex-col rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-error-500/30 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
          <AlertIcon className="size-5 text-warning" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Stale Documents ({total})
          </h3>
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">
            No status change for 11+ months
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge color="error">{overdue} Overdue</Badge>
        <Badge color="warning">{approaching} Approaching</Badge>
      </div>

      <span className="text-theme-sm mt-4 inline-flex items-center gap-1 font-medium text-brand-500 dark:text-brand-400">
        View Details
        <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}
