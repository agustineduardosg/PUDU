"use server";

import {
  DeliveryEventType,
  MessageChannel,
  MessageStatus,
} from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  getEmailDeliveryConfig,
  sendEmailMessage,
  startOfTodayInSantiago,
} from "@/lib/messaging/email";

const administrator = "Admin PUDU";

function clean(value: unknown, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

function selectedIds(formData: FormData) {
  return Array.from(
    new Set(
      formData
        .getAll("messageIds")
        .map((value) => clean(value, 100))
        .filter(Boolean),
    ),
  ).slice(0, 200);
}

function ensureWritableCrm() {
  if (process.env.CRM_DEMO_MODE === "true") {
    throw new Error("La bandeja está desactivada en el modo de demostración.");
  }
}

function refreshOutbox(leadIds: Array<string | null> = []) {
  revalidatePath("/admin/crm");
  revalidatePath("/admin/crm/outbox");
  for (const leadId of leadIds) {
    if (leadId) revalidatePath(`/admin/crm/leads/${leadId}`);
  }
}

export async function approveOutboxMessages(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();
  const ids = selectedIds(formData);
  if (ids.length === 0) throw new Error("Selecciona al menos un borrador.");

  const messages = await prisma.outboundMessage.findMany({
    select: { id: true, leadId: true },
    where: {
      channel: MessageChannel.EMAIL,
      id: { in: ids },
      lead: {
        doNotContact: false,
        unsubscribedAt: null,
      },
      status: { in: [MessageStatus.DRAFT, MessageStatus.FAILED] },
    },
  });
  if (messages.length === 0) {
    throw new Error("Los mensajes seleccionados no se pueden aprobar.");
  }

  const approvedAt = new Date();
  await prisma.$transaction([
    prisma.outboundMessage.updateMany({
      data: {
        approvedAt,
        approvedBy: administrator,
        errorMessage: null,
        status: MessageStatus.QUEUED,
      },
      where: { id: { in: messages.map((message) => message.id) } },
    }),
    prisma.messageDeliveryEvent.createMany({
      data: messages.map((message) => ({
        createdBy: administrator,
        detail: "Mensaje aprobado manualmente y agregado a la cola.",
        messageId: message.id,
        type: DeliveryEventType.APPROVED,
      })),
    }),
  ]);
  refreshOutbox(messages.map((message) => message.leadId));
}

export async function revokeOutboxApproval(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();
  const ids = selectedIds(formData);
  if (ids.length === 0) throw new Error("Selecciona al menos un mensaje.");

  const messages = await prisma.outboundMessage.findMany({
    select: { id: true, leadId: true },
    where: { id: { in: ids }, status: MessageStatus.QUEUED },
  });
  if (messages.length === 0) return;

  await prisma.$transaction([
    prisma.outboundMessage.updateMany({
      data: {
        approvedAt: null,
        approvedBy: null,
        status: MessageStatus.DRAFT,
      },
      where: { id: { in: messages.map((message) => message.id) } },
    }),
    prisma.messageDeliveryEvent.createMany({
      data: messages.map((message) => ({
        createdBy: administrator,
        detail: "Aprobación retirada antes del envío.",
        messageId: message.id,
        type: DeliveryEventType.APPROVAL_REVOKED,
      })),
    }),
  ]);
  refreshOutbox(messages.map((message) => message.leadId));
}

export async function sendApprovedMessages(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();
  const ids = selectedIds(formData);
  if (ids.length === 0) throw new Error("Selecciona mensajes aprobados.");
  if (formData.get("confirmSend") !== "yes") {
    throw new Error("Debes confirmar expresamente el envío.");
  }

  const config = getEmailDeliveryConfig();
  if (!config.enabled || !config.configured) {
    throw new Error("El envío real está bloqueado hasta configurar y habilitar SMTP.");
  }

  const sentToday = await prisma.outboundMessage.count({
    where: {
      sentAt: { gte: startOfTodayInSantiago() },
      status: { in: [MessageStatus.SENT, MessageStatus.DELIVERED] },
    },
  });
  const remaining = Math.max(0, config.dailyLimit - sentToday);
  if (remaining === 0) throw new Error("Se alcanzó el límite diario de envíos.");

  const messages = await prisma.outboundMessage.findMany({
    include: { lead: true },
    orderBy: { approvedAt: "asc" },
    take: remaining,
    where: {
      approvedAt: { not: null },
      channel: MessageChannel.EMAIL,
      id: { in: ids },
      lead: {
        doNotContact: false,
        unsubscribedAt: null,
      },
      status: MessageStatus.QUEUED,
    },
  });

  for (const message of messages) {
    if (!message.lead?.email || message.lead.email !== message.recipient) {
      await prisma.$transaction([
        prisma.outboundMessage.update({
          data: {
            errorMessage: "El destinatario ya no coincide con el email del prospecto.",
            status: MessageStatus.FAILED,
          },
          where: { id: message.id },
        }),
        prisma.messageDeliveryEvent.create({
          data: {
            createdBy: administrator,
            detail: "Bloqueado porque el destinatario no coincide con el prospecto.",
            messageId: message.id,
            type: DeliveryEventType.BLOCKED,
          },
        }),
      ]);
      continue;
    }

    const attemptedAt = new Date();
    await prisma.$transaction([
      prisma.outboundMessage.update({
        data: {
          lastAttemptAt: attemptedAt,
          sendAttempts: { increment: 1 },
        },
        where: { id: message.id },
      }),
      prisma.messageDeliveryEvent.create({
        data: {
          createdBy: administrator,
          detail: "Intento de entrega iniciado.",
          messageId: message.id,
          type: DeliveryEventType.SEND_STARTED,
        },
      }),
    ]);

    try {
      const delivery = await sendEmailMessage({
        content: message.content,
        recipient: message.recipient,
        subject: message.subject || "Mensaje de PUDU IT Solutions",
      });
      await prisma.$transaction([
        prisma.outboundMessage.update({
          data: {
            errorMessage: null,
            providerMessageId: delivery.messageId,
            sentAt: delivery.mode === "smtp" ? new Date() : null,
            status:
              delivery.mode === "preview"
                ? MessageStatus.PREVIEWED
                : MessageStatus.SENT,
          },
          where: { id: message.id },
        }),
        prisma.messageDeliveryEvent.create({
          data: {
            createdBy: administrator,
            detail:
              delivery.mode === "preview"
                ? "Mensaje capturado en el modo de prueba local. No salió a Internet."
                : "El proveedor SMTP aceptó el mensaje.",
            messageId: message.id,
            metadata: {
              mode: delivery.mode,
              providerMessageId: delivery.messageId,
            },
            type:
              delivery.mode === "preview"
                ? DeliveryEventType.PREVIEW_CAPTURED
                : DeliveryEventType.SENT,
          },
        }),
      ]);
      if (delivery.mode === "smtp" && message.leadId) {
        await prisma.contactSubmission.updateMany({
          data: { firstResponseAt: new Date() },
          where: { firstResponseAt: null, id: message.leadId },
        });
      }
    } catch (error) {
      const detail =
        error instanceof Error ? error.message.slice(0, 500) : "Error SMTP desconocido.";
      await prisma.$transaction([
        prisma.outboundMessage.update({
          data: { errorMessage: detail, status: MessageStatus.FAILED },
          where: { id: message.id },
        }),
        prisma.messageDeliveryEvent.create({
          data: {
            createdBy: administrator,
            detail,
            messageId: message.id,
            type: DeliveryEventType.FAILED,
          },
        }),
      ]);
    }
  }
  refreshOutbox(messages.map((message) => message.leadId));
}

export async function updateLeadContactPermission(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();
  const leadId = clean(formData.get("leadId"), 100);
  const doNotContact = formData.get("doNotContact") === "true";
  const reason = clean(formData.get("reason"));
  if (!leadId) throw new Error("El prospecto no es válido.");

  await prisma.$transaction(async (transaction) => {
    await transaction.contactSubmission.update({
      data: {
        doNotContact,
        doNotContactReason: doNotContact ? reason || "Exclusión manual" : null,
      },
      where: { id: leadId },
    });

    if (doNotContact) {
      const pending = await transaction.outboundMessage.findMany({
        select: { id: true },
        where: {
          leadId,
          status: { in: [MessageStatus.DRAFT, MessageStatus.QUEUED] },
        },
      });
      if (pending.length > 0) {
        await transaction.outboundMessage.updateMany({
          data: {
            approvedAt: null,
            approvedBy: null,
            errorMessage: "Bloqueado: prospecto marcado como no contactar.",
            status: MessageStatus.CANCELLED,
          },
          where: { id: { in: pending.map((message) => message.id) } },
        });
        await transaction.messageDeliveryEvent.createMany({
          data: pending.map((message) => ({
            createdBy: administrator,
            detail: reason || "Prospecto marcado como no contactar.",
            messageId: message.id,
            type: DeliveryEventType.BLOCKED,
          })),
        });
      }
    }
  });
  refreshOutbox([leadId]);
}
