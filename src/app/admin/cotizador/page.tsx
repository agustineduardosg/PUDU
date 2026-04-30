"use client";

import React, { useState, useRef } from "react";
import { Plus, Trash2, Download, Save, Calculator, Check } from "lucide-react";
import { PdfTemplate } from "@/components/admin/PdfTemplate";

const SERVICES_OPTIONS = [
  { id: "sio-min", name: "Minería (SIO Min)", descBase: "Implementación de Sincronización Operativa 24/7 y Telemetría." },
  { id: "sio-health", name: "Salud (SIO Health)", descBase: "Ecosistema Clínico Seguro e Interoperabilidad SIS/MINSAL." },
  { id: "sio-agro", name: "Agro de Precisión (SIO Agro)", descBase: "Sistema de Gestión Hídrica Inteligente e IoT de Campo." },
  { id: "sio-ind", name: "Industria 4.0 (SIO Ind)", descBase: "Automatización Industrial y Visibilidad Total de Planta." },
  { id: "sio-logistics", name: "Automoción (SIO Logistics)", descBase: "Sincronización de Última Milla y Gestión de Flotas." },
  { id: "sio-ecom", name: "E-commerce (SIO E-com)", descBase: "Plataforma de Venta Omnicanal y Sincronización de Stock." },
  { id: "apps", name: "Desarrollo de Apps", descBase: "Creación de Aplicación Móvil iOS/Android (React Native/Flutter)." },
  { id: "web", name: "Páginas Web Pro", descBase: "Desarrollo Web Next.js/React de Alto Rendimiento." },
  { id: "cctv", name: "Videovigilancia Rural", descBase: "Sistema de Monitoreo Off-Grid con Inteligencia Artificial." },
  { id: "redes", name: "Redes e Infraestructura", descBase: "Diseño e Implementación de Red Corporativa / Backbone." },
  { id: "cybersecurity", name: "Cybersecurity & GovTech", descBase: "Safetica DLP & Compliance Ley 21.719 (Alianza e-know)." },
  { id: "custom", name: "Otro / Personalizado", descBase: "Describe el servicio, asesoría o componente a medida." },
];

