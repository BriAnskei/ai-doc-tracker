import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ValidationQueueTable from "../../components/tables/ValidationQueueTable";

export default function ValidationQueuePage() {
  return (
    <>
      <PageMeta
        title="Validation Queue | Document Tracking System"
        description="Review and validate uploaded documents before they enter the tracking system."
      />
      <PageBreadcrumb pageTitle="Validation Queue" />
      <div className="space-y-6">
        <ComponentCard title="Validation Queue">
          <ValidationQueueTable />
        </ComponentCard>
      </div>
    </>
  );
}
