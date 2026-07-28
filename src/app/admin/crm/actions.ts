"use server";

import { ActivityType, LeadStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const allowedStatuses = new Set(Object.values(LeadStatus));

export async function updateLeadStage(formData: FormData) {
  await requireAdmin();

  const leadId = String(formData.get("leadId") || "");
  const requestedStatus = String(formData.get("status") || "") as LeadStatus;

  if (!leadId || !allowedStatuses.has(requestedStatus)) {
    throw new Error("La actualización del prospecto no es válida.");
  }

  const currentLead = await prisma.contactSubmission.findUnique({
    select: { status: true },
    where: { id: leadId },
  });

  if (!currentLead || currentLead.status === requestedStatus) {
    return;
  }

  await prisma.$transaction([
    prisma.contactSubmission.update({
      data: { status: requestedStatus },
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

  revalidatePath("/admin/crm");
  revalidatePath("/admin/leads");
}
