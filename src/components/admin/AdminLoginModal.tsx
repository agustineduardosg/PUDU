"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ArrowRight, ShieldCheck, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Contraseña estática para desarrollo temporal (vibe123)
    if (password === "vibe123") {
      setIsSuccess(true);
      document.cookie = "pudu_admin_auth=authenticated; path=/; max-age=86400"; // 1 day
      
      setTimeout(() => {
        onClose();
        router.push("/admin");
      }, 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden glass p-1 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Background Decorative Gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-blue/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 p-10">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-10">
                <div className="relative inline-block mb-6">
                  <motion.div
                    animate={isSuccess ? { scale: [1, 1.2, 1] } : {}}
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl ${
                      isSuccess ? "bg-green-500/20 text-green-500" : "bg-brand-blue/20 text-brand-blue"
                    }`}
                  >
                    {isSuccess ? <ShieldCheck className="w-10 h-10" /> : <Lock className="w-10 h-10" />}
                  </motion.div>
                  {error && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white border-4 border-slate-900"
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
                <h2 className="text-3xl font-black tracking-tight text-white mb-2 uppercase">
                  {isSuccess ? "Acceso Concedido" : "Portal Maestro"}
                </h2>
                <p className="text-white/40 text-sm font-medium">
                  {isSuccess ? "Iniciando sesión segura..." : "Solo personal autorizado de PUDU Solutions"}
                </p>
              </div>

              {/* Form */}
              {!isSuccess && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className={`relative transition-all duration-300 ${error ? "animate-shake" : ""}`}>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue mb-2 ml-1">
                      Código de Autorización
                    </label>
                    <div className="relative group">
                      <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        error ? "text-red-500" : "text-white/20 group-focus-within:text-brand-blue"
                      }`} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        placeholder="••••••••••••"
                        className={`w-full bg-slate-900/50 border ${
                          error ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-white/10 focus:border-brand-blue/50"
                        } outline-none rounded-2xl py-5 pl-14 pr-6 text-white text-lg tracking-[0.3em] placeholder:text-white/5 transition-all focus:bg-slate-900/80`}
                      />
                    </div>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-xs text-red-400 mt-3 font-bold uppercase tracking-wider"
                      >
                        Credenciales no válidas
                      </motion.p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(14,165,233,0.3)] group"
                  >
                    Entrar al Sistema
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-widest mt-8 pt-6 border-t border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue/40 animate-pulse" />
                    Protocolo de Seguridad Nivel 4
                  </div>
                </form>
              )}

              {/* Success State */}
              {isSuccess && (
                <div className="flex flex-col items-center py-10">
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-brand-blue"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

