import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  ExternalLink,
  MailCheck,
  MessageSquareText,
  ShieldCheck,
  SkipForward,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { crmDemoLeads } from "@/data/crmDemo";
import { defaultMessageTemplates } from "@/data/messageTemplates";
import {
  addCampaignMembers,
  bulkReviewCampaignMembers,
  generateApprovedCampaignDrafts,
  setCampaignTemplate,
  updateCampaignMemberStatus,
} from "../actions";

export const dynamic = "force-dynamic";

type LeadSummary = {
  company: string | null;
  doNotContact?: boolean;
  email: string | null;
  id: string;
  instagram: string | null;
  interest: string;
  name: string;
  phone: string | null;
  priority: string;
  status: string;
  unsubscribedAt?: Date | null;
};

type CampaignDetailView = {
  campaign: {
    channel: string;
    description: string | null;
    id: string;
    members: {
      approvedAt: Date | null;
      id: string;
      lead: LeadSummary;
      status: string;
    }[];
    messages: {
      content: string;
      createdAt: Date;
      id: string;
      lead: { name: string } | null;
      recipient: string;
      status: string;
      subject: string | null;
    }[];
    name: string;
    status: string;
    template: {
      content: string;
      id: string;
      name: string;
      subject: string | null;
    } | null;
    templateId: string | null;
  };
  availableLeads: LeadSummary[];
  isDemo: boolean;
  templates: {
    channel: string;
    id: string;
    name: string;
  }[];
};

const memberLabels: Record<string, string> = {
  APPROVED: "Aprobado",
  CONTACTED: "Contactado",
  PENDING: "Pendiente",
  QUALIFIED: "Calificado",
  REPLIED: "Respondió",
  SKIPPED: "Omitido",
};

