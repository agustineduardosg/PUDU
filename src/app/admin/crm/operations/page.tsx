import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Instagram,
  ShieldAlert,
  UserRoundCheck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function age(from: Date, now: Date) {
  const minutes = Math.max(
    0,
    Math.floor((now.getTime() - from.getTime()) / 60_000),
  );
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours} h`;
  return `${Math.floor(hours / 24)} días`;
}

async function loadOperations() {
  const now = new Date();
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  if (process.env.CRM_DEMO_MODE === "true") {
    return {
      breachedLeads: [],
      failedWebhooks: 0,
      incidents: [],
      latestWebhook: null,
      now,
      overdueTasks: [],
      unassignedPriority: 0,
    };
  }

  const [
    incidents,
    overdueTasks,
    breachedLeads,
    unassignedPriority,
    failedWebhooks,
    latestWebhook,
  ] = await Promise.all([
    prisma.systemIncident.findMany({
      orderBy: { lastOccurredAt: "desc" },
      take: 30,
      where: { status: "OPEN" },
    }),
    prisma.leadTask.findMany({
      include: {
        lead: { select: { id: true, name: true } },
      },
      orderBy: { dueAt: "asc" },
      take: 20,
      where: {
        dueAt: { lt: now },
        status: { in: ["PENDING", "IN_PROGRESS"] },
      },
    }),
    prisma.contactSubmission.findMany({
      orderBy: { responseDueAt: "asc" },
      select: {
        id: true,
        name: true,
        responseDueAt: true,
        source: true,
      },
      take: 20,
      where: {
        firstResponseAt: null,
        responseDueAt: { lt: now },
        status: { notIn: ["WON", "LOST"] },
      },
    }),
    prisma.contactSubmission.count({
      where: {
        assignedTo: null,
        priority: { in: ["HIGH", "URGENT"] },
        status: { notIn: ["WON", "LOST"] },
      },
    }),
    prisma.instagramWebhookEvent.count({
      where: { receivedAt: { gte: since }, status: "FAILED" },
    }),
    prisma.instagramWebhookEvent.findFirst({
      orderBy: { receivedAt: "desc" },
      select: { processedAt: true, receivedAt: true, status: true },
    }),
  ]);

  return {
    breachedLeads,
    failedWebhooks,
    incidents,
    latestWebhook,
    now,
    overdueTasks,
    unassignedPriority,
  };
}

export default async function OperationsPage() {
  const data = await loadOperations();
  const criticalIncidents = data.incidents.filter(
    (incident) => incident.severity === "CRITICAL",
  ).length;
  const healthy =
    criticalIncidents === 0 &&
    data.failedWebhooks === 0 &&
    data.breachedLeads.length === 0;

  const cards = [
    {
      detail: healthy ? "Sin bloqueos críticos" : "Requiere revisión",
      icon: healthy ? CheckCircle2 : ShieldAlert,
      label: "Estado operativo",
      tone: healthy ? "text-brand-emerald" : "text-red-300",
      value: healthy ? "Saludable" : "Atención",
    },
    {
      detail: "Sin primera respuesta",
      icon: Clock3,
      label: "SLA vencidos",
      tone: data.breachedLeads.length ? "text-amber-300" : "text-brand-emerald",
      value: data.breachedLeads.length,
    },
    {
      detail: "Pendientes fuera de plazo",
      icon: AlertTriangle,
      label: "Tareas vencidas",
      tone: data.overdueTasks.length ? "text-amber-300" : "text-brand-emerald",
      value: data.overdueTasks.length,
    },
    {
      detail: "Últimas 24 horas",
      icon: Instagram,
      label: "Webhooks fallidos",
      tone: data.failedWebhooks ? "text-red-300" : "text-brand-emerald",
      value: data.failedWebhooks,
    },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-emerald">
          <Activity className="h-4 w-4" />
          Control operacional
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Salud del <span className="text-brand-emerald">ecosistema</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/50 sm:text-base">
          Alertas técnicas y compromisos comerciales que requieren atención.
          Los datos se actualizan al abrir esta vista.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-wider text-white/40">
                {card.label}
              </p>
              <card.icon className={`h-5 w-5 ${card.tone}`} />
            </div>
            <p className={`mt-4 text-3xl font-black ${card.tone}`}>
              {card.value}
            </p>
            <p className="mt-2 text-xs text-white/35">{card.detail}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/70 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black">Leads fuera de SLA</h2>
              <p className="mt-1 text-sm text-white/40">
                Promesa inicial: primera respuesta en 1 día hábil.
              </p>
            </div>
            <UserRoundCheck className="h-6 w-6 text-brand-blue" />
          </div>
          <div className="mt-5 space-y-3">
            {data.breachedLeads.map((lead) => (
              <a
                key={lead.id}
                href={`/admin/crm/leads/${lead.id}`}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-brand-blue/30"
              >
                <div>
                  <p className="font-bold">{lead.name}</p>
                  <p className="mt-1 text-xs text-white/35">{lead.source}</p>
                </div>
                <span className="text-sm font-black text-amber-300">
                  +{lead.responseDueAt ? age(lead.responseDueAt, data.now) : "—"}
                </span>
              </a>
            ))}
            {data.breachedLeads.length === 0 && (
              <p className="rounded-2xl bg-brand-emerald/10 p-4 text-sm text-brand-emerald">
                No hay leads fuera del plazo de respuesta.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/70 p-6">
          <h2 className="text-xl font-black">Tareas vencidas</h2>
          <p className="mt-1 text-sm text-white/40">
            {data.unassignedPriority} leads de alta prioridad aún no tienen
            responsable.
          </p>
          <div className="mt-5 space-y-3">
            {data.overdueTasks.map((task) => (
              <a
                key={task.id}
                href={`/admin/crm/leads/${task.lead.id}`}
                className="block rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-brand-blue/30"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-bold">{task.title}</p>
                    <p className="mt-1 text-xs text-white/35">
                      {task.lead.name}
                    </p>
                  </div>
                  <span className="text-xs font-black text-amber-300">
                    +{task.dueAt ? age(task.dueAt, data.now) : "—"}
                  </span>
                </div>
              </a>
            ))}
            {data.overdueTasks.length === 0 && (
              <p className="rounded-2xl bg-brand-emerald/10 p-4 text-sm text-brand-emerald">
                No hay tareas vencidas.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-[2rem] border border-white/10 bg-[#0f172a]/70 p-6">
        <h2 className="text-xl font-black">Incidentes abiertos</h2>
        <p className="mt-1 text-sm text-white/40">
          {data.latestWebhook
            ? `Último webhook: ${data.latestWebhook.status}, hace ${age(
                data.latestWebhook.processedAt ||
                  data.latestWebhook.receivedAt,
                data.now,
              )}.`
            : "Aún no se han recibido eventos de Instagram."}
        </p>
        <div className="mt-5 space-y-3">
          {data.incidents.map((incident) => (
            <article
              key={incident.id}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{incident.title}</p>
                  <p className="mt-1 text-xs text-white/35">
                    {incident.source} · {incident.occurrences} ocurrencia(s) ·
                    hace {age(incident.lastOccurredAt, data.now)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-black ${
                    incident.severity === "CRITICAL"
                      ? "bg-red-400/10 text-red-300"
                      : "bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {incident.severity}
                </span>
              </div>
              <p className="mt-3 break-words text-sm text-white/50">
                {incident.detail}
              </p>
            </article>
          ))}
          {data.incidents.length === 0 && (
            <p className="rounded-2xl bg-brand-emerald/10 p-4 text-sm text-brand-emerald">
              No existen incidentes operativos abiertos.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
