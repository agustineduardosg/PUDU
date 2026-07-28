import React from "react";
import Link from "next/link";
import { FileText, Plus, TrendingUp, Settings2, UserCheck, Mail, Calendar, Database } from "lucide-react";
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
      {data.metrics.dbStatus === "ERROR" && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-8 flex items-center gap-4 text-red-400">
          <Database className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Error de Conexión a Base de Datos</p>
            <p className="text-xs opacity-70">
              {"errorMessage" in data.metrics
                ? data.metrics.errorMessage
                : "No fue posible conectar con la base de datos."}
            </p>
          </div>
        </div>
      )}
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
        <div className="bg-[#0f172a]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText className="w-24 h-24" />
          </div>
          <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-4 relative z-10">Cotizaciones (Total)</p>
          <p className="text-5xl font-black relative z-10 tracking-tighter">{data.metrics.quotesCount}</p>
        </div>
        
        <div className="bg-[#0f172a]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-24 h-24 text-brand-blue" />
          </div>
          <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-4 relative z-10">Valor Propuesto</p>
          <p className="text-5xl font-black text-brand-blue relative z-10 tracking-tighter">
            {formatCurrency(data.metrics.totalValue)}
          </p>
        </div>
        
        <div className="bg-[#0f172a]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserCheck className="w-24 h-24 text-brand-emerald" />
          </div>
          <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-4 relative z-10">Leads Capturados</p>
          <p className="text-5xl font-black relative z-10 text-brand-emerald tracking-tighter">{data.recentLeads.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quotes */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-brand-blue" />
              Cotizaciones Recientes
            </h2>
          </div>
          
          <div className="divide-y divide-white/5">
            {data.recentQuotes.length > 0 ? (
              data.recentQuotes.map((quote) => (
                <div key={quote.id} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                  <div>
                    <h3 className="font-bold text-white group-hover:text-brand-blue transition-colors text-sm">{quote.clientName}</h3>
                    <p className="text-[10px] text-white/40 mt-1 flex items-center gap-2 uppercase tracking-wide">
                      <Calendar className="w-3 h-3" />
                      {new Date(quote.createdAt).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-blue text-sm">{formatCurrency(quote.total)}</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-widest font-mono">{quote.clientRut}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center opacity-40">
                <FileText className="w-12 h-12 mb-4" />
                <h3 className="text-sm font-bold">No hay cotizaciones</h3>
              </div>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-emerald" />
              Últimos Leads
            </h2>
          </div>
          
          <div className="divide-y divide-white/5">
            {data.recentLeads.length > 0 ? (
              data.recentLeads.map((lead) => (
                <div key={lead.id} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                  <div>
                    <h3 className="font-bold text-white group-hover:text-brand-emerald transition-colors text-sm">{lead.name}</h3>
                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wide truncate max-w-[150px] md:max-w-none">{lead.company || lead.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] bg-brand-emerald/10 text-brand-emerald px-2 py-1 rounded-full border border-brand-emerald/20 font-black uppercase tracking-widest">
                      {lead.interest}
                    </span>
                    <p className="text-[9px] text-white/20 mt-2 font-mono">
                      {new Date(lead.createdAt).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center opacity-40">
                <Mail className="w-12 h-12 mb-4" />
                <h3 className="text-sm font-bold">No hay leads nuevos</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
