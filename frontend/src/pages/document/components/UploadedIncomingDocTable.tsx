// ─── MyUploadsTable.tsx ───────────────────────────────────────────────────────

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../../components/ui/table";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadStatus = "pending" | "approved" | "rejected" | "archived";

interface UploadedDocument {
  id: number;
  fileName: string;
  uploadedAt: string;
  status: UploadStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockData: UploadedDocument[] = [
  {
    id: 1,
    fileName: "barangay-clearance-001.pdf",
    uploadedAt: "2024-01-10T09:14:00",
    status: "approved",
  },
  {
    id: 2,
    fileName: "engineering-permit-rev2.pdf",
    uploadedAt: "2024-01-14T14:30:00",
    status: "rejected",
  },
  {
    id: 3,
    fileName: "site-inspection-report.pdf",
    uploadedAt: "2024-01-18T11:05:00",
    status: "pending",
  },
  {
    id: 4,
    fileName: "building-plan-floor1.docx",
    uploadedAt: "2024-01-22T08:47:00",
    status: "approved",
  },
  {
    id: 5,
    fileName: "environmental-clearance.pdf",
    uploadedAt: "2024-01-25T16:20:00",
    status: "pending",
  },
  {
    id: 6,
    fileName: "occupancy-permit-req.pdf",
    uploadedAt: "2024-02-01T10:00:00",
    status: "rejected",
  },
  {
    id: 7,
    fileName: "structural-analysis-v3.pdf",
    uploadedAt: "2024-02-05T13:22:00",
    status: "approved",
  },
  {
    id: 8,
    fileName: "electrical-plan-final.docx",
    uploadedAt: "2024-02-10T09:50:00",
    status: "pending",
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

type StatusConfigEntry = { label: string; className: string };

const STATUS_CONFIG: Record<UploadStatus, StatusConfigEntry> = {
  pending: { label: "Pending", className: "text-warning font-medium" },
  approved: { label: "Approved", className: "text-success font-medium" },
  rejected: { label: "Rejected", className: "text-danger font-medium" },
  archived: { label: "Archived", className: "text-gray-400 font-medium" },
};

function StatusBadge({ status }: { status: UploadStatus }) {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-theme-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

// ─── Archive SVG Icon ─────────────────────────────────────────────────────────

function ArchiveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7H4a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 10v8a1 1 0 001 1h12a1 1 0 001-1v-8"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14h4" />
    </svg>
  );
}

// ─── Archive Confirm Modal ────────────────────────────────────────────────────

function ArchiveConfirmModal({
  file,
  onConfirm,
  onCancel,
}: {
  file: UploadedDocument;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-gray-900">
        <div className="px-6 py-5">
          {/* Icon */}
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 dark:bg-white/[0.06]">
            <ArchiveIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>

          <h2 className="text-theme-sm font-semibold text-gray-900 dark:text-white/90">
            Archive document?
          </h2>
          <p className="mt-1.5 text-theme-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {file.fileName}
            </span>{" "}
            will be moved to the archive. You can restore it later if needed.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 dark:border-white/[0.05] px-6 py-4">
          <button
            onClick={onCancel}
            className="px-3 py-2 text-theme-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/[0.08] rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-theme-sm font-medium bg-gray-700 text-white hover:bg-gray-800 dark:bg-white/[0.10] dark:hover:bg-white/[0.15] transition-colors"
          >
            <ArchiveIcon className="w-4 h-4" />
            Archive
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UploadedIncomingDocTable() {
  const [records, setRecords] = useState<UploadedDocument[]>(mockData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<UploadStatus | "">("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [pendingArchive, setPendingArchive] = useState<UploadedDocument | null>(
    null,
  );

  // ── Filtering ──

  const hasFilters = search || filterStatus || filterDateFrom || filterDateTo;

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || r.fileName.toLowerCase().includes(q);
    const matchesStatus = !filterStatus || r.status === filterStatus;
    const date = new Date(r.uploadedAt);
    const matchesFrom = !filterDateFrom || date >= new Date(filterDateFrom);
    const matchesTo = !filterDateTo || date <= new Date(filterDateTo);
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  function clearFilters() {
    setSearch("");
    setFilterStatus("");
    setFilterDateFrom("");
    setFilterDateTo("");
  }

  // ── Archive ──

  function confirmArchive() {
    if (!pendingArchive) return;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === pendingArchive.id ? { ...r, status: "archived" } : r,
      ),
    );
    setPendingArchive(null);
  }

  // ── Shared class strings ──

  const inputCls =
    "px-3 py-2 text-theme-sm rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-200 transition";

  const labelCls = "text-theme-xs text-gray-500 dark:text-gray-400 font-medium";

  // ── Archive Button ──

  function ArchiveButton({ onClick }: { onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-theme-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-white/[0.12] hover:bg-gray-700 hover:text-white hover:border-gray-700 dark:hover:bg-white/[0.10] dark:hover:border-white/[0.20] transition-colors duration-150 whitespace-nowrap"
        title="Archive document"
      >
        <ArchiveIcon className="w-3.5 h-3.5 flex-shrink-0" />
        Archive
      </button>
    );
  }

  return (
    <>
      {pendingArchive && (
        <ArchiveConfirmModal
          file={pendingArchive}
          onConfirm={confirmArchive}
          onCancel={() => setPendingArchive(null)}
        />
      )}

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
              placeholder="Search by file name…"
              className={`w-full pl-9 pr-4 ${inputCls}`}
            />
          </div>

          <div className="flex gap-3 flex-wrap items-end">
            {/* Status filter */}
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Status</label>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as UploadStatus | "")
                }
                className={inputCls}
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="archived">Archived</option>
              </select>
            </div>

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
                onClick={clearFilters}
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
                <div className="flex items-start justify-between gap-2">
                  <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90 break-all">
                    {record.fileName}
                  </p>
                  <StatusBadge status={record.status} />
                </div>

                <div>
                  <p className="text-theme-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
                    Uploaded At
                  </p>
                  <p className="text-theme-xs text-gray-700 dark:text-gray-300 mt-0.5">
                    {formatDateTime(record.uploadedAt)}
                  </p>
                </div>

                {record.status !== "archived" && (
                  <div className="pt-1 border-t border-gray-100 dark:border-white/[0.05]">
                    <ArchiveButton onClick={() => setPendingArchive(record)} />
                  </div>
                )}
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
                {records.length}
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
                  {["File Name", "Uploaded At", "Status", "Action"].map(
                    (col) => (
                      <TableCell
                        key={col}
                        isHeader
                        className="px-3 py-3 font-semibold text-primary text-start text-theme-xs dark:text-gray-300 whitespace-nowrap"
                      >
                        {col}
                      </TableCell>
                    ),
                  )}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
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
                      {/* File name */}
                      <TableCell className="px-3 py-3 text-gray-800 dark:text-white/90 text-theme-sm font-medium">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 flex-shrink-0 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                          </svg>
                          {record.fileName}
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="px-3 py-3 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                        {formatDateTime(record.uploadedAt)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-3 py-3">
                        <StatusBadge status={record.status} />
                      </TableCell>

                      {/* Action */}
                      <TableCell className="px-3 py-3">
                        {record.status !== "archived" ? (
                          <ArchiveButton
                            onClick={() => setPendingArchive(record)}
                          />
                        ) : (
                          <span className="text-theme-xs text-gray-300 dark:text-gray-600 italic">
                            Archived
                          </span>
                        )}
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
                  {records.length}
                </span>{" "}
                records
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
