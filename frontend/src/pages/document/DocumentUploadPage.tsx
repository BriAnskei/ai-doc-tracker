import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import axios from "axios";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ---------------------------------------------------------------------------
// Constants & Types
// ---------------------------------------------------------------------------

const PANEL_HEIGHT = "640px" as const;
const PDF_PAGE_WIDTH = 380 as const;
const ACCEPTED_FILE_TYPES = { "application/pdf": [".pdf"] } as const;

type DocumentType = "incoming" | "outgoing";
type ExtractionStatus = "idle" | "extracting" | "done" | "error";

interface IncomingMetadata {
  idCode: string; // system-generated
  subject: string; // extracted (mock)
  from: string; // extracted (mock)
  to: string; // extracted (mock)
  dateReceived: string;
  routedTo: string; // manual
  noticeOfAction: string; // manual
  actionTaken: string; // manual
}

interface OutgoingMetadata {
  idCode: string; // system-generated
  to: string; // extracted (mock)
  datePrepared: string; // extracted (mock)
  subject: string; // extracted (mock)
  dateReceived: string; // system-generated
  receivedBy: string; // system-generated
}

const EMPTY_INCOMING: IncomingMetadata = {
  idCode: "",
  subject: "",
  from: "",
  to: "",
  dateReceived: "",
  routedTo: "",
  noticeOfAction: "",
  actionTaken: "",
};

const EMPTY_OUTGOING: OutgoingMetadata = {
  idCode: "",
  to: "",
  datePrepared: "",
  subject: "",
  dateReceived: "",
  receivedBy: "",
};

type ExtractionResponseType = {
  subject: string;
  from: string;
  to: string;
  date_received: string;
  time_received: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateIdCode() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const dd = String(now.getDate()).padStart(2, "0");
  const seq = Math.floor(1 + Math.random() * 999);
  return `${yyyy}-${dd}-${seq}`;
}

