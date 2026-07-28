"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  CheckCircle2,
  Instagram,
  MessagesSquare,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import PuduLogo from "@/components/PuduLogo";
import { trackConversion } from "@/lib/analytics/client";

const directMessageUrl = "https://ig.me/m/puduitsolutions";

export function InstagramAcquisitionHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 pb-20 pt-28 text-white sm:pt-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-16 h-80 w-80 rounded-full bg-brand-blue/15 blur-3xl" />
        <div className="absolute -right-24 top-40 h-96 w-96 rounded-full bg-brand-emerald/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-brand-emerald/[0.08] to-transparent" />
      </div>

      <div className="container relative mx-auto grid items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-pink-300">
            <Instagram className="h-4 w-4" />
            Llegaste desde Instagram
          </div>

          <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-7xl">
            Convierte mensajes dispersos en{" "}
            <span className="text-gradient-emerald">
              oportunidades que sí avanzan.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/65 sm:text-xl">
            PUDU conecta Instagram, WhatsApp, CRM, agenda y automatización para
            que tu empresa responda mejor, haga seguimiento y deje de perder
            clientes entre mensajes y planillas.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#diagnostico"
              onClick={() =>
                trackConversion("CTA_CLICK", {
                  cta: "instagram_landing_diagnostic",
                  destination: "diagnostico",
                })
              }
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-fire px-7 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/15 sm:text-base"
            >
              Obtener diagnóstico gratuito
              <ArrowDown className="h-4 w-4" />
            </Link>
            <a
              href={directMessageUrl}
              onClick={() =>
                trackConversion("CTA_CLICK", {
                  cta: "instagram_landing_dm",
                  destination: "instagram_dm",
                })
              }
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 text-sm font-black text-white transition hover:bg-white/10 sm:text-base"
            >
              Escribir por Instagram
              <Instagram className="h-4 w-4 text-pink-300" />
            </a>
          </div>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["API oficial de Meta", CheckCircle2],
              ["CRM propio de PUDU", MessagesSquare],
              ["Atención humana", UserRoundCheck],
            ].map(([label, Icon]) => (
              <div
                key={label as string}
                className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-3 text-xs font-bold text-white/55"
              >
                <Icon className="h-4 w-4 shrink-0 text-brand-emerald" />
                {label as string}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-pink-400/15 via-brand-blue/10 to-brand-emerald/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-900/90 p-4 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <PuduLogo color="white" className="h-7 w-20" />
              <span className="rounded-full bg-brand-emerald/10 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-brand-emerald">
                Embudo conectado
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-pink-400/15 bg-pink-400/[0.07] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-400/15 text-pink-300">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-pink-300">
                      Mensaje nuevo
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      “Necesito ordenar los leads que llegan por Instagram”
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowDown className="h-5 w-5 text-white/25" />
              </div>

              <div className="rounded-2xl border border-brand-blue/15 bg-brand-blue/[0.07] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-brand-blue">
                      Calificación asistida
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      Detecta necesidad, urgencia y próxima pregunta sin perder
                      el contexto.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowDown className="h-5 w-5 text-white/25" />
              </div>

              <div className="rounded-2xl border border-brand-emerald/20 bg-brand-emerald/[0.08] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-emerald/15 text-brand-emerald">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-brand-emerald">
                        Lead creado en CRM
                      </p>
                      <p className="mt-1 text-sm font-bold">
                        Prioridad alta · Seguimiento pendiente
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-brand-emerald" />
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-[10px] leading-relaxed text-white/30">
              Demostración del flujo PUDU. La automatización se adapta al
              proceso real de cada empresa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
