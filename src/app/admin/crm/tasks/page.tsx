import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock3,
  ExternalLink,
  ListTodo,
} from "lucide-react";
import { updateLeadTaskStatus } from "../actions";
import { crmDemoLeads, getCrmDemoLeadDetail } from "@/data/crmDemo";

export const dynamic = "force-dynamic";

type TaskItem = {
  dueAt: Date | null;
  id: string;
  isFollowUp: boolean;
  lead: { company: string | null; id: string; name: string };
  priority: string;
  status: string;
  title: string;
};

function formatDate(value: Date | null) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

async function loadTasks() {
  const isDemo = process.env.CRM_DEMO_MODE === "true";
  const now = Date.now();

  if (isDemo) {
    const tasks = crmDemoLeads.flatMap((lead) => {
      const detail = getCrmDemoLeadDetail(lead.id);
      const directTasks: TaskItem[] = (detail?.tasks || []).map((task) => ({
        ...task,
        isFollowUp: false,
        lead: { company: lead.company, id: lead.id, name: lead.name },
      }));
      const followUp: TaskItem[] = lead.nextFollowUpAt
        ? [
            {
              dueAt: lead.nextFollowUpAt,
              id: `${lead.id}-follow-up`,
              isFollowUp: true,
              lead: { company: lead.company, id: lead.id, name: lead.name },
              priority: lead.priority,
              status: "PENDING",
              title: "Próximo seguimiento comercial",
            },
          ]
        : [];
      return [...directTasks, ...followUp];
    });
    return { isDemo, now, tasks };
  }

  const { prisma } = await import("@/lib/prisma");
  const [databaseTasks, followUps] = await Promise.all([
    prisma.leadTask.findMany({
      include: { lead: { select: { company: true, id: true, name: true } } },
      orderBy: [{ status: "asc" }, { dueAt: "asc" }],
    }),
    prisma.contactSubmission.findMany({
      orderBy: { nextFollowUpAt: "asc" },
      select: {
        company: true,
        id: true,
        name: true,
        nextFollowUpAt: true,
        priority: true,
      },
      where: { nextFollowUpAt: { not: null } },
    }),
  ]);

  const tasks: TaskItem[] = [
    ...databaseTasks.map((task) => ({ ...task, isFollowUp: false })),
    ...followUps.map((lead) => ({
      dueAt: lead.nextFollowUpAt,
      id: `${lead.id}-follow-up`,
      isFollowUp: true,
      lead: { company: lead.company, id: lead.id, name: lead.name },
      priority: lead.priority,
      status: "PENDING",
      title: "Próximo seguimiento comercial",
    })),
  ].sort(
    (a, b) =>
      (a.dueAt?.getTime() || Number.MAX_SAFE_INTEGER) -
      (b.dueAt?.getTime() || Number.MAX_SAFE_INTEGER),
  );

  return { isDemo, now, tasks };
}

export default async function TasksPage() {
  const { isDemo, now, tasks } = await loadTasks();
  const pending = tasks.filter(
    (task) => !["COMPLETED", "CANCELLED"].includes(task.status),
  );
  const overdue = pending.filter(
    (task) => task.dueAt && task.dueAt.getTime() < now,
  ).length;
  const completed = tasks.filter((task) => task.status === "COMPLETED").length;

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
            <ListTodo className="h-4 w-4" />
            Agenda comercial
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Tareas y <span className="text-amber-300">seguimientos</span>
          </h1>
          <p className="mt-2 text-white/50">
            Una bandeja única para que ninguna oportunidad quede sin respuesta.
          </p>
        </div>
        <div className="flex gap-3">
          {[
            { label: "Pendientes", value: pending.length },
            { label: "Vencidas", value: overdue },
            { label: "Completadas", value: completed },
          ].map((metric) => (
            <div
              key={metric.label}
              className="min-w-28 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
            >
              <p className="text-[9px] font-black uppercase tracking-wider text-white/35">
                {metric.label}
              </p>
              <p className="mt-1 text-2xl font-black">{metric.value}</p>
            </div>
          ))}
        </div>
      </header>

      {isDemo && (
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
          Bandeja demostrativa. Las tareas se podrán completar al conectar la base
          de datos.
        </div>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f172a]/80">
        <div className="divide-y divide-white/5">
          {tasks.map((task) => {
            const isCompleted = task.status === "COMPLETED";
            const isOverdue =
              !isCompleted && Boolean(task.dueAt && task.dueAt.getTime() < now);

            return (
              <article
                key={task.id}
                className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center"
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-brand-emerald" />
                ) : (
                  <Circle
                    className={`h-5 w-5 ${
                      isOverdue ? "text-red-400" : "text-white/25"
                    }`}
                  />
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      className={`text-sm font-black ${
                        isCompleted ? "text-white/35 line-through" : ""
                      }`}
                    >
                      {task.title}
                    </h2>
                    {task.isFollowUp && (
                      <span className="rounded-full bg-brand-blue/10 px-2 py-1 text-[9px] font-black uppercase text-brand-blue">
                        Seguimiento
                      </span>
                    )}
                    {isOverdue && (
                      <span className="rounded-full bg-red-400/10 px-2 py-1 text-[9px] font-black uppercase text-red-300">
                        Vencida
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-white/40">
                    {task.lead.name} · {task.lead.company || "Sin empresa"}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-[10px] text-white/30">
                    {task.dueAt ? (
                      <CalendarClock className="h-3 w-3" />
                    ) : (
                      <Clock3 className="h-3 w-3" />
                    )}
                    {formatDate(task.dueAt)} · Prioridad {task.priority}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isDemo && !task.isFollowUp && (
                    <form action={updateLeadTaskStatus}>
                      <input type="hidden" name="leadId" value={task.lead.id} />
                      <input type="hidden" name="taskId" value={task.id} />
                      <button
                        name="status"
                        value={isCompleted ? "PENDING" : "COMPLETED"}
                        className="rounded-xl bg-white/5 px-3 py-2 text-xs font-bold text-white/50 hover:text-white"
                      >
                        {isCompleted ? "Reabrir" : "Completar"}
                      </button>
                    </form>
                  )}
                  <Link
                    href={`/admin/crm/leads/${task.lead.id}`}
                    aria-label={`Abrir ficha de ${task.lead.name}`}
                    className="rounded-xl border border-white/10 p-2.5 text-white/40 hover:text-brand-emerald"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
          {tasks.length === 0 && (
            <div className="p-12 text-center text-sm text-white/30">
              No hay tareas ni seguimientos registrados.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
