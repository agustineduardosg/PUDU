import React from "react";
import { getAllLeads } from "@/app/actions";
import { Users, Mail, Calendar, Building2, MessageSquare, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getAllLeads();

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Prospectos <span className="text-brand-emerald">(CRM)</span>
        </h1>
        <p className="text-white/50 text-lg">Gestiona y haz seguimiento a las consultas entrantes.</p>
      </div>

      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-emerald" />
            Registro de Contactos ({leads.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Fecha</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Nombre / Empresa</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Contacto</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Industria</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Mensaje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">
                          {new Date(lead.createdAt).toLocaleDateString('es-CL')}
                        </span>
                        <span className="text-[10px] text-white/30">
                          {new Date(lead.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-brand-emerald transition-colors">{lead.name}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Building2 className="w-3 h-3 text-white/20" />
                          <span className="text-xs text-white/40">{lead.company || "Personal"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <a href={`mailto:${lead.email}`} className="text-xs text-brand-emerald hover:underline flex items-center gap-1.5">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </a>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[10px] bg-brand-emerald/10 text-brand-emerald px-3 py-1.5 rounded-full border border-brand-emerald/20 font-bold uppercase tracking-tight">
                        {lead.interest}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="max-w-xs">
                        <p className="text-sm text-white/60 line-clamp-2 italic">"{lead.message}"</p>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white/60">No hay prospectos aún</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
