"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, 
  Kanban,
  FileText, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronRight,
  Plus,
  X,
  Upload,
  ListTodo,
  MessageSquareText,
  Megaphone,
  Send,
  Instagram,
} from "lucide-react";
import PuduLogo from "../PuduLogo";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Pipeline CRM", href: "/admin/crm", icon: <Kanban className="w-5 h-5" /> },
  { name: "Prospección", href: "/admin/crm/prospects", icon: <Upload className="w-5 h-5" /> },
  { name: "Tareas CRM", href: "/admin/crm/tasks", icon: <ListTodo className="w-5 h-5" /> },
  { name: "Plantillas", href: "/admin/crm/templates", icon: <MessageSquareText className="w-5 h-5" /> },
  { name: "Campañas", href: "/admin/crm/campaigns", icon: <Megaphone className="w-5 h-5" /> },
  { name: "Bandeja de salida", href: "/admin/crm/outbox", icon: <Send className="w-5 h-5" /> },
  { name: "Instagram Inbox", href: "/admin/crm/instagram", icon: <Instagram className="w-5 h-5" /> },
  { name: "Leads Entrantes", href: "/admin/leads", icon: <Users className="w-5 h-5" /> },
  { name: "Historial CPQ", href: "/admin/history", icon: <FileText className="w-5 h-5" /> },
  { name: "Nuevo Cotizador", href: "/admin/cotizador", icon: <Plus className="w-5 h-5" /> },
  { name: "Configuración", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <aside className="h-screen w-72 bg-[#020617] border-r border-white/5 flex flex-col z-40">
      {/* Sidebar Header */}
      <div className="p-8 border-b border-white/5 mb-6 relative">
        <div className="flex items-center justify-between">
          <PuduLogo href="/admin" color="white" className="h-8 w-24" />
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Control Center
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/admin/crm" &&
              pathname.startsWith("/admin/crm/leads/")) ||
            (!["/admin", "/admin/crm"].includes(item.href) &&
              pathname.startsWith(`${item.href}/`));
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
