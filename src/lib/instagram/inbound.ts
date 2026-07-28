import {
  ActivityType,
  InstagramConversationStatus,
  InstagramMessageDirection,
  LeadSource,
  Prisma,
} from "@/generated/prisma";
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
        await transaction.leadActivity.create({
          data: {
            body: text || "El prospecto envió un archivo o contenido multimedia.",
            leadId: lead.id,
            metadata: {
              conversationId: conversation.id,
              instagramMessageId: messageId,
              source,
            },
            title: "Mensaje recibido por Instagram",
            type: ActivityType.INSTAGRAM,
          },
        });
        await transaction.contactSubmission.update({
          data: { lastContactAt: event.occurredAt },
          where: { id: lead.id },
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
