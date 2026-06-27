// components/admin/ValidationQueueCard.tsx
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";

interface QueueStatProps {
  label: string;
  value: number;
  sub: string;
  accent: string;
  iconBg: string;
  icon: React.ReactNode;
}

function QueueStat({
  label,
  value,
  sub,
  accent,
  iconBg,
  icon,
}: QueueStatProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
      <div
        className={`flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-theme-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className={`text-2xl font-bold mt-0.5 ${accent}`}>{value}</p>
        <p className="text-theme-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {sub}
        </p>
      </div>
    </div>
  );
}

function AlertIcon({ className }: { className?: string }) {
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
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

// Simulated queue items
const queueItems = [
  {
    code: "DOC-2024-087",
    subject: "Road Widening Proposal",
    uploader: "J. Reyes",
  },
  {
    code: "DOC-2024-086",
    subject: "Bridge Inspection Report",
    uploader: "M. Santos",
  },
  {
    code: "DOC-2024-085",
    subject: "Equipment Request Form",
    uploader: "L. Cruz",
  },
];

export default function ValidationQueueCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Validation Queue
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            AI-flagged documents awaiting review
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <QueueStat
          label="Needs Review"
          value={20}
          sub="pending AI flags"
          accent="text-warning"
          iconBg="bg-warning/10"
          icon={<AlertIcon className="size-5 text-warning" />}
        />
        <QueueStat
          label="Approved Today"
          value={50}
          sub="cleared by admin"
          accent="text-success"
          iconBg="bg-success/10"
          icon={<CheckIcon className="size-5 text-success" />}
        />
      </div>

      {/* Queue List */}
      <div className="space-y-2">
        {queueItems.map((item) => (
          <div
            key={item.code}
            className="flex items-center justify-between rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] hover:bg-warning/5 dark:hover:bg-warning/5 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90 truncate">
                  {item.subject}
                </p>
                <p className="text-theme-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {item.code} · {item.uploader}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
