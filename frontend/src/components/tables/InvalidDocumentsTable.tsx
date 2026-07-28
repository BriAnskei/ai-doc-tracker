import { useState } from "react";
import { useNavigate } from "react-router";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../ui/table";
import { useNotifications } from "../../context/NotificationsContext";

// ─── Types ─────────────────────────────────────────────────────────────

interface InvalidDocument {
  id: number;
  uploaderName: string;
  fileName: string;
  from: string;
  uploadedAt: string;
  missingFields: string[];
  fileUrl: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────

const mockData: InvalidDocument[] = [
  {
    id: 1,
    uploaderName: "Maria Santos",
    fileName: "memo-budget-allocation.pdf",
    from: "Barangay Hall",
    uploadedAt: "2024-01-10T09:14:00",
    missingFields: ["Subject", "Date Received"],
    fileUrl: "/files/doc-001.pdf",
  },
  {
    id: 2,
    uploaderName: "Juan dela Cruz",
    fileName: "construction-proposal.pdf",
    from: "Engineering Division",
    uploadedAt: "2024-01-14T14:30:00",
    missingFields: ["To"],
    fileUrl: "/files/doc-002.pdf",
  },
  {
    id: 3,
    uploaderName: "Ana Reyes",
    fileName: "inspection-report.pdf",
    from: "City Mayor's Office",
    uploadedAt: "2024-01-18T11:05:00",
    missingFields: ["Subject", "From", "Date Received"],
    fileUrl: "/files/doc-003.pdf",
  },
  {
    id: 4,
    uploaderName: "Carlos Mendoza",
    fileName: "fund-release-order.pdf",
    from: "Treasury Office",
    uploadedAt: "2024-01-22T08:47:00",
    missingFields: ["To", "Date Received"],
    fileUrl: "/files/doc-004.pdf",
  },
  {
    id: 5,
    uploaderName: "Liza Torres",
    fileName: "permit-application.pdf",
    from: "Planning Office",
    uploadedAt: "2024-01-25T16:20:00",
    missingFields: ["Subject"],
    fileUrl: "/files/doc-005.pdf",
  },
  {
    id: 6,
    uploaderName: "Ramon Garcia",
    fileName: "health-advisory.pdf",
    from: "Health Office",
    uploadedAt: "2024-02-01T10:00:00",
    missingFields: ["From", "To", "Date Received"],
    fileUrl: "/files/doc-006.pdf",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────

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

// ─── Main Component ─────────────────────────────────────────────────────

export default function InvalidDocumentsTable() {
  const [search, setSearch] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterMissingField, setFilterMissingField] = useState("");

  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<number | null>(null);
  const [rejectedIds, setRejectedIds] = useState<number[]>([]);

  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const hasFilters = search || filterDateFrom || filterDateTo || filterMissingField;

  // Only show documents that haven't been rejected yet
  const activeData = mockData.filter((r) => !rejectedIds.includes(r.id));

  function handleRejectConfirm() {
    if (pendingRejectId === null) return;
    setRejectedIds((prev) => [...prev, pendingRejectId]);
    setShowRejectConfirm(false);
    setPendingRejectId(null);
  }

  function handleRejectCancel() {
    setShowRejectConfirm(false);
    setPendingRejectId(null);
  }

  const filtered = activeData.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.uploaderName.toLowerCase().includes(q) ||
      r.fileName.toLowerCase().includes(q) ||
      r.from.toLowerCase().includes(q);
    const date = new Date(r.uploadedAt);
    const matchesFrom = !filterDateFrom || date >= new Date(filterDateFrom);
    const matchesTo = !filterDateTo || date <= new Date(filterDateTo);
    const matchesField =
      !filterMissingField || r.missingFields.includes(filterMissingField);
    return matchesSearch && matchesFrom && matchesTo && matchesField;
  });

  // ── Shared class strings ──
  const inputCls =
    "px-3 py-2 text-theme-sm rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-200 transition";

  const labelCls = "text-theme-xs text-gray-500 dark:text-gray-400 font-medium";

  const btnBase =
    "text-theme-xs inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 font-medium transition-colors duration-150";

