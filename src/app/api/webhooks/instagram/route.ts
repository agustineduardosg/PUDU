import { createHmac, timingSafeEqual } from "node:crypto";
import { IncidentSeverity } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { processInstagramWebhook } from "@/lib/instagram/inbound";
import { recordIncident } from "@/lib/operations/incidents";

export const runtime = "nodejs";

function validSignature(body: string, signature: string | null) {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !signature?.startsWith("sha256=")) return false;

  const expected = Buffer.from(
    createHmac("sha256", secret).update(body).digest("hex"),
  );
  const received = Buffer.from(signature.slice("sha256=".length));
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    challenge &&
    token &&
    token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN
  ) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Verificación rechazada." }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!validSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as unknown;
    const result = await processInstagramWebhook(payload);
    return NextResponse.json({ received: true, ...result });
  } catch (error) {
    console.error("No se pudo procesar el webhook de Instagram:", error);
    await recordIncident({
      detail: error instanceof Error ? error.message : "Error desconocido",
      fingerprint: "instagram-webhook-processing",
      severity: IncidentSeverity.CRITICAL,
      source: "instagram-webhook",
      title: "Falló el procesamiento de mensajes de Instagram",
    });
    return NextResponse.json(
      { error: "No se pudo procesar el evento." },
      { status: 500 },
    );
  }
}
