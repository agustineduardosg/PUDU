-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'RESOLVED');

-- AlterTable
ALTER TABLE "ContactSubmission"
ADD COLUMN "submissionToken" TEXT,
ADD COLUMN "firstResponseAt" TIMESTAMP(3),
ADD COLUMN "responseDueAt" TIMESTAMP(3);

-- Existing active leads receive an initial SLA deadline.
UPDATE "ContactSubmission"
SET "responseDueAt" = "createdAt" + INTERVAL '24 hours'
WHERE "responseDueAt" IS NULL
  AND "status" NOT IN ('WON', 'LOST');

-- CreateTable
CREATE TABLE "AbuseThrottle" (
  "id" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "keyHash" TEXT NOT NULL,
  "windowStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "count" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AbuseThrottle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemIncident" (
  "id" TEXT NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "severity" "IncidentSeverity" NOT NULL DEFAULT 'WARNING',
  "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
  "title" TEXT NOT NULL,
  "detail" TEXT NOT NULL,
  "metadata" JSONB,
  "occurrences" INTEGER NOT NULL DEFAULT 1,
  "firstOccurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastOccurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SystemIncident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactSubmission_submissionToken_key"
ON "ContactSubmission"("submissionToken");

CREATE INDEX "ContactSubmission_firstResponseAt_responseDueAt_idx"
ON "ContactSubmission"("firstResponseAt", "responseDueAt");

CREATE UNIQUE INDEX "AbuseThrottle_scope_keyHash_key"
ON "AbuseThrottle"("scope", "keyHash");

CREATE INDEX "AbuseThrottle_updatedAt_idx"
ON "AbuseThrottle"("updatedAt");

CREATE UNIQUE INDEX "SystemIncident_fingerprint_key"
ON "SystemIncident"("fingerprint");

CREATE INDEX "SystemIncident_status_lastOccurredAt_idx"
ON "SystemIncident"("status", "lastOccurredAt");

CREATE INDEX "SystemIncident_severity_status_idx"
ON "SystemIncident"("severity", "status");
