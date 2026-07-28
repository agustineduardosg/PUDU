"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { Menu, X } from "lucide-react";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export const AdminLayoutWrapper: React.FC<AdminLayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Header Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <Menu 
          className="w-6 h-6 text-white cursor-pointer" 
          onClick={() => setSidebarOpen(true)}
        />
        <span className="text-xs font-black uppercase tracking-widest text-brand-blue">Control Center</span>
        <div className="w-6" /> {/* Placeholder for balance */}
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative overflow-hidden w-full">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-blue/10 blur-[100px] rounded-full -ml-32 -mb-32" />

        <div className="relative z-10 p-6 lg:p-12 mt-16 lg:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

