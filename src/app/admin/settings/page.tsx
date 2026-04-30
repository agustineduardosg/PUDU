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
          <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5">
              <h2 className="text-xl font-bold mb-1">Perfil de Administrador</h2>
              <p className="text-sm text-white/40">Gestiona tus credenciales de acceso al Control Center.</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    defaultValue="Admin PUDU" 
                    disabled
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Email de Control</label>
                  <input 
                    type="email" 
                    defaultValue="agustineduardosg@puduit.tech" 
                    disabled
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
              
              <div className="pt-6">
                <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-all text-sm flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>

          <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-brand-blue/5">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-blue" />
                Estado del Servidor
              </h2>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-emerald-400">Base de Datos Conectada</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-500/60 uppercase">PostgreSQL 16</span>
              </div>
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/60">Uso de Almacenamiento</span>
                <span className="text-xs font-black text-white">0.24 GB / 10 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
