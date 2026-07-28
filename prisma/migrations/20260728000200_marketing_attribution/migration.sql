ALTER TABLE "ContactSubmission"
ADD COLUMN "utmSource" TEXT,
ADD COLUMN "utmMedium" TEXT,
ADD COLUMN "utmCampaign" TEXT,
ADD COLUMN "utmContent" TEXT,
ADD COLUMN "landingPath" TEXT,
ADD COLUMN "referrer" TEXT;

CREATE INDEX "ContactSubmission_utmSource_createdAt_idx"
ON "ContactSubmission"("utmSource", "createdAt");
