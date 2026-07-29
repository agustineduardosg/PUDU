import {
  ActivityType,
  InstagramConversationStatus,
  InstagramMessageDirection,
  LeadPriority,
  LeadSource,
  Prisma,
  TaskStatus,
} from "@/generated/prisma";
import {
  classifyInstagramLead,
  INSTAGRAM_RESPONSE_TASK_TITLE,
  LEAD_CLASSIFICATION_VERSION,
  preserveAdvancedLeadStatus,
} from "@/lib/crm/lead-classification";
import { prisma } from "@/lib/prisma";

type InstagramMessagingEvent = {
  sender?: { id?: string; username?: string };
  recipient?: { id?: string };
  timestamp?: number;
  message?: {
    attachments?: unknown[];
    is_echo?: boolean;
    mid?: string;
    quick_reply?: { payload?: string };
    text?: string;
  };
};

type InstagramWebhookPayload = {
  object?: string;
  entry?: Array<{
    id?: string;
    messaging?: InstagramMessagingEvent[];
    time?: number;
  }>;
};

function clean(value: unknown, maxLength = 2000) {
  return String(value || "").trim().slice(0, maxLength);
}

const priorityRank: Record<LeadPriority, number> = {
  [LeadPriority.LOW]: 0,
  [LeadPriority.MEDIUM]: 1,
  [LeadPriority.HIGH]: 2,
  [LeadPriority.URGENT]: 3,
};

function higherPriority(current: LeadPriority, recommended: LeadPriority) {
  return priorityRank[current] >= priorityRank[recommended]
    ? current
    : recommended;
}

function conversationStatusAfterClassification(
  current: InstagramConversationStatus | undefined,
  recommended: InstagramConversationStatus,
  blocked: boolean,
) {
  if (blocked) return InstagramConversationStatus.BLOCKED;
  if (
    current === InstagramConversationStatus.BLOCKED ||
    current === InstagramConversationStatus.CLOSED ||
    current === InstagramConversationStatus.HUMAN_REQUIRED
  ) {
    return current;
  }
  return recommended;
}

function normalizedUsername(value: unknown) {
  return clean(value, 120).toLowerCase().replace(/^@/, "");
}

function incomingEvents(payload: InstagramWebhookPayload) {
  return (payload.entry || []).flatMap((entry) =>
    (entry.messaging || []).map((event) => ({
      accountId: clean(event.recipient?.id || entry.id, 200),
      externalUserId: clean(event.sender?.id, 200),
      message: event.message,
      occurredAt: event.timestamp
        ? new Date(event.timestamp)
        : new Date(entry.time || Date.now()),
      username: normalizedUsername(event.sender?.username),
    })),
  );
}

