import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  AtSign,
  Building2,
  CalendarClock,
  CheckCircle2,
  Circle,
  ClipboardList,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import {
  addLeadNote,
  createLeadTask,
  updateLeadProfile,
  updateLeadTaskStatus,
} from "@/app/admin/crm/actions";
import { MessageComposer } from "@/components/admin/crm/MessageComposer";
import {
  getCrmDemoLeadDetail,
  type CrmDemoLead,
} from "@/data/crmDemo";

export const dynamic = "force-dynamic";

type LeadDetail = Omit<CrmDemoLead, "tasks"> & {
  activities: {
    body: string | null;
    createdAt: Date;
    id: string;
    title: string;
    type: string;
  }[];
  messages: {
    channel: string;
    content: string;
    createdAt: Date;
    id: string;
    recipient: string;
    status: string;
    subject: string | null;
  }[];
  tasks: {
    completedAt: Date | null;
    description: string | null;
    dueAt: Date | null;
    id: string;
    priority: string;
    status: string;
    title: string;
  }[];
};

const statusLabels: Record<string, string> = {
  CONTACTED: "Contactado",
  LOST: "Perdido",
  MEETING: "Reunión",
  NEGOTIATION: "Negociación",
  NEW: "Nuevo",
  PROPOSAL: "Propuesta",
  QUALIFYING: "Calificando",
  WON: "Ganado",
};

const priorityLabels: Record<string, string> = {
  HIGH: "Alta",
  LOW: "Baja",
  MEDIUM: "Media",
  URGENT: "Urgente",
};

function formatDate(value: Date | null, includeTime = false) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    ...(includeTime ? { timeStyle: "short" } : {}),
  }).format(value);
}

function toDateTimeLocal(value: Date | null) {
  return value ? new Date(value).toISOString().slice(0, 16) : "";
}

