import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../ui/table";
import axios from "axios";
import { userUser } from "../../context/UserContext";

// ─── Types ─────────────────────────────────────────────────────

interface InvalidDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  missingFields: string[];
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────

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

// ─── Main Component ──────────────────────────────────────────

export default function InvalidDocumentsTable() {
  const { userId } = userUser();
  const [search, setSearch] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const [data, setData] = useState<InvalidDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const hasFilters = search || filterDateFrom || filterDateTo;

  // Fetch invalid documents from API, filtered by current user
  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await axios.get<{ data: InvalidDocument[]; total: number }>(
          `${apiUrl}/invalid-documents`,
          {
            params: { uploaderId: userId },
          },
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch invalid documents:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const filtered = data.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.fileName.toLowerCase().includes(q);
    const date = new Date(r.createdAt);
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
              placeholder="Search by file name…"
              className={`w-full pr-4 pl-9 ${inputCls}`}
            />
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
          {loading ? (
            <div className="text-theme-sm rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-gray-400 dark:border-white/[0.08] dark:bg-white/[0.03]">
              Loading…
            </div>
          ) : filtered.length === 0 ? (
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
                    {record.fileName}
                  </p>
                  <span className="text-[10px] font-semibold text-danger">
                    {record.missingFields.length} missing
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div>
                    <p className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                      Uploaded At
                    </p>
                    <p className="text-theme-xs mt-0.5 text-gray-700 dark:text-gray-300">
                      {formatDateTime(record.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                      Uploaded At
                    </p>
                    <p className="text-theme-xs mt-0.5 text-gray-700 dark:text-gray-300">
                      {formatDateTime(record.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
                      Missing Fields
                    </p>
                    <p className="text-theme-xs mt-0.5 text-danger">
                      {record.missingFields.join(", ")}
                    </p>
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
                {data.length}
              </span>{" "}
              records
            </p>
          )}
        </div>

        {/* ── Desktop Table (≥ md) ── */}
        <div className="hidden rounded-xl border border-gray-200 bg-white md:block dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="dark:border-white/[0.05]">
                <TableRow>
                  {[
                    "File Name",
                    "Missing Fields",
                    "Uploaded At",
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

              <TableBody className="dark:divide-white/[0.05]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-theme-sm px-5 py-10 text-center text-gray-400"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
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
                        {record.fileName}
                      </TableCell>

                      <TableCell className="text-theme-sm px-3 py-3 text-left font-semibold text-danger dark:text-danger">
                        {record.missingFields.join(", ")}
                      </TableCell>

                      <TableCell className="text-theme-sm px-3 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {formatDateTime(record.createdAt)}
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
                  {data.length}
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
