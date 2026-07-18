// components/admin/StaleDocumentsCard.tsx
import { useMemo, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import Badge from "../ui/badge/Badge";

interface StaleDocument {
  trackingNo: string;
  subject: string;
  status: "Pending" | "On-Going";
  lastStatusChange: string; // ISO date string
}

// ── Mock data ─────────────────────────────────────────────────────────────────
// Incoming documents whose status hasn't changed in ~11 months or more.
const staleDocuments: StaleDocument[] = [
  {
    trackingNo: "DOC-001",
    subject: "Road Widening Proposal - Barangay Sto. Niño",
    status: "Pending",
    lastStatusChange: "2025-07-10",
  },
  {
    trackingNo: "DOC-005",
    subject: "Bridge Structural Assessment Report",
    status: "On-Going",
    lastStatusChange: "2025-08-02",
  },
  {
    trackingNo: "DOC-012",
    subject: "Drainage System Repair Request",
    status: "Pending",
    lastStatusChange: "2025-08-20",
  },
  {
    trackingNo: "DOC-019",
    subject: "Equipment Procurement Endorsement",
    status: "On-Going",
    lastStatusChange: "2025-09-05",
  },
  {
    trackingNo: "DOC-023",
    subject: "Right-of-Way Clearance Application",
    status: "Pending",
    lastStatusChange: "2025-09-14",
  },
];

const STALE_THRESHOLD_DAYS = 335; // ~11 months
const OVERDUE_THRESHOLD_DAYS = 365; // 1 year

function daysSince(dateString: string): number {
  const then = new Date(dateString).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function AlertTriangleIcon({ className }: { className?: string }) {
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
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a1.5 1.5 0 001.29 2.25h17.78A1.5 1.5 0 0022.18 18L13.71 3.86a1.5 1.5 0 00-2.42 0z"
      />
    </svg>
  );
}

export default function StaleDocumentsCard() {
  const [isOpen, setIsOpen] = useState(false);

  const rows = useMemo(() => {
    return staleDocuments
      .map((doc) => {
        const days = daysSince(doc.lastStatusChange);
        const tier: "Approaching" | "Overdue" =
          days >= OVERDUE_THRESHOLD_DAYS ? "Overdue" : "Approaching";
        return { ...doc, days, tier };
      })
      .filter((doc) => doc.days >= STALE_THRESHOLD_DAYS)
      .sort((a, b) => b.days - a.days);
  }, []);

  const overdueCount = rows.filter((r) => r.tier === "Overdue").length;
  const approachingCount = rows.filter((r) => r.tier === "Approaching").length;

  const goToReport = () => {
    // Placeholder: hook up navigation to a dedicated stale-documents
    // report page here if/when one is built.
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Stale Incoming Documents
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            Incoming documents with no status change for 11+ months
          </p>
        </div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={() => setIsOpen((v) => !v)}>
            <MoreDotIcon className="size-6 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
            <DropdownItem
              onItemClick={() => {
                setIsOpen(false);
                goToReport();
              }}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View Full Report
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="bg-warning/10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl">
            <AlertTriangleIcon className="text-warning size-5" />
          </div>
          <div>
            <p className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
              Approaching
            </p>
            <p className="text-warning mt-0.5 text-2xl font-bold">{approachingCount}</p>
            <p className="text-theme-xs mt-0.5 text-gray-500 dark:text-gray-400">
              335–364 days unchanged
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="bg-error-50 dark:bg-error-500/10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl">
            <AlertTriangleIcon className="text-error-500 size-5" />
          </div>
          <div>
            <p className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
              Overdue
            </p>
            <p className="text-error-500 mt-0.5 text-2xl font-bold">{overdueCount}</p>
            <p className="text-theme-xs mt-0.5 text-gray-500 dark:text-gray-400">
              365+ days unchanged
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/[0.05]">
              <th className="text-theme-xs px-3 py-2 font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                Tracking No.
              </th>
              <th className="text-theme-xs px-3 py-2 font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                Current Status
              </th>
              <th className="text-theme-xs px-3 py-2 font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                Last Status Change
              </th>
              <th className="text-theme-xs px-3 py-2 text-right font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                Days Unchanged
              </th>
              <th className="text-theme-xs px-3 py-2 text-right font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                Tier
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((doc) => (
              <tr
                key={doc.trackingNo}
                className="border-b border-gray-50 last:border-0 dark:border-white/[0.03]"
              >
                <td className="text-theme-sm px-3 py-3 font-medium text-gray-800 dark:text-white/90">
                  {doc.trackingNo}
                  <p className="text-theme-xs mt-0.5 max-w-[220px] truncate font-normal text-gray-400 dark:text-gray-500">
                    {doc.subject}
                  </p>
                </td>
                <td className="text-theme-sm px-3 py-3 text-gray-600 dark:text-gray-300">
                  {doc.status}
                </td>
                <td className="text-theme-sm px-3 py-3 text-gray-600 dark:text-gray-300">
                  {formatDate(doc.lastStatusChange)}
                </td>
                <td className="text-theme-sm px-3 py-3 text-right font-semibold text-gray-800 dark:text-white/90">
                  {doc.days}
                </td>
                <td className="px-3 py-3 text-right">
                  <Badge color={doc.tier === "Overdue" ? "error" : "warning"}>{doc.tier}</Badge>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-theme-sm px-3 py-6 text-center text-gray-400">
                  No stale documents to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
