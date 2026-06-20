import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import OutgoingDocumentsTable from "../../components/tables/OutgoingDocumentsTable";

export default function OutgoingDocPage() {
  return (
    <>
      <PageMeta
        title="Outgoing Documents | Document Tracking System"
        description="Manage and track all outgoing documents — view, update status, and audit changes."
      />
      <PageBreadcrumb pageTitle="Outgoing Documents" />
      <div className="space-y-6">
        <ComponentCard title="Outgoing Documents">
          <OutgoingDocumentsTable />
        </ComponentCard>
      </div>
    </>
  );
}
