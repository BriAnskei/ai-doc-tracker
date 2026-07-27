// pages/Dashboard/AdminDashboard.tsx
import NeedsAttention from "../../components/admin/NeedsAttention";
import AdminMetrics from "../../components/admin/AdminMetrix";
import AnalyticsSection from "../../components/admin/AnalyticsSection";
import StaleDocumentsSummary from "../../components/admin/StaleDocumentsSummary";
import QuickActions from "../../components/admin/QuickActions";
import RecentActivity from "../../components/admin/RecentActivity";

import PageMeta from "../../components/common/PageMeta";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-theme-sm mb-3 font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
      {children}
    </h2>
  );
}

export default function AdminDashboard() {
  return (
    <>
      <PageMeta
        title="Admin Dashboard | Document Tracking System"
        description="Monitor system-wide document flow, validation queue, and division workload across the Provincial Engineer's Office."
      />

      <div className="space-y-10">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            {greeting()}, Brian
          </h1>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            Here's what needs your attention today.
          </p>
        </div>

        {/* Hero: actionable items first */}
        <NeedsAttention />

        {/* Overview: the four KPIs */}
        <section>
          <SectionTitle>Overview</SectionTitle>
          <AdminMetrics />
        </section>

        {/* Analytics: merged status / divisions / uploads */}
        <section>
          <SectionTitle>Analytics</SectionTitle>
          <AnalyticsSection />
        </section>

        {/* Operations: collapsed, role-relevant details */}
        <section>
          <SectionTitle>Operations</SectionTitle>
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 xl:col-span-5">
              <StaleDocumentsSummary />
            </div>
            <div className="col-span-12 xl:col-span-7">
              <QuickActions />
            </div>
          </div>
        </section>

        {/* Recent activity feed */}
        <section>
          <SectionTitle>Recent Activity</SectionTitle>
          <RecentActivity />
        </section>
      </div>
    </>
  );
}
