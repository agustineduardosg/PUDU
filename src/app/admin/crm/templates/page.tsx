import { Braces, MessageSquareText, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import {
  createMessageTemplate,
  toggleMessageTemplate,
} from "../prospecting-actions";
import {
  defaultMessageTemplates,
  type CrmMessageTemplate,
} from "@/data/messageTemplates";

export const dynamic = "force-dynamic";

async function loadTemplates() {
  const isDemo = process.env.CRM_DEMO_MODE === "true";
  if (isDemo) return { isDemo, templates: defaultMessageTemplates };

  const { prisma } = await import("@/lib/prisma");
  const templates = await prisma.messageTemplate.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });
  return { isDemo, templates: templates as CrmMessageTemplate[] };
}

export default async function TemplatesPage() {
  const { isDemo, templates } = await loadTemplates();

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-blue">
          <MessageSquareText className="h-4 w-4" />
          Comunicación consistente
        </div>
        <h1 className="text-4xl font-black tracking-tight">
          Plantillas de <span className="text-brand-blue">mensajes</span>
        </h1>
        <p className="mt-2 max-w-3xl text-white/50">
          Reutiliza buenos puntos de partida, personaliza cada mensaje y conserva
          la revisión humana.
        </p>
      </header>

      {isDemo && (
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
          Estas plantillas demostrativas ya pueden probarse desde la ficha de cada
          prospecto.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(340px,0.7fr)_minmax(0,1.3fr)]">
        <form
          action={createMessageTemplate}
          className="h-fit rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <Plus className="h-5 w-5 text-brand-emerald" />
            <h2 className="font-black">Nueva plantilla</h2>
          </div>
          <fieldset disabled={isDemo} className="space-y-4">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Nombre
              </span>
              <input
                name="name"
                required
                placeholder="Primer contacto por Instagram"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
              />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label>
                <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                  Canal
                </span>
                <select
                  name="channel"
                  defaultValue="EMAIL"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
                >
                  <option value="EMAIL">Email</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="SMS">SMS</option>
                </select>
              </label>
              <label>
                <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                  Asunto
                </span>
                <input
                  name="subject"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Contenido
              </span>
              <textarea
                name="content"
                required
                rows={7}
                placeholder="Hola {nombre}, vimos una oportunidad para {empresa}..."
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
              />
            </label>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-white/40">
                <Braces className="h-3.5 w-3.5" />
                Variables disponibles
              </p>
              <p className="mt-2 text-xs text-white/50">
                {"{nombre} · {empresa} · {interes}"}
              </p>
            </div>
            <button className="w-full rounded-xl bg-brand-blue px-4 py-3 text-sm font-black disabled:opacity-40">
              {isDemo ? "Disponible con base real" : "Guardar plantilla"}
            </button>
          </fieldset>
        </form>

        <section className="grid grid-cols-1 gap-4">
          {templates.map((template) => (
            <article
              key={template.id}
              className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-black">{template.name}</h2>
                    <span className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-[9px] font-black uppercase text-brand-blue">
                      {template.channel}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${
                        template.isActive
                          ? "bg-brand-emerald/10 text-brand-emerald"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      {template.isActive ? "Activa" : "Pausada"}
                    </span>
                  </div>
                  {template.subject && (
                    <p className="mt-2 text-sm font-bold text-white/55">
                      {template.subject}
                    </p>
                  )}
                </div>
                {!isDemo && (
                  <form action={toggleMessageTemplate}>
                    <input type="hidden" name="templateId" value={template.id} />
                    <button
                      name="isActive"
                      value={String(!template.isActive)}
                      aria-label={
                        template.isActive
                          ? `Pausar ${template.name}`
                          : `Activar ${template.name}`
                      }
                      className="rounded-xl border border-white/10 p-2.5 text-white/40 hover:text-white"
                    >
                      {template.isActive ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </button>
                  </form>
                )}
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-sm leading-relaxed text-white/50">
                {template.content}
              </p>
            </article>
          ))}
          {templates.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-white/10 p-12 text-center text-sm text-white/30">
              Aún no hay plantillas guardadas.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