  return (
    <>
      <div className="space-y-4">
        {/* ── Filters ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          {/* Search */}
          <div className="relative w-full sm:min-w-[200px] sm:flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg
                className="h-4 w-4"
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
              placeholder="Search by uploader, file name, or from…"
              className={`w-full pr-4 pl-9 ${inputCls}`}
            />
          </div>

          {/* Missing Field Filter */}
          <div className="flex flex-col gap-1">
            <label className={labelCls}>Missing Field</label>
            <select
              value={filterMissingField}
              onChange={(e) => setFilterMissingField(e.target.value)}
              className={`${inputCls} appearance-none`}
            >
              <option value="">All Missing Fields</option>
              <option value="Subject">Subject</option>
              <option value="From">From</option>
              <option value="To">To</option>
              <option value="Date Received">Date Received</option>
            </select>
          </div>

          {/* Date filters + Clear */}
          <div className="flex flex-wrap items-end gap-3">
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
                  setFilterMissingField("");
                }}
                className="text-theme-sm hover:text-danger hover:border-danger/40 dark:hover:text-danger rounded-lg border border-gray-200 px-3 py-2 whitespace-nowrap text-gray-500 transition-colors dark:border-white/[0.08] dark:text-gray-400"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile Cards (< md) ── */}
        <div className="space-y-3 md:hidden">
          {filtered.length === 0 ? (
            <div className="text-theme-sm rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-gray-400 dark:border-white/[0.08] dark:bg-white/[0.03]">
              No invalid documents match your filters.
            </div>
          ) : (
            filtered.map((record) => (
              <div
                key={record.id}
                className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.08] dark:bg-white/[0.03]"
              >
                <div className="flex items-start justify-between">
                  <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                    {record.uploaderName}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-semibold text-danger">
                    Missing{" "}
                    {record.missingFields.length}
                    {record.missingFields.length > 1 ? " fields" : " field"}
                  </span>
                </div>

                <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                  {record.fileName}
                </p>

                <div className="flex flex-col gap-1.5">
                  <div>
                    <p className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                      From
                    </p>
                    <p className="text-theme-xs mt-0.5 text-gray-700 dark:text-gray-300">
                      {record.from}
                    </p>
                  </div>
                  <div>
                    <p className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                      Missing Fields
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {record.missingFields.map((field) => (
                        <span
                          key={field}
                          className="inline-flex items-center rounded-full border border-danger/30 bg-danger/5 px-2 py-0.5 text-[10px] font-medium text-danger"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                      Uploaded At
                    </p>
                    <p className="text-theme-xs mt-0.5 text-gray-700 dark:text-gray-300">
                      {formatDateTime(record.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 dark:border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate("/upload-direct")}
                      className="text-theme-xs text-secondary border-secondary/30 hover:bg-secondary inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors duration-150 hover:text-white"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit &amp; Route
                    </button>
                    <button
                      onClick={() => {
                        setPendingRejectId(record.id);
                        setShowRejectConfirm(true);
                      }}
                      className="text-theme-xs text-danger border-danger/30 hover:bg-danger inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors duration-150 hover:text-white"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          {filtered.length > 0 && (
            <p className="text-theme-xs px-1 text-right text-gray-400 dark:text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {activeData.length}
              </span>{" "}
              records
            </p>
          )}
        </div>

        {/* ── Desktop Table (≥ md) ── */}
        <div className="hidden rounded-xl border border-gray-200 bg-white md:block dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {[
                    "Uploader's Name",
                    "File",
                    "From",
                    "Missing Fields",
                    "Uploaded At",
                    "Actions",
                  ].map((col) => (
                    <TableCell
                      key={col}
                      isHeader
                      className="text-primary text-theme-xs px-3 py-3 text-start font-semibold whitespace-nowrap dark:text-gray-300"
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
                      colSpan={6}
                      className="text-theme-sm px-5 py-10 text-center text-gray-400"
                    >
                      No invalid documents match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((record) => (
                    <TableRow
                      key={record.id}
                      className="transition-colors hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
                    >
                      <TableCell className="text-theme-sm px-3 py-3 font-medium whitespace-nowrap text-gray-800 dark:text-white/90">
                        {record.uploaderName}
                      </TableCell>

                      <TableCell className="text-theme-sm px-3 py-3 max-w-[180px] truncate text-gray-500 dark:text-gray-400">
                        {record.fileName}
                      </TableCell>

                      <TableCell className="text-theme-sm px-3 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {record.from}
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {record.missingFields.map((field) => (
                            <span
                              key={field}
                              className="inline-flex items-center rounded-full border border-danger/30 bg-danger/5 px-2 py-0.5 text-[10px] font-medium text-danger"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="text-theme-sm px-3 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {formatDateTime(record.uploadedAt)}
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate("/upload-direct")}
                            className="text-theme-xs text-secondary border-secondary/30 hover:bg-secondary inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 font-medium whitespace-nowrap transition-colors duration-150 hover:text-white"
                            title="Edit metadata and route document"
                          >
                            <svg
                              className="h-3.5 w-3.5 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit &amp; Route
                          </button>
                          <button
                            onClick={() => {
                              setPendingRejectId(record.id);
                              setShowRejectConfirm(true);
                            }}
                            className="text-theme-xs text-danger border-danger/30 hover:bg-danger inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 font-medium whitespace-nowrap transition-colors duration-150 hover:text-white"
                            title="Reject and send back to receiver"
                          >
                            <svg
                              className="h-3.5 w-3.5 flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Reject
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filtered.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3 dark:border-white/[0.05]">
              <span className="text-theme-xs text-gray-400 dark:text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {activeData.length}
                </span>{" "}
                records
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Reject Confirm Modal ── */}
      {showRejectConfirm && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 px-4"
          onClick={(e) =>
            e.target === e.currentTarget && handleRejectCancel()
          }
        >
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-gray-900">
            <div className="px-6 py-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 dark:bg-danger/20">
                <svg
                  className="h-5 w-5 text-danger"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h2 className="text-theme-sm font-semibold text-gray-900 dark:text-white/90">
                Reject document?
              </h2>
              <p className="text-theme-xs mt-1.5 leading-relaxed text-gray-500 dark:text-gray-400">
                This will send the document back to the receiver with a{" "}
                <span className="font-medium text-danger">Rejected</span>{" "}
                status. The receiver will be notified and can fix the missing
                metadata and re-upload.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4 dark:border-white/[0.05]">
              <button
                onClick={handleRejectCancel}
                className="text-theme-sm rounded-lg border border-gray-200 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.04]"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="text-theme-sm inline-flex items-center gap-1.5 rounded-lg bg-danger px-3 py-2 font-medium text-white transition-colors hover:bg-danger/90"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
