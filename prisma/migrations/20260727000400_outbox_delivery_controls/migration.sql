-- CreateEnum
CREATE TYPE "DeliveryEventType" AS ENUM (
  'APPROVED',
  'APPROVAL_REVOKED',
  'QUEUED',
  'SEND_STARTED',
  'SENT',
  'FAILED',
  'CANCELLED',
  'BLOCKED'
);

-- AlterTable
ALTER TABLE "ContactSubmission"
ADD COLUMN "doNotContact" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "doNotContactReason" TEXT,
ADD COLUMN "unsubscribedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OutboundMessage"
ADD COLUMN "approvedAt" TIMESTAMP(3),
ADD COLUMN "approvedBy" TEXT,
ADD COLUMN "sendAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastAttemptAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "MessageDeliveryEvent" (
  "id" TEXT NOT NULL,
  "messageId" TEXT NOT NULL,
  "type" "DeliveryEventType" NOT NULL,
  "detail" TEXT,
  "metadata" JSONB,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MessageDeliveryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactSubmission_doNotContact_updatedAt_idx"
ON "ContactSubmission"("doNotContact", "updatedAt");

-- CreateIndex
CREATE INDEX "OutboundMessage_approvedAt_status_idx"
ON "OutboundMessage"("approvedAt", "status");

-- CreateIndex
CREATE INDEX "MessageDeliveryEvent_messageId_createdAt_idx"
ON "MessageDeliveryEvent"("messageId", "createdAt");

-- AddForeignKey
ALTER TABLE "MessageDeliveryEvent"
ADD CONSTRAINT "MessageDeliveryEvent_messageId_fkey"
FOREIGN KEY ("messageId") REFERENCES "OutboundMessage"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
