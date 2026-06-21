import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import CompanyLogo from "../../components/logo/CompanyLogo";

export default function AuthLayout({
  children,
  forceLightLogo = false,
}: {
  children: React.ReactNode;
  forceLightLogo?: boolean;
}) {
  return (
    <div className="relative p-6 bg-background z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-primary dark:bg-primary lg:grid">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-5">
                <CompanyLogo size={176} forceLight={forceLightLogo} />
              </Link>
              <h2 className="mb-2 text-lg font-semibold text-center text-white">
                Document Tracking System
              </h2>
              <p className="text-sm text-center text-white/70">
                Provincial Engineering Office — internal records and document
                routing portal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
