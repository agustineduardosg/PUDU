CREATE TYPE "LeadStatus" AS ENUM (
  'NEW',
  'QUALIFYING',
  'CONTACTED',
  'MEETING',
  'PROPOSAL',
  'NEGOTIATION',
  'WON',
  'LOST'
);

CREATE TYPE "LeadPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "LeadSource" AS ENUM (
  'WEBSITE',
  'INSTAGRAM',
  'LINKEDIN',
  'REFERRAL',
  'CAMPAIGN',
  'MANUAL',
  'OTHER'
);
CREATE TYPE "ActivityType" AS ENUM (
  'NOTE',
  'EMAIL',
  'CALL',
  'WHATSAPP',
  'INSTAGRAM',
  'MEETING',
  'STATUS_CHANGE',
  'PROPOSAL'
);
CREATE TYPE "TaskStatus" AS ENUM (
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
);
CREATE TYPE "MessageChannel" AS ENUM (
  'EMAIL',
  'WHATSAPP',
  'INSTAGRAM',
  'LINKEDIN',
  'SMS'
);
CREATE TYPE "MessageStatus" AS ENUM (
  'DRAFT',
  'SCHEDULED',
  'QUEUED',
  'SENT',
  'DELIVERED',
  'REPLIED',
  'FAILED',
  'CANCELLED'
);

ALTER TABLE "ContactSubmission"
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "instagram" TEXT,
  ADD COLUMN "source" "LeadSource" NOT NULL DEFAULT 'WEBSITE',
  ADD COLUMN "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  ADD COLUMN "priority" "LeadPriority" NOT NULL DEFAULT 'MEDIUM',
  ADD COLUMN "score" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "assignedTo" TEXT,
  ADD COLUMN "notes" TEXT,
  ADD COLUMN "lastContactAt" TIMESTAMP(3),
  ADD COLUMN "nextFollowUpAt" TIMESTAMP(3),
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "LeadActivity" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "type" "ActivityType" NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT,
  "metadata" JSONB,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LeadTask" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
  "priority" "LeadPriority" NOT NULL DEFAULT 'MEDIUM',
  "dueAt" TIMESTAMP(3),
  "assignedTo" TEXT,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LeadTask_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutboundMessage" (
  "id" TEXT NOT NULL,
  "leadId" TEXT,
  "channel" "MessageChannel" NOT NULL,
  "status" "MessageStatus" NOT NULL DEFAULT 'DRAFT',
  "recipient" TEXT NOT NULL,
  "subject" TEXT,
  "content" TEXT NOT NULL,
  "scheduledAt" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "providerMessageId" TEXT,
  "errorMessage" TEXT,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OutboundMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContactSubmission_status_createdAt_idx"
  ON "ContactSubmission"("status", "createdAt");
CREATE INDEX "ContactSubmission_email_idx"
  ON "ContactSubmission"("email");
CREATE INDEX "ContactSubmission_nextFollowUpAt_idx"
  ON "ContactSubmission"("nextFollowUpAt");
CREATE INDEX "LeadActivity_leadId_createdAt_idx"
  ON "LeadActivity"("leadId", "createdAt");
CREATE INDEX "LeadTask_leadId_status_idx"
  ON "LeadTask"("leadId", "status");
CREATE INDEX "LeadTask_dueAt_status_idx"
  ON "LeadTask"("dueAt", "status");
CREATE INDEX "OutboundMessage_status_scheduledAt_idx"
  ON "OutboundMessage"("status", "scheduledAt");
CREATE INDEX "OutboundMessage_leadId_createdAt_idx"
  ON "OutboundMessage"("leadId", "createdAt");

ALTER TABLE "LeadActivity"
  ADD CONSTRAINT "LeadActivity_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "ContactSubmission"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LeadTask"
  ADD CONSTRAINT "LeadTask_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "ContactSubmission"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OutboundMessage"
  ADD CONSTRAINT "OutboundMessage_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "ContactSubmission"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
