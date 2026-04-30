import React from "react";
import Link from "next/link";
import { FileText, Plus, TrendingUp, Settings2, UserCheck, Mail, Calendar } from "lucide-react";
import { getDashboardData } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

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
        {/* Metric Cards */}
        <div className="glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-24 h-24" />
          </div>
          <p className="text-white/50 font-medium text-sm mb-2 relative z-10">Cotizaciones (Total)</p>
          <p className="text-4xl font-black relative z-10">{data.metrics.quotesCount}</p>
        </div>
        
        <div className="glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-brand-blue" />
          </div>
          <p className="text-white/50 font-medium text-sm mb-2 relative z-10">Valor Propuesto</p>
          <p className="text-4xl font-black text-brand-blue relative z-10">
            {formatCurrency(data.metrics.totalValue)}
          </p>
        </div>
        
        <div className="glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserCheck className="w-24 h-24 text-brand-emerald" />
          </div>
          <p className="text-white/50 font-medium text-sm mb-2 relative z-10">Leads Capturados</p>
          <p className="text-4xl font-black relative z-10 text-brand-emerald">{data.recentLeads.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quotes */}
        <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-brand-blue" />
              Cotizaciones Recientes
            </h2>
          </div>
          
          <div className="divide-y divide-white/5">
            {data.recentQuotes.length > 0 ? (
              data.recentQuotes.map((quote) => (
                <div key={quote.id} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                  <div>
                    <h3 className="font-bold text-white group-hover:text-brand-blue transition-colors">{quote.clientName}</h3>
                    <p className="text-xs text-white/40 mt-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(quote.createdAt).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-blue">{formatCurrency(quote.total)}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">{quote.clientRut}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <FileText className="w-12 h-12 text-white/10 mb-4" />
                <h3 className="text-lg font-bold text-white/60">No hay cotizaciones</h3>
              </div>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-emerald" />
              Últimos Leads
            </h2>
          </div>
          
          <div className="divide-y divide-white/5">
            {data.recentLeads.length > 0 ? (
              data.recentLeads.map((lead) => (
                <div key={lead.id} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                  <div>
                    <h3 className="font-bold text-white group-hover:text-brand-emerald transition-colors">{lead.name}</h3>
                    <p className="text-xs text-white/40 mt-1">{lead.company || lead.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-brand-emerald/10 text-brand-emerald px-2 py-1 rounded-full border border-brand-emerald/20 font-bold uppercase tracking-tighter">
                      {lead.interest}
                    </span>
                    <p className="text-[10px] text-white/30 mt-2">
                      {new Date(lead.createdAt).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <Mail className="w-12 h-12 text-white/10 mb-4" />
                <h3 className="text-lg font-bold text-white/60">No hay leads nuevos</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