function nowDateTimeLocal() {
  return new Date().toISOString().slice(0, 16);
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useIncomingExtraction() {
  const [status, setStatus] = useState<ExtractionStatus>("idle");
  const [metadata, setMetadata] = useState<IncomingMetadata>(EMPTY_INCOMING);

  const extract = useCallback((_file: File) => {
    setMetadata(EMPTY_INCOMING);
  }, []);

  const updateField = useCallback(
    (field: keyof IncomingMetadata, value: string) => {
      setMetadata((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setMetadata(EMPTY_INCOMING);
  }, []);

  // Helper function
  const formatDateTimeLocal = (date: string, time: string) => {
    const parsed = new Date(`${date} ${time}`);

    if (isNaN(parsed.getTime())) {
      return "";
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");

    const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const setExtractionField = useCallback((payload: ExtractionResponseType) => {
    setMetadata((prev) => ({
      ...prev,
      subject: payload.subject,
      from: payload.from,
      to: payload.to,
      dateReceived: formatDateTimeLocal(
        payload.date_received,
        payload.time_received,
      ),
    }));
  }, []);

  return {
    status,
    metadata,
    extract,
    updateField,
    reset,
    setExtractionField,
    setStatus,
  };
}

function useOutgoingExtraction() {
  const [status, setStatus] = useState<ExtractionStatus>("idle");
  const [metadata, setMetadata] = useState<OutgoingMetadata>(EMPTY_OUTGOING);

  const extract = useCallback((_file: File) => {
    setStatus("extracting");
    setMetadata(EMPTY_OUTGOING);
    setTimeout(() => {
      setMetadata({
        idCode: generateIdCode(),
        to: "Department of Budget and Management",
        datePrepared: "2026-06-10",
        subject: "Transmittal of FY2026 Work and Financial Plan",
        dateReceived: nowDateTimeLocal(),
        receivedBy: "Maria Santos",
      });
      setStatus("done");
    }, 2200);
  }, []);

  const updateField = useCallback(
    (field: keyof OutgoingMetadata, value: string) => {
      setMetadata((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setMetadata(EMPTY_OUTGOING);
  }, []);

  return { status, metadata, extract, updateField, reset };
}

// ---------------------------------------------------------------------------
// Shared UI primitives
// ---------------------------------------------------------------------------

function DropZone({ onFileDrop }: { onFileDrop: (file: File) => void }) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFileDrop(accepted[0]);
    },
    [onFileDrop],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        flex cursor-pointer flex-col items-center justify-center gap-3
        rounded-xl border-2 border-dashed px-6 py-16 transition-colors
        ${
          isDragActive
            ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
            : "border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/[0.03] dark:hover:border-brand-500"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800">
        <svg
          className="h-6 w-6 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          or{" "}
          <span className="font-medium text-brand-500 underline-offset-2 hover:underline">
            click to browse
          </span>{" "}
          · PDF only
        </p>
      </div>
    </div>
  );
}

function PdfPreviewPanel({
  file,
  onClear,
}: {
  file: File;
  onClear: () => void;
}) {
  const [pageCount, setPageCount] = useState(0);
  const fileUrl = useMemo(() => URL.createObjectURL(file), [file]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-white/[0.03]">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-600 dark:bg-red-500/10 dark:text-red-400">
            PDF
          </span>
          <span className="truncate text-xs text-gray-600 dark:text-gray-300">
            {file.name}
          </span>
          {pageCount > 0 && (
            <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
              · {pageCount} {pageCount === 1 ? "page" : "pages"}
            </span>
          )}
        </div>
        <button
          onClick={onClear}
          aria-label="Remove file"
          className="ml-2 shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div
        className="overflow-y-auto rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900"
        style={{ maxHeight: PANEL_HEIGHT }}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setPageCount(numPages)}
          className="flex flex-col items-center gap-3 py-4"
        >
          {Array.from({ length: pageCount }, (_, i) => (
            <Page
              key={`page-${i + 1}`}
              pageNumber={i + 1}
              width={PDF_PAGE_WIDTH}
              renderTextLayer
              renderAnnotationLayer
              className="shadow-md"
            />
          ))}
        </Document>
      </div>
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="grid grid-cols-[180px_1fr] items-center gap-4">
      <div className="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-9 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  readOnly?: boolean;
  systemGenerated?: boolean;
  textarea?: boolean;
  onChange: (value: string) => void;
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
  readOnly = false,
  systemGenerated = false,
  textarea = false,
  onChange,
}: FieldProps) {
  const baseInput = `
    w-full rounded-lg border px-3 text-sm outline-none transition
    ${
      readOnly || systemGenerated
        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-500"
        : `border-gray-200 bg-white text-gray-800 placeholder-gray-400
           focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
           dark:border-gray-700 dark:bg-white/[0.03] dark:text-white/90
           dark:placeholder-gray-600 dark:focus:border-brand-500`
    }
  `;

  return (
    <div className="grid grid-cols-[180px_1fr] items-start gap-4">
      <div className="flex items-center gap-1.5 pt-2">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </label>
        {systemGenerated && (
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gray-400 dark:bg-gray-800 dark:text-gray-600">
            AUTO
          </span>
        )}
      </div>
      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          readOnly={readOnly || systemGenerated}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInput} resize-none py-2`}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly || systemGenerated}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInput} h-9`}
        />
      )}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
        {label}
      </span>
      <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-10 dark:border-gray-700">
      <svg
        className="h-8 w-8 text-gray-300 dark:text-gray-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
        />
      </svg>
      <p className="text-xs text-gray-400 dark:text-gray-600">
        No document uploaded yet
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Incoming Extraction Panel
// ---------------------------------------------------------------------------

function IncomingExtractionPanel({
  status,
  metadata,
  hasFile,
  onFieldChange,
}: {
  status: ExtractionStatus;
  metadata: IncomingMetadata;
  hasFile: boolean;
  onFieldChange: (field: keyof IncomingMetadata, value: string) => void;
}) {
  const isExtracting = status === "extracting";
  const isReady = status === "done";

  return (
    <div
      className="flex flex-col gap-4"
      style={hasFile ? { height: PANEL_HEIGHT } : undefined}
    >
      {/* ── Fixed top: header + extracting badge ── */}
      <div className="shrink-0">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
          Document Details
        </h2>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
          {isExtracting
            ? "Reading the document…"
            : isReady
              ? "Review extracted fields and fill in the required inputs."
              : "Upload a PDF to extract metadata."}
        </p>
      </div>

      {isExtracting && (
        <div className="shrink-0 flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 dark:border-brand-500/30 dark:bg-brand-500/10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
          <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
            Extracting metadata…
          </span>
        </div>
      )}

      {/* ── Scrollable middle: fields only ── */}
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
                onChange={(v) => onFieldChange("idCode", v)}
              />

              <SectionDivider label="Extracted from document" />
              <Field
                label="Subject"
                value={metadata.subject}
                placeholder="e.g. Memorandum on Budget Allocation"
                onChange={(v) => onFieldChange("subject", v)}
              />
              <Field
                label="From"
                value={metadata.from}
                placeholder="e.g. Office of the Director"
                onChange={(v) => onFieldChange("from", v)}
              />
              <Field
                label="To"
                value={metadata.to}
                placeholder="e.g. Finance Division"
                onChange={(v) => onFieldChange("to", v)}
              />
              <Field
                label="Date Received"
                value={metadata.dateReceived}
                placeholder=""
                type="datetime-local"
                onChange={(v) => onFieldChange("dateReceived", v)}
              />

              <SectionDivider label="Requires input" />
              <Field
                label="Routed To"
                value={metadata.routedTo}
                placeholder="e.g. Records Section"
                onChange={(v) => onFieldChange("routedTo", v)}
              />
              <Field
                label="Notice of Action"
                value={metadata.noticeOfAction}
                placeholder="Instructions given by PE…"
                textarea
                onChange={(v) => onFieldChange("noticeOfAction", v)}
              />
              <Field
                label="Action Taken"
                value={metadata.actionTaken}
                placeholder="Personnel/Division action…"
                textarea
                onChange={(v) => onFieldChange("actionTaken", v)}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* ── Fixed bottom: save button ── */}
      {isReady && (
        <div className="shrink-0 border-t border-gray-100 pt-4 dark:border-gray-800">
          <button
            type="button"
            className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 active:scale-[0.98]"
          >
            Save Document
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Outgoing Extraction Panel
// ---------------------------------------------------------------------------

function OutgoingExtractionPanel({
  status,
  metadata,
  hasFile,
  onFieldChange,
}: {
  status: ExtractionStatus;
  metadata: OutgoingMetadata;
  hasFile: boolean;
  onFieldChange: (field: keyof OutgoingMetadata, value: string) => void;
}) {
  const isExtracting = status === "extracting";
  const isReady = status === "done";

  return (
    <div
      className="flex flex-col gap-4"
      style={hasFile ? { height: PANEL_HEIGHT } : undefined}
    >
      {/* ── Fixed top: header + extracting badge ── */}
      <div className="shrink-0">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
          Document Details
        </h2>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
          {isExtracting
            ? "Reading the document…"
            : isReady
              ? "Review and confirm the extracted fields."
              : "Upload a PDF to extract metadata."}
        </p>
      </div>

      {isExtracting && (
        <div className="shrink-0 flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 dark:border-brand-500/30 dark:bg-brand-500/10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
          <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
            Extracting metadata…
          </span>
        </div>
      )}

      {/* ── Scrollable middle: fields only ── */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex flex-col gap-4">
          {isExtracting ? (
            Array.from({ length: 5 }, (_, i) => <FieldSkeleton key={i} />)
          ) : isReady ? (
            <>
              <SectionDivider label="System" />
              <Field
                label="ID Code"
                value={metadata.idCode}
                placeholder="YYYY-DD-#"
                systemGenerated
                onChange={(v) => onFieldChange("idCode", v)}
              />
              <Field
                label="Date Received"
                value={metadata.dateReceived}
                placeholder=""
                type="datetime-local"
                systemGenerated
                onChange={(v) => onFieldChange("dateReceived", v)}
              />
              <Field
                label="Received By"
                value={metadata.receivedBy}
                placeholder="e.g. Maria Santos"
                systemGenerated
                onChange={(v) => onFieldChange("receivedBy", v)}
              />

              <SectionDivider label="Extracted from document" />
              <Field
                label="To"
                value={metadata.to}
                placeholder="e.g. Department of Budget"
                onChange={(v) => onFieldChange("to", v)}
              />
              <Field
                label="Subject"
                value={metadata.subject}
                placeholder="e.g. Transmittal of Work Plan"
                onChange={(v) => onFieldChange("subject", v)}
              />
              <Field
                label="Date Prepared/Released"
                value={metadata.datePrepared}
                placeholder="e.g. 2026-06-10"
                type="date"
                onChange={(v) => onFieldChange("datePrepared", v)}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* ── Fixed bottom: save button ── */}
      {isReady && (
        <div className="shrink-0 border-t border-gray-100 pt-4 dark:border-gray-800">
          <button
            type="button"
            className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 active:scale-[0.98]"
          >
            Save Document
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Document Type Toggle
// ---------------------------------------------------------------------------

function DocumentTypeToggle({
  value,
  onChange,
}: {
  value: DocumentType;
  onChange: (type: DocumentType) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-white/[0.05]">
      {(["incoming", "outgoing"] as DocumentType[]).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`
            flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all
            ${
              value === type
                ? "bg-white text-gray-800 shadow-sm dark:bg-gray-800 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }
          `}
        >
          {type === "incoming" ? (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12M12 7.5V21"
              />
            </svg>
          )}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DocumentUploadPage() {
  const [docType, setDocType] = useState<DocumentType>("incoming");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const incoming = useIncomingExtraction();
  const outgoing = useOutgoingExtraction();

  const extractPdfText = useCallback(async (file: File) => {
    try {
      const arrBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrBuffer }).promise;

      let text = "";
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        const pageText = content.items.map((item: any) => item.str).join(" ");
        text += `\n\n--- PAGE ${pageNum} ---\n${pageText}`;
      }

      return text;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const extractOCR = async (file: File) => {
    try {
      const arrBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrBuffer,
      }).promise;

      let fullText = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        const viewport = page.getViewport({
          scale: 2, //  In production we set this to 1.5 to handle many pages
        });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          canvas,
          viewport,
        }).promise;

        const image = canvas.toDataURL("image/png");

        const result = await Tesseract.recognize(image, "eng", {
          logger: (m) => console.log(m),
        });

        fullText += `\n\n--- PAGE ${pageNum} ---\n`;
        fullText += result.data.text;
      }

      return fullText;
    } catch (error) {
      console.error("OCR error:", error);
    }
  };

  const extractMetadataAi = async (documentText: string) => {
    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-oss-120b:free",
          messages: [
            {
              role: "system",
              content: `
             You are a document information extraction assistant.

          Extract the following information from the document:

          - Subject
          - From
          - To
          - Date recieved
          - Time recieved
   

          Return JSON only.
          Do not include explanations, markdown, or additional text.

          Use this exact JSON format:

          {
            "subject": "string",
            "from": "string",
            "to": "string"
            "date_received": "YYYY-MM-DD",
            "time_received": "HH:mm",
          }

          If any field cannot be found in the document, return an empty string.
          `,
            },
            {
              role: "user",
              content: `
            Extract the information from this document:

            ${documentText}
            `,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      return JSON.parse(
        res.data.choices[0].message.content,
      ) as ExtractionResponseType;
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileDrop = useCallback(
    async (file: File) => {
      setUploadedFile(file);

      if (docType === "incoming") incoming.extract(file);
      else outgoing.extract(file);

      let text = await extractPdfText(file);

      incoming.setStatus("extracting");

      if (!text || text.length <= 50) {
        text = await extractOCR(file);
      }
      const extractionRes = await extractMetadataAi(text!);

      console.log("Exxtraction respponse: ", extractionRes);

      if (extractionRes) {
        incoming.setExtractionField(extractionRes);
        incoming.setStatus("done");
      }
    },
    [docType, incoming, outgoing, extractPdfText],
  );

  const handleClearFile = useCallback(() => {
    setUploadedFile(null);
    incoming.reset();
    outgoing.reset();
  }, [incoming, outgoing]);

  const handleTypeChange = useCallback(
    (type: DocumentType) => {
      setDocType(type);
      setUploadedFile(null);
      incoming.reset();
      outgoing.reset();
    },
    [incoming, outgoing],
  );

  return (
    <div>
      <PageMeta
        title="Document Upload | DTRS"
        description="Upload a PDF document to extract and review its metadata."
      />
      <PageBreadcrumb pageTitle="Document Upload" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {/* Page heading + type toggle */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90 sm:text-2xl">
              Upload
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload a PDF to automatically extract its metadata for routing and
              tracking.
            </p>
          </div>
          <DocumentTypeToggle value={docType} onChange={handleTypeChange} />
        </div>

        {/* Document type indicator strip */}
        <div
          className={`mb-6 flex items-center gap-2.5 rounded-xl border px-4 py-3 ${
            docType === "incoming"
              ? "border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10"
              : "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          }`}
        >
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              docType === "incoming"
                ? "text-blue-600 dark:text-blue-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {docType === "incoming"
              ? "▼ Incoming Document"
              : "▲ Outgoing Document"}
          </span>
          <span
            className={`text-xs ${
              docType === "incoming"
                ? "text-blue-500/70 dark:text-blue-400/60"
                : "text-emerald-500/70 dark:text-emerald-400/60"
            }`}
          >
            {docType === "incoming"
              ? "Documents received by the office"
              : "Documents sent out by the office"}
          </span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left — dropzone or PDF preview */}
          <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
            {uploadedFile ? (
              <PdfPreviewPanel file={uploadedFile} onClear={handleClearFile} />
            ) : (
              <DropZone onFileDrop={handleFileDrop} />
            )}
          </div>

          {/* Right — extraction panel */}
          <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
            {docType === "incoming" ? (
              <IncomingExtractionPanel
                status={incoming.status}
                metadata={incoming.metadata}
                hasFile={uploadedFile !== null}
                onFieldChange={incoming.updateField}
              />
            ) : (
              <OutgoingExtractionPanel
                status={outgoing.status}
                metadata={outgoing.metadata}
                hasFile={uploadedFile !== null}
                onFieldChange={outgoing.updateField}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
