import {
  InstagramConversationStatus,
  LeadPriority,
  LeadStatus,
} from "@/generated/prisma";

export const LEAD_CLASSIFICATION_VERSION = "rules-cl-v1";
export const INSTAGRAM_RESPONSE_TASK_TITLE = "Responder DM de Instagram";

type SignalGroup = {
  label: string;
  patterns: RegExp[];
  score: number;
  tag: string;
};

const services: SignalGroup[] = [
  {
    label: "CRM",
    patterns: [
      /\bcrm\b/,
      /gesti[oó]n de clientes/,
      /seguimiento de (clientes|ventas|prospectos)/,
      /pipeline/,
    ],
    score: 22,
    tag: "servicio:crm",
  },
  {
    label: "Automatización",
    patterns: [
      /automatiza/,
      /flujo(s)? de trabajo/,
      /tarea(s)? repetitiva/,
      /integraci[oó]n/,
      /\bapi\b/,
    ],
    score: 22,
    tag: "servicio:automatizacion",
  },
  {
    label: "Landing page",
    patterns: [
      /landing/,
      /p[aá]gina web/,
      /sitio web/,
      /p[aá]gina de venta/,
      /presencia (web|digital)/,
    ],
    score: 18,
    tag: "servicio:landing",
  },
  {
    label: "SaaS o software a medida",
    patterns: [
      /\bsaas\b/,
      /software a medida/,
      /plataforma/,
      /sistema (web|propio|de gesti[oó]n)/,
      /aplicaci[oó]n/,
    ],
    score: 22,
    tag: "servicio:saas",
  },
  {
    label: "Agenda online",
    patterns: [
      /agenda (online|digital)/,
      /agendamiento/,
      /reservas/,
      /reservar hora/,
      /citas/,
    ],
    score: 20,
    tag: "servicio:agenda",
  },
  {
    label: "Comercio electrónico",
    patterns: [
      /e-?commerce/,
      /tienda (online|virtual)/,
      /venta(s)? online/,
      /carrito de compra/,
    ],
    score: 20,
    tag: "servicio:ecommerce",
  },
  {
    label: "Ciberseguridad",
    patterns: [
      /ciberseguridad/,
      /seguridad inform[aá]tica/,
      /protecci[oó]n de datos/,
      /\bdlp\b/,
      /ley 21\.?719/,
    ],
    score: 22,
    tag: "servicio:ciberseguridad",
  },
  {
    label: "Soporte tecnológico",
    patterns: [
      /soporte/,
      /mantenci[oó]n/,
      /problema (t[eé]cnico|con el sistema)/,
      /infraestructura/,
      /redes/,
    ],
    score: 14,
    tag: "servicio:soporte",
  },
];

const commercialSignals: SignalGroup[] = [
  {
    label: "solicita cotización o precio",
    patterns: [
      /cotiza/,
      /presupuesto/,
      /\bprecio(s)?\b/,
      /\bcu[aá]nto (cuesta|sale|cobran)\b/,
      /valor del servicio/,
    ],
    score: 24,
    tag: "intencion:cotizacion",
  },
  {
    label: "solicita reunión o contacto",
    patterns: [
      /reuni[oó]n/,
      /agend(ar|emos|emos una)/,
      /llamada/,
      /conversemos/,
      /contact(ar|en|o)/,
      /hablar con/,
    ],
    score: 22,
    tag: "intencion:reunion",
  },
  {
    label: "expresa urgencia",
    patterns: [
      /\burgente\b/,
      /lo antes posible/,
      /esta semana/,
      /necesitamos? (ahora|pronto)/,
      /cuanto antes/,
    ],
    score: 18,
    tag: "intencion:urgente",
  },
  {
    label: "describe una necesidad concreta",
    patterns: [
      /necesito/,
      /necesitamos/,
      /busco/,
      /buscamos/,
      /queremos/,
      /problema/,
      /mejorar/,
      /implementar/,
    ],
    score: 10,
    tag: "intencion:necesidad",
  },
];

function normalizeText(value: string) {
  return value.toLocaleLowerCase("es-CL").replace(/\s+/g, " ").trim();
}

