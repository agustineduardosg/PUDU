CREATE TYPE "InstagramConversationStatus" AS ENUM (
  'NEW',
  'BOT_ACTIVE',
  'WAITING_REPLY',
  'HUMAN_REQUIRED',
  'QUALIFIED',
  'CLOSED',
  'BLOCKED'
);

CREATE TYPE "InstagramMessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

CREATE TABLE "InstagramAccount" (
  "id" TEXT NOT NULL,
  "instagramUserId" TEXT NOT NULL,
  "username" TEXT,
  "displayName" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InstagramAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InstagramConversation" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "leadId" TEXT,
  "externalUserId" TEXT NOT NULL,
  "username" TEXT,
  "displayName" TEXT,
  "status" "InstagramConversationStatus" NOT NULL DEFAULT 'NEW',
  "lastMessageAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InstagramConversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InstagramMessage" (
  "id" TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "metaMessageId" TEXT NOT NULL,
  "direction" "InstagramMessageDirection" NOT NULL,
  "text" TEXT,
  "payload" JSONB,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InstagramMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InstagramWebhookEvent" (
  "id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "errorMessage" TEXT,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  CONSTRAINT "InstagramWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InstagramAccount_instagramUserId_key"
ON "InstagramAccount"("instagramUserId");

CREATE INDEX "InstagramAccount_isActive_updatedAt_idx"
ON "InstagramAccount"("isActive", "updatedAt");

CREATE UNIQUE INDEX "InstagramConversation_accountId_externalUserId_key"
ON "InstagramConversation"("accountId", "externalUserId");

CREATE INDEX "InstagramConversation_status_lastMessageAt_idx"
ON "InstagramConversation"("status", "lastMessageAt");

CREATE INDEX "InstagramConversation_leadId_lastMessageAt_idx"
ON "InstagramConversation"("leadId", "lastMessageAt");

CREATE UNIQUE INDEX "InstagramMessage_metaMessageId_key"
ON "InstagramMessage"("metaMessageId");

CREATE INDEX "InstagramMessage_conversationId_occurredAt_idx"
ON "InstagramMessage"("conversationId", "occurredAt");

CREATE INDEX "InstagramWebhookEvent_status_receivedAt_idx"
ON "InstagramWebhookEvent"("status", "receivedAt");

ALTER TABLE "InstagramConversation"
ADD CONSTRAINT "InstagramConversation_accountId_fkey"
FOREIGN KEY ("accountId") REFERENCES "InstagramAccount"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InstagramConversation"
ADD CONSTRAINT "InstagramConversation_leadId_fkey"
FOREIGN KEY ("leadId") REFERENCES "ContactSubmission"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "InstagramMessage"
ADD CONSTRAINT "InstagramMessage_conversationId_fkey"
FOREIGN KEY ("conversationId") REFERENCES "InstagramConversation"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