function contactForChannel(channel: string, lead: LeadSummary) {
  if (channel === "EMAIL") return lead.email;
  if (channel === "INSTAGRAM") return lead.instagram;
  if (channel === "WHATSAPP" || channel === "SMS") return lead.phone;
  return null;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

async function loadCampaign(campaignId: string): Promise<CampaignDetailView | null> {
  const isDemo = process.env.CRM_DEMO_MODE === "true";

  if (isDemo) {
    const members = crmDemoLeads.slice(0, 3).map((lead, index) => ({
      approvedAt: index === 0 ? new Date() : null,
      id: `demo-member-${lead.id}`,
      lead,
      status: index === 0 ? "APPROVED" : "PENDING",
    }));
    return {
      availableLeads: crmDemoLeads.slice(3),
      campaign: {
        channel: "EMAIL",
        description:
          "Demostración del flujo de audiencia, aprobación y borradores.",
        id: campaignId,
        members,
        messages: [],
        name: "Campaña demostrativa",
        status: "DRAFT",
        template: defaultMessageTemplates[0],
        templateId: defaultMessageTemplates[0].id,
      },
      isDemo,
      templates: defaultMessageTemplates.map(({ channel, id, name }) => ({
        channel,
        id,
        name,
      })),
    };
  }

  const { prisma } = await import("@/lib/prisma");
  const [campaign, availableLeads, templates] = await Promise.all([
    prisma.campaign.findUnique({
      include: {
        members: {
          include: {
            lead: {
              select: {
                company: true,
                doNotContact: true,
                email: true,
                id: true,
                instagram: true,
                interest: true,
                name: true,
                phone: true,
                priority: true,
                status: true,
                unsubscribedAt: true,
              },
            },
          },
          orderBy: [{ status: "asc" }, { createdAt: "asc" }],
        },
        messages: {
          include: { lead: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
        template: {
          select: {
            content: true,
            id: true,
            name: true,
            subject: true,
          },
        },
      },
      where: { id: campaignId },
    }),
    prisma.contactSubmission.findMany({
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      select: {
        company: true,
        doNotContact: true,
        email: true,
        id: true,
        instagram: true,
        interest: true,
        name: true,
        phone: true,
        priority: true,
        status: true,
        unsubscribedAt: true,
      },
      where: {
        campaignMembers: { none: { campaignId } },
        doNotContact: false,
        unsubscribedAt: null,
        status: { not: "LOST" },
      },
    }),
    prisma.messageTemplate.findMany({
      orderBy: [{ channel: "asc" }, { name: "asc" }],
      select: { channel: true, id: true, name: true },
      where: { isActive: true },
    }),
  ]);

  if (!campaign) return null;

  return {
    availableLeads,
    campaign,
    isDemo,
    templates,
  } as CampaignDetailView;
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadCampaign(id);
  if (!data) notFound();

  const { availableLeads, campaign, isDemo, templates } = data;
  const approvedMembers = campaign.members.filter(
    (member) => member.status === "APPROVED",
  );
  const pendingMembers = campaign.members.filter(
    (member) => member.status === "PENDING",
  );
  const readyMembers = approvedMembers.filter((member) =>
    Boolean(contactForChannel(campaign.channel, member.lead)) &&
    !member.lead.doNotContact &&
    !member.lead.unsubscribedAt,
  );

  return (
    <div className="animate-in fade-in duration-500">
      <Link
        href="/admin/crm/campaigns"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a campañas
      </Link>

      <header className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-pink-400/10 px-3 py-1 text-[10px] font-black uppercase text-pink-300">
              {campaign.channel}
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase text-white/45">
              {campaign.status}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">{campaign.name}</h1>
          <p className="mt-2 max-w-3xl text-white/50">
            {campaign.description || "Sin descripción registrada."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Audiencia", value: campaign.members.length },
            { label: "Pendientes", value: pendingMembers.length },
            { label: "Aprobados", value: approvedMembers.length },
            { label: "Borradores", value: campaign.messages.length },
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

      <div className="mb-6 flex gap-3 rounded-2xl border border-brand-emerald/20 bg-brand-emerald/10 px-5 py-4">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-emerald" />
        <div>
          <p className="text-sm font-black text-brand-emerald">
            Revisión humana en dos pasos
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/50">
            Primero apruebas destinatarios. Después generas borradores
            personalizados. Ninguna acción de esta pantalla envía mensajes.
          </p>
        </div>
      </div>

      {isDemo && (
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
          Campaña demostrativa: las acciones están desactivadas.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-brand-blue" />
              <div>
                <h2 className="font-black">Plantilla de la campaña</h2>
                <p className="text-xs text-white/40">
                  Define el canal y el contenido base de los borradores.
                </p>
              </div>
            </div>
            <form action={setCampaignTemplate}>
              <input type="hidden" name="campaignId" value={campaign.id} />
              <fieldset
                disabled={isDemo}
                className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <select
                  name="templateId"
                  aria-label="Plantilla de campaña"
                  defaultValue={campaign.templateId || ""}
                  className="rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
                >
                  <option value="">Sin plantilla</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} · {template.channel}
                    </option>
                  ))}
                </select>
                <button className="rounded-xl bg-brand-blue px-5 py-3 text-sm font-black disabled:opacity-40">
                  Guardar plantilla
                </button>
              </fieldset>
            </form>
            {campaign.template && (
              <div className="mt-4 rounded-2xl border border-white/5 bg-slate-950/50 p-4">
                <p className="text-xs font-black text-white/60">
                  {campaign.template.subject || campaign.template.name}
                </p>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/35">
                  {campaign.template.content}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-pink-300" />
                  <h2 className="font-black">Revisión de audiencia</h2>
                </div>
                <p className="mt-1 text-xs text-white/40">
                  Selecciona filas para aprobar u omitir en conjunto.
                </p>
              </div>
              <form
                id="bulk-review-campaign"
                action={bulkReviewCampaignMembers}
                className="flex gap-2"
              >
                <input type="hidden" name="campaignId" value={campaign.id} />
                <button
                  name="status"
                  value="APPROVED"
                  disabled={isDemo || campaign.members.length === 0}
                  className="rounded-xl bg-brand-emerald/10 px-3 py-2 text-xs font-black text-brand-emerald disabled:opacity-30"
                >
                  Aprobar seleccionados
                </button>
                <button
                  name="status"
                  value="SKIPPED"
                  disabled={isDemo || campaign.members.length === 0}
                  className="rounded-xl bg-white/5 px-3 py-2 text-xs font-black text-white/50 disabled:opacity-30"
                >
                  Omitir
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {campaign.members.map((member) => {
                const contact = contactForChannel(campaign.channel, member.lead);
                return (
                  <article
                    key={member.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl border border-white/10 bg-slate-950/55 p-4 lg:grid-cols-[auto_minmax(0,1fr)_auto]"
                  >
                    <input
                      type="checkbox"
                      name="memberIds"
                      value={member.id}
                      form="bulk-review-campaign"
                      disabled={isDemo}
                      aria-label={`Seleccionar ${member.lead.name}`}
                      className="mt-1 h-4 w-4 accent-emerald-400"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-black">
                          {member.lead.name}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-black uppercase ${
                            member.status === "APPROVED"
                              ? "bg-brand-emerald/10 text-brand-emerald"
                              : member.status === "SKIPPED"
                                ? "bg-white/5 text-white/30"
                                : "bg-amber-400/10 text-amber-300"
                          }`}
                        >
                          {memberLabels[member.status] || member.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/40">
                        {member.lead.company || "Sin empresa"} ·{" "}
                        {member.lead.interest}
                      </p>
                      <p
                        className={`mt-2 text-[10px] ${
                          contact ? "text-white/35" : "text-red-300"
                        }`}
                      >
                        {contact || `Sin contacto compatible con ${campaign.channel}`}
                      </p>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 lg:col-span-1">
                      <Link
                        href={`/admin/crm/leads/${member.lead.id}`}
                        aria-label={`Abrir ${member.lead.name}`}
                        className="rounded-lg border border-white/10 p-2 text-white/35 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      {!isDemo && (
                        <>
                          <form action={updateCampaignMemberStatus}>
                            <input
                              type="hidden"
                              name="campaignId"
                              value={campaign.id}
                            />
                            <input
                              type="hidden"
                              name="memberId"
                              value={member.id}
                            />
                            <button
                              name="status"
                              value="APPROVED"
                              aria-label={`Aprobar ${member.lead.name}`}
                              className="rounded-lg bg-brand-emerald/10 p-2 text-brand-emerald"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          </form>
                          <form action={updateCampaignMemberStatus}>
                            <input
                              type="hidden"
                              name="campaignId"
                              value={campaign.id}
                            />
                            <input
                              type="hidden"
                              name="memberId"
                              value={member.id}
                            />
                            <button
                              name="status"
                              value="SKIPPED"
                              aria-label={`Omitir ${member.lead.name}`}
                              className="rounded-lg bg-white/5 p-2 text-white/35"
                            >
                              <SkipForward className="h-4 w-4" />
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
              {campaign.members.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-white/30">
                  Agrega prospectos desde el panel lateral.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <MailCheck className="h-5 w-5 text-brand-emerald" />
                  <h2 className="font-black">Preparar borradores</h2>
                </div>
                <p className="mt-1 text-xs text-white/40">
                  {readyMembers.length} aprobados tienen un contacto compatible.
                </p>
              </div>
              <form action={generateApprovedCampaignDrafts}>
                <input type="hidden" name="campaignId" value={campaign.id} />
                <button
                  disabled={
                    isDemo || !campaign.templateId || readyMembers.length === 0
                  }
                  className="rounded-xl bg-brand-emerald px-5 py-3 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Generar borradores aprobados
                </button>
              </form>
            </div>

            <div className="mt-5 space-y-3">
              {campaign.messages.map((message) => (
                <article
                  key={message.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-brand-blue">
                        {message.status} · {message.recipient}
                      </p>
                      <h3 className="mt-1 text-sm font-black">
                        {message.subject || "Mensaje sin asunto"}
                      </h3>
                      <p className="mt-1 text-xs text-white/35">
                        {message.lead?.name || "Prospecto eliminado"}
                      </p>
                    </div>
                    <time className="text-[10px] text-white/25">
                      {formatDate(message.createdAt)}
                    </time>
                  </div>
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-white/45">
                    {message.content}
                  </p>
                </article>
              ))}
              {campaign.messages.length === 0 && (
                <p className="text-sm text-white/30">
                  Todavía no se han generado borradores para esta campaña.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <form
            action={addCampaignMembers}
            className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6"
          >
            <input type="hidden" name="campaignId" value={campaign.id} />
            <div className="mb-5 flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-brand-blue" />
              <div>
                <h2 className="font-black">Agregar prospectos</h2>
                <p className="text-xs text-white/40">
                  {availableLeads.length} disponibles
                </p>
              </div>
            </div>
            <fieldset disabled={isDemo}>
              <div className="max-h-[480px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                {availableLeads.map((lead) => (
                  <label
                    key={lead.id}
                    className="flex cursor-pointer gap-3 rounded-xl border border-white/5 bg-slate-950/45 p-3 hover:border-brand-blue/25"
                  >
                    <input
                      type="checkbox"
                      name="leadIds"
                      value={lead.id}
                      className="mt-1 h-4 w-4 accent-blue-400"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-black">
                        {lead.name}
                      </span>
                      <span className="mt-1 block truncate text-[10px] text-white/35">
                        {lead.company || "Sin empresa"} · {lead.interest}
                      </span>
                    </span>
                  </label>
                ))}
                {availableLeads.length === 0 && (
                  <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-white/30">
                    Todos los prospectos activos ya están en la campaña.
                  </p>
                )}
              </div>
              <button
                disabled={availableLeads.length === 0}
                className="mt-4 w-full rounded-xl bg-brand-blue px-4 py-3 text-sm font-black disabled:opacity-30"
              >
                Incorporar seleccionados
              </button>
            </fieldset>
          </form>

          <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-pink-300" />
              <h2 className="font-black">Reglas del flujo</h2>
            </div>
            <div className="mt-4 space-y-3 text-xs text-white/45">
              {[
                "Un prospecto aparece una sola vez por campaña.",
                "Solo los aprobados generan borrador.",
                "Sin contacto compatible, el prospecto se omite.",
                "Regenerar no duplica borradores existentes.",
                "El envío queda fuera de esta fase.",
              ].map((rule) => (
                <p key={rule} className="flex gap-2">
                  <Circle className="mt-0.5 h-3 w-3 shrink-0 text-brand-emerald" />
                  {rule}
                </p>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
