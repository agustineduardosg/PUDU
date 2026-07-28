import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MailCheck,
  RotateCcw,
  Send,
  ShieldCheck,
} from "lucide-react";
import { MessageChannel, MessageStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import {
  getEmailDeliveryConfig,
  startOfTodayInSantiago,
} from "@/lib/messaging/email";
import {
  approveOutboxMessages,
  revokeOutboxApproval,
  sendApprovedMessages,
} from "./actions";

export const dynamic = "force-dynamic";

const eventLabels: Record<string, string> = {
  APPROVAL_REVOKED: "Aprobación retirada",
  APPROVED: "Aprobado",
  BLOCKED: "Bloqueado",
  CANCELLED: "Cancelado",
  FAILED: "Fallido",
  PREVIEW_CAPTURED: "Capturado localmente",
  QUEUED: "En cola",
  SEND_STARTED: "Intento iniciado",
  SENT: "Enviado",
};

function formatDate(value: Date | null) {
  if (!value) return "Sin registro";
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(value);
}

async function loadOutbox() {
  const config = getEmailDeliveryConfig();
  if (process.env.CRM_DEMO_MODE === "true") {
    return {
      config,
      drafts: [],
      queued: [],
      recent: [],
      sentToday: 0,
    };
  }

  const commonInclude = {
    campaign: { select: { name: true } },
    deliveryEvents: { orderBy: { createdAt: "desc" as const }, take: 3 },
    lead: {
      select: {
        company: true,
        doNotContact: true,
        email: true,
        id: true,
        name: true,
        unsubscribedAt: true,
      },
    },
  };
  const [drafts, queued, recent, sentToday] = await Promise.all([
    prisma.outboundMessage.findMany({
      include: commonInclude,
      orderBy: { createdAt: "desc" },
      take: 100,
      where: {
        channel: MessageChannel.EMAIL,
        status: { in: [MessageStatus.DRAFT, MessageStatus.FAILED] },
      },
    }),
    prisma.outboundMessage.findMany({
      include: commonInclude,
      orderBy: { approvedAt: "asc" },
      take: 100,
      where: { status: MessageStatus.QUEUED },
    }),
    prisma.outboundMessage.findMany({
      include: commonInclude,
      orderBy: { updatedAt: "desc" },
      take: 20,
      where: {
        status: {
          in: [
            MessageStatus.SENT,
            MessageStatus.DELIVERED,
            MessageStatus.PREVIEWED,
            MessageStatus.CANCELLED,
          ],
        },
      },
    }),
    prisma.outboundMessage.count({
      where: {
        sentAt: { gte: startOfTodayInSantiago() },
        status: { in: [MessageStatus.SENT, MessageStatus.DELIVERED] },
      },
    }),
  ]);

  return { config, drafts, queued, recent, sentToday };
}

type OutboxMessage = Awaited<ReturnType<typeof loadOutbox>>["drafts"][number];

function MessageCard({
  formId,
  message,
  selectable = true,
}: {
  formId?: string;
  message: OutboxMessage;
  selectable?: boolean;
}) {
  const blocked =
    !message.lead ||
    message.lead.doNotContact ||
    Boolean(message.lead.unsubscribedAt);
  const latestEvent = message.deliveryEvents[0];

  return (
    <article className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4 lg:grid-cols-[auto_minmax(0,1fr)_220px]">
      {selectable ? (
        <input
          aria-label={`Seleccionar mensaje para ${message.recipient}`}
          disabled={blocked}
          form={formId}
          name="messageIds"
          type="checkbox"
          value={message.id}
          className="mt-1 h-4 w-4 accent-emerald-400 disabled:opacity-25"
        />
      ) : (
        <span className="mt-1 h-2 w-2 rounded-full bg-white/20" />
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-black">
            {message.lead?.name || "Prospecto eliminado"}
          </p>
          <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] font-black uppercase text-white/45">
            {message.status}
          </span>
          {blocked && (
            <span className="rounded-full bg-red-400/10 px-2 py-1 text-[9px] font-black uppercase text-red-300">
              No contactar
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-white/35">
          {message.lead?.company || "Sin empresa"} · {message.recipient}
        </p>
        <p className="mt-3 text-sm font-bold">
          {message.subject || "Mensaje sin asunto"}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/40">
          {message.content}
        </p>
        {message.errorMessage && (
          <p className="mt-2 text-xs text-red-300">{message.errorMessage}</p>
        )}
      </div>
      <div className="text-xs text-white/35 lg:text-right">
        <p>{message.campaign?.name || "Mensaje individual"}</p>
        <p className="mt-1">{formatDate(message.createdAt)}</p>
        {message.approvedAt && (
          <p className="mt-2 text-brand-emerald">
            Aprobado {formatDate(message.approvedAt)}
          </p>
        )}
        {latestEvent && (
          <p className="mt-2">
            Último evento: {eventLabels[latestEvent.type] || latestEvent.type}
          </p>
        )}
        {message.lead && (
          <Link
            href={`/admin/crm/leads/${message.lead.id}`}
            className="mt-3 inline-block font-bold text-brand-blue hover:text-white"
          >
            Abrir prospecto
          </Link>
        )}
      </div>
    </article>
  );
}

export default async function OutboxPage() {
  const { config, drafts, queued, recent, sentToday } = await loadOutbox();
  const isDemo = process.env.CRM_DEMO_MODE === "true";
  const remaining = Math.max(0, config.dailyLimit - sentToday);
  const deliveryReady = config.enabled && config.configured && remaining > 0;
  const isPreview = config.mode === "preview";

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-emerald">
            Control de comunicaciones
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Bandeja de salida
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/45">
            Revisa, aprueba y registra cada comunicación antes de entregarla al
            proveedor de correo.
          </p>
        </div>
        <div
          className={`rounded-2xl border px-5 py-4 ${
            deliveryReady
              ? "border-brand-emerald/20 bg-brand-emerald/10"
              : "border-amber-400/20 bg-amber-400/10"
          }`}
        >
          <div className="flex items-center gap-3">
            {deliveryReady ? (
              <ShieldCheck className="h-5 w-5 text-brand-emerald" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-300" />
            )}
            <div>
              <p className="text-sm font-black">
                {isPreview
                  ? "Modo de prueba local"
                  : deliveryReady
                    ? "Proveedor habilitado"
                    : "Envío real bloqueado"}
              </p>
              <p className="text-xs text-white/45">
                {isPreview
                  ? "Los mensajes se capturan sin salir a Internet."
                  : !config.configured
                  ? "Falta completar la cuenta SMTP."
                  : !config.enabled
                    ? "Requiere habilitación explícita en configuración."
                    : remaining === 0
                      ? "Se alcanzó el límite diario."
                      : "Listo para envíos confirmados."}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: MailCheck, label: "Por revisar", value: drafts.length },
          { icon: Clock3, label: "Aprobados en cola", value: queued.length },
          { icon: CheckCircle2, label: "Enviados hoy", value: sentToday },
          { icon: ShieldCheck, label: "Cupo disponible", value: remaining },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-white/10 bg-[#0f172a]/75 p-5"
          >
            <metric.icon className="h-5 w-5 text-brand-emerald" />
            <p className="mt-4 text-3xl font-black">{metric.value}</p>
            <p className="mt-1 text-xs text-white/35">{metric.label}</p>
          </div>
        ))}
      </section>

      {isDemo && (
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          La bandeja necesita PostgreSQL activo para registrar aprobaciones.
        </div>
      )}

      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black">1. Revisión humana</h2>
              <p className="mt-1 text-xs text-white/40">
                Selecciona únicamente los mensajes que autorizas para la cola.
              </p>
            </div>
            <form id="approve-outbox" action={approveOutboxMessages}>
              <button
                disabled={isDemo || drafts.length === 0}
                className="rounded-xl bg-brand-emerald px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-30"
              >
                Aprobar seleccionados
              </button>
            </form>
          </div>
          <div className="space-y-3">
            {drafts.map((message) => (
              <MessageCard
                formId="approve-outbox"
                key={message.id}
                message={message}
              />
            ))}
            {drafts.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-white/30">
                No hay borradores pendientes de revisión.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
          <div className="mb-5">
            <h2 className="text-xl font-black">2. Cola aprobada</h2>
            <p className="mt-1 text-xs text-white/40">
              El envío exige selección, confirmación y proveedor habilitado.
            </p>
          </div>
          <div className="space-y-3">
            {queued.map((message) => (
              <MessageCard
                formId="send-outbox"
                key={message.id}
                message={message}
              />
            ))}
            {queued.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-white/30">
                No hay mensajes aprobados en cola.
              </p>
            )}
          </div>
          <form
            id="send-outbox"
            action={sendApprovedMessages}
            className="mt-5 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <button
              formAction={revokeOutboxApproval}
              disabled={isDemo || queued.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-black text-white/55 disabled:opacity-30"
            >
              <RotateCcw className="h-4 w-4" />
              Retirar aprobación
            </button>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="flex items-center gap-2 text-xs text-white/55">
                <input
                  name="confirmSend"
                  type="checkbox"
                  value="yes"
                  className="h-4 w-4 accent-emerald-400"
                />
                {isPreview
                  ? "Confirmo la captura local de los mensajes seleccionados"
                  : "Confirmo el envío real de los mensajes seleccionados"}
              </label>
              <button
                disabled={!deliveryReady || isDemo || queued.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
                {isPreview ? "Capturar seleccionados" : "Enviar seleccionados"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
          <h2 className="text-xl font-black">Trazabilidad reciente</h2>
          <div className="mt-5 space-y-3">
            {recent.map((message) => (
              <MessageCard key={message.id} message={message} selectable={false} />
            ))}
            {recent.length === 0 && (
              <p className="text-sm text-white/30">
                Aún no hay comunicaciones finalizadas o canceladas.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
