import { NextRequest, NextResponse } from "next/server";
import { ConversionEventName } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const allowedEvents = new Set<ConversionEventName>([
  "PAGE_VIEW",
  "CTA_CLICK",
  "DIAGNOSTIC_STARTED",
  "DIAGNOSTIC_COMPLETED",
  "CONTACT_FORM_STARTED",
]);

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function safeMetadata(
  value: unknown,
): Record<string, string | number | boolean> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(value)
      .slice(0, 12)
      .flatMap(([key, item]) => {
        if (!["string", "number", "boolean"].includes(typeof item)) return [];
        const safeValue =
          typeof item === "string" ? item.slice(0, 250) : item;
        return [[key.slice(0, 80), safeValue]];
      }),
  );
}

function deviceType(userAgent: string) {
  if (/tablet|ipad/i.test(userAgent)) return "tablet";
  if (/mobile|android|iphone/i.test(userAgent)) return "mobile";
  return "desktop";
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const event = text(body.event, 40) as ConversionEventName;
  const sessionKey = text(body.sessionKey, 120);
  const path = text(body.path, 500) || "/";

  if (!sessionKey || !allowedEvents.has(event)) {
    return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
  }

  try {
    const session = await prisma.conversionSession.upsert({
      create: {
        deviceType: deviceType(request.headers.get("user-agent") || ""),
        firstPath: text(body.landingPath, 500) || path,
        firstReferrer: text(body.referrer, 500) || null,
        sessionKey,
        utmCampaign: text(body.utmCampaign, 180) || null,
        utmContent: text(body.utmContent, 180) || null,
        utmMedium: text(body.utmMedium, 120) || null,
        utmSource: text(body.utmSource, 120) || null,
      },
      update: {},
      where: { sessionKey },
    });

    await prisma.conversionEvent.create({
      data: {
        metadata: safeMetadata(body.metadata),
        name: event,
        path,
        sessionId: session.id,
      },
    });

    return NextResponse.json({ accepted: true }, { status: 202 });
  } catch (error) {
    console.error("Could not store conversion event:", error);
    return NextResponse.json(
      { error: "No se pudo registrar el evento." },
      { status: 500 },
    );
  }
}
