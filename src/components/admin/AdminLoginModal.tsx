"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Lock,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error || "Credenciales inválidas.");
        return;
      }

      setIsSuccess(true);
      window.setTimeout(() => {
        onClose();
        router.push("/admin/crm");
        router.refresh();
      }, 700);
    } catch {
      setError("No fue posible conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.button
            aria-label="Cerrar acceso administrativo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-login-title"
            className="relative w-full max-w-md glass p-10 rounded-[3rem] border border-white/10 shadow-2xl"
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div
                className={`mx-auto mb-5 w-20 h-20 rounded-3xl flex items-center justify-center ${
                  isSuccess
                    ? "bg-green-500/20 text-green-400"
                    : "bg-brand-blue/20 text-brand-blue"
                }`}
              >
                {isSuccess ? (
                  <ShieldCheck className="w-10 h-10" />
                ) : (
                  <Lock className="w-10 h-10" />
                )}
              </div>
              <h2
                id="admin-login-title"
                className="text-3xl font-black tracking-tight text-white uppercase"
              >
                {isSuccess ? "Acceso concedido" : "Portal PUDU"}
              </h2>
              <p className="text-white/40 text-sm mt-2">
                Acceso exclusivo para personal autorizado
              </p>
            </div>

            {!isSuccess && (
              <form onSubmit={handleLogin} className="space-y-5">
                <label className="block">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue mb-2">
                    Clave de acceso
                  </span>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      autoFocus
                      required
                      disabled={isSubmitting}
                      className="w-full bg-slate-900/50 border border-white/10 focus:border-brand-blue/50 outline-none rounded-2xl py-5 pl-14 pr-6 text-white"
                    />
                  </div>
                </label>

                {error && (
                  <p
                    role="alert"
                    className="flex items-center justify-center gap-2 text-xs text-red-400 font-bold"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-60 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  {isSubmitting ? "Verificando..." : "Entrar al sistema"}
                  {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