export default function QuoteEngine() {
  const [clientData, setClientData] = useState({ name: "", rut: "", email: "", validUntil: "" });
  const [options, setOptions] = useState([
    {
      id: "opt-1",
      title: "Opción 1: Propuesta Principal",
      items: [{ id: "1", serviceId: "web", customName: "", description: "Sitio corporativo optimizado.", quantity: 1, unitPrice: 0 }]
    }
  ]);
  const [applyIva, setApplyIva] = useState(true);
  const [notes, setNotes] = useState("Condiciones de pago: 50% anticipo, 50% contra entrega.");
  const [isGenerating, setIsGenerating] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);

  const handleAddOption = () => {
    setOptions([...options, { 
      id: Date.now().toString(), 
      title: `Opción ${options.length + 1}: Alternativa`, 
      items: [{ id: Date.now().toString() + "-i", serviceId: "web", customName: "", description: "", quantity: 1, unitPrice: 0 }] 
    }]);
  };

  const handleRemoveOption = (optId: string) => {
    if (options.length > 1) {
      setOptions(options.filter(o => o.id !== optId));
    }
  };

  const handleOptionTitleChange = (optId: string, title: string) => {
    setOptions(options.map(o => o.id === optId ? { ...o, title } : o));
  };

  const handleAddItem = (optId: string) => {
    setOptions(options.map(o => o.id === optId ? { 
      ...o, 
      items: [...o.items, { id: Date.now().toString(), serviceId: "web", customName: "", description: "", quantity: 1, unitPrice: 0 }] 
    } : o));
  };

  const handleRemoveItem = (optId: string, itemId: string) => {
    setOptions(options.map(o => {
      if (o.id === optId && o.items.length > 1) {
        return { ...o, items: o.items.filter(i => i.id !== itemId) };
      }
      return o;
    }));
  };

  const handleItemChange = (optId: string, itemId: string, field: string, value: any) => {
    setOptions(options.map(o => {
      if (o.id === optId) {
        return {
          ...o,
          items: o.items.map(item => {
            if (item.id === itemId) {
              const updatedItem = { ...item, [field]: value };
              if (field === "serviceId") {
                const svc = SERVICES_OPTIONS.find(s => s.id === value);
                if (svc && !item.description) {
                  updatedItem.description = svc.descBase;
                }
              }
              return updatedItem;
            }
            return item;
          })
        };
      }
      return o;
    }));
  };

  const generatePDF = async () => {
    if (!pdfRef.current) return;
    setIsGenerating(true);
    
    try {
      // Temporarily display the element for rendering to ensure layout applies cleanly
      pdfRef.current.style.left = "0px";
      pdfRef.current.style.position = "relative";
      
      // Dynamic import to avoid SSR issues with html2pdf
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;

      const currDate = new Date().toISOString().split("T")[0];
      const fnName = clientData.name ? clientData.name.replace(/\s+/g, '_').toUpperCase() : "CLIENTE";
      const filename = `COT_PUDU_${fnName}_${currDate}.pdf`;

      const opt = {
        margin:       0,
        filename:     filename,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak:    { mode: ['css', 'avoid-all', 'legacy'] }
      };

      await html2pdf().set(opt).from(pdfRef.current).save();

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Hubo un error generando el PDF.");
    } finally {
      // Restore position
      if (pdfRef.current) {
        pdfRef.current.style.left = "-9999px";
        pdfRef.current.style.position = "absolute";
      }
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Editor de <span className="text-brand-blue">Cotizaciones</span> (CPQ)</h1>
          <p className="text-white/50">Configura servicios, precios y genera documentos oficiales al instante.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors border border-white/10">
             <Save className="w-4 h-4" />
             Guardar Borrador
           </button>
           <button 
             onClick={generatePDF}
             disabled={isGenerating}
             className="bg-brand-blue hover:bg-brand-blue/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg disabled:opacity-50"
           >
             {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
             {isGenerating ? "Generando..." : "Exportar PDF"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Client Data Wrapper */}
          <div className="glass p-6 rounded-[2rem] border border-white/5">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-blue">
              <span className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center text-xs">1</span>
              Datos del Cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Nombre / Empresa</label>
                <input 
                  type="text" 
                  value={clientData.name}
                  onChange={(e) => setClientData({...clientData, name: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-blue transition-colors" 
                  placeholder="Ej. Minera Escondida"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">RUT</label>
                <input 
                  type="text" 
                  value={clientData.rut}
                  onChange={(e) => setClientData({...clientData, rut: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-blue transition-colors" 
                  placeholder="Ej. 76.123.456-7"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Email Contacto</label>
                <input 
                  type="email" 
                  value={clientData.email}
                  onChange={(e) => setClientData({...clientData, email: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-blue transition-colors" 
                  placeholder="contacto@empresa.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Válida Hasta</label>
                <input 
                  type="text" 
                  value={clientData.validUntil}
                  onChange={(e) => setClientData({...clientData, validUntil: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-blue transition-colors" 
                  placeholder="Ej. 15 Días (o fecha)"
                />
              </div>
            </div>
          </div>

          {/* Options & Services Wrapper */}
          <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-8">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2 text-brand-blue">
                  <span className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center text-xs">2</span>
                  Servicios y Opciones
                </h2>
                <button 
                  onClick={handleAddOption}
                  className="text-xs font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 hover:bg-brand-blue hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-brand-blue/30"
                >
                  <Plus className="w-3 h-3" /> Añadir Opción
                </button>
             </div>

             {options.map((opt, optIndex) => (
               <div key={opt.id} className="bg-slate-900/50 rounded-2xl p-5 border border-white/10 relative">
                 {options.length > 1 && (
                    <button 
                      onClick={() => handleRemoveOption(opt.id)}
                      className="absolute right-4 top-4 text-white/30 hover:text-red-400 transition-colors"
                      title="Eliminar Opción"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                 )}
                 
                 <div className="mb-6">
                   <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Título de la Opción</label>
                   <input 
                     type="text" 
                     value={opt.title}
                     onChange={(e) => handleOptionTitleChange(opt.id, e.target.value)}
                     className="w-full md:w-2/3 bg-transparent border-b border-white/20 px-1 py-2 outline-none focus:border-brand-blue transition-colors text-white font-bold text-lg" 
                     placeholder="Ej. Opción 1: Sistema Básico"
                   />
                 </div>

                 <div className="space-y-4">
                    {opt.items.map((item) => (
                      <div key={item.id} className="bg-slate-900/80 border border-white/5 p-4 rounded-xl relative group">
                        {opt.items.length > 1 && (
                          <button 
                            onClick={() => handleRemoveItem(opt.id, item.id)}
                            className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        <div className="grid grid-cols-12 gap-4">
                          {/* Select Service */}
                          <div className="col-span-12 md:col-span-4 flex flex-col gap-2">
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Vertical de Servicio</label>
                              <select 
                                value={item.serviceId}
                                onChange={(e) => handleItemChange(opt.id, item.id, "serviceId", e.target.value)}
                                className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2.5 outline-none focus:border-brand-blue text-sm appearance-none"
                              >
                                {SERVICES_OPTIONS.map(svc => (
                                  <option key={svc.id} value={svc.id}>{svc.name}</option>
                                ))}
                              </select>
                            </div>
                            {item.serviceId === "custom" && (
                              <div className="animate-in fade-in slide-in-from-top-2">
                                <input 
                                  type="text" 
                                  value={item.customName || ""}
                                  onChange={(e) => handleItemChange(opt.id, item.id, "customName", e.target.value)}
                                  placeholder="Nombre del servicio..."
                                  className="w-full bg-brand-blue/10 border border-brand-blue/30 rounded-lg px-3 py-2 outline-none focus:border-brand-blue text-sm text-brand-blue placeholder:text-brand-blue/50"
                                />
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <div className="col-span-12 md:col-span-8">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Descripción Detallada</label>
                            <input 
                              type="text" 
                              value={item.description}
                              onChange={(e) => handleItemChange(opt.id, item.id, "description", e.target.value)}
                              className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand-blue text-sm"
                            />
                          </div>

                          {/* Quantity */}
                          <div className="col-span-6 md:col-span-3">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Cantidad</label>
                            <input 
                              type="number" 
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(opt.id, item.id, "quantity", parseInt(e.target.value) || 1)}
                              className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand-blue text-sm text-center"
                            />
                          </div>
                          
                          {/* Unit Price */}
                          <div className="col-span-6 md:col-span-5">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Valor Unitario (CLP)</label>
                            <input 
                              type="number" 
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(opt.id, item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                              className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-brand-blue text-sm text-right"
                            />
                          </div>

                          {/* Subtotal Item */}
                          <div className="col-span-12 md:col-span-4 flex flex-col justify-end">
                            <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-right">
                              <span className="text-[10px] text-white/40 block">Total Ítem</span>
                              <span className="font-bold text-brand-blue text-sm">
                                $ {new Intl.NumberFormat('es-CL').format(item.quantity * item.unitPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>

                 <button 
                    onClick={() => handleAddItem(opt.id)}
                    className="mt-4 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Agregar Ítem a esta Opción
                 </button>
               </div>
             ))}
          </div>

          {/* Notes */}
          <div className="glass p-6 rounded-[2rem] border border-white/5">
             <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-brand-blue">
              <span className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center text-xs">3</span>
              Términos y Condiciones
             </h2>
             <textarea 
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-blue transition-colors min-h-[100px] text-sm"
             />
          </div>

        </div>

        {/* Totals & Calc Sidebar */}
        <div className="lg:col-span-4">
           <div className="glass p-6 rounded-[2rem] border border-white/5 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-brand-blue">
                <Calculator className="w-5 h-5" />
                <h3 className="font-bold text-lg">Resumen de Cotización</h3>
              </div>

              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {options.map((opt, i) => {
                  const optSubtotal = opt.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
                  const optIva = applyIva ? optSubtotal * 0.19 : 0;
                  const optTotal = optSubtotal + optIva;
                  return (
                    <div key={opt.id} className="bg-slate-900/80 rounded-xl p-4 border border-white/10">
                      <h4 className="font-bold text-white mb-3 text-sm border-b border-white/5 pb-2">{opt.title}</h4>
                      <div className="flex justify-between items-center text-xs text-white/60 mb-2">
                        <span>Subtotal:</span>
                        <span>$ {new Intl.NumberFormat('es-CL').format(optSubtotal)}</span>
                      </div>
                      {applyIva && (
                        <div className="flex justify-between items-center text-xs text-white/60 mb-2">
                          <span>IVA (19%):</span>
                          <span>$ {new Intl.NumberFormat('es-CL').format(optIva)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-3 pt-2 text-brand-blue font-black border-t border-brand-blue/20">
                        <span>Total C/ IVA:</span>
                        <span>$ {new Intl.NumberFormat('es-CL').format(optTotal)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10 mb-6">
                <span className="text-sm font-bold text-white/70">Emitir con IVA (19%)</span>
                {/* Toggle Switch */}
                <div 
                  onClick={() => setApplyIva(!applyIva)}
                  className={`w-12 h-6 rounded-full cursor-pointer p-1 transition-colors relative flex items-center ${applyIva ? 'bg-brand-blue' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${applyIva ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <button 
                onClick={generatePDF}
                disabled={isGenerating}
                className="w-full bg-gradient-fire text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100"
              >
                {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-5 h-5" />}
                {isGenerating ? "Procesando Documento..." : "Finalizar y Generar PDF"}
              </button>
           </div>
        </div>
      </div>

      {/* Hidden Render Container for PDF */}
      <div className="fixed overflow-hidden w-0 h-0" style={{ pointerEvents: "none" }}>
         <PdfTemplate 
            ref={pdfRef}
            clientName={clientData.name}
            clientRut={clientData.rut}
            clientEmail={clientData.email}
            validUntil={clientData.validUntil}
            options={options}
            applyIva={applyIva}
            notes={notes}
            date={new Date().toLocaleDateString('es-CL')}
         />
      </div>

    </div>
  );
}
