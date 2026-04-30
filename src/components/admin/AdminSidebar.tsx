"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronRight,
  Plus
} from "lucide-react";
import PuduLogo from "../PuduLogo";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Leads (CRM)", href: "/admin/leads", icon: <Users className="w-5 h-5" /> },
  { name: "Historial CPQ", href: "/admin/history", icon: <FileText className="w-5 h-5" /> },
  { name: "Nuevo Cotizador", href: "/admin/cotizador", icon: <Plus className="w-5 h-5" /> },
  { name: "Configuración", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = "pudu_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#020617] border-r border-white/5 flex flex-col z-40">
      {/* Sidebar Header */}
      <div className="p-8 border-b border-white/5 mb-6">
        <Link href="/admin">
          <PuduLogo color="white" className="h-8 w-24" />
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Control Center
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`relative flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                isActive 
                  ? "text-white bg-brand-blue/10" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`transition-colors ${isActive ? "text-brand-blue" : "group-hover:text-white"}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-bold tracking-tight">{item.name}</span>
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-brand-blue rounded-r-full"
                />
              )}
              
              {isActive && <ChevronRight className="w-4 h-4 text-brand-blue" />}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-white/5">
        <div className="bg-slate-900/50 rounded-2xl p-4 mb-4 border border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-black text-xs">
              AD
            </div>
            <div>
              <p className="text-xs font-bold text-white">Admin PUDU</p>
              <p className="text-[10px] text-white/30">Privilegios Totales</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-bold">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
