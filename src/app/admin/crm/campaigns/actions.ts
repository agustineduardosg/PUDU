"use server";

import {
  ActivityType,
  CampaignMemberStatus,
  MessageChannel,
  MessageStatus,
} from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const reviewStatuses = new Set<CampaignMemberStatus>([
  CampaignMemberStatus.PENDING,
  CampaignMemberStatus.APPROVED,
  CampaignMemberStatus.SKIPPED,
]);

function ensureWritableCrm() {
  if (process.env.CRM_DEMO_MODE === "true") {
    throw new Error(
      "Las acciones de escritura están desactivadas en el modo de demostración.",
    );
  }
}

function clean(value: unknown, maxLength = 200) {
  return String(value || "").trim().slice(0, maxLength);
}

function revalidateCampaign(campaignId: string) {
  revalidatePath("/admin/crm");
  revalidatePath("/admin/crm/campaigns");
  revalidatePath(`/admin/crm/campaigns/${campaignId}`);
}

function personalize(value: string, lead: {
  company: string | null;
  interest: string;
  name: string;
}) {
  const replacements: Record<string, string> = {
    "{empresa}": lead.company || lead.name,
    "{interes}": lead.interest.toLowerCase(),
    "{nombre}": lead.name.split(" ")[0],
  };

  return Object.entries(replacements).reduce(
    (result, [token, replacement]) =>
      result.replaceAll(token, replacement),
    value,
  );
}

function recipientForChannel(
  channel: MessageChannel,
  lead: {
    email: string | null;
    instagram: string | null;
    phone: string | null;
  },
) {
  if (channel === MessageChannel.EMAIL) return lead.email;
  if (channel === MessageChannel.INSTAGRAM) return lead.instagram;
  if (
    channel === MessageChannel.WHATSAPP ||
    channel === MessageChannel.SMS
  ) {
    return lead.phone;
  }
  return null;
}

export async function setCampaignTemplate(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const campaignId = clean(formData.get("campaignId"));
  const templateId = clean(formData.get("templateId"));

  if (!campaignId) throw new Error("La campaña no es válida.");

  if (!templateId) {
    await prisma.campaign.update({
      data: { templateId: null },
      where: { id: campaignId },
    });
    revalidateCampaign(campaignId);
    return;
  }

  const template = await prisma.messageTemplate.findFirst({
    select: { channel: true, id: true },
    where: { id: templateId, isActive: true },
  });

  if (!template) throw new Error("La plantilla seleccionada no está disponible.");

  await prisma.campaign.update({
    data: { channel: template.channel, templateId: template.id },
    where: { id: campaignId },
  });
  revalidateCampaign(campaignId);
}

export async function addCampaignMembers(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const campaignId = clean(formData.get("campaignId"));
  const leadIds = Array.from(
    new Set(formData.getAll("leadIds").map((value) => clean(value)).filter(Boolean)),
  ).slice(0, 500);

  if (!campaignId || leadIds.length === 0) {
    throw new Error("Selecciona al menos un prospecto.");
  }

  const validLeads = await prisma.contactSubmission.findMany({
    select: { id: true },
    where: { id: { in: leadIds } },
  });

  await prisma.campaignMember.createMany({
    data: validLeads.map((lead) => ({ campaignId, leadId: lead.id })),
    skipDuplicates: true,
  });
  revalidateCampaign(campaignId);
}

export async function updateCampaignMemberStatus(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const campaignId = clean(formData.get("campaignId"));
  const memberId = clean(formData.get("memberId"));
  const status = clean(formData.get("status")) as CampaignMemberStatus;

  if (!campaignId || !memberId || !reviewStatuses.has(status)) {
    throw new Error("La revisión seleccionada no es válida.");
  }

  await prisma.campaignMember.update({
    data: {
      approvedAt:
        status === CampaignMemberStatus.APPROVED ? new Date() : null,
      status,
    },
    where: { id: memberId, campaignId },
  });
  revalidateCampaign(campaignId);
}

export async function bulkReviewCampaignMembers(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const campaignId = clean(formData.get("campaignId"));
  const memberIds = Array.from(
    new Set(
      formData.getAll("memberIds").map((value) => clean(value)).filter(Boolean),
    ),
  ).slice(0, 500);
  const status = clean(formData.get("status")) as CampaignMemberStatus;

  if (!campaignId || memberIds.length === 0 || !reviewStatuses.has(status)) {
    throw new Error("Selecciona prospectos y una acción de revisión válida.");
  }

  await prisma.campaignMember.updateMany({
    data: {
      approvedAt:
        status === CampaignMemberStatus.APPROVED ? new Date() : null,
      status,
    },
    where: { campaignId, id: { in: memberIds } },
  });
  revalidateCampaign(campaignId);
}

export async function generateApprovedCampaignDrafts(formData: FormData) {
  await requireAdmin();
  ensureWritableCrm();

  const campaignId = clean(formData.get("campaignId"));
  if (!campaignId) throw new Error("La campaña no es válida.");

  const campaign = await prisma.campaign.findUnique({
    include: {
      members: {
        include: {
          lead: {
            select: {
              company: true,
              email: true,
              id: true,
              instagram: true,
              interest: true,
              name: true,
              phone: true,
            },
          },
        },
        where: { status: CampaignMemberStatus.APPROVED },
      },
      template: true,
    },
    where: { id: campaignId },
  });

  if (!campaign?.template || !campaign.template.isActive) {
    throw new Error("Selecciona una plantilla activa antes de generar borradores.");
  }

  const existingDrafts = await prisma.outboundMessage.findMany({
    select: { leadId: true },
    where: {
      campaignId,
      status: MessageStatus.DRAFT,
      templateId: campaign.template.id,
    },
  });
  const existingLeadIds = new Set(
    existingDrafts.map((message) => message.leadId).filter(Boolean),
  );
  const draftableMembers = campaign.members
    .map((member) => ({
      lead: member.lead,
      recipient: recipientForChannel(campaign.channel, member.lead),
    }))
    .filter(
      (
        item,
      ): item is typeof item & {
        recipient: string;
      } => Boolean(item.recipient) && !existingLeadIds.has(item.lead.id),
    );

  if (draftableMembers.length === 0) {
    revalidateCampaign(campaignId);
    return;
  }

  await prisma.$transaction([
    prisma.outboundMessage.createMany({
      data: draftableMembers.map(({ lead, recipient }) => ({
        campaignId,
        channel: campaign.channel,
        content: personalize(campaign.template!.content, lead),
        leadId: lead.id,
        recipient,
        status: MessageStatus.DRAFT,
        subject: campaign.template!.subject
          ? personalize(campaign.template!.subject, lead)
          : null,
        templateId: campaign.template!.id,
      })),
    }),
    prisma.leadActivity.createMany({
      data: draftableMembers.map(({ lead }) => ({
        body: `Campaña: ${campaign.name}. Requiere revisión antes de enviar.`,
        leadId: lead.id,
        title: "Borrador de campaña generado",
        type: ActivityType.NOTE,
      })),
    }),
    prisma.messageTemplate.update({
      data: { usageCount: { increment: draftableMembers.length } },
      where: { id: campaign.template.id },
    }),
  ]);

  revalidateCampaign(campaignId);
}
