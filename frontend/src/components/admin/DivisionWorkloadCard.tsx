// components/admin/DivisionWorkloadCard.tsx
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface Division {
  name: string;
  count: number;
  color: string;
}

const divisions: Division[] = [
  { name: "Roads Division", count: 30, color: "#465FFF" },
  { name: "Planning Division", count: 20, color: "#22C55E" },
  { name: "Maintenance Division", count: 15, color: "#F59E0B" },
  { name: "Bridge Division", count: 12, color: "#8B5CF6" },
  { name: "Drainage Division", count: 8, color: "#06B6D4" },
];

function WorkloadRow({ name, count, color, max }: Division & { max: number }) {
  const percent = Math.round((count / max) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="block w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
            {count}
          </span>
          <span className="text-theme-xs text-gray-400 dark:text-gray-500 w-8 text-right">
            {percent}%
          </span>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function BuildingIcon({ className }: { className?: string }) {
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
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}

export default function DivisionWorkloadCard() {
  const [isOpen, setIsOpen] = useState(false);
  const max = Math.max(...divisions.map((d) => d.count));
  const total = divisions.reduce((a, d) => a + d.count, 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Division Workload
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Documents assigned per division
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
              View All
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Total callout */}
      <div className="flex items-center gap-3 mb-5 p-3.5 rounded-xl bg-primary/5 dark:bg-secondary/5 border border-primary/10 dark:border-secondary/10">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 dark:bg-secondary/10 flex-shrink-0">
          <BuildingIcon className="size-5 text-primary dark:text-secondary" />
        </div>
        <div>
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">
            Total assigned documents
          </p>
          <p className="text-lg font-bold text-gray-800 dark:text-white/90 mt-0.5">
            {total}
          </p>
        </div>
      </div>

      {/* Workload rows */}
      <div className="space-y-4">
        {divisions.map((div) => (
          <WorkloadRow key={div.name} {...div} max={max} />
        ))}
      </div>
    </div>
  );
}
