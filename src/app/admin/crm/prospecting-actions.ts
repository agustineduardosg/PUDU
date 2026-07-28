"use server";

import {
  ActivityType,
  LeadSource,
  MessageChannel,
  Prisma,
} from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export type ProspectImportRow = {
  city?: string;
  company?: string;
  email?: string;
  instagram?: string;
  interest?: string;
  message?: string;
  name?: string;
  phone?: string;
  source?: string;
};

export type ProspectImportResult = {
  created: number;
  errors: string[];
  skipped: number;
};

const allowedChannels = new Set(Object.values(MessageChannel));
const allowedCampaignStatuses = new Set([
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "ARCHIVED",
]);
const allowedSources = new Set(Object.values(LeadSource));
type CampaignStatusValue =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "ARCHIVED";

function ensureWritableCrm() {
  if (process.env.CRM_DEMO_MODE === "true") {
    throw new Error(
      "Las acciones de escritura están desactivadas en el modo de demostración.",
    );
  }
}

function clean(value: unknown, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeInstagram(value: string) {
  return value.trim().toLowerCase().replace(/^@/, "");
}

function contactKeys(row: {
  email?: string | null;
  instagram?: string | null;
  phone?: string | null;
}) {
  return [
    row.email ? `email:${normalizeEmail(row.email)}` : "",
    row.phone ? `phone:${normalizePhone(row.phone)}` : "",
    row.instagram ? `instagram:${normalizeInstagram(row.instagram)}` : "",
  ].filter(Boolean);
}

function revalidateCrm() {
  revalidatePath("/admin");
  revalidatePath("/admin/crm");
  revalidatePath("/admin/crm/prospects");
  revalidatePath("/admin/crm/campaigns");
  revalidatePath("/admin/crm/templates");
}

export async function importProspects(
  submittedRows: ProspectImportRow[],
): Promise<ProspectImportResult> {
  await requireAdmin();
  ensureWritableCrm();

  const rows = submittedRows.slice(0, 500).map((row) => ({
    city: clean(row.city, 120),
    company: clean(row.company, 180),
    email: clean(row.email, 254),
    instagram: clean(row.instagram, 120),
    interest: clean(row.interest, 180) || "Por calificar",
    message: clean(row.message, 2000) || "Prospecto importado mediante CSV.",
    name: clean(row.name, 180),
    phone: clean(row.phone, 80),
    source: clean(row.source, 40).toUpperCase(),
  }));

  const errors: string[] = [];
  const validRows: ProspectImportRow[] = [];
  const seen = new Set<string>();
  let skipped = Math.max(0, submittedRows.length - rows.length);

  rows.forEach((row, index) => {
    const keys = contactKeys(row);

    if (!row.name) {
      errors.push(`Fila ${index + 2}: falta el nombre.`);
      skipped += 1;
      return;
    }

    if (keys.length === 0) {
      errors.push(
        `Fila ${index + 2}: agrega email, teléfono o cuenta de Instagram.`,
      );
      skipped += 1;
      return;
    }

    if (keys.some((key) => seen.has(key))) {
      errors.push(`Fila ${index + 2}: contacto repetido dentro del archivo.`);
      skipped += 1;
      return;
    }

    keys.forEach((key) => seen.add(key));
    validRows.push(row);
  });

  const duplicateConditions: Prisma.ContactSubmissionWhereInput[] = [];

  for (const row of validRows) {
    if (row.email) {
      duplicateConditions.push({
        email: { equals: normalizeEmail(row.email), mode: "insensitive" },
      });
    }
    if (row.phone) duplicateConditions.push({ phone: row.phone });
    if (row.instagram) {
      duplicateConditions.push({
        instagram: { equals: row.instagram, mode: "insensitive" },
      });
    }
  }

  const existing =
    duplicateConditions.length > 0
      ? await prisma.contactSubmission.findMany({
          select: { email: true, instagram: true, phone: true },
          where: { OR: duplicateConditions },
        })
      : [];
  const existingKeys = new Set(existing.flatMap(contactKeys));
  const rowsToCreate = validRows.filter((row, index) => {
    if (contactKeys(row).some((key) => existingKeys.has(key))) {
      errors.push(`Fila ${index + 2}: el contacto ya existe en el CRM.`);
      skipped += 1;
      return false;
    }
    return true;
  });

  if (rowsToCreate.length > 0) {
    await prisma.contactSubmission.createMany({
      data: rowsToCreate.map((row) => ({
        city: row.city || null,
        company: row.company || null,
        email: row.email ? normalizeEmail(row.email) : null,
        instagram: row.instagram || null,
        interest: row.interest || "Por calificar",
        message: row.message || "Prospecto importado mediante CSV.",
        name: row.name || "",
        phone: row.phone || null,
        source:
          row.source && allowedSources.has(row.source as LeadSource)
            ? (row.source as LeadSource)
            : LeadSource.MANUAL,
      })),
    });
  }

  revalidateCrm();
  return { created: rowsToCreate.length, errors: errors.slice(0, 20), skipped };
}

export async function createLeadManually(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const row = {
    city: clean(formData.get("city"), 120),
    company: clean(formData.get("company"), 180),
    email: clean(formData.get("email"), 254),
    instagram: clean(formData.get("instagram"), 120),
    interest: clean(formData.get("interest"), 180) || "Por calificar",
    message:
      clean(formData.get("message"), 2000) ||
      "Prospecto ingresado manualmente.",
    name: clean(formData.get("name"), 180),
    phone: clean(formData.get("phone"), 80),
  };

  if (!row.name || contactKeys(row).length === 0) {
    throw new Error(
      "El nombre y al menos un medio de contacto son obligatorios.",
    );
  }

  const duplicate = await prisma.contactSubmission.findFirst({
    select: { id: true },
    where: {
      OR: [
        ...(row.email
          ? [
              {
                email: {
                  equals: normalizeEmail(row.email),
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ]
          : []),
        ...(row.phone ? [{ phone: row.phone }] : []),
        ...(row.instagram
          ? [
              {
                instagram: {
                  equals: row.instagram,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ]
          : []),
      ],
    },
  });

  if (duplicate) {
    redirect(`/admin/crm/leads/${duplicate.id}`);
  }

  const lead = await prisma.contactSubmission.create({
    data: {
      ...row,
      city: row.city || null,
      company: row.company || null,
      email: row.email ? normalizeEmail(row.email) : null,
      instagram: row.instagram || null,
      phone: row.phone || null,
      source: LeadSource.MANUAL,
    },
  });

  await prisma.leadActivity.create({
    data: {
      leadId: lead.id,
      title: "Prospecto ingresado manualmente",
      type: ActivityType.NOTE,
    },
  });

  revalidateCrm();
  redirect(`/admin/crm/leads/${lead.id}`);
}

export async function createMessageTemplate(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const name = clean(formData.get("name"), 180);
  const channel = clean(formData.get("channel"), 40) as MessageChannel;
  const subject = clean(formData.get("subject"), 300);
  const content = clean(formData.get("content"), 8000);

  if (!name || !content || !allowedChannels.has(channel)) {
    throw new Error("Completa el nombre, canal y contenido de la plantilla.");
  }

  await prisma.messageTemplate.create({
    data: { channel, content, name, subject: subject || null },
  });
  revalidateCrm();
}

export async function toggleMessageTemplate(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const templateId = clean(formData.get("templateId"), 100);
  const isActive = clean(formData.get("isActive")) === "true";

  await prisma.messageTemplate.update({
    data: { isActive },
    where: { id: templateId },
  });
  revalidateCrm();
}

export async function createCampaign(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const name = clean(formData.get("name"), 180);
  const description = clean(formData.get("description"), 1000);
  const channel = clean(formData.get("channel"), 40) as MessageChannel;

  if (!name || !allowedChannels.has(channel)) {
    throw new Error("Completa el nombre y selecciona un canal válido.");
  }

  const campaign = await prisma.campaign.create({
    data: { channel, description: description || null, name },
  });
  revalidateCrm();
  redirect(`/admin/crm/campaigns/${campaign.id}`);
}

export async function updateCampaignStatus(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const campaignId = clean(formData.get("campaignId"), 100);
  const status = clean(formData.get("status"), 40) as CampaignStatusValue;

  if (!campaignId || !allowedCampaignStatuses.has(status)) {
    throw new Error("La actualización de campaña no es válida.");
  }

  await prisma.campaign.update({
    data: { status },
    where: { id: campaignId },
  });
  revalidateCrm();
}
