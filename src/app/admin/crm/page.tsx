import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Mail,
  MessageSquareText,
  Target,
  Users,
} from "lucide-react";
import { crmDemoLeads, type CrmDemoLead } from "@/data/crmDemo";
import { updateLeadStage } from "./actions";

export const dynamic = "force-dynamic";

const stages = [
  { label: "Nuevos", status: "NEW", color: "bg-sky-400" },
  { label: "Calificando", status: "QUALIFYING", color: "bg-cyan-400" },
  { label: "Contactados", status: "CONTACTED", color: "bg-indigo-400" },
  { label: "Reunión", status: "MEETING", color: "bg-violet-400" },
  { label: "Propuesta", status: "PROPOSAL", color: "bg-amber-400" },
  { label: "Negociación", status: "NEGOTIATION", color: "bg-orange-400" },
  { label: "Ganados", status: "WON", color: "bg-emerald-400" },
  { label: "Perdidos", status: "LOST", color: "bg-rose-400" },
] as const;

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
  }).format(value);
}

async function loadCrmData() {
  const isDemo = process.env.CRM_DEMO_MODE === "true";

  if (isDemo) {
    return {
      isDemo,
      leads: crmDemoLeads,
      pendingTasks: crmDemoLeads.reduce(
        (total, lead) => total + lead.tasks.length,
        0,
      ),
      queuedMessages: 3,
    };
  }

  const { prisma } = await import("@/lib/prisma");
  const [databaseLeads, pendingTasks, queuedMessages] = await Promise.all([
    prisma.contactSubmission.findMany({
      include: {
        tasks: {
          orderBy: { dueAt: "asc" },
          take: 1,
          where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
        },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    }),
    prisma.leadTask.count({
      where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
    }),
    prisma.outboundMessage.count({
      where: { status: { in: ["SCHEDULED", "QUEUED"] } },
    }),
  ]);

  return {
    isDemo,
    leads: databaseLeads as CrmDemoLead[],
    pendingTasks,
    queuedMessages,
  };
}

export default async function CrmPipelinePage() {
  const { isDemo, leads, pendingTasks, queuedMessages } = await loadCrmData();

  const wonCount = leads.filter((lead) => lead.status === "WON").length;
  const activeCount = leads.filter(
    (lead) => !["WON", "LOST"].includes(lead.status),
  ).length;

  return (
    <div className="animate-in fade-in duration-700">
      {isDemo && (
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
          Vista de demostración: los prospectos son ficticios y los movimientos
          entre etapas están desactivados.
        </div>
      )}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-brand-emerald text-xs font-black uppercase tracking-[0.2em] mb-3">
            <Target className="w-4 h-4" />
            Ventas y prospección
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Pipeline <span className="text-brand-emerald">CRM</span>
          </h1>
          <p className="text-white/50 mt-2">
            Ordena prospectos, próximos pasos y comunicaciones en un solo lugar.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { icon: Users, label: "Activos", value: activeCount },
            { icon: Target, label: "Ganados", value: wonCount },
            { icon: CalendarClock, label: "Tareas", value: pendingTasks },
            { icon: MessageSquareText, label: "En cola", value: queuedMessages },
          ].map((metric) => (
            <div
              key={metric.label}
              className="min-w-28 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
            >
              <div className="flex items-center gap-2 text-white/40">
                <metric.icon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {metric.label}
                </span>
              </div>
              <p className="text-2xl font-black mt-1">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-6 custom-scrollbar">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage, stageIndex) => {
            const stageLeads = leads.filter(
              (lead) => lead.status === stage.status,
            );

            return (
              <section
                key={stage.status}
                className="w-[300px] rounded-[2rem] border border-white/10 bg-[#0f172a]/70 p-4"
              >
                <header className="flex items-center justify-between px-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                    <h2 className="text-sm font-black">{stage.label}</h2>
                  </div>
                  <span className="text-xs font-bold text-white/40 bg-white/5 rounded-full px-2.5 py-1">
                    {stageLeads.length}
                  </span>
                </header>

                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <article
                      key={lead.id}
                      className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-bold truncate">{lead.name}</h3>
                          <p className="text-xs text-white/40 truncate mt-1">
                            {lead.company || "Sin empresa"}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 w-2.5 h-2.5 rounded-full ${
                            lead.priority === "URGENT"
                              ? "bg-red-400"
                              : lead.priority === "HIGH"
                                ? "bg-orange-400"
                                : "bg-white/20"
                          }`}
                          title={`Prioridad ${lead.priority}`}
                        />
                      </div>

                      <div className="mt-4 space-y-2 text-xs text-white/50">
                        {lead.email ? (
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-2 hover:text-brand-emerald truncate"
                          >
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span>Sin email</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <CalendarClock className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {lead.tasks[0]?.dueAt
                              ? `Seguimiento ${formatDate(lead.tasks[0].dueAt)}`
                              : `Ingreso ${formatDate(lead.createdAt)}`}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/admin/crm/leads/${lead.id}`}
                        className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-black flex items-center justify-center gap-2 hover:border-brand-emerald/30 hover:text-brand-emerald"
                      >
                        Abrir ficha
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        {!isDemo && stageIndex > 0 ? (
                          <form action={updateLeadStage}>
                            <input type="hidden" name="leadId" value={lead.id} />
                            <button
                              type="submit"
                              name="status"
                              value={stages[stageIndex - 1].status}
                              aria-label={`Mover ${lead.name} a ${stages[stageIndex - 1].label}`}
                              className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                          </form>
                        ) : (
                          <span />
                        )}

                        <span className="text-[9px] uppercase tracking-wider font-bold text-white/25">
                          {lead.source}
                        </span>

                        {!isDemo && stageIndex < stages.length - 1 ? (
                          <form action={updateLeadStage}>
                            <input type="hidden" name="leadId" value={lead.id} />
                            <button
                              type="submit"
                              name="status"
                              value={stages[stageIndex + 1].status}
                              aria-label={`Mover ${lead.name} a ${stages[stageIndex + 1].label}`}
                              className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </form>
                        ) : (
                          <span />
                        )}
                      </div>
                    </article>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-white/25">
                      Sin prospectos en esta etapa
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
