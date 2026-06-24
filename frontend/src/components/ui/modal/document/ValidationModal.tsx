import { useState } from "react";

interface ValidationDocument {
  id: number;
  uploaderName: string;
  uploadedAt: string;
  fileUrl: string;
}

interface Props {
  record: ValidationDocument | null;
  onClose: () => void;
  onApprove: (record: ValidationDocument) => void;
  onReject: (record: ValidationDocument, reason: string) => void;
}

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

export default function ValidationModal({
  record,
  onClose,
  onApprove,
  onReject,
}: Props) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  if (!record) return null;

  function handleClose() {
    setIsRejecting(false);
    setRejectionReason("");
    onClose();
  }

  function handleRejectClick() {
    if (!isRejecting) {
      setIsRejecting(true);
      return;
    }
    // record is guaranteed to be non-null here due to the guard above
    onReject(record, rejectionReason);
    handleClose();
  }

  function handleApprove() {
    // record is guaranteed to be non-null here due to the guard above
    onApprove(record);
    handleClose();
  }

  const filename = record.fileUrl.split("/").pop() ?? "document.pdf";

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-gray-900 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 dark:border-white/[0.05] px-6 py-4">
          <div>
            <h2 className="text-theme-sm font-semibold text-gray-900 dark:text-white/90">
              Document Review
            </h2>
            <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
              Uploaded by{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {record.uploaderName}
              </span>{" "}
              · {formatDateTime(record.uploadedAt)}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="mt-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Document preview */}
          <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] px-4 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.05] text-gray-400">
              <svg
                className="w-6 h-6"
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
            </div>
            <div>
              <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                {filename}
              </p>
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                PDF document · Uploaded {formatDateTime(record.uploadedAt)}
              </p>
            </div>
            <a
              href={record.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.05] text-theme-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors"
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Open document
            </a>
          </div>

          {/* Rejection reason (conditional) */}
          {isRejecting && (
            <div className="space-y-1.5">
              <label className="text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Reason for rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason for rejection…"
                rows={3}
                autoFocus
                className="w-full resize-y rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] px-3 py-2 text-theme-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger/50 transition"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 dark:border-white/[0.05] px-6 py-4">
          <button
            onClick={
              isRejecting
                ? () => {
                    setIsRejecting(false);
                    setRejectionReason("");
                  }
                : handleClose
            }
            className="px-3 py-2 text-theme-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-white/[0.08] rounded-lg hover:border-gray-300 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleRejectClick}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-theme-sm font-medium transition-colors ${
              isRejecting
                ? "bg-danger text-white hover:bg-danger/90"
                : "text-danger border border-danger/30 hover:bg-danger hover:text-white"
            }`}
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {isRejecting ? "Confirm rejection" : "Reject document"}
          </button>

          {!isRejecting && (
            <button
              onClick={handleApprove}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-theme-sm font-medium text-success border border-success/30 hover:bg-success hover:text-white transition-colors"
            >
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Approve &amp; proceed to extraction
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
