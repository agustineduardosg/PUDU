"use server";

import {
  ActivityType,
  LeadPriority,
  LeadStatus,
  MessageChannel,
  TaskStatus,
} from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const allowedStatuses = new Set(Object.values(LeadStatus));
const allowedPriorities = new Set(Object.values(LeadPriority));
const allowedChannels = new Set(Object.values(MessageChannel));
const allowedTaskStatuses = new Set(Object.values(TaskStatus));
const respondedStatuses = new Set<LeadStatus>([
  LeadStatus.CONTACTED,
  LeadStatus.MEETING,
  LeadStatus.PROPOSAL,
  LeadStatus.NEGOTIATION,
  LeadStatus.WON,
]);

function ensureWritableCrm() {
  if (process.env.CRM_DEMO_MODE === "true") {
    throw new Error(
      "Las acciones de escritura están desactivadas en el modo de demostración.",
    );
  }
}

function readRequiredString(formData: FormData, field: string) {
  const value = String(formData.get(field) || "").trim();

  if (!value) {
    throw new Error(`El campo ${field} es obligatorio.`);
  }

  return value;
}

function revalidateLead(leadId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/crm");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/crm/leads/${leadId}`);
}

export async function updateLeadStage(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const leadId = String(formData.get("leadId") || "");
  const requestedStatus = String(formData.get("status") || "") as LeadStatus;

  if (!leadId || !allowedStatuses.has(requestedStatus)) {
    throw new Error("La actualización del prospecto no es válida.");
  }

  const currentLead = await prisma.contactSubmission.findUnique({
    select: { firstResponseAt: true, status: true },
    where: { id: leadId },
  });

  if (!currentLead || currentLead.status === requestedStatus) {
    return;
  }

  await prisma.$transaction([
    prisma.contactSubmission.update({
      data: {
        ...(respondedStatuses.has(requestedStatus) &&
        !currentLead.firstResponseAt
          ? { firstResponseAt: new Date() }
          : {}),
        status: requestedStatus,
      },
      where: { id: leadId },
    }),
    prisma.leadActivity.create({
      data: {
        leadId,
        title: `Etapa actualizada: ${currentLead.status} → ${requestedStatus}`,
        type: ActivityType.STATUS_CHANGE,
      },
    }),
  ]);

  revalidateLead(leadId);
}

export async function updateLeadProfile(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const leadId = readRequiredString(formData, "leadId");
  const status = String(formData.get("status") || "") as LeadStatus;
  const priority = String(formData.get("priority") || "") as LeadPriority;
  const assignedTo = String(formData.get("assignedTo") || "").trim();
  const followUpValue = String(formData.get("nextFollowUpAt") || "").trim();

  if (!allowedStatuses.has(status) || !allowedPriorities.has(priority)) {
    throw new Error("La etapa o prioridad seleccionada no es válida.");
  }

  const previous = await prisma.contactSubmission.findUnique({
    select: { firstResponseAt: true, priority: true, status: true },
    where: { id: leadId },
  });

  if (!previous) {
    throw new Error("El prospecto no existe.");
  }

  const nextFollowUpAt = followUpValue ? new Date(followUpValue) : null;

  if (nextFollowUpAt && Number.isNaN(nextFollowUpAt.getTime())) {
    throw new Error("La fecha de seguimiento no es válida.");
  }

  await prisma.$transaction([
    prisma.contactSubmission.update({
      data: {
        assignedTo: assignedTo || null,
        ...(respondedStatuses.has(status) && !previous.firstResponseAt
          ? { firstResponseAt: new Date() }
          : {}),
        nextFollowUpAt,
        priority,
        status,
      },
      where: { id: leadId },
    }),
    prisma.leadActivity.create({
      data: {
        body: `Etapa: ${previous.status} → ${status}. Prioridad: ${previous.priority} → ${priority}.`,
        leadId,
        title: "Ficha comercial actualizada",
        type: ActivityType.STATUS_CHANGE,
      },
    }),
  ]);

  revalidateLead(leadId);
}

export async function addLeadNote(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const leadId = readRequiredString(formData, "leadId");
  const body = readRequiredString(formData, "body");

  if (body.length > 4000) {
    throw new Error("La nota no puede superar los 4.000 caracteres.");
  }

  await prisma.leadActivity.create({
    data: {
      body,
      leadId,
      title: "Nota comercial",
      type: ActivityType.NOTE,
    },
  });

  revalidateLead(leadId);
}

export async function createLeadTask(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const leadId = readRequiredString(formData, "leadId");
  const title = readRequiredString(formData, "title");
  const description = String(formData.get("description") || "").trim();
  const priority = String(formData.get("priority") || "") as LeadPriority;
  const dueValue = String(formData.get("dueAt") || "").trim();

  if (!allowedPriorities.has(priority)) {
    throw new Error("La prioridad seleccionada no es válida.");
  }

  const dueAt = dueValue ? new Date(dueValue) : null;

  if (dueAt && Number.isNaN(dueAt.getTime())) {
    throw new Error("La fecha de la tarea no es válida.");
  }

  await prisma.$transaction([
    prisma.leadTask.create({
      data: {
        description: description || null,
        dueAt,
        leadId,
        priority,
        title,
      },
    }),
    prisma.leadActivity.create({
      data: {
        body: dueAt
          ? `Vencimiento: ${dueAt.toLocaleDateString("es-CL")}`
          : null,
        leadId,
        title: `Tarea creada: ${title}`,
        type: ActivityType.NOTE,
      },
    }),
  ]);

  revalidateLead(leadId);
}

export async function updateLeadTaskStatus(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const leadId = readRequiredString(formData, "leadId");
  const taskId = readRequiredString(formData, "taskId");
  const status = String(formData.get("status") || "") as TaskStatus;

  if (!allowedTaskStatuses.has(status)) {
    throw new Error("El estado de la tarea no es válido.");
  }

  await prisma.leadTask.update({
    data: {
      completedAt: status === TaskStatus.COMPLETED ? new Date() : null,
      status,
    },
    where: { id: taskId, leadId },
  });

  revalidateLead(leadId);
}

export async function createMessageDraft(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const leadId = readRequiredString(formData, "leadId");
  const recipient = readRequiredString(formData, "recipient");
  const content = readRequiredString(formData, "content");
  const subject = String(formData.get("subject") || "").trim();
  const channel = String(formData.get("channel") || "") as MessageChannel;

  if (!allowedChannels.has(channel)) {
    throw new Error("El canal seleccionado no es válido.");
  }

  if (content.length > 8000) {
    throw new Error("El mensaje no puede superar los 8.000 caracteres.");
  }

  await prisma.$transaction([
    prisma.outboundMessage.create({
      data: {
        channel,
        content,
        leadId,
        recipient,
        subject: subject || null,
      },
    }),
    prisma.leadActivity.create({
      data: {
        body: `Canal: ${channel}. Destino: ${recipient}.`,
        leadId,
        title: "Borrador de mensaje creado",
        type: ActivityType.NOTE,
      },
    }),
  ]);

  revalidateLead(leadId);
}
