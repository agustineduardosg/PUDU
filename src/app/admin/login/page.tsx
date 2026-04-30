"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Contraseña estática para desarrollo temporal (hasta configurar auth real)
    // Se recomienda cambiarla en variables de entorno para prod
    if (password === "vibe123") {
      document.cookie = "pudu_admin_auth=authenticated; path=/; max-age=86400"; // 1 day
      router.push("/admin");
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <div className="mb-10 text-center">
        <ShieldAlert className="w-16 h-16 text-brand-blue mx-auto mb-6" />
        <h1 className="text-3xl font-black tracking-tight mb-2">Acceso Restringido</h1>
        <p className="text-white/50">Portal administrativo exclusivo de PUDU.</p>
      </div>

      <div className="w-full max-w-sm glass p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-blue to-transparent" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-blue/20 blur-3xl rounded-full" />

        <form onSubmit={handleLogin} className="relative z-10">
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
              Clave Maestra
            </label>
            <div className={`relative flex items-center transition-all ${error ? "animate-shake" : ""}`}>
              <Lock className={`absolute left-4 w-5 h-5 ${error ? "text-red-500" : "text-white/40"}`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className={`w-full bg-slate-900/50 border ${error ? "border-red-500" : "border-white/10 focus:border-brand-blue"} outline-none rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 transition-colors`}
                placeholder="••••••••••"
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 mt-2 font-medium">Credenciales inválidas.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors group shadow-[0_0_20px_rgba(14,165,233,0.3)]"
          >
            Acceder al Sistema
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
