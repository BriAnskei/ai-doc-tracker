// pages/admin/AdminDashboard.tsx
import AdminMetrics from "../../components/admin/AdminMetrix";
import AdminStatusChart from "../../components/admin/AdminStatusChart";
import DivisionWorkloadCard from "../../components/admin/DivisionWorkloadCard";
import StaleDocumentsCard from "../../components/admin/StaleDocumentCard";
import UploadQueueCard from "../../components/admin/UploadQueueCard";

import PageMeta from "../../components/common/PageMeta";

export default function AdminDashboard() {
  return (
    <>
      <PageMeta
        title="Admin Dashboard | Document Tracking System"
        description="Monitor system-wide document flow, validation queue, and division workload across the Provincial Engineer's Office."
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* ── Metrics Row ── */}
        <div className="col-span-12">
          <AdminMetrics />
        </div>

        {/* ── Validation Queue ── */}
        <div className="col-span-12 xl:col-span-5">
          <UploadQueueCard />
        </div>

        {/* ── Status Chart ── */}
        <div className="col-span-12 xl:col-span-3">
          <AdminStatusChart />
        </div>

        {/* ── Division Workload ── */}
        <div className="col-span-12 xl:col-span-4">
          <DivisionWorkloadCard />
        </div>

        {/* ── Stale Incoming Documents ── */}
        <div className="col-span-12">
          <StaleDocumentsCard />
        </div>
      </div>
    </>
  );
}
