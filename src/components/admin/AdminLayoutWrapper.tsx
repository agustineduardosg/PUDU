"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export const AdminLayoutWrapper: React.FC<AdminLayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-72 min-h-screen relative overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-blue/10 blur-[100px] rounded-full -ml-32 -mb-32" />

        <div className="relative z-10 p-12">
          {children}
        </div>
      </main>
    </div>
  );
};
