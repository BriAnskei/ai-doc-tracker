// components/admin/NeedsAttentionStrip.tsx
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
  { label: "Pending Validation", value: 120, to: "/upload-queue", valueClass: "text-warning", dotClass: "bg-warning" },
  { label: "Invalid Documents", value: 6, to: "/upload-invalid", valueClass: "text-danger", dotClass: "bg-danger" },
  { label: "Pending OCR Extraction", value: 20, to: "/upload-queue", valueClass: "text-secondary", dotClass: "bg-secondary" },
  { label: "Stale Documents", value: 2, to: "/admin/stale-documents", valueClass: "text-danger", dotClass: "bg-danger" },
  { label: "Failed Uploads", value: 1, to: "/upload-queue", valueClass: "text-accent", dotClass: "bg-accent" },
];

const receiverItems: AttentionItem[] = [
  { label: "Rejected Documents", value: 3, to: "/rejected-documents", valueClass: "text-danger", dotClass: "bg-danger" },
];

export default function NeedsAttentionStrip() {
  const { role } = userUser();
  const items = role === 3 ? receiverItems : adminItems;
  const navigate = useNavigate();
  const visibleItems = items.filter((i) => i.value > 0);

  if (visibleItems.length === 0) return null;

  return (
    <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-warning/20 bg-warning/[0.04] px-3 py-2.5 dark:border-warning/20 dark:bg-warning/[0.04]">
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-warning/10">
        <AlertIcon className="size-4 text-warning" />
      </span>
      <div className="flex flex-1 items-center gap-2 overflow-x-auto">
        {visibleItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.to)}
            className="group flex flex-shrink-0 items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-1.5 transition hover:border-warning/30 dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${item.dotClass}`} />
            <span className={`text-theme-sm font-bold ${item.valueClass}`}>{item.value}</span>
            <span className="text-theme-xs text-gray-500 dark:text-gray-400">{item.label}</span>
            <ArrowRightIcon className="size-3 text-gray-300 opacity-0 transition group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  );
}
