// components/admin/UploadQueueCard.tsx
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

function QueueStat({ label, value, sub, accent, iconBg, icon }: QueueStatProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-theme-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
          {label}
        </p>
        <p className={`mt-0.5 text-2xl font-bold ${accent}`}>{value}</p>
        <p className="text-theme-xs mt-0.5 text-gray-500 dark:text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14" />
    </svg>
  );
}

function RouteIcon({ className }: { className?: string }) {
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

export default function UploadQueueCard() {
  const [isOpen, setIsOpen] = useState(false);

  const goToUpload = (code?: string) => {
    // Redirect into the upload page, deep-linking to a specific doc's
    // extraction/routing flow when one is clicked from the list.
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Upload Queue</h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            Documents awaiting extraction & routing
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
                goToUpload();
              }}
              className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Go to Upload Page
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <QueueStat
          label="Pending Extraction"
          value={20}
          sub="awaiting processing"
          accent="text-warning"
          iconBg="bg-warning/10"
          icon={<UploadIcon className="text-warning size-5" />}
        />
        <QueueStat
          label="Routed Today"
          value={50}
          sub="sent to recipients"
          accent="text-success"
          iconBg="bg-success/10"
          icon={<RouteIcon className="text-success size-5" />}
        />
      </div>

      {/* Queue List */}
      <div className="space-y-2">
        {queueItems.map((item) => (
          <button
            key={item.code}
            onClick={() => goToUpload(item.code)}
            className="hover:bg-warning/5 dark:hover:bg-warning/5 group flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left transition-colors dark:border-white/[0.05] dark:bg-white/[0.02]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="bg-warning h-1.5 w-1.5 flex-shrink-0 rounded-full" />
              <div className="min-w-0">
                <p className="text-theme-sm truncate font-medium text-gray-800 dark:text-white/90">
                  {item.subject}
                </p>
                <p className="text-theme-xs mt-0.5 text-gray-400 dark:text-gray-500">
                  {item.code} · {item.uploader}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer CTA */}
      <button
        onClick={() => goToUpload()}
        className="text-theme-sm mt-4 w-full rounded-xl border border-gray-200 py-2.5 font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.03]"
      >
        Go to Upload Page
      </button>
    </div>
  );
}