export async function processInstagramWebhook(
  rawPayload: unknown,
  source: "META" | "SIMULATOR" = "META",
) {
  const payload = rawPayload as InstagramWebhookPayload;
  const webhookEvent = await prisma.instagramWebhookEvent.create({
    data: {
      payload: rawPayload as Prisma.InputJsonValue,
      status: "PROCESSING",
    },
  });
  let processed = 0;
  let duplicates = 0;
  let ignored = 0;

  try {
    if (payload.object !== "instagram") {
      throw new Error("El evento no pertenece a Instagram.");
    }

    for (const event of incomingEvents(payload)) {
      const messageId = clean(event.message?.mid, 300);
      const text = clean(event.message?.text, 4000);

      if (
        !event.accountId ||
        !event.externalUserId ||
        !messageId ||
        event.message?.is_echo
      ) {
        ignored += 1;
        continue;
      }

      const exists = await prisma.instagramMessage.findUnique({
        select: { id: true },
        where: { metaMessageId: messageId },
      });
      if (exists) {
        duplicates += 1;
        continue;
      }

      await prisma.$transaction(async (transaction) => {
        const account = await transaction.instagramAccount.upsert({
          create: {
            displayName:
              source === "SIMULATOR" ? "PUDU Instagram Local" : null,
            instagramUserId: event.accountId,
          },
          update: { isActive: true },
          where: { instagramUserId: event.accountId },
        });
        const currentConversation =
          await transaction.instagramConversation.findUnique({
            include: { lead: true },
            where: {
              accountId_externalUserId: {
                accountId: account.id,
                externalUserId: event.externalUserId,
              },
            },
          });
        const instagramHandle = event.username
          ? `@${event.username}`
          : `igsid:${event.externalUserId}`;
        const existingLead =
          currentConversation?.lead ||
          (await transaction.contactSubmission.findFirst({
            where: {
              OR: [
                { instagram: instagramHandle },
                ...(event.username
                  ? [
                      {
                        instagram: {
                          equals: event.username,
                          mode: Prisma.QueryMode.insensitive,
                        },
                      },
                      {
                        instagram: {
                          equals: `@${event.username}`,
                          mode: Prisma.QueryMode.insensitive,
                        },
                      },
                    ]
                  : []),
              ],
            },
          }));
        const lead =
          existingLead ||
          (await transaction.contactSubmission.create({
            data: {
              instagram: instagramHandle,
              interest: "Consulta recibida por Instagram",
              message: text || "Mensaje multimedia recibido por Instagram.",
              name: event.username
                ? `@${event.username}`
                : `Prospecto Instagram ${event.externalUserId.slice(-6)}`,
              source: LeadSource.INSTAGRAM,
            },
          }));
        const isNewLead = !existingLead;
        const conversation = await transaction.instagramConversation.upsert({
          create: {
            accountId: account.id,
            externalUserId: event.externalUserId,
            lastMessageAt: event.occurredAt,
            leadId: lead.id,
            status: lead.doNotContact
              ? InstagramConversationStatus.BLOCKED
              : InstagramConversationStatus.NEW,
            username: event.username || null,
          },
          update: {
            lastMessageAt: event.occurredAt,
            leadId: lead.id,
            status: lead.doNotContact
              ? InstagramConversationStatus.BLOCKED
              : currentConversation?.status,
            username: event.username || currentConversation?.username,
          },
          where: {
            accountId_externalUserId: {
              accountId: account.id,
              externalUserId: event.externalUserId,
            },
          },
        });

        await transaction.instagramMessage.create({
          data: {
            conversationId: conversation.id,
            direction: InstagramMessageDirection.INBOUND,
            metaMessageId: messageId,
            occurredAt: event.occurredAt,
            payload: event.message as Prisma.InputJsonValue,
            text: text || null,
          },
        });
        const recentMessages = await transaction.instagramMessage.findMany({
          orderBy: { occurredAt: "desc" },
          select: { text: true },
          take: 10,
          where: {
            conversationId: conversation.id,
            direction: InstagramMessageDirection.INBOUND,
          },
        });
        const classification = classifyInstagramLead(
          recentMessages
            .reverse()
            .map((message) => message.text)
            .filter((message): message is string => Boolean(message)),
          event.occurredAt,
        );
        const leadPriority = isNewLead
          ? classification.priority
          : higherPriority(lead.priority, classification.priority);
        const leadStatus = preserveAdvancedLeadStatus(
          lead.status,
          classification.recommendedLeadStatus,
        );
        const nextFollowUpAt =
          lead.nextFollowUpAt &&
          lead.nextFollowUpAt.getTime() < classification.dueAt.getTime()
            ? lead.nextFollowUpAt
            : classification.dueAt;
        const assignedTo =
          lead.assignedTo ||
          clean(process.env.CRM_DEFAULT_ASSIGNEE, 120) ||
          "Agustín";
        const tags = [...new Set([...lead.tags, ...classification.tags])];

        await transaction.contactSubmission.update({
          data: {
            assignedTo,
            classificationVersion: LEAD_CLASSIFICATION_VERSION,
            interest:
              classification.tags.some((tag) => tag.startsWith("servicio:")) ||
              isNewLead
                ? classification.interest
                : lead.interest,
            lastContactAt: event.occurredAt,
            nextFollowUpAt,
            priority: leadPriority,
            qualificationConfidence: classification.confidence,
            qualificationReason: classification.reason,
            qualificationSummary: classification.summary,
            qualifiedAt:
              classification.recommendedLeadStatus === "QUALIFYING"
                ? event.occurredAt
                : lead.qualifiedAt,
            score: Math.max(lead.score, classification.score),
            status: leadStatus,
            tags,
          },
          where: { id: lead.id },
        });
        await transaction.instagramConversation.update({
          data: {
            status: conversationStatusAfterClassification(
              conversation.status,
              classification.conversationStatus,
              lead.doNotContact,
            ),
          },
          where: { id: conversation.id },
        });

        if (!lead.doNotContact) {
          const responseTask = await transaction.leadTask.findFirst({
            orderBy: { createdAt: "desc" },
            where: {
              leadId: lead.id,
              status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] },
              title: INSTAGRAM_RESPONSE_TASK_TITLE,
            },
          });
          const taskDescription =
            `${classification.summary} ${classification.reason}${
              classification.suggestedQuestion
                ? ` Pregunta sugerida: ${classification.suggestedQuestion}`
                : ""
            }`.trim();

          if (responseTask) {
            await transaction.leadTask.update({
              data: {
                assignedTo: responseTask.assignedTo || assignedTo,
                description: taskDescription,
                dueAt:
                  responseTask.dueAt &&
                  responseTask.dueAt.getTime() < classification.dueAt.getTime()
                    ? responseTask.dueAt
                    : classification.dueAt,
                priority: higherPriority(
                  responseTask.priority,
                  classification.priority,
                ),
              },
              where: { id: responseTask.id },
            });
          } else {
            await transaction.leadTask.create({
              data: {
                assignedTo,
                description: taskDescription,
                dueAt: classification.dueAt,
                leadId: lead.id,
                priority: classification.priority,
                title: INSTAGRAM_RESPONSE_TASK_TITLE,
              },
            });
          }
        }

        await transaction.leadActivity.create({
          data: {
            body: text || "El prospecto envió un archivo o contenido multimedia.",
            leadId: lead.id,
            metadata: {
              classification: {
                campaignKeyword: classification.campaignKeyword,
                confidence: classification.confidence,
                interest: classification.interest,
                priority: classification.priority,
                reason: classification.reason,
                score: classification.score,
                suggestedQuestion: classification.suggestedQuestion,
                tags: classification.tags,
                version: LEAD_CLASSIFICATION_VERSION,
              },
              conversationId: conversation.id,
              instagramMessageId: messageId,
              source,
            },
            title: "Mensaje recibido por Instagram",
            type: ActivityType.INSTAGRAM,
          },
        });
      });
      processed += 1;
    }

    await prisma.instagramWebhookEvent.update({
      data: {
        processedAt: new Date(),
        status: "PROCESSED",
      },
      where: { id: webhookEvent.id },
    });
    return { duplicates, ignored, processed };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message.slice(0, 1000) : "Error desconocido";
    await prisma.instagramWebhookEvent.update({
      data: {
        errorMessage,
        processedAt: new Date(),
        status: "FAILED",
      },
      where: { id: webhookEvent.id },
    });
    throw error;
  }
}
