ALTER TABLE "ContactSubmission"
ADD COLUMN "qualificationSummary" TEXT,
ADD COLUMN "qualificationReason" TEXT,
ADD COLUMN "qualificationConfidence" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "classificationVersion" TEXT,
ADD COLUMN "qualifiedAt" TIMESTAMP(3);

CREATE INDEX "ContactSubmission_priority_score_idx"
ON "ContactSubmission"("priority", "score");
