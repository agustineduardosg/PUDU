"use client";

import React from "react";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import PuduLogo from "./PuduLogo";

export const ContactForm = () => {
  return (
    <section className="py-24 bg-foreground/[0.02]">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto glass rounded-[2.5rem] overflow-hidden shadow-2xl border-white/20">
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
                      <div className="text-lg">+56 (2) 2345 6789</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div>
                      <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Email</div>
                      <div className="text-lg">contacto@pudu.tech</div>
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
            <div className="lg:w-3/5 p-12 bg-white/50 backdrop-blur-xl">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Juan Pérez"
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-foreground/10 focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Empresa / Cargo</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Minera Norte / Gerente TI"
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-foreground/10 focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Correo Corporativo</label>
                  <input 
                    type="email" 
                    placeholder="juan@empresa.cl"
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-foreground/10 focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Área de Interés</label>
                  <select className="w-full px-6 py-4 rounded-2xl bg-white border border-foreground/10 focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 outline-none transition-all appearance-none cursor-pointer">
                    <option>Transformación Digital General</option>
                    <option>Integración IA y Datos</option>
                    <option>IoT y Telemetría Industrial</option>
                    <option>Ciberseguridad y Monitoreo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Mensaje</label>
                  <textarea 
                    rows={4}
                    placeholder="Cuéntanos sobre tu desafío tecnológico..."
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-foreground/10 focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 outline-none transition-all resize-none"
                  />
                </div>

                <button className="w-full bg-gradient-fire text-white py-5 rounded-2xl text-lg font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-fire-start/20 mt-4 underline-offset-4">
                  Enviar Solicitud <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
