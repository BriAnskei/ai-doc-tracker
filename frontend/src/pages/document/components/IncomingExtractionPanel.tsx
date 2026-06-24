import React from "react";
import Field from "./Field";
import SectionDivider from "./SectionDivider";
import EmptyState from "./EmptyState";
import FieldSkeleton from "./FieldSkeleton";
import { IncomingMetadata, ExtractionStatus } from "./types";

interface Props {
  status: ExtractionStatus;
  metadata: IncomingMetadata;
  hasFile: boolean;
  onFieldChange: (field: keyof IncomingMetadata, value: string) => void;
}

export default function IncomingExtractionPanel({
  status,
  metadata,
  hasFile,
  onFieldChange,
}: Props) {
  const isExtracting = status === "extracting";
  const isReady = status === "done";

  return (
    <div
      className="flex flex-col gap-4"
      style={hasFile ? { height: "640px" } : undefined}
    >
      {/* Header */}
      <div className="shrink-0">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
          Document Details
        </h2>
        <p className="mt-0.5 text-theme-xs text-gray-400 dark:text-gray-500">
          {isExtracting
            ? "Reading the document…"
            : isReady
            ? "Review extracted fields and fill in the required inputs."
            : "Upload a PDF to extract metadata."}
        </p>
      </div>

      {isExtracting && (
        <div className="shrink-0 flex items-center gap-2 rounded-lg border border-secondary/30 bg-secondary/5 px-3 py-2 dark:border-secondary/20 dark:bg-secondary/10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
          </span>
          <span className="text-theme-xs font-medium text-secondary dark:text-secondary">
            Extracting metadata…
          </span>
        </div>
      )}

      {/* Fields */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex flex-col gap-4">
          {isExtracting ? (
            Array.from({ length: 6 }, (_, i) => <FieldSkeleton key={i} />)
          ) : isReady ? (
            <>
              <SectionDivider label="System" />
              <Field
                label="ID Code"
                value={metadata.idCode}
                placeholder="YYYY-DD-#"
                systemGenerated
                onChange={(v: string) => onFieldChange("idCode", v)}
              />

              <SectionDivider label="Extracted from document" />
              <Field label="Subject" value={metadata.subject} placeholder="e.g. Memorandum on Budget Allocation" onChange={(v: string) => onFieldChange("subject", v)} />
              <Field label="From" value={metadata.from} placeholder="e.g. Office of the Director" onChange={(v: string) => onFieldChange("from", v)} />
              <Field label="To" value={metadata.to} placeholder="e.g. Finance Division" onChange={(v: string) => onFieldChange("to", v)} />
              <Field label="Date Received" value={metadata.dateReceived} placeholder="" type="datetime-local" onChange={(v: string) => onFieldChange("dateReceived", v)} />

              <SectionDivider label="Requires input" />
              <Field label="Routed To" value={metadata.routedTo} placeholder="e.g. Records Section" onChange={(v: string) => onFieldChange("routedTo", v)} />
              <Field label="Notice of Action" value={metadata.noticeOfAction} placeholder="Instructions given by PE…" textarea onChange={(v: string) => onFieldChange("noticeOfAction", v)} />
              <Field label="Action Taken" value={metadata.actionTaken} placeholder="Personnel/Division action…" textarea onChange={(v: string) => onFieldChange("actionTaken", v)} />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Save button */}
      {isReady && (
        <div className="shrink-0 border-t border-gray-100 pt-4 dark:border-gray-800">
          <button
            type="button"
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-theme-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98]"
          >
            Save Document
          </button>
        </div>
      )}
    </div>
  );
}
