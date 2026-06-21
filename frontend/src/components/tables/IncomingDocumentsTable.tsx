import { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusType = "Completed" | "On-Going" | "Pending";

interface IncomingDocument {
  id: number;
  code: string;
  subject: string;
  from: string;
  to: string;
  routedTo: string;
  status: StatusType;
  fileUrl: string;
  dateReceived: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockData: IncomingDocument[] = [
  {
    id: 1,
    code: "INC-2024-001",
    subject: "Budget Proposal FY2024",
    from: "Finance Department",
    to: "Executive Office",
    routedTo: "Maria Santos",
    status: "Completed",
    fileUrl: "/files/budget-proposal-2024.pdf",
    dateReceived: "2024-01-10",
  },
  {
    id: 2,
    code: "INC-2024-002",
    subject: "Infrastructure Maintenance Request",
    from: "Facilities Management",
    to: "Operations Division",
    routedTo: "Juan dela Cruz",
    status: "On-Going",
    fileUrl: "/files/maintenance-request.pdf",
    dateReceived: "2024-01-14",
  },
  {
    id: 3,
    code: "INC-2024-003",
    subject: "Staff Regularization Endorsement",
    from: "HR Department",
    to: "Director's Office",
    routedTo: "Ana Reyes",
    status: "Pending",
    fileUrl: "/files/regularization-endorsement.pdf",
    dateReceived: "2024-01-18",
  },
  {
    id: 4,
    code: "INC-2024-004",
    subject: "Procurement of Office Supplies",
    from: "Administrative Office",
    to: "Procurement Division",
    routedTo: "Carlos Mendoza",
    status: "Pending",
    fileUrl: "/files/procurement-supplies.pdf",
    dateReceived: "2024-01-22",
  },
  {
    id: 5,
    code: "INC-2024-005",
    subject: "Annual Performance Review Results",
    from: "HR Department",
    to: "Department Heads",
    routedTo: "Liza Torres",
    status: "Completed",
    fileUrl: "/files/performance-review.pdf",
    dateReceived: "2024-01-25",
  },
  {
    id: 6,
    code: "INC-2024-006",
    subject: "Legal Compliance Audit Report",
    from: "Legal Affairs",
    to: "Compliance Office",
    routedTo: "Ramon Garcia",
    status: "On-Going",
    fileUrl: "/files/audit-report.pdf",
    dateReceived: "2024-02-01",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALL_STATUSES: StatusType[] = ["Completed", "On-Going", "Pending"];

function getBadgeColor(status: StatusType) {
  if (status === "Completed") return "success";
  if (status === "On-Going") return "warning";
  return "error";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────

function StatusDropdown({
  status,
  onChangeStatus,
}: {
  status: StatusType;
  onChangeStatus: (s: StatusType) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const others = ALL_STATUSES.filter((s) => s !== status);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer focus:outline-none"
        title="Change status"
      >
        <Badge size="sm" color={getBadgeColor(status)}>
          {status}
          <svg
            className="ml-1 inline w-3 h-3 opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Badge>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 left-0 min-w-[130px] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-white/[0.08] dark:bg-gray-900">
          {others.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChangeStatus(s);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-theme-xs hover:bg-gray-50 dark:hover:bg-white/[0.05] first:rounded-t-lg last:rounded-b-lg transition-colors"
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  s === "Completed"
                    ? "bg-success"
                    : s === "On-Going"
                      ? "bg-warning"
                      : "bg-danger"
                }`}
              />
              <span className="text-gray-700 dark:text-gray-300">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Kebab Menu ───────────────────────────────────────────────────────────────

function KebabMenu({ record }: { record: IncomingDocument }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const actions: {
    label: string;
    icon: React.ReactNode;
    handler: () => void;
    danger?: boolean;
  }[] = [
    {
      label: "View",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
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
      ),
      handler: () => console.log("[View] Record:", record),
    },
    {
      label: "History",
      icon: (
        <svg
          className="w-4 h-4"
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
      ),
      handler: () => console.log("[History] Audit log for record:", record),
    },
    {
      label: "Archive",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
      handler: () => console.log("[Archive] Record:", record),
    },
    {
      label: "Delete",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      handler: () => console.log("[Delete] Record:", record),
      danger: true,
    },
  ];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/[0.06] dark:hover:text-gray-200 transition-colors focus:outline-none"
        title="More actions"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 right-0 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-white/[0.08] dark:bg-gray-900">
          {actions.map((action, idx) => (
            <button
              key={action.label}
              onClick={() => {
                action.handler();
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-theme-xs transition-colors
                ${idx === 0 ? "rounded-t-lg" : ""}
                ${idx === actions.length - 1 ? "rounded-b-lg" : ""}
                ${
                  action.danger
                    ? "text-danger hover:bg-red-50 dark:hover:bg-red-500/10"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Mobile Card ──────────────────────────────────────────────────────────────

function MobileCard({
  record,
  onChangeStatus,
  onViewFile,
}: {
  record: IncomingDocument;
  onChangeStatus: (id: number, s: StatusType) => void;
  onViewFile: (r: IncomingDocument) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.03] p-4 space-y-3">
      {/* Top row: code + kebab */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-theme-xs font-semibold text-primary dark:text-secondary bg-primary/5 dark:bg-secondary/10 px-2 py-0.5 rounded">
          {record.code}
        </span>
        <KebabMenu record={record} />
      </div>

      {/* Subject */}
      <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90 leading-snug">
        {record.subject}
      </p>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <p className="text-theme-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
            From
          </p>
          <p className="text-theme-xs text-gray-700 dark:text-gray-300 mt-0.5">
            {record.from}
          </p>
        </div>
        <div>
          <p className="text-theme-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
            To
          </p>
          <p className="text-theme-xs text-gray-700 dark:text-gray-300 mt-0.5">
            {record.to}
          </p>
        </div>
        <div>
          <p className="text-theme-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
            Routed To
          </p>
          <p className="text-theme-xs text-gray-700 dark:text-gray-300 mt-0.5">
            {record.routedTo}
          </p>
        </div>
        <div>
          <p className="text-theme-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
            Date Received
          </p>
          <p className="text-theme-xs text-gray-700 dark:text-gray-300 mt-0.5">
            {formatDate(record.dateReceived)}
          </p>
        </div>
      </div>

      {/* Bottom row: status + file button */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-white/[0.05]">
        <StatusDropdown
          status={record.status}
          onChangeStatus={(s) => onChangeStatus(record.id, s)}
        />
        <button
          onClick={() => onViewFile(record)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-theme-xs font-medium text-secondary border border-secondary/30 hover:bg-secondary hover:text-white transition-colors duration-150"
          title="Open PDF"
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
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          View File
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IncomingDocumentsTable() {
  const [records, setRecords] = useState<IncomingDocument[]>(mockData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusType | "All">("All");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  function handleStatusChange(id: number, newStatus: StatusType) {
    console.log(`[Status Change] Record ID ${id}: → ${newStatus}`);
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
  }

  function handleViewFile(record: IncomingDocument) {
    console.log(
      "[View File] Opening PDF for record:",
      record.code,
      record.fileUrl,
    );
  }

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.code.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q);
    const matchesStatus = filterStatus === "All" || r.status === filterStatus;
    const date = new Date(r.dateReceived);
    const matchesFrom = !filterDateFrom || date >= new Date(filterDateFrom);
    const matchesTo = !filterDateTo || date <= new Date(filterDateTo);
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  const hasFilters =
    search || filterStatus !== "All" || filterDateFrom || filterDateTo;

  return (
    <div className="space-y-4">
      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        {/* Search — full width on mobile, flex-1 on sm+ */}
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
            placeholder="Search by code or subject…"
            className="w-full pl-9 pr-4 py-2 text-theme-sm rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-200 dark:placeholder-gray-500 transition"
          />
        </div>

        {/* Status + Date row on mobile (side by side), inline on sm+ */}
        <div className="flex gap-3 flex-wrap items-end">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as StatusType | "All")
            }
            className="flex-1 min-w-[130px] px-3 py-2 text-theme-sm rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-200 transition"
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Date From */}
          <div className="flex flex-col gap-1">
            <label className="text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
              From
            </label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="px-3 py-2 text-theme-sm rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-200 transition"
            />
          </div>

          {/* Date To */}
          <div className="flex flex-col gap-1">
            <label className="text-theme-xs text-gray-500 dark:text-gray-400 font-medium">
              To
            </label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="px-3 py-2 text-theme-sm rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-200 transition"
            />
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setFilterStatus("All");
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
            <MobileCard
              key={record.id}
              record={record}
              onChangeStatus={handleStatusChange}
              onViewFile={handleViewFile}
            />
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
      <div className="hidden md:block rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] @container">
        <div className="w-full overflow-x-auto">
          <div className="min-w-0">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {[
                    { label: "Code", hide: "" },
                    { label: "Subject", hide: "" },
                    { label: "From", hide: "" },
                    { label: "To", hide: "hidden @4xl:table-cell" },
                    { label: "Routed To", hide: "hidden @4xl:table-cell" },
                    { label: "Date Received", hide: "" },
                    { label: "Status", hide: "" },
                    { label: "File", hide: "" },
                    { label: "Action", hide: "" },
                  ].map((col) => (
                    <TableCell
                      key={col.label}
                      isHeader
                      className={`px-3 py-3 font-semibold text-primary text-start text-theme-xs dark:text-gray-300 whitespace-nowrap ${col.hide}`}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
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
                      {/* Code */}
                      <TableCell className="px-3 py-3 whitespace-nowrap">
                        <span className="font-mono text-theme-xs font-semibold text-primary dark:text-secondary bg-primary/5 dark:bg-secondary/10 px-2 py-0.5 rounded">
                          {record.code}
                        </span>
                      </TableCell>

                      {/* Subject — fixed width, truncate with title tooltip */}
                      <TableCell className="px-3 py-3 text-gray-800 dark:text-white/90 text-theme-sm font-medium">
                        <span
                          className="block truncate max-w-[160px]"
                          title={record.subject}
                        >
                          {record.subject}
                        </span>
                      </TableCell>

                      {/* From */}
                      <TableCell className="px-3 py-3 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                        <span
                          className="block truncate max-w-[130px]"
                          title={record.from}
                        >
                          {record.from}
                        </span>
                      </TableCell>

                      {/* To */}
                      <TableCell className="hidden @4xl:table-cell px-3 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <span
                          className="block truncate max-w-[130px]"
                          title={record.to}
                        >
                          {record.to}
                        </span>
                      </TableCell>

                      {/* Routed To */}
                      <TableCell className="hidden @4xl:table-cell px-3 py-3 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                        {record.routedTo}
                      </TableCell>

                      {/* Date Received */}
                      <TableCell className="px-3 py-3 text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap">
                        {formatDate(record.dateReceived)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-3 py-3 whitespace-nowrap">
                        <StatusDropdown
                          status={record.status}
                          onChangeStatus={(s) =>
                            handleStatusChange(record.id, s)
                          }
                        />
                      </TableCell>

                      {/* File */}
                      <TableCell className="px-3 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleViewFile(record)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-theme-xs font-medium text-secondary border border-secondary/30 hover:bg-secondary hover:text-white transition-colors duration-150 whitespace-nowrap"
                          title="Open PDF"
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
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                          </svg>
                          View File
                        </button>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="px-3 py-3">
                        <KebabMenu record={record} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer */}
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
  );
}
