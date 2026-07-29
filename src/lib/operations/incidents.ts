import {
  IncidentSeverity,
  type Prisma,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

type IncidentInput = {
  detail: string;
  fingerprint: string;
  metadata?: Prisma.InputJsonValue;
  severity?: IncidentSeverity;
  source: string;
  title: string;
};

export async function recordIncident({
  detail,
  fingerprint,
  metadata,
  severity = IncidentSeverity.WARNING,
  source,
  title,
}: IncidentInput) {
  try {
    await prisma.systemIncident.upsert({
      create: {
        detail: detail.slice(0, 4000),
        fingerprint: fingerprint.slice(0, 240),
        metadata,
        severity,
        source: source.slice(0, 120),
        title: title.slice(0, 240),
      },
      update: {
        detail: detail.slice(0, 4000),
        lastOccurredAt: new Date(),
        metadata,
        occurrences: { increment: 1 },
        resolvedAt: null,
        severity,
        status: "OPEN",
      },
      where: { fingerprint: fingerprint.slice(0, 240) },
    });
  } catch (incidentError) {
    console.error("Could not persist operational incident:", incidentError);
  }
}
