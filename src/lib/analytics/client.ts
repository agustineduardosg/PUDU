"use client";

export type ConversionEventName =
  | "PAGE_VIEW"
  | "CTA_CLICK"
  | "DIAGNOSTIC_STARTED"
  | "DIAGNOSTIC_COMPLETED"
  | "CONTACT_FORM_STARTED";

export type ConversionContext = {
  sessionKey: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  landingPath: string;
  referrer: string;
};

const contextKey = "pudu_conversion_context";

function createSessionKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getConversionContext(): ConversionContext {
  const emptyContext: ConversionContext = {
    sessionKey: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    landingPath: "",
    referrer: "",
  };

  if (typeof window === "undefined") return emptyContext;

  const params = new URLSearchParams(window.location.search);
  const currentAttribution = {
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
  };
  const hasCurrentAttribution = Object.values(currentAttribution).some(Boolean);
  const stored = window.sessionStorage.getItem(contextKey);

  if (stored) {
    try {
      const storedContext = JSON.parse(stored) as ConversionContext;

      // A new campaign visit must replace attribution left by an earlier visit
      // in the same browser tab. Otherwise the CRM credits the new lead to the
      // first link opened during the session.
      if (hasCurrentAttribution) {
        const refreshedContext: ConversionContext = {
          ...storedContext,
          ...currentAttribution,
          landingPath: `${window.location.pathname}${window.location.search}`,
        };

        window.sessionStorage.setItem(
          contextKey,
          JSON.stringify(refreshedContext),
        );
        return refreshedContext;
      }

      return storedContext;
    } catch {
      window.sessionStorage.removeItem(contextKey);
    }
  }

  const context: ConversionContext = {
    sessionKey: createSessionKey(),
    ...currentAttribution,
    landingPath: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer,
  };

  window.sessionStorage.setItem(contextKey, JSON.stringify(context));
  return context;
}

export function trackConversion(
  event: ConversionEventName,
  metadata?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;

  const context = getConversionContext();
  const payload = JSON.stringify({
    event,
    metadata,
    path: `${window.location.pathname}${window.location.search}`,
    ...context,
  });

  void fetch("/api/analytics/events", {
    body: payload,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    method: "POST",
  }).catch(() => {
    // Analytics must never interrupt the visitor's experience.
  });

  window.dispatchEvent(
    new CustomEvent("pudu:conversion", { detail: { event, metadata } }),
  );
}
