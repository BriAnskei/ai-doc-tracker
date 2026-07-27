// components/admin/QuickActions.tsx
import { useNavigate } from "react-router";
import { PlugInIcon, Document, ArrowRightIcon } from "../../icons";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Upload Documents",
      to: "/upload-direct",
      icon: <PlugInIcon className="size-5" />,
      description: "Add a new document to the system",
    },
    {
      label: "Go to Validation",
      to: "/upload-queue",
      icon: <Document className="size-5" />,
      description: "Review the validation queue",
    },
    {
      label: "View Incoming",
      to: "/incoming",
      icon: <ArrowRightIcon className="size-5" />,
      description: "Browse incoming documents",
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Quick Actions</h3>
      <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
        Jump straight into common tasks
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.to)}
            className="group flex flex-col items-start rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-brand-500/30 hover:bg-brand-500/[0.03] dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-500 shadow-theme-xs dark:bg-white/10">
              {a.icon}
            </span>
            <span className="text-theme-sm mt-3 font-medium text-gray-800 dark:text-white/90">
              {a.label}
            </span>
            <span className="text-theme-xs mt-0.5 text-gray-500 dark:text-gray-400">{a.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
