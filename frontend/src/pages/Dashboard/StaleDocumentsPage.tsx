// pages/Dashboard/StaleDocumentsPage.tsx
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import StaleDocumentsCard from "../../components/admin/StaleDocumentCard";

export default function StaleDocumentsPage() {
  return (
    <>
      <PageMeta
        title="Stale Documents | Document Tracking System"
        description="Documents with no status change for 11 or more months."
      />
      <PageBreadcrumb pageTitle="Stale Documents" />
      <div className="space-y-6">
        <ComponentCard title="Stale Incoming Documents">
          <StaleDocumentsCard />
        </ComponentCard>
      </div>
    </>
  );
}
