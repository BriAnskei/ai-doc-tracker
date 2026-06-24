import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";
import DocumentReviewModal from "../ui/modal/document/ValidationModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValidationDocument {
  id: number;
  uploaderName: string;
  uploadedAt: string;
  fileUrl: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockData: ValidationDocument[] = [
  {
    id: 1,
    uploaderName: "Maria Santos",
    uploadedAt: "2024-01-10T09:14:00",
    fileUrl: "/files/doc-001.pdf",
  },
  {
    id: 2,
    uploaderName: "Juan dela Cruz",
    uploadedAt: "2024-01-14T14:30:00",
    fileUrl: "/files/doc-002.pdf",
  },
  {
    id: 3,
    uploaderName: "Ana Reyes",
    uploadedAt: "2024-01-18T11:05:00",
    fileUrl: "/files/doc-003.pdf",
  },
  {
    id: 4,
    uploaderName: "Carlos Mendoza",
    uploadedAt: "2024-01-22T08:47:00",
    fileUrl: "/files/doc-004.pdf",
  },
  {
    id: 5,
    uploaderName: "Liza Torres",
    uploadedAt: "2024-01-25T16:20:00",
    fileUrl: "/files/doc-005.pdf",
  },
  {
    id: 6,
    uploaderName: "Ramon Garcia",
    uploadedAt: "2024-02-01T10:00:00",
    fileUrl: "/files/doc-006.pdf",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ValidationQueueTable() {
  const [search, setSearch] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const [selected, setSelected] = useState<ValidationDocument | null>(null);

  // swap handleView
  function handleView(record: ValidationDocument) {
    setSelected(record);
  }

  const hasFilters = search || filterDateFrom || filterDateTo;

  const filtered = mockData.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || r.uploaderName.toLowerCase().includes(q);
    const date = new Date(r.uploadedAt);
    const matchesFrom = !filterDateFrom || date >= new Date(filterDateFrom);
    const matchesTo = !filterDateTo || date <= new Date(filterDateTo);
    return matchesSearch && matchesFrom && matchesTo;
  });

  // ── Shared class strings ──
  const inputCls =
    "px-3 py-2 text-theme-sm rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-200 transition";

  const labelCls = "text-theme-xs text-gray-500 dark:text-gray-400 font-medium";

  return (
    <>
      <div className="space-y-4">
        {/* ── Filters ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          {/* Search */}
          <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by uploader name…"
              className={`w-full pl-9 pr-4 ${inputCls}`}
            />
          </div>

          {/* Date filters + Clear */}
          <div className="flex gap-3 flex-wrap items-end">
            {/* Date From */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>From</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Date To */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>To</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                }}
                className="px-3 py-2 text-theme-sm text-gray-500 hover:text-danger border border-gray-200 rounded-lg hover:border-danger/40 transition-colors dark:border-white/[0.08] dark:text-gray-400 dark:hover:text-danger whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile Cards (< md) ── */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.03] px-5 py-10 text-center text-gray-400 text-theme-sm">
              No records match your filters.
            </div>
          ) : (
            filtered.map((record) => (
              <div
                key={record.id}
                className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.03] p-4 space-y-3"
              >
                <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                  {record.uploaderName}
                </p>
                <div>
                  <p className="text-theme-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
                    Uploaded At
                  </p>
                  <p className="text-theme-xs text-gray-700 dark:text-gray-300 mt-0.5">
                    {formatDateTime(record.uploadedAt)}
                  </p>
                </div>
                <div className="pt-1 border-t border-gray-100 dark:border-white/[0.05]">
                  <button
                    onClick={() => handleView(record)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-theme-xs font-medium text-secondary border border-secondary/30 hover:bg-secondary hover:text-white transition-colors duration-150"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </button>
                </div>
              </div>
            ))
          )}
          {filtered.length > 0 && (
            <p className="text-theme-xs text-gray-400 dark:text-gray-500 text-right px-1">
              Showing{" "}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {mockData.length}
              </span>{" "}
              records
            </p>
          )}
        </div>

        {/* ── Desktop Table (≥ md) ── */}
        <div className="hidden md:block rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {["Uploader's Name", "Uploaded At", "Action"].map((col) => (
                    <TableCell
                      key={col}
                      isHeader
                      className="px-3 py-3 font-semibold text-primary text-start text-theme-xs dark:text-gray-300 whitespace-nowrap"
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-10 text-center text-gray-400 text-theme-sm"
                    >
                      No records match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((record) => (
                    <TableRow
                      key={record.id}
                      className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell className="px-3 py-3 text-gray-800 dark:text-white/90 text-theme-sm font-medium whitespace-nowrap">
                        {record.uploaderName}
                      </TableCell>

                      <TableCell className="px-3 py-3 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                        {formatDateTime(record.uploadedAt)}
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <button
                          onClick={() => handleView(record)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-theme-xs font-medium text-secondary border border-secondary/30 hover:bg-secondary hover:text-white transition-colors duration-150 whitespace-nowrap"
                          title="View document"
                        >
                          <svg
                            className="w-3.5 h-3.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 dark:border-white/[0.05]">
              <span className="text-theme-xs text-gray-400 dark:text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {mockData.length}
                </span>{" "}
                records
              </span>
            </div>
          )}
        </div>
      </div>
      <DocumentReviewModal
        record={selected}
        onClose={() => setSelected(null)}
        onApprove={(record) => {
          console.log("[Approve]", record);
          setSelected(null);
        }}
        onReject={(record, reason) => {
          console.log("[Reject]", record, reason);
          setSelected(null);
        }}
      />
    </>
  );
}
