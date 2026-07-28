// components/common/Pagination.tsx
import { ReactNode } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.05]">
      <span className="text-theme-xs text-gray-400 dark:text-gray-500">
        {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-theme-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-primary hover:border-primary/30 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-400 dark:hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40 dark:disabled:text-gray-600"
        >
          ← Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 text-theme-xs font-medium transition-colors ${
              page === currentPage
                ? "bg-primary text-white dark:bg-secondary"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-primary hover:border-primary/30 dark:bg-white/[0.03] dark:border-white/[0.05] dark:text-gray-400 dark:hover:text-secondary"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-theme-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-primary hover:border-primary/30 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-400 dark:hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40 dark:disabled:text-gray-600"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
