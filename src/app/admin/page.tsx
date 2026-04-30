"use client";

import React from "react";
import Link from "next/link";
import { FileText, Plus, Database, TrendingUp, Settings2 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Panel <span className="text-brand-blue">Central</span>
          </h1>
          <p className="text-white/50 text-lg">Bienvenido al motor operativo de PUDU.</p>
        </div>
        
        <Link 
          href="/admin/cotizador"
          className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-colors group shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Generar Nueva Cotización
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Metric Cards placeholder */}
        <div className="glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-24 h-24" />
          </div>
          <p className="text-white/50 font-medium text-sm mb-2 relative z-10">Cotizaciones (Mes)</p>
          <p className="text-4xl font-black relative z-10">0</p>
        </div>
        
        <div className="glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-brand-blue" />
          </div>
          <p className="text-white/50 font-medium text-sm mb-2 relative z-10">Valor Propuesto (Mes)</p>
          <p className="text-4xl font-black text-brand-blue relative z-10">$0</p>
        </div>
        
        <div className="glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database className="w-24 h-24" />
          </div>
          <p className="text-white/50 font-medium text-sm mb-2 relative z-10">Base de Datos</p>
          <p className="text-4xl font-black relative z-10">OK</p>
        </div>
      </div>

      <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-brand-blue" />
            Cotizaciones Recientes
          </h2>
        </div>
        
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-bold text-white/60 mb-1">Aún no hay cotizaciones</h3>
          <p className="text-sm text-white/40 max-w-sm">
            Genera tu primera cotización profesional para que aparezca en este registro.
          </p>
        </div>
      </div>
    </div>
  );
}
