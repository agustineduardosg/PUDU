"use client";

import React, { useState } from "react";
import { Send, Phone, Mail, MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import PuduLogo from "./PuduLogo";
import { submitContactForm } from "@/app/actions";

export const ContactForm = ({ preselectedIndustry, themeColor }: { preselectedIndustry?: string; themeColor?: string }) => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto glass rounded-[2.5rem] overflow-hidden shadow-2xl border-border/10">
          <div className="flex flex-col lg:flex-row">
            {/* Info Side */}
            <div className="lg:w-2/5 bg-black p-12 text-white flex flex-col justify-between">
              <div>
                <PuduLogo color="white" className="h-10 w-28 mb-8" />
                <h2 className="text-4xl font-black mb-6">Tu industria está lista para el siguiente nivel. ¿Lo estás tú?</h2>
                <p className="text-white/60 mb-12">
                  Ya sea que necesites escalar un sistema legado, automatizar tu cadena logística o digitalizar procesos clínicos, estamos aquí para ejecutar tu Prime Utility Digital Upgrade.
                </p>

                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-brand-emerald" />
                    </div>
                    <div>
                      <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Teléfono</div>
                      <div className="text-lg">+56 9 6904 0587</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div>
                      <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Email</div>
                      <div className="text-lg">agustineduardosg@puduit.tech</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-brand-fire-start" />
                    </div>
                    <div>
                      <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Ubicación</div>
                      <div className="text-lg">Santiago, Chile</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-white/10">
                <p className="text-sm text-white/40 italic">
                  &quot;Tu visión, nuestra precisión técnica.&quot;
                </p>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:w-3/5 p-12 bg-background/50 backdrop-blur-xl">
              <ContactFormInner preselectedIndustry={preselectedIndustry} themeColor={themeColor} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactFormInner = ({ preselectedIndustry, themeColor }: { preselectedIndustry?: string; themeColor?: string }) => {
  const [state, setState] = useState<{ success?: string; error?: string }>({});
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setState({});
    
    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);
    
    if (result.error) {
      setState({ error: result.error });
    } else {
      setState({ success: result.success });
      (e.target as HTMLFormElement).reset();
    }
    setIsPending(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {state.success && (
        <div className="p-4 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-bold">{state.success}</p>
        </div>
      )}
      {state.error && (
        <div className="p-4 rounded-2xl bg-brand-fire-start/10 border border-brand-fire-start/20 text-brand-fire-start flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-bold">{state.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1">Nombre Completo</label>
          <input 
            name="name"
            type="text" 
            required
            placeholder="Ej: Juan Pérez"
            className="w-full px-6 py-4 rounded-2xl bg-background border border-foreground/10 focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1">Empresa / Cargo</label>
          <input 
            name="company"
            type="text" 
            placeholder="Ej: Minera Norte / Gerente TI"
            className="w-full px-6 py-4 rounded-2xl bg-background border border-foreground/10 focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold ml-1">Correo Corporativo</label>
        <input 
          name="email"
          type="email" 
          required
          placeholder="juan@empresa.cl"
          className="w-full px-6 py-4 rounded-2xl bg-white border border-foreground/10 focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold ml-1">Área de Interés</label>
        <select 
          name="interest"
          defaultValue={preselectedIndustry || "Transformación Digital General"}
          className="w-full px-6 py-4 rounded-2xl bg-white border border-foreground/10 focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 outline-none transition-all appearance-none cursor-pointer"
          style={themeColor ? { borderColor: `${themeColor}33`, focusVisible: { borderColor: themeColor } } as any : {}}
        >
          <option value="Transformación Digital General">Transformación Digital General</option>
          <option value="mineria">Minería (Telemetría y Seguridad)</option>
          <option value="healthcare">Healthcare (Salud Conectada e Interoperabilidad)</option>
          <option value="agricultura">Agricultura (Agro-Tecnología y Eficiencia Hídrica)</option>
          <option value="industrial">Industrial (Manufactura e Inteligencia OEE)</option>
          <option value="automocion">Automoción (Movilidad y Flotas Inteligentes)</option>
          <option value="Integración IA y Datos">Integración IA y Datos</option>
          <option value="Ciberseguridad y Monitoreo">Ciberseguridad y Monitoreo</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold ml-1">Mensaje</label>
        <textarea 
          name="message"
          rows={4}
          required
          placeholder="Cuéntanos sobre tu desafío tecnológico..."
          className="w-full px-6 py-4 rounded-2xl bg-white border border-foreground/10 focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 outline-none transition-all resize-none"
        />
      </div>

      <button 
        disabled={isPending}
        className="w-full text-white py-5 rounded-2xl text-lg font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl mt-4 disabled:opacity-50"
        style={{ 
          background: themeColor ? `linear-gradient(to right, ${themeColor}, ${themeColor}dd)` : "linear-gradient(to right, #f59e0b, #ef4444)",
          boxShadow: themeColor ? `0 20px 25px -5px ${themeColor}33` : undefined
        }}
      >
        {isPending ? (
          <>Enviando... <Loader2 className="w-5 h-5 animate-spin" /></>
        ) : (
          <>
            {preselectedIndustry ? `Solicitar Auditoría Specialized` : "Enviar Solicitud"} 
            <Send className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};
