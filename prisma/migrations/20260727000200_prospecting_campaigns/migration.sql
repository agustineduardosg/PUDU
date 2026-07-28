CREATE TYPE "CampaignStatus" AS ENUM (
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'COMPLETED',
  'ARCHIVED'
);

CREATE TYPE "CampaignMemberStatus" AS ENUM (
  'PENDING',
  'APPROVED',
  'CONTACTED',
  'REPLIED',
  'QUALIFIED',
  'SKIPPED'
);

CREATE TABLE "MessageTemplate" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "channel" "MessageChannel" NOT NULL,
  "subject" TEXT,
  "content" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "usageCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MessageTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Campaign" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "channel" "MessageChannel" NOT NULL,
  "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CampaignMember" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "status" "CampaignMemberStatus" NOT NULL DEFAULT 'PENDING',
  "approvedAt" TIMESTAMP(3),
  "contactedAt" TIMESTAMP(3),
  "repliedAt" TIMESTAMP(3),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CampaignMember_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ContactSubmission" ALTER COLUMN "email" DROP NOT NULL;

ALTER TABLE "OutboundMessage"
  ADD COLUMN "campaignId" TEXT,
  ADD COLUMN "templateId" TEXT;

CREATE INDEX "MessageTemplate_channel_isActive_idx"
  ON "MessageTemplate"("channel", "isActive");
CREATE INDEX "Campaign_status_createdAt_idx"
  ON "Campaign"("status", "createdAt");
CREATE UNIQUE INDEX "CampaignMember_campaignId_leadId_key"
  ON "CampaignMember"("campaignId", "leadId");
CREATE INDEX "CampaignMember_campaignId_status_idx"
  ON "CampaignMember"("campaignId", "status");
CREATE INDEX "CampaignMember_leadId_createdAt_idx"
  ON "CampaignMember"("leadId", "createdAt");
CREATE INDEX "OutboundMessage_campaignId_status_idx"
  ON "OutboundMessage"("campaignId", "status");
CREATE INDEX "OutboundMessage_templateId_idx"
  ON "OutboundMessage"("templateId");

ALTER TABLE "CampaignMember"
  ADD CONSTRAINT "CampaignMember_campaignId_fkey"
  FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CampaignMember"
  ADD CONSTRAINT "CampaignMember_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "ContactSubmission"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OutboundMessage"
  ADD CONSTRAINT "OutboundMessage_campaignId_fkey"
  FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OutboundMessage"
  ADD CONSTRAINT "OutboundMessage_templateId_fkey"
  FOREIGN KEY ("templateId") REFERENCES "MessageTemplate"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "MessageTemplate"
  ("id", "name", "channel", "subject", "content", "isActive", "usageCount", "createdAt", "updatedAt")
VALUES
  (
    'template-first-contact',
    'Primer acercamiento',
    'EMAIL',
    'Una idea tecnológica para tu empresa',
    'Hola {nombre}, soy parte de PUDU IT Solutions. Estuvimos revisando el trabajo de {empresa} y vemos una oportunidad concreta para mejorar {interes}. ¿Te parece si coordinamos una conversación breve esta semana?',
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'template-follow-up',
    'Seguimiento',
    'EMAIL',
    'Seguimiento a nuestra conversación',
    'Hola {nombre}, quería retomar nuestra conversación sobre {interes}. Podemos preparar una propuesta acotada con alcance, plazos y próximos pasos. ¿Qué día te acomoda revisarla?',
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'template-proposal',
    'Envío de propuesta',
    'EMAIL',
    'Propuesta PUDU IT Solutions',
    'Hola {nombre}, ya preparamos la propuesta para {empresa}. Resume la solución para {interes}, el plan de implementación y la inversión estimada. Quedo atento para revisarla contigo.',
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
