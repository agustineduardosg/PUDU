import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Inbox,
  Instagram,
  MessageCircleMore,
  ShieldCheck,
  UserPlus,
  Webhook,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { simulateInstagramInbound } from "./actions";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  BLOCKED: "Bloqueado",
  BOT_ACTIVE: "Bot activo",
  CLOSED: "Cerrado",
  HUMAN_REQUIRED: "Requiere asesor",
  NEW: "Nuevo",
  QUALIFIED: "Calificado",
  WAITING_REPLY: "Esperando respuesta",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(value);
}

async function loadInstagramInbox() {
  if (process.env.CRM_DEMO_MODE === "true") {
    return {
      accounts: 0,
      conversations: [],
      failedEvents: 0,
      processedEvents: 0,
      totalMessages: 0,
    };
  }

  const [
    conversations,
    accounts,
    totalMessages,
    processedEvents,
    failedEvents,
  ] = await Promise.all([
    prisma.instagramConversation.findMany({
      include: {
        account: { select: { displayName: true, username: true } },
        lead: {
          select: {
            company: true,
            doNotContact: true,
            id: true,
            name: true,
            status: true,
          },
        },
        messages: {
          orderBy: { occurredAt: "desc" },
          take: 5,
        },
      },
      orderBy: { lastMessageAt: "desc" },
      take: 100,
    }),
    prisma.instagramAccount.count({ where: { isActive: true } }),
    prisma.instagramMessage.count(),
    prisma.instagramWebhookEvent.count({ where: { status: "PROCESSED" } }),
    prisma.instagramWebhookEvent.count({ where: { status: "FAILED" } }),
  ]);

  return {
    accounts,
    conversations,
    failedEvents,
    processedEvents,
    totalMessages,
  };
}

export default async function InstagramInboxPage() {
  const data = await loadInstagramInbox();
  const isDemo = process.env.CRM_DEMO_MODE === "true";
  const webhookReady = Boolean(
    process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN && process.env.META_APP_SECRET,
  );

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-pink-300">
            <Instagram className="h-4 w-4" />
            Captación inbound
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Instagram <span className="text-pink-300">Inbox</span>
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/45">
            Cada DM entrante se transforma en una conversación trazable y en un
            prospecto del CRM.
          </p>
        </div>
        <div
          className={`rounded-2xl border px-5 py-4 ${
            webhookReady
              ? "border-brand-emerald/20 bg-brand-emerald/10"
              : "border-amber-400/20 bg-amber-400/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <Webhook
              className={`h-5 w-5 ${
                webhookReady ? "text-brand-emerald" : "text-amber-300"
              }`}
            />
            <div>
              <p className="text-sm font-black">
                {webhookReady ? "Webhook preparado" : "Conexión Meta pendiente"}
              </p>
              <p className="text-xs text-white/40">
                {webhookReady
                  ? "Firma y token configurados."
                  : "El simulador local está disponible."}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Instagram, label: "Cuentas conectadas", value: data.accounts },
          {
            icon: Inbox,
            label: "Conversaciones",
            value: data.conversations.length,
          },
          {
            icon: MessageCircleMore,
            label: "Mensajes recibidos",
            value: data.totalMessages,
          },
          {
            icon: ShieldCheck,
            label: "Eventos procesados",
            value: data.processedEvents,
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-white/10 bg-[#0f172a]/75 p-5"
          >
            <metric.icon className="h-5 w-5 text-pink-300" />
            <p className="mt-4 text-3xl font-black">{metric.value}</p>
            <p className="mt-1 text-xs text-white/35">{metric.label}</p>
          </div>
        ))}
      </section>

      {data.failedEvents > 0 && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-200">
          Hay {data.failedEvents} eventos de Instagram que requieren revisión.
        </div>
      )}

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.5fr)_420px]">
        <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
          <div className="mb-5 flex items-center gap-3">
            <Inbox className="h-5 w-5 text-pink-300" />
            <div>
              <h2 className="text-xl font-black">Conversaciones recibidas</h2>
              <p className="text-xs text-white/40">
                Ordenadas por la interacción más reciente.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {data.conversations.map((conversation) => (
              <article
                key={conversation.id}
                className="rounded-2xl border border-white/10 bg-slate-950/55 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black">
                        {conversation.username
                          ? `@${conversation.username}`
                          : conversation.lead?.name ||
                            `Instagram ${conversation.externalUserId.slice(-6)}`}
                      </h3>
                      <span className="rounded-full bg-pink-400/10 px-2 py-1 text-[9px] font-black uppercase text-pink-200">
                        {statusLabels[conversation.status] || conversation.status}
                      </span>
                      {conversation.lead?.doNotContact && (
                        <span className="rounded-full bg-red-400/10 px-2 py-1 text-[9px] font-black uppercase text-red-200">
                          No contactar
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-white/35">
                      {conversation.lead?.company || "Sin empresa identificada"} ·{" "}
                      {conversation.account.displayName ||
                        conversation.account.username ||
                        "Cuenta PUDU"}
                    </p>
                  </div>
                  <div className="text-xs text-white/30 sm:text-right">
                    <p>{formatDate(conversation.lastMessageAt)}</p>
                    {conversation.lead && (
                      <Link
                        href={`/admin/crm/leads/${conversation.lead.id}`}
                        className="mt-2 inline-flex items-center gap-1 font-bold text-brand-blue hover:text-white"
                      >
                        Abrir lead
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {[...conversation.messages].reverse().map((message) => (
                    <div
                      key={message.id}
                      className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[9px] font-black uppercase tracking-wider text-pink-300">
                          {message.direction === "INBOUND"
                            ? "Prospecto"
                            : "PUDU"}
                        </p>
                        <time className="text-[9px] text-white/25">
                          {formatDate(message.occurredAt)}
                        </time>
                      </div>
                      <p className="mt-1 text-sm text-white/60">
                        {message.text || "Contenido multimedia"}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
            {data.conversations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
                <UserPlus className="mx-auto h-8 w-8 text-white/20" />
                <p className="mt-3 text-sm text-white/35">
                  Todavía no hay mensajes entrantes.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <form
            action={simulateInstagramInbound}
            className="rounded-[2rem] border border-pink-400/15 bg-pink-400/[0.05] p-6"
          >
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-pink-300" />
              <div>
                <h2 className="font-black">Simulador inbound</h2>
                <p className="text-xs text-white/40">
                  Prueba la captación sin conectar Meta.
                </p>
              </div>
            </div>
            <fieldset disabled={isDemo} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                  Cuenta del prospecto
                </span>
                <input
                  name="username"
                  required
                  placeholder="@empresa_ejemplo"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                  Mensaje entrante
                </span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Hola, necesito ordenar mis ventas con un CRM..."
                  className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-slate-950 p-3 text-sm"
                />
              </label>
              <button className="w-full rounded-xl bg-pink-300 px-4 py-3 text-sm font-black text-slate-950 disabled:opacity-30">
                Simular DM entrante
              </button>
            </fieldset>
          </form>

          <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
            <h2 className="font-black">Endpoint para Meta</h2>
            <code className="mt-3 block break-all rounded-xl bg-slate-950 p-3 text-xs text-brand-emerald">
              /api/webhooks/instagram
            </code>
            <div className="mt-4 space-y-3 text-xs leading-relaxed text-white/40">
              <p>GET valida el token solicitado por Meta.</p>
              <p>POST verifica la firma SHA-256 antes de leer el evento.</p>
              <p>Los reintentos duplicados no crean mensajes ni leads nuevos.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