function matchGroups(text: string, groups: SignalGroup[]) {
  return groups.filter((group) =>
    group.patterns.some((pattern) => pattern.test(text)),
  );
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function priorityFor(score: number, hasUrgency: boolean) {
  if (hasUrgency && score >= 65) return LeadPriority.URGENT;
  if (score >= 62) return LeadPriority.HIGH;
  if (score >= 30) return LeadPriority.MEDIUM;
  return LeadPriority.LOW;
}

function dueAtFor(priority: LeadPriority, now: Date) {
  const minutesByPriority: Record<LeadPriority, number> = {
    [LeadPriority.URGENT]: 60,
    [LeadPriority.HIGH]: 4 * 60,
    [LeadPriority.MEDIUM]: 24 * 60,
    [LeadPriority.LOW]: 48 * 60,
  };

  return new Date(now.getTime() + minutesByPriority[priority] * 60_000);
}

export type LeadClassification = {
  confidence: number;
  conversationStatus: InstagramConversationStatus;
  dueAt: Date;
  interest: string;
  priority: LeadPriority;
  reason: string;
  recommendedLeadStatus: LeadStatus;
  score: number;
  summary: string;
  tags: string[];
};

export function classifyInstagramLead(
  messages: string[],
  now = new Date(),
): LeadClassification {
  const text = normalizeText(messages.filter(Boolean).join("\n"));
  const matchedServices = matchGroups(text, services);
  const matchedSignals = matchGroups(text, commercialSignals);
  const hasContactData =
    /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text) ||
    /(?:\+?56\s?)?9[\s.-]?\d{4}[\s.-]?\d{4}/.test(text);
  const substantive = text.length >= 35;

  const rawScore =
    matchedServices.reduce((total, group) => total + group.score, 0) +
    matchedSignals.reduce((total, group) => total + group.score, 0) +
    (hasContactData ? 10 : 0) +
    (substantive ? 6 : 0);
  const score = Math.min(100, rawScore);
  const urgency = matchedSignals.some(
    (signal) => signal.tag === "intencion:urgente",
  );
  const priority = priorityFor(score, urgency);
  const serviceLabels = matchedServices.map((service) => service.label);
  const signalLabels = matchedSignals.map((signal) => signal.label);
  const tags = unique([
    "canal:instagram",
    ...matchedServices.map((service) => service.tag),
    ...matchedSignals.map((signal) => signal.tag),
    ...(hasContactData ? ["dato:contacto"] : []),
  ]);
  const interest =
    serviceLabels.length > 0
      ? serviceLabels.slice(0, 2).join(" + ")
      : "Consulta por Instagram por clasificar";
  const confidence = Math.min(
    95,
    20 + matchedServices.length * 22 + matchedSignals.length * 12 +
      Number(hasContactData) * 8 +
      Number(substantive) * 6,
  );
  const meaningful =
    matchedServices.length > 0 || matchedSignals.length > 0 || hasContactData;
  const summary = meaningful
    ? `${interest}. Prioridad ${priority.toLocaleLowerCase("es-CL")} con score ${score}/100.`
    : "Mensaje recibido sin señales comerciales suficientes; requiere revisión.";
  const reasons = [
    serviceLabels.length
      ? `Servicios detectados: ${serviceLabels.join(", ")}`
      : null,
    signalLabels.length
      ? `Señales: ${signalLabels.join(", ")}`
      : null,
    hasContactData ? "Incluye un dato de contacto" : null,
    !meaningful ? "No se detectaron señales comerciales explícitas" : null,
  ].filter(Boolean);

  return {
    confidence,
    conversationStatus:
      score >= 62
        ? InstagramConversationStatus.HUMAN_REQUIRED
        : meaningful
          ? InstagramConversationStatus.QUALIFIED
          : InstagramConversationStatus.NEW,
    dueAt: dueAtFor(priority, now),
    interest,
    priority,
    reason: reasons.join(". "),
    recommendedLeadStatus: meaningful
      ? LeadStatus.QUALIFYING
      : LeadStatus.NEW,
    score,
    summary,
    tags,
  };
}

export function preserveAdvancedLeadStatus(
  current: LeadStatus,
  recommended: LeadStatus,
) {
  const protectedStatuses = new Set<LeadStatus>([
    LeadStatus.CONTACTED,
    LeadStatus.MEETING,
    LeadStatus.PROPOSAL,
    LeadStatus.NEGOTIATION,
    LeadStatus.WON,
    LeadStatus.LOST,
  ]);

  return protectedStatuses.has(current) ? current : recommended;
}
