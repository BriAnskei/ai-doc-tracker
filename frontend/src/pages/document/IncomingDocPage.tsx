import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import IncomingDocumentsTable from "../../components/tables/IncomingDocumentsTable";

export default function IncomingDocPage() {
  return (
    <>
      <PageMeta
        title="Incoming Documents | Document Tracking System"
        description="Manage and track all incoming documents — view, update status, and audit changes."
      />
      <PageBreadcrumb pageTitle="Incoming Documents" />
      <div className="space-y-6">
        <ComponentCard title="Incoming Documents">
          <IncomingDocumentsTable />
        </ComponentCard>
      </div>
    </>
  );
}