async function loadLead(leadId: string) {
  const isDemo = process.env.CRM_DEMO_MODE === "true";

  if (isDemo) {
    return {
      isDemo,
      lead: getCrmDemoLeadDetail(leadId) as LeadDetail | null,
    };
  }

  const { prisma } = await import("@/lib/prisma");
  const databaseLead = await prisma.contactSubmission.findUnique({
    include: {
      activities: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "desc" } },
      tasks: { orderBy: [{ status: "asc" }, { dueAt: "asc" }] },
    },
    where: { id: leadId },
  });

  return {
    isDemo,
    lead: databaseLead as LeadDetail | null,
  };
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { isDemo, lead } = await loadLead(id);

  if (!lead) {
    notFound();
  }

  const openTasks = lead.tasks.filter(
    (task) => task.status !== "COMPLETED" && task.status !== "CANCELLED",
  );

  return (
    <div className="animate-in fade-in duration-500">
      <Link
        href="/admin/crm"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al pipeline
      </Link>

      {isDemo && (
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
          Ficha demostrativa. Puedes probar las plantillas, pero las acciones de
          guardado se habilitan al conectar PostgreSQL.
        </div>
      )}

      <header className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="rounded-full border border-brand-emerald/20 bg-brand-emerald/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-emerald">
              {statusLabels[lead.status] || lead.status}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white/50">
              Prioridad {priorityLabels[lead.priority] || lead.priority}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white/50">
              Score {lead.score}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">{lead.name}</h1>
          <p className="text-lg text-white/45 mt-2 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {lead.company || "Prospecto independiente"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Origen", value: lead.source },
            { label: "Interés", value: lead.interest },
            { label: "Responsable", value: lead.assignedTo || "Sin asignar" },
            { label: "Tareas", value: String(openTasks.length) },
          ].map((item) => (
            <div
              key={item.label}
              className="min-w-28 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
            >
              <p className="text-[9px] font-black uppercase tracking-wider text-white/30">
                {item.label}
              </p>
              <p className="text-sm font-bold mt-1 truncate">{item.value}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
        <a
          href={`mailto:${lead.email}`}
          className="rounded-2xl border border-white/10 bg-[#0f172a]/70 p-4 hover:border-brand-emerald/30"
        >
          <Mail className="w-4 h-4 text-brand-emerald mb-3" />
          <p className="text-[9px] uppercase tracking-wider text-white/30 font-black">
            Email
          </p>
          <p className="text-sm font-bold mt-1 break-all">{lead.email}</p>
        </a>
        <div className="rounded-2xl border border-white/10 bg-[#0f172a]/70 p-4">
          <Phone className="w-4 h-4 text-brand-blue mb-3" />
          <p className="text-[9px] uppercase tracking-wider text-white/30 font-black">
            Teléfono
          </p>
          <p className="text-sm font-bold mt-1">{lead.phone || "Sin teléfono"}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0f172a]/70 p-4">
          <AtSign className="w-4 h-4 text-pink-400 mb-3" />
          <p className="text-[9px] uppercase tracking-wider text-white/30 font-black">
            Instagram
          </p>
          <p className="text-sm font-bold mt-1">
            {lead.instagram || "Sin Instagram"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0f172a]/70 p-4">
          <MapPin className="w-4 h-4 text-amber-400 mb-3" />
          <p className="text-[9px] uppercase tracking-wider text-white/30 font-black">
            Ciudad
          </p>
          <p className="text-sm font-bold mt-1">{lead.city || "Sin ciudad"}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.8fr)] gap-6">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
            <div className="flex items-center gap-3 mb-5">
              <MessageSquare className="w-5 h-5 text-brand-emerald" />
              <div>
                <h2 className="font-black">Actividad y notas</h2>
                <p className="text-xs text-white/40">
                  Historial comercial del prospecto.
                </p>
              </div>
            </div>

            <form action={addLeadNote} className="mb-6">
              <input type="hidden" name="leadId" value={lead.id} />
              <fieldset disabled={isDemo}>
                <textarea
                  name="body"
                  required
                  rows={3}
                  placeholder={
                    isDemo
                      ? "Disponible con base real"
                      : "Registra una llamada, acuerdo o antecedente..."
                  }
                  className="w-full resize-y rounded-xl border border-white/10 bg-slate-950 p-4 text-sm disabled:opacity-40"
                />
                <button
                  type="submit"
                  className="mt-3 rounded-xl bg-brand-emerald px-4 py-2.5 text-sm font-black disabled:opacity-40"
                >
                  Agregar nota
                </button>
              </fieldset>
            </form>

            <div className="space-y-5">
              {lead.activities.map((activity) => (
                <article
                  key={activity.id}
                  className="relative pl-7 before:absolute before:left-[5px] before:top-5 before:bottom-[-22px] before:w-px before:bg-white/10 last:before:hidden"
                >
                  <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-brand-emerald ring-4 ring-[#0f172a]" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm font-bold">{activity.title}</h3>
                    <time className="text-[10px] text-white/30">
                      {formatDate(activity.createdAt, true)}
                    </time>
                  </div>
                  {activity.body && (
                    <p className="text-sm text-white/50 mt-2 leading-relaxed">
                      {activity.body}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>

          <MessageComposer
            company={lead.company}
            email={lead.email}
            interest={lead.interest}
            isDemo={isDemo}
            leadId={lead.id}
            leadName={lead.name}
          />

          <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
            <h2 className="font-black mb-4">Borradores guardados</h2>
            <div className="space-y-3">
              {lead.messages.map((message) => (
                <article
                  key={message.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-black text-brand-blue">
                        {message.channel} · {message.status}
                      </p>
                      <h3 className="text-sm font-bold mt-1">
                        {message.subject || "Mensaje sin asunto"}
                      </h3>
                    </div>
                    <time className="text-[10px] text-white/30">
                      {formatDate(message.createdAt)}
                    </time>
                  </div>
                  <p className="text-sm text-white/50 mt-3 line-clamp-3">
                    {message.content}
                  </p>
                </article>
              ))}
              {lead.messages.length === 0 && (
                <p className="text-sm text-white/30">
                  Todavía no existen borradores para este prospecto.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <form
            action={updateLeadProfile}
            className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6"
          >
            <input type="hidden" name="leadId" value={lead.id} />
            <div className="flex items-center gap-3 mb-5">
              <UserRound className="w-5 h-5 text-brand-blue" />
              <h2 className="font-black">Gestión comercial</h2>
            </div>
            <fieldset disabled={isDemo} className="space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-black text-white/40">
                  Etapa
                </span>
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-black text-white/40">
                  Prioridad
                </span>
                <select
                  name="priority"
                  defaultValue={lead.priority}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
                >
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-black text-white/40">
                  Responsable
                </span>
                <input
                  name="assignedTo"
                  defaultValue={lead.assignedTo || ""}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-wider font-black text-white/40">
                  Próximo seguimiento
                </span>
                <input
                  type="datetime-local"
                  name="nextFollowUpAt"
                  defaultValue={toDateTimeLocal(lead.nextFollowUpAt)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-brand-blue px-4 py-3 text-sm font-black flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Save className="w-4 h-4" />
                {isDemo ? "Disponible con base real" : "Guardar cambios"}
              </button>
            </fieldset>
          </form>

          <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
            <div className="flex items-center gap-3 mb-5">
              <ClipboardList className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="font-black">Tareas</h2>
                <p className="text-xs text-white/40">
                  {openTasks.length} pendientes
                </p>
              </div>
            </div>

            <form action={createLeadTask} className="mb-6">
              <input type="hidden" name="leadId" value={lead.id} />
              <fieldset disabled={isDemo} className="space-y-3">
                <input
                  name="title"
                  required
                  placeholder="Nueva tarea"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
                />
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Descripción opcional"
                  className="w-full resize-y rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="datetime-local"
                    name="dueAt"
                    className="rounded-xl border border-white/10 bg-slate-950 p-3 text-xs"
                  />
                  <select
                    name="priority"
                    defaultValue="MEDIUM"
                    className="rounded-xl border border-white/10 bg-slate-950 p-3 text-xs"
                  >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2.5 text-sm font-black text-amber-300 disabled:opacity-40"
                >
                  Crear tarea
                </button>
              </fieldset>
            </form>

            <div className="space-y-3">
              {lead.tasks.map((task) => {
                const isCompleted = task.status === "COMPLETED";

                return (
                  <article
                    key={task.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-white/25 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-sm font-bold ${
                            isCompleted ? "line-through text-white/35" : ""
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-xs text-white/40 mt-1">
                            {task.description}
                          </p>
                        )}
                        <p className="text-[10px] text-white/30 mt-2 flex items-center gap-1">
                          <CalendarClock className="w-3 h-3" />
                          {formatDate(task.dueAt, true)}
                        </p>
                      </div>
                    </div>

                    {!isDemo && (
                      <form action={updateLeadTaskStatus} className="mt-3">
                        <input type="hidden" name="leadId" value={lead.id} />
                        <input type="hidden" name="taskId" value={task.id} />
                        <button
                          type="submit"
                          name="status"
                          value={isCompleted ? "PENDING" : "COMPLETED"}
                          className="w-full rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-white/50 hover:text-white"
                        >
                          {isCompleted ? "Reabrir tarea" : "Marcar completada"}
                        </button>
                      </form>
                    )}
                  </article>
                );
              })}

              {lead.tasks.length === 0 && (
                <p className="text-sm text-white/30">No hay tareas registradas.</p>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
            <h2 className="font-black mb-3">Contexto inicial</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              {lead.message}
            </p>
            {lead.notes && (
              <p className="text-sm text-white/50 leading-relaxed mt-4 pt-4 border-t border-white/10">
                {lead.notes}
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
