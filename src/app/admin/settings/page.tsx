import React from "react";
import { Settings, Shield, Database, Bell, Save, User, Cloud } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Configuración <span className="text-brand-blue">del Sistema</span>
        </h1>
        <p className="text-white/50 text-lg">Administra los parámetros operativos y preferencias de PUDU.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Settings Categories */}
        <div className="lg:col-span-1 space-y-4">
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 text-white font-bold transition-all">
            <Shield className="w-5 h-5 text-brand-blue" />
            Seguridad y Acceso
          </button>
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <Database className="w-5 h-5" />
            Base de Datos
          </button>
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <Cloud className="w-5 h-5" />
            Integraciones (API)
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/10 bg-white/[0.02]">
              <h2 className="text-xl font-bold mb-1 text-white">Perfil de Administrador</h2>
              <p className="text-sm text-white/40">Gestiona tus credenciales de acceso al Control Center.</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue ml-1">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    defaultValue="Admin PUDU" 
                    disabled
                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white/60 outline-none cursor-not-allowed font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue ml-1">Email de Control</label>
                  <input 
                    type="email" 
                    defaultValue="agustineduardosg@puduit.tech" 
                    disabled
                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white/60 outline-none cursor-not-allowed font-bold"
                  />
                </div>
              </div>
              
              <div className="pt-6">
                <button className="bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue border border-brand-blue/30 px-8 py-4 rounded-full font-black transition-all text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/10 bg-brand-blue/10">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-white">
                <Database className="w-5 h-5 text-brand-blue" />
                Estado del Servidor
              </h2>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-sm font-black text-emerald-400 tracking-tight">Base de Datos Conectada</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-500/60 uppercase font-black">PostgreSQL 16</span>
              </div>
              
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Uso de Almacenamiento</span>
                <span className="text-sm font-black text-white">0.24 GB / 10 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

