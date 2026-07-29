import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChartNoAxesCombined,
  MousePointerClick,
  Target,
  UsersRound,
} from "lucide-react";

export const dynamic = "force-dynamic";

const eventLabels = {
  PAGE_VIEW: "Visitas",
  CTA_CLICK: "Clics en llamados",
  DIAGNOSTIC_STARTED: "Diagnósticos iniciados",
  DIAGNOSTIC_COMPLETED: "Diagnósticos completos",
  CONTACT_FORM_STARTED: "Formularios iniciados",
  LEAD_SUBMITTED: "Leads recibidos",
} as const;

function percentage(value: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function sourceName(value: string | null) {
  if (!value) return "Tráfico directo";
  const normalized = value.toLowerCase();
  if (normalized === "ig" || normalized.includes("instagram")) {
    return "Instagram";
  }
  return value;
}

async function loadAnalytics() {
  const isDemo = process.env.CRM_DEMO_MODE === "true";
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  if (isDemo) {
    return { events: [], instagramLeads: [], isDemo, sessions: [], since };
  }

  const { prisma } = await import("@/lib/prisma");
  const [sessions, events, instagramLeads] = await Promise.all([
    prisma.conversionSession.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        leadId: true,
        sessionKey: true,
        utmCampaign: true,
        utmSource: true,
      },
      where: { createdAt: { gte: since } },
    }),
    prisma.conversionEvent.findMany({
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, name: true, sessionId: true },
      where: { createdAt: { gte: since } },
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        interest: true,
        status: true,
        tags: true,
      },
      where: {
        createdAt: { gte: since },
        source: "INSTAGRAM",
      },
    }),
  ]);

  return { events, instagramLeads, isDemo, sessions, since };
}

