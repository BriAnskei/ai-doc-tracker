// components/admin/NeedsAttentionStrip.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertIcon, ArrowRightIcon } from "../../icons";
import { userUser } from "../../context/UserContext";

interface AttentionItem {
  label: string;
  value: number;
  to: string;
  valueClass: string;
  dotClass: string;
}

const adminItems: AttentionItem[] = [
  { label: "Pending Documents", value: 120, to: "/upload-queue", valueClass: "text-warning", dotClass: "bg-warning" },
  { label: "Stale Documents", value: 2, to: "/admin/stale-documents", valueClass: "text-danger", dotClass: "bg-danger" },
  { label: "Invalid Documents", value: 6, to: "/upload-invalid", valueClass: "text-danger", dotClass: "bg-danger" },
];

const receiverItems: AttentionItem[] = [
  { label: "Invalid Documents", value: 3, to: "/rejected-documents", valueClass: "text-danger", dotClass: "bg-danger" },
];

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function AlertDangerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );
}

export default function NeedsAttentionStrip() {
  const { role } = userUser();
  const items = role === 3 ? receiverItems : adminItems;
  const navigate = useNavigate();
  const visibleItems = items.filter((i) => i.value > 0);
  const [dismissed, setDismissed] = useState(false);

  if (visibleItems.length === 0 || dismissed) return null;

  const hasDanger = visibleItems.some((i) => i.valueClass === "text-danger");
  const stripBg = hasDanger ? "bg-danger/[0.04]" : "bg-warning/[0.04]";
  const stripBorder = hasDanger ? "border-danger/20" : "border-warning/20";
  const stripBgDark = hasDanger ? "dark:bg-danger/[0.04]" : "dark:bg-warning/[0.04]";
  const stripBorderDark = hasDanger ? "dark:border-danger/20" : "dark:border-warning/20";
  const iconBg = hasDanger ? "bg-danger/10" : "bg-warning/10";
  const IconComponent = hasDanger ? AlertDangerIcon : AlertIcon;

  return (
    <div className={`flex items-center gap-3 overflow-x-auto rounded-xl border ${stripBorder} ${stripBg} px-3 py-2.5 ${stripBgDark} ${stripBorderDark}`}>
      <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        <IconComponent className="size-4" />
      </span>
      <div className="flex flex-1 items-center gap-2 overflow-x-auto">
        {visibleItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.to)}
            className="group flex flex-shrink-0 items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-1.5 transition hover:border-danger/30 dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${item.dotClass}`} />
            <span className={`text-theme-sm font-bold ${item.valueClass}`}>{item.value}</span>
            <span className="text-theme-xs text-gray-500 dark:text-gray-400">{item.label}</span>
            <ArrowRightIcon className="size-3 text-gray-300 opacity-0 transition group-hover:opacity-100" />
          </button>
        ))}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        aria-label="Dismiss alert"
      >
        <CloseIcon className="size-4" />
      </button>
    </div>
  );
}
