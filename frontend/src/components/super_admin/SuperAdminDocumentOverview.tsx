// components/superadmin/SystemDocumentOverview.tsx
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface OverviewStat {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

function TotalIcon({ className }: { className?: string }) {
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
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
      />
    </svg>
  );
}
function InboxIcon({ className }: { className?: string }) {
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
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );
}
function OutboxIcon({ className }: { className?: string }) {
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
        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
      />
    </svg>
  );
}
function ArchiveIcon({ className }: { className?: string }) {
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
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  );
}

const stats: OverviewStat[] = [
  {
    label: "Total Documents",
    value: 3840,
    color: "#465FFF",
    icon: <TotalIcon className="size-5 text-primary dark:text-secondary" />,
  },
  {
    label: "Incoming",
    value: 2100,
    color: "#22C55E",
    icon: <InboxIcon className="size-5 text-success" />,
  },
  {
    label: "Outgoing",
    value: 1200,
    color: "#8B5CF6",
    icon: <OutboxIcon className="size-5 text-violet-500" />,
  },
  {
    label: "Archived",
    value: 540,
    color: "#9CA3AF",
    icon: <ArchiveIcon className="size-5 text-gray-400" />,
  },
];

export default function SystemDocumentOverview() {
  const [isOpen, setIsOpen] = useState(false);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF", "#22C55E", "#8B5CF6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 260,
      type: "area",
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: [2, 2, 2] },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.45, opacityTo: 0 },
    },
    markers: { size: 0, hover: { size: 5 } },
    dataLabels: { enabled: false },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      borderColor: "#F3F4F6",
    },
    xaxis: {
      type: "category",
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { fontSize: "11px", colors: Array(12).fill("#9CA3AF") },
      },
    },
    yaxis: {
      labels: { style: { fontSize: "11px", colors: ["#9CA3AF"] } },
    },
    tooltip: { x: { show: true } },
  };

  const series = [
    {
      name: "Total",
      data: [280, 310, 290, 340, 360, 400, 380, 420, 450, 500, 480, 530],
    },
    {
      name: "Incoming",
      data: [160, 175, 160, 190, 200, 220, 210, 240, 260, 290, 270, 300],
    },
    {
      name: "Outgoing",
      data: [80, 95, 90, 105, 115, 130, 125, 140, 150, 165, 160, 175],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            System Document Overview
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            High-level document flow across the entire system
          </p>
        </div>
        <div className="relative inline-block">
          <button
            className="dropdown-toggle"
            onClick={() => setIsOpen((v) => !v)}
          >
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Export CSV
            </DropdownItem>
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View Report
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Stat pills row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 dark:border-white/[0.06] bg-gray-50/60 dark:bg-white/[0.02]"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-white/[0.05] border border-gray-100 dark:border-white/[0.06] flex-shrink-0">
              {s.icon}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-800 dark:text-white/90 leading-none">
                {s.value.toLocaleString()}
              </p>
              <p className="text-theme-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-3">
        {[
          { label: "Total", color: "#465FFF" },
          { label: "Incoming", color: "#22C55E" },
          { label: "Outgoing", color: "#8B5CF6" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: l.color }}
            />
            <span className="text-theme-xs text-gray-500 dark:text-gray-400">
              {l.label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={260} />
        </div>
      </div>
    </div>
  );
}
