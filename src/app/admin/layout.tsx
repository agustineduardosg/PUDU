import React from "react";
import { Outfit } from "next/font/google";
import { Metadata } from "next";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Portal | PUDU Dashboard",
  description: "Portal administrativo de PUDU IT Solutions",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-[#020617] text-white dark ${outfit.className}`}>
      <AdminLayoutWrapper>
        {children}
      </AdminLayoutWrapper>
    </div>
  );
}

