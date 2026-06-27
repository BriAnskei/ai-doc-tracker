import { useState, useEffect, useRef } from "react";
import Badge from "../../badge/Badge";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatusType = "Completed" | "On-Going" | "Pending";

export interface StatusUpdatePayload {
  newStatus: StatusType;
  reason?: string;
}

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: StatusUpdatePayload) => void;
  currentStatus: StatusType;
  documentCode: string;
  documentSubject: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALL_STATUSES: StatusType[] = ["Completed", "On-Going", "Pending"];

const STATUS_ORDER: Record<StatusType, number> = {
  Pending: 0,
  "On-Going": 1,
  Completed: 2,
};

function isRollback(from: StatusType, to: StatusType): boolean {
  return STATUS_ORDER[to] < STATUS_ORDER[from];
}

function getBadgeColor(status: StatusType) {
  if (status === "Completed") return "success";
  if (status === "On-Going") return "warning";
  return "error";
}

const STATUS_META: Record<
  StatusType,
  { label: string; dot: string; ring: string; text: string }
> = {
  Completed: {
    label: "Completed",
    dot: "bg-success",
    ring: "ring-success/20",
    text: "text-success",
  },
  "On-Going": {
    label: "On-Going",
    dot: "bg-warning",
    ring: "ring-warning/20",
    text: "text-warning",
  },
  Pending: {
    label: "Pending",
    dot: "bg-danger",
    ring: "ring-danger/20",
    text: "text-danger",
  },
};

// ─── Arrow Icon ───────────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-400 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

// ─── Warning Icon ─────────────────────────────────────────────────────────────

function WarningIcon() {
  return (
    <svg
      className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}

// ─── StatusUpdateModal ────────────────────────────────────────────────────────

export default function StatusUpdateModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  documentCode,
  documentSubject,
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<StatusType>(currentStatus);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rollback = isRollback(currentStatus, selectedStatus);
  const unchanged = selectedStatus === currentStatus;

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus);
      setReason("");
      setReasonError(false);
    }
  }, [isOpen, currentStatus]);

  // Focus textarea when rollback is detected
  useEffect(() => {
    if (rollback && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [rollback]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  function handleConfirm() {
    if (rollback && !reason.trim()) {
      setReasonError(true);
      textareaRef.current?.focus();
      return;
    }
    onConfirm({
      newStatus: selectedStatus,
      reason: rollback ? reason.trim() : undefined,
    });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-white/[0.08] flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/[0.08]">
          <div className="space-y-1 pr-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Update Document Status
            </h2>
            <p className="text-theme-xs text-gray-500 dark:text-gray-400 leading-snug">
              <span className="font-mono font-semibold text-primary dark:text-secondary">
                {documentCode}
              </span>{" "}
              &mdash; <span className="truncate">{documentSubject}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/[0.06] dark:hover:text-gray-200 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-5">
          {/* Current → New status preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <span className="text-theme-xs text-gray-400 dark:text-gray-500 font-medium">
                Current
              </span>
              <Badge size="sm" color={getBadgeColor(currentStatus)}>
                {currentStatus}
              </Badge>
            </div>
            <ArrowRightIcon />
            <div className="flex items-center gap-1.5">
              <span className="text-theme-xs text-gray-400 dark:text-gray-500 font-medium">
                New
              </span>
              {unchanged ? (
                <span className="text-theme-xs text-gray-400 dark:text-gray-500 italic">
                  no change
                </span>
              ) : (
                <Badge size="sm" color={getBadgeColor(selectedStatus)}>
                  {selectedStatus}
                </Badge>
              )}
            </div>
          </div>

          {/* Status selector */}
          <div className="space-y-2">
            <label className="block text-theme-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Select New Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ALL_STATUSES.map((s) => {
                const meta = STATUS_META[s];
                const isSelected = selectedStatus === s;
                const isCurrent = currentStatus === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedStatus(s);
                      setReasonError(false);
                      if (!isRollback(currentStatus, s)) setReason("");
                    }}
                    className={`relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 text-left transition-all duration-150 focus:outline-none
                      ${
                        isSelected
                          ? `border-primary dark:border-secondary bg-primary/5 dark:bg-secondary/10 ring-2 ring-primary/10 dark:ring-secondary/20`
                          : "border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/20"
                      }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${meta.dot} ${isSelected ? "ring-4 " + meta.ring : ""} transition-all`}
                    />
                    <span
                      className={`text-theme-xs font-semibold leading-tight text-center ${
                        isSelected
                          ? "text-primary dark:text-secondary"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {meta.label}
                    </span>
                    {isCurrent && (
                      <span className="absolute top-1.5 right-1.5 text-[9px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/[0.06] px-1 rounded">
                        current
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rollback warning + reason */}
          {rollback && (
            <div className="space-y-3">
              <div className="flex gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                <WarningIcon />
                <p className="text-theme-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  You are rolling back the status from{" "}
                  <span className="font-semibold">{currentStatus}</span> to{" "}
                  <span className="font-semibold">{selectedStatus}</span>. A
                  reason is required for audit purposes.
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="block text-theme-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Reason for Rollback{" "}
                  <span className="text-danger normal-case font-normal tracking-normal">
                    *required
                  </span>
                </label>
                <textarea
                  ref={textareaRef}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (e.target.value.trim()) setReasonError(false);
                  }}
                  rows={3}
                  placeholder="Briefly describe why this status is being rolled back…"
                  className={`w-full px-3 py-2.5 text-theme-sm rounded-lg border resize-none bg-white dark:bg-white/[0.03] text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition
                    ${
                      reasonError
                        ? "border-danger ring-2 ring-danger/20 focus:border-danger focus:ring-danger/30"
                        : "border-gray-200 dark:border-white/[0.08] focus:ring-2 focus:ring-secondary/40 focus:border-secondary"
                    }`}
                />
                {reasonError && (
                  <p className="text-theme-xs text-danger">
                    Please provide a reason before confirming.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-2 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-theme-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-white/[0.08] rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={unchanged}
            className={`px-4 py-2 text-theme-sm font-semibold rounded-lg transition-colors focus:outline-none
              ${
                unchanged
                  ? "bg-gray-100 dark:bg-white/[0.05] text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 dark:bg-secondary dark:hover:bg-secondary/90 text-white shadow-sm"
              }`}
          >
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
}