export default async function ConversionAnalyticsPage() {
  const { events, instagramLeads, isDemo, sessions, since } =
    await loadAnalytics();
  const uniqueByEvent = new Map<string, Set<string>>();

  for (const event of events) {
    const sessionsForEvent =
      uniqueByEvent.get(event.name) || new Set<string>();
    sessionsForEvent.add(event.sessionId);
    uniqueByEvent.set(event.name, sessionsForEvent);
  }

  const visits =
    uniqueByEvent.get("PAGE_VIEW")?.size || sessions.length;
  const ctaClicks = uniqueByEvent.get("CTA_CLICK")?.size || 0;
  const diagnosticStarts =
    uniqueByEvent.get("DIAGNOSTIC_STARTED")?.size || 0;
  const diagnosticCompletions =
    uniqueByEvent.get("DIAGNOSTIC_COMPLETED")?.size || 0;
  const formStarts =
    uniqueByEvent.get("CONTACT_FORM_STARTED")?.size || 0;
  const leads = uniqueByEvent.get("LEAD_SUBMITTED")?.size || 0;

  const sources = new Map<
    string,
    { campaigns: Set<string>; leads: number; sessions: number }
  >();

  for (const session of sessions) {
    const key = sourceName(session.utmSource);
    const current = sources.get(key) || {
      campaigns: new Set<string>(),
      leads: 0,
      sessions: 0,
    };
    current.sessions += 1;
    current.leads += session.leadId ? 1 : 0;
    if (session.utmCampaign) current.campaigns.add(session.utmCampaign);
    sources.set(key, current);
  }

  const sourceRows = [...sources.entries()]
    .map(([source, data]) => ({ source, ...data }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 8);

  const qualifiedStatuses = new Set([
    "QUALIFYING",
    "CONTACTED",
    "MEETING",
    "PROPOSAL",
    "NEGOTIATION",
    "WON",
  ]);
  const meetingStatuses = new Set([
    "MEETING",
    "PROPOSAL",
    "NEGOTIATION",
    "WON",
  ]);
  const verticalLabels: Record<string, string> = {
    belleza: "Belleza",
    fitness: "Fitness",
    general: "General",
    salud: "Salud",
  };
  const keywordRowsMap = new Map<
    string,
    {
      keyword: string;
      leads: number;
      meetings: number;
      qualified: number;
      vertical: string;
    }
  >();

  for (const lead of instagramLeads) {
    const vertical =
      lead.tags
        .find((tag) => tag.startsWith("rubro:"))
        ?.slice("rubro:".length) || "sin-clasificar";
    const keyword =
      lead.tags
        .find((tag) => tag.startsWith("campana:"))
        ?.slice("campana:".length)
        .toLocaleUpperCase("es-CL") || "ORGÁNICO";
    const key = `${vertical}:${keyword}`;
    const current = keywordRowsMap.get(key) || {
      keyword,
      leads: 0,
      meetings: 0,
      qualified: 0,
      vertical: verticalLabels[vertical] || "Sin clasificar",
    };
    current.leads += 1;
    current.qualified += qualifiedStatuses.has(lead.status) ? 1 : 0;
    current.meetings += meetingStatuses.has(lead.status) ? 1 : 0;
    keywordRowsMap.set(key, current);
  }

  const keywordRows = [...keywordRowsMap.values()].sort(
    (a, b) => b.leads - a.leads,
  );

  const funnel = [
    { label: eventLabels.PAGE_VIEW, value: visits },
    { label: eventLabels.CTA_CLICK, value: ctaClicks },
    {
      label: eventLabels.DIAGNOSTIC_STARTED,
      value: diagnosticStarts,
    },
    {
      label: eventLabels.DIAGNOSTIC_COMPLETED,
      value: diagnosticCompletions,
    },
    {
      label: eventLabels.CONTACT_FORM_STARTED,
      value: formStarts,
    },
    { label: eventLabels.LEAD_SUBMITTED, value: leads },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {isDemo && (
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
          La analítica está en modo demostración. Conecta la base de datos para
          comenzar a medir visitas y conversiones reales.
        </div>
      )}

      <header className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-emerald">
            <ChartNoAxesCombined className="h-4 w-4" />
            Medición de conversión
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Embudo de <span className="text-brand-emerald">crecimiento</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/50 sm:text-base">
            Desde la primera visita hasta el lead guardado en el CRM. Ventana
            móvil desde el {since.toLocaleDateString("es-CL")}.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-white/35">
            Conversión visita → lead
          </p>
          <p className="mt-1 text-3xl font-black text-brand-emerald">
            {percentage(leads, visits)}
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            detail: `${sessions.length} sesiones atribuidas`,
            icon: UsersRound,
            label: "Visitas",
            value: visits,
          },
          {
            detail: `${percentage(ctaClicks, visits)} de las visitas`,
            icon: MousePointerClick,
            label: "Interés",
            value: ctaClicks,
          },
          {
            detail: `${percentage(diagnosticCompletions, diagnosticStarts)} completados`,
            icon: Target,
            label: "Diagnósticos",
            value: diagnosticCompletions,
          },
          {
            detail: `${percentage(leads, formStarts)} de formularios`,
            icon: BarChart3,
            label: "Leads",
            value: leads,
          },
        ].map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-wider text-white/40">
                {metric.label}
              </p>
              <metric.icon className="h-5 w-5 text-brand-emerald" />
            </div>
            <p className="mt-4 text-4xl font-black">{metric.value}</p>
            <p className="mt-2 text-xs text-white/35">{metric.detail}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/70 p-5 sm:p-7">
          <h2 className="text-xl font-black">Embudo completo</h2>
          <p className="mt-1 text-sm text-white/40">
            Personas únicas que alcanzaron cada paso.
          </p>
          <div className="mt-6 space-y-4">
            {funnel.map((step, index) => {
              const previous = index === 0 ? visits : funnel[index - 1].value;
              const width = visits ? Math.max((step.value / visits) * 100, 4) : 0;

              return (
                <div key={step.label}>
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">{step.label}</p>
                      {index > 0 && (
                        <p className="text-[10px] text-white/30">
                          {percentage(step.value, previous)} desde el paso
                          anterior
                        </p>
                      )}
                    </div>
                    <p className="text-xl font-black">{step.value}</p>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-emerald"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f172a]/70">
          <div className="p-5 sm:p-7">
            <h2 className="text-xl font-black">Rendimiento por origen</h2>
            <p className="mt-1 text-sm text-white/40">
              La atribución conserva la primera fuente de cada sesión.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead className="border-y border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-wider text-white/30">
                <tr>
                  <th className="px-6 py-4">Origen</th>
                  <th className="px-4 py-4">Sesiones</th>
                  <th className="px-4 py-4">Leads</th>
                  <th className="px-4 py-4">Conversión</th>
                  <th className="px-6 py-4">Campañas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sourceRows.map((row) => {
                  const rate = row.sessions
                    ? row.leads / row.sessions
                    : 0;

                  return (
                    <tr key={row.source} className="text-sm">
                      <td className="px-6 py-4 font-bold">{row.source}</td>
                      <td className="px-4 py-4 text-white/60">
                        {row.sessions}
                      </td>
                      <td className="px-4 py-4 text-white/60">{row.leads}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 font-bold text-brand-emerald">
                          {percentage(row.leads, row.sessions)}
                          {rate > 0 ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5 text-white/25" />
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/40">
                        {row.campaigns.size || "—"}
                      </td>
                    </tr>
                  );
                })}
                {sourceRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-white/30"
                    >
                      Aún no hay sesiones en esta ventana. Las nuevas visitas
                      comenzarán a aparecer automáticamente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f172a]/70">
        <div className="p-5 sm:p-7">
          <h2 className="text-xl font-black">
            Instagram por palabra clave y rubro
          </h2>
          <p className="mt-1 text-sm text-white/40">
            DMs capturados durante la temporada editorial de salud, belleza y
            fitness.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead className="border-y border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-wider text-white/30">
              <tr>
                <th className="px-6 py-4">Rubro</th>
                <th className="px-4 py-4">Palabra</th>
                <th className="px-4 py-4">Leads</th>
                <th className="px-4 py-4">Calificados</th>
                <th className="px-4 py-4">Conversión</th>
                <th className="px-6 py-4">Reuniones+</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {keywordRows.map((row) => (
                <tr
                  key={`${row.vertical}-${row.keyword}`}
                  className="text-sm"
                >
                  <td className="px-6 py-4 font-bold">{row.vertical}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full border border-brand-emerald/20 bg-brand-emerald/10 px-2.5 py-1 text-[10px] font-black text-brand-emerald">
                      {row.keyword}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white/60">{row.leads}</td>
                  <td className="px-4 py-4 text-white/60">
                    {row.qualified}
                  </td>
                  <td className="px-4 py-4 font-bold text-brand-emerald">
                    {percentage(row.qualified, row.leads)}
                  </td>
                  <td className="px-6 py-4 text-white/60">{row.meetings}</td>
                </tr>
              ))}
              {keywordRows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-white/30"
                  >
                    Los primeros DMs con SALUD, AGENDA, FITNESS o DIAGNÓSTICO
                    aparecerán aquí.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
