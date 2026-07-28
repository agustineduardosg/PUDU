"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Gauge,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { trackConversion } from "@/lib/analytics/client";

const goals = [
  {
    interest: "Landing page y conversión",
    label: "Conseguir más clientes",
    recommendation: "Landing de conversión + captación conectada al CRM",
  },
  {
    interest: "CRM y gestión comercial",
    label: "Ordenar ventas y clientes",
    recommendation: "CRM comercial con pipeline y seguimientos",
  },
  {
    interest: "Automatización e IA",
    label: "Automatizar tareas",
    recommendation: "Automatización de procesos e integración de herramientas",
  },
  {
    interest: "Software, SaaS o aplicación",
    label: "Crear un producto digital",
    recommendation: "Software a medida o SaaS escalable",
  },
];

const situations = [
  "Hoy lo hacemos con planillas y mensajes",
  "Tenemos herramientas, pero no se conectan",
  "Ya existe un sistema que debemos mejorar",
  "Partimos desde una idea",
];

const urgencies = [
  { label: "Este mes", value: "Alta" },
  { label: "En 1 a 3 meses", value: "Media" },
  { label: "Estoy evaluando", value: "Exploratoria" },
];

export function DigitalDiagnostic() {
  const [goal, setGoal] = useState<(typeof goals)[number] | null>(null);
  const [situation, setSituation] = useState("");
  const [urgency, setUrgency] = useState("");
  const startedRef = useRef(false);
  const completedRef = useRef(false);

  const complete = Boolean(goal && situation && urgency);
  const progress = [goal, situation, urgency].filter(Boolean).length;
  const diagnosticMessage = useMemo(() => {
    if (!goal) return "";

    return [
      `Diagnóstico digital: ${goal.label}.`,
      situation ? `Situación actual: ${situation}.` : "",
      urgency ? `Urgencia declarada: ${urgency}.` : "",
      `Recomendación inicial: ${goal.recommendation}.`,
    ]
      .filter(Boolean)
      .join(" ");
  }, [goal, situation, urgency]);

  function sendToContact() {
    if (!goal || !complete) return;

    window.dispatchEvent(
      new CustomEvent("pudu:diagnostic", {
        detail: {
          interest: goal.interest,
          message: diagnosticMessage,
        },
      }),
    );
    trackConversion("CTA_CLICK", {
      cta: "diagnostic_to_contact",
      goal: goal.interest,
      urgency,
    });
    document
      .getElementById("contacto")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() {
    setGoal(null);
    setSituation("");
    setUrgency("");
    startedRef.current = false;
    completedRef.current = false;
  }

  function startDiagnostic() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackConversion("DIAGNOSTIC_STARTED");
  }

  function completeDiagnostic(
    selectedGoal: (typeof goals)[number] | null,
    selectedSituation: string,
    selectedUrgency: string,
  ) {
    if (
      !selectedGoal ||
      !selectedSituation ||
      !selectedUrgency ||
      completedRef.current
    ) {
      return;
    }

    completedRef.current = true;
    trackConversion("DIAGNOSTIC_COMPLETED", {
      goal: selectedGoal.interest,
      situation: selectedSituation,
      urgency: selectedUrgency,
    });
  }

  function selectGoal(value: (typeof goals)[number]) {
    startDiagnostic();
    setGoal(value);
    completeDiagnostic(value, situation, urgency);
  }

  function selectSituation(value: string) {
    startDiagnostic();
    setSituation(value);
    completeDiagnostic(goal, value, urgency);
  }

  function selectUrgency(value: string) {
    startDiagnostic();
    setUrgency(value);
    completeDiagnostic(goal, situation, value);
  }

  return (
    <section id="diagnostico" className="scroll-mt-28 bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-foreground/[0.03] p-6 shadow-2xl md:p-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-[2rem] bg-slate-950 p-7 text-white md:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-emerald/15 text-brand-emerald">
              <Gauge className="h-6 w-6" />
            </div>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-brand-emerald">
              Herramienta gratuita
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              Diagnóstico digital en 60 segundos
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Responde tres preguntas y obtén una ruta inicial para mejorar
              ventas, operación o producto.
            </p>
            <div className="mt-8">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-white/35">
                <span>Progreso</span>
                <span>{progress}/3</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-emerald to-brand-blue transition-all"
                  style={{ width: `${(progress / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-7 py-2">
            <fieldset>
              <legend className="text-sm font-black">
                1. ¿Cuál es tu principal objetivo?
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {goals.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => selectGoal(item)}
                    className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${
                      goal?.label === item.label
                        ? "border-brand-emerald bg-brand-emerald/10 text-brand-emerald"
                        : "border-foreground/10 bg-background hover:border-brand-emerald/30"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-black">
                2. ¿Cómo trabajan hoy?
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {situations.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => selectSituation(item)}
                    className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${
                      situation === item
                        ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                        : "border-foreground/10 bg-background hover:border-brand-blue/30"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-black">
                3. ¿Cuándo te gustaría comenzar?
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {urgencies.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => selectUrgency(item.value)}
                    className={`rounded-2xl border p-4 text-sm font-bold transition ${
                      urgency === item.value
                        ? "border-brand-fire-start bg-brand-fire-start/10 text-brand-fire-start"
                        : "border-foreground/10 bg-background hover:border-brand-fire-start/30"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {complete && goal && (
              <div className="rounded-2xl border border-brand-emerald/20 bg-brand-emerald/[0.07] p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-emerald" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-brand-emerald">
                      Recomendación inicial
                    </p>
                    <p className="mt-2 font-black">{goal.recommendation}</p>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/50">
                      El siguiente paso es validar alcance, impacto y
                      factibilidad en una conversación breve.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={!complete}
                onClick={sendToContact}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-fire px-6 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Recibir diagnóstico sin costo
                <ArrowRight className="h-4 w-4" />
              </button>
              {progress > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-foreground/10 px-5 py-4 text-sm font-bold text-foreground/50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reiniciar
                </button>
              )}
            </div>

            <p className="flex items-center gap-2 text-[10px] text-foreground/35">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand-emerald" />
              Sin compromiso. La recomendación final siempre será revisada por
              una persona.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
