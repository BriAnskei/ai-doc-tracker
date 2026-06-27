// pages/admin/AdminDashboard.tsx
import AdminMetrics from "../../components/admin/AdminMetrix";
import AdminStatusChart from "../../components/admin/AdminStatusChart";
import DivisionWorkloadCard from "../../components/admin/DivisionWorkloadCard";
import ValidationQueueCard from "../../components/admin/ValidationQueueCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
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
          <ValidationQueueCard />
        </div>

        {/* ── Status Chart ── */}
        <div className="col-span-12 xl:col-span-3">
          <AdminStatusChart />
        </div>

        {/* ── Division Workload ── */}
        <div className="col-span-12 xl:col-span-4">
          <DivisionWorkloadCard />
        </div>
      </div>
    </>
  );
}
