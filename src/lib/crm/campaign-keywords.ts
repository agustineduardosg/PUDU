export const INSTAGRAM_EDITORIAL_CAMPAIGN = "ig_2026_08_verticales";

export type CampaignKeywordMatch = {
  campaign: string;
  interest: string;
  keyword: "AGENDA" | "DIAGNÓSTICO" | "FITNESS" | "SALUD";
  qualificationQuestion: string;
  score: number;
  tags: string[];
  vertical: "belleza" | "fitness" | "general" | "salud";
};

const keywordDefinitions: Record<
  string,
  Omit<CampaignKeywordMatch, "campaign" | "keyword">
> = {
  agenda: {
    interest: "Agenda online",
    qualificationQuestion:
      "¿Cómo registras hoy una reserva y su confirmación?",
    score: 36,
    tags: [
      "campana:agenda",
      "rubro:belleza",
      "servicio:agenda",
      `utm-campaign:${INSTAGRAM_EDITORIAL_CAMPAIGN}`,
    ],
    vertical: "belleza",
  },
  diagnostico: {
    interest: "Diagnóstico digital general",
    qualificationQuestion:
      "¿Qué te gustaría ordenar primero: ventas y seguimiento, agenda y reservas, tareas repetitivas u otro proceso?",
    score: 28,
    tags: [
      "campana:diagnostico",
      "rubro:general",
      `utm-campaign:${INSTAGRAM_EDITORIAL_CAMPAIGN}`,
    ],
    vertical: "general",
  },
  fitness: {
    interest: "CRM + Agenda online",
    qualificationQuestion:
      "¿Cómo registras hoy las consultas, pagos y renovaciones?",
    score: 42,
    tags: [
      "campana:fitness",
      "rubro:fitness",
      "servicio:agenda",
      "servicio:crm",
      `utm-campaign:${INSTAGRAM_EDITORIAL_CAMPAIGN}`,
    ],
    vertical: "fitness",
  },
  salud: {
    interest: "Agenda online + CRM",
    qualificationQuestion:
      "¿Cómo coordinas hoy las solicitudes y confirmaciones de hora?",
    score: 42,
    tags: [
      "campana:salud",
      "rubro:salud",
      "servicio:agenda",
      "servicio:crm",
      `utm-campaign:${INSTAGRAM_EDITORIAL_CAMPAIGN}`,
    ],
    vertical: "salud",
  },
};

function normalizeKeyword(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-CL")
    .replace(/[¡!¿?.,;:'"()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectCampaignKeyword(
  messages: string[],
): CampaignKeywordMatch | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const normalized = normalizeKeyword(messages[index] || "");
    const definition = keywordDefinitions[normalized];

    if (!definition) continue;

    const keyword =
      normalized === "diagnostico"
        ? "DIAGNÓSTICO"
        : (normalized.toLocaleUpperCase("es-CL") as CampaignKeywordMatch["keyword"]);

    return {
      ...definition,
      campaign: INSTAGRAM_EDITORIAL_CAMPAIGN,
      keyword,
    };
  }

  return null;
}
