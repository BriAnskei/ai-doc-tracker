// components/admin/staleDocumentsData.ts
// Shared stale-document mock data + computation used by both the dashboard
// summary card and the dedicated Stale Documents report page.

export interface StaleDocument {
  trackingNo: string;
  subject: string;
  status: "Pending" | "On-Going";
  lastStatusChange: string; // ISO date string
}

export type StaleTier = "Approaching" | "Overdue";

export interface StaleRow extends StaleDocument {
  days: number;
  tier: StaleTier;
}

// Incoming documents whose status hasn't changed in ~11 months or more.
export const staleDocuments: StaleDocument[] = [
  {
    trackingNo: "DOC-001",
    subject: "Road Widening Proposal - Barangay Sto. Niño",
    status: "Pending",
    lastStatusChange: "2025-07-10",
  },
  {
    trackingNo: "DOC-005",
    subject: "Bridge Structural Assessment Report",
    status: "On-Going",
    lastStatusChange: "2025-08-02",
  },
  {
    trackingNo: "DOC-012",
    subject: "Drainage System Repair Request",
    status: "Pending",
    lastStatusChange: "2025-08-20",
  },
  {
    trackingNo: "DOC-019",
    subject: "Equipment Procurement Endorsement",
    status: "On-Going",
    lastStatusChange: "2025-09-05",
  },
  {
    trackingNo: "DOC-023",
    subject: "Right-of-Way Clearance Application",
    status: "Pending",
    lastStatusChange: "2025-09-14",
  },
];

export const STALE_THRESHOLD_DAYS = 335; // ~11 months
export const OVERDUE_THRESHOLD_DAYS = 365; // 1 year

export function daysSince(dateString: string, now: number = Date.now()): number {
  const then = new Date(dateString).getTime();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export function getStaleRows(now: number = Date.now()): StaleRow[] {
  return staleDocuments
    .map((doc) => {
      const days = daysSince(doc.lastStatusChange, now);
      const tier: StaleTier = days >= OVERDUE_THRESHOLD_DAYS ? "Overdue" : "Approaching";
      return { ...doc, days, tier };
    })
    .filter((doc) => doc.days >= STALE_THRESHOLD_DAYS)
    .sort((a, b) => b.days - a.days);
}

export function getStaleCounts(now: number = Date.now()) {
  const rows = getStaleRows(now);
  return {
    total: rows.length,
    overdue: rows.filter((r) => r.tier === "Overdue").length,
    approaching: rows.filter((r) => r.tier === "Approaching").length,
  };
}
