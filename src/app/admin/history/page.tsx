import React from "react";
import { getAllQuotes } from "@/app/actions";
import { FileText, Calendar, User, CreditCard, ExternalLink, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const quotes = await getAllQuotes();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Historial <span className="text-brand-blue">CPQ</span>
        </h1>
        <p className="text-white/50 text-lg">Registro histórico de todas las propuestas comerciales emitidas.</p>
      </div>

      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-blue" />
            Cotizaciones Guardadas ({quotes.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">ID / Fecha</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Cliente</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Monto Total</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Vence el</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quotes.length > 0 ? (
                quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-brand-blue/60 mb-1">#{quote.id.slice(-6).toUpperCase()}</span>
                        <span className="text-xs text-white/60 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(quote.createdAt).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-brand-blue transition-colors">{quote.clientName}</span>
                        <span className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{quote.clientRut}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-black text-brand-blue">
                        {formatCurrency(quote.total)}
                      </span>
                    </td>
                    <td className="p-6 text-xs text-white/40">
                      {quote.validUntil}
                    </td>
                    <td className="p-6">
                      <div className="flex -space-x-2">
                        {quote.items.map((item, idx) => (
                          <div 
                            key={item.id} 
                            className="w-6 h-6 rounded-full bg-white/10 border border-[#020617] flex items-center justify-center text-[8px] font-bold text-white/60"
                            title={item.description}
                          >
                            {idx + 1}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <FileText className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white/60">No hay cotizaciones registradas</h3>
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

