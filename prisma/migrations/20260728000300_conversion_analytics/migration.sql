-- CreateEnum
CREATE TYPE "ConversionEventName" AS ENUM (
  'PAGE_VIEW',
  'CTA_CLICK',
  'DIAGNOSTIC_STARTED',
  'DIAGNOSTIC_COMPLETED',
  'CONTACT_FORM_STARTED',
  'LEAD_SUBMITTED'
);

-- CreateTable
CREATE TABLE "ConversionSession" (
  "id" TEXT NOT NULL,
  "sessionKey" TEXT NOT NULL,
  "firstPath" TEXT NOT NULL,
  "firstReferrer" TEXT,
  "utmSource" TEXT,
  "utmMedium" TEXT,
  "utmCampaign" TEXT,
  "utmContent" TEXT,
  "deviceType" TEXT,
  "leadId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ConversionSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversionEvent" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "name" "ConversionEventName" NOT NULL,
  "path" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ConversionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConversionSession_sessionKey_key" ON "ConversionSession"("sessionKey");
CREATE UNIQUE INDEX "ConversionSession_leadId_key" ON "ConversionSession"("leadId");
CREATE INDEX "ConversionSession_createdAt_idx" ON "ConversionSession"("createdAt");
CREATE INDEX "ConversionSession_utmSource_createdAt_idx" ON "ConversionSession"("utmSource", "createdAt");
CREATE INDEX "ConversionSession_utmCampaign_createdAt_idx" ON "ConversionSession"("utmCampaign", "createdAt");
CREATE INDEX "ConversionEvent_name_createdAt_idx" ON "ConversionEvent"("name", "createdAt");
CREATE INDEX "ConversionEvent_sessionId_createdAt_idx" ON "ConversionEvent"("sessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "ConversionSession"
ADD CONSTRAINT "ConversionSession_leadId_fkey"
FOREIGN KEY ("leadId") REFERENCES "ContactSubmission"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionEvent"
ADD CONSTRAINT "ConversionEvent_sessionId_fkey"
FOREIGN KEY ("sessionId") REFERENCES "ConversionSession"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
