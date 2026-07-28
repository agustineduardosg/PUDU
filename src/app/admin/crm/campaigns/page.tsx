import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Megaphone,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  createCampaign,
  updateCampaignStatus,
} from "../prospecting-actions";

export const dynamic = "force-dynamic";

type CampaignView = {
  channel: string;
  description: string | null;
  id: string;
  members: { status: string }[];
  messagesCount: number;
  name: string;
  status: string;
};

const demoCampaigns: CampaignView[] = [
  {
    channel: "INSTAGRAM",
    description:
      "Empresas de servicios en Chile con oportunidades visibles de agenda y automatización.",
    id: "demo-campaign-instagram",
    members: [
      { status: "APPROVED" },
      { status: "APPROVED" },
      { status: "REPLIED" },
      { status: "PENDING" },
    ],
    messagesCount: 3,
    name: "Prospección Instagram · Servicios",
    status: "ACTIVE",
  },
  {
    channel: "EMAIL",
    description:
      "Seguimiento consultivo a prospectos que mostraron interés en CRM y SaaS.",
    id: "demo-campaign-followup",
    members: [
      { status: "CONTACTED" },
      { status: "QUALIFIED" },
      { status: "PENDING" },
    ],
    messagesCount: 2,
    name: "Seguimiento oportunidades CRM",
    status: "DRAFT",
  },
];

async function loadCampaigns() {
  const isDemo = process.env.CRM_DEMO_MODE === "true";
  if (isDemo) return { campaigns: demoCampaigns, isDemo };

  const { prisma } = await import("@/lib/prisma");
  const databaseCampaigns = await prisma.campaign.findMany({
    include: {
      members: { select: { status: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const campaigns: CampaignView[] = databaseCampaigns.map((campaign) => ({
    channel: campaign.channel,
    description: campaign.description,
    id: campaign.id,
    members: campaign.members,
    messagesCount: campaign._count.messages,
    name: campaign.name,
    status: campaign.status,
  }));
  return { campaigns, isDemo };
}

const statusLabels: Record<string, string> = {
  ACTIVE: "Activa",
  ARCHIVED: "Archivada",
  COMPLETED: "Completada",
  DRAFT: "Borrador",
  PAUSED: "Pausada",
};

export default async function CampaignsPage() {
  const { campaigns, isDemo } = await loadCampaigns();

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-pink-300">
          <Megaphone className="h-4 w-4" />
          Prospección controlada
        </div>
        <h1 className="text-4xl font-black tracking-tight">
          Campañas de <span className="text-pink-300">acercamiento</span>
        </h1>
        <p className="mt-2 max-w-3xl text-white/50">
          Agrupa prospectos, prepara comunicaciones y mide respuestas sin
          convertir el contacto en spam.
        </p>
      </header>

      <div className="mb-6 flex gap-3 rounded-2xl border border-brand-emerald/20 bg-brand-emerald/10 px-5 py-4">
        <ShieldCheck className="h-5 w-5 shrink-0 text-brand-emerald" />
        <div>
          <p className="text-sm font-black text-brand-emerald">
            Aprobación humana obligatoria
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/50">
            Activar una campaña no envía mensajes automáticamente. Cada
            destinatario y borrador debe revisarse antes de conectar un proveedor
            de envío.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(340px,0.65fr)_minmax(0,1.35fr)]">
        <form
          action={createCampaign}
          className="h-fit rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6"
        >
          <h2 className="font-black">Nueva campaña</h2>
          <p className="mt-1 text-xs text-white/40">
            Se crea como borrador para definir audiencia y mensaje.
          </p>
          <fieldset disabled={isDemo} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Nombre
              </span>
              <input
                name="name"
                required
                placeholder="Prospección clínicas Santiago"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Canal principal
              </span>
              <select
                name="channel"
                defaultValue="INSTAGRAM"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
              >
                <option value="INSTAGRAM">Instagram</option>
                <option value="EMAIL">Email</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="LINKEDIN">LinkedIn</option>
                <option value="SMS">SMS</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Objetivo y audiencia
              </span>
              <textarea
                name="description"
                rows={5}
                placeholder="Rubro, territorio, señal observada y propuesta de valor..."
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
              />
            </label>
            <button className="w-full rounded-xl bg-pink-400 px-4 py-3 text-sm font-black text-slate-950 disabled:opacity-40">
              {isDemo ? "Disponible con base real" : "Crear borrador"}
            </button>
          </fieldset>
        </form>

        <section className="grid grid-cols-1 gap-4">
          {campaigns.map((campaign) => {
            const replies = campaign.members.filter(
              (member) => member.status === "REPLIED",
            ).length;
            const approved = campaign.members.filter((member) =>
              ["APPROVED", "CONTACTED", "REPLIED", "QUALIFIED"].includes(
                member.status,
              ),
            ).length;
            const nextStatus =
              campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE";

            return (
              <article
                key={campaign.id}
                className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-black">{campaign.name}</h2>
                      <span className="rounded-full bg-pink-400/10 px-2.5 py-1 text-[9px] font-black uppercase text-pink-300">
                        {campaign.channel}
                      </span>
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-[9px] font-black uppercase text-white/45">
                        {statusLabels[campaign.status] || campaign.status}
                      </span>
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/45">
                      {campaign.description || "Sin descripción registrada."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isDemo &&
                      !["COMPLETED", "ARCHIVED"].includes(campaign.status) && (
                        <form action={updateCampaignStatus}>
                          <input
                            type="hidden"
                            name="campaignId"
                            value={campaign.id}
                          />
                          <button
                            name="status"
                            value={nextStatus}
                            className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-white/50 hover:text-white"
                          >
                            {campaign.status === "ACTIVE" ? (
                              <PauseCircle className="h-4 w-4" />
                            ) : (
                              <PlayCircle className="h-4 w-4" />
                            )}
                            {campaign.status === "ACTIVE" ? "Pausar" : "Activar"}
                          </button>
                        </form>
                      )}
                    <Link
                      href={`/admin/crm/campaigns/${campaign.id}`}
                      className="flex items-center gap-2 rounded-xl bg-pink-400/10 px-3 py-2 text-xs font-black text-pink-300"
                    >
                      Gestionar
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    {
                      icon: Users,
                      label: "Prospectos",
                      value: campaign.members.length,
                    },
                    {
                      icon: ShieldCheck,
                      label: "Aprobados",
                      value: approved,
                    },
                    {
                      icon: Megaphone,
                      label: "Borradores",
                      value: campaign.messagesCount,
                    },
                    {
                      icon: CheckCircle2,
                      label: "Respuestas",
                      value: replies,
                    },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-white/5 bg-slate-950/50 p-3"
                    >
                      <metric.icon className="h-4 w-4 text-white/30" />
                      <p className="mt-2 text-xl font-black">{metric.value}</p>
                      <p className="text-[9px] font-black uppercase tracking-wider text-white/30">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
          {campaigns.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-white/10 p-12 text-center text-sm text-white/30">
              Aún no hay campañas creadas.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
