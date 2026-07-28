"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  Code2,
  UsersRound,
} from "lucide-react";
import { trackConversion } from "@/lib/analytics/client";

const outcomes = [
  {
    description:
      "Landing pages, sitios y e-commerce diseñados para transformar visitas en conversaciones.",
    icon: ChartNoAxesCombined,
    interest: "Landing page y conversión",
    title: "Quiero atraer más clientes",
  },
  {
    description:
      "Centraliza prospectos, tareas y seguimientos para que ninguna oportunidad se pierda.",
    icon: UsersRound,
    interest: "CRM y gestión comercial",
    title: "Quiero ordenar mis ventas",
  },
  {
    description:
      "Conecta herramientas y elimina tareas repetitivas con flujos e inteligencia artificial.",
    icon: Bot,
    interest: "Automatización e IA",
    title: "Quiero ahorrar horas",
  },
  {
    description:
      "Construye una plataforma, aplicación o SaaS preparado para crecer junto a tu operación.",
    icon: Code2,
    interest: "Software, SaaS o aplicación",
    title: "Quiero crear un producto",
  },
];

type ConversionOutcomesProps = {
  basePath?: string;
};

export function ConversionOutcomes({
  basePath = "/",
}: ConversionOutcomesProps) {
  return (
    <section
      id="resultados"
      className="border-y border-white/5 bg-slate-950 py-16 text-white"
    >
      <div className="container mx-auto px-6">
        <div className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            "Ingeniería desde Chile",
            "Experiencia en sistemas críticos",
            "Diagnóstico inicial sin costo",
            "Respuesta en 1 día hábil",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-[10px] font-black uppercase tracking-wider text-white/55"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-brand-emerald">
            Comienza por tu objetivo
          </p>
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            No necesitas saber de tecnología.
            <span className="block text-white/45">
              Solo cuéntanos qué quieres mejorar.
            </span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {outcomes.map((outcome) => {
            const Icon = outcome.icon;

            return (
              <article
                key={outcome.title}
                className="group flex min-h-72 flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-brand-emerald/30 hover:bg-brand-emerald/[0.06]"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-emerald/10 text-brand-emerald">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black">{outcome.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/45">
                  {outcome.description}
                </p>
                <Link
                  href={`${basePath}?interest=${encodeURIComponent(outcome.interest)}#contacto`}
                  onClick={() =>
                    trackConversion("CTA_CLICK", {
                      cta: "outcome_card",
                      interest: outcome.interest,
                    })
                  }
                  className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-emerald"
                >
                  Explorar solución
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
