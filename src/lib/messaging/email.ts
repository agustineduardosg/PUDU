import nodemailer from "nodemailer";

function numericLimit(value: string | undefined) {
  const parsed = Number.parseInt(value || "20", 10);
  return Number.isFinite(parsed) ? Math.min(200, Math.max(1, parsed)) : 20;
}

export function getEmailDeliveryConfig() {
  const host = process.env.SMTP_HOST?.trim() || "";
  const port = Number.parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER?.trim() || "";
  const pass = process.env.SMTP_PASS || "";
  const from = process.env.SMTP_FROM?.trim() || user;
  const mode =
    process.env.CRM_EMAIL_DELIVERY_MODE === "preview" ? "preview" : "smtp";

  return {
    configured:
      mode === "preview" || Boolean(host && port && user && pass && from),
    dailyLimit: numericLimit(process.env.CRM_EMAIL_DAILY_LIMIT),
    enabled: process.env.CRM_EMAIL_SENDING_ENABLED === "true",
    from,
    host,
    mode,
    pass,
    port,
    user,
  };
}

export function startOfTodayInSantiago(now = new Date()) {
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Santiago",
    year: "numeric",
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((result, part) => {
      result[part.type] = part.value;
      return result;
    }, {});
  const utcMidnight = Date.UTC(
    Number(dateParts.year),
    Number(dateParts.month) - 1,
    Number(dateParts.day),
  );
  const offsetName =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Santiago",
      timeZoneName: "longOffset",
    })
      .formatToParts(new Date(utcMidnight))
      .find((part) => part.type === "timeZoneName")?.value || "GMT-04:00";
  const match = offsetName.match(/GMT([+-])(\d{2}):?(\d{2})/);
  const offsetMinutes = match
    ? (match[1] === "+" ? 1 : -1) *
      (Number(match[2]) * 60 + Number(match[3]))
    : -240;

  return new Date(utcMidnight - offsetMinutes * 60_000);
}

export async function sendEmailMessage(input: {
  recipient: string;
  subject: string;
  content: string;
}) {
  const config = getEmailDeliveryConfig();

  if (!config.enabled) {
    throw new Error("El envío real está deshabilitado por configuración.");
  }
  if (!config.configured) {
    throw new Error("La cuenta SMTP todavía no está configurada.");
  }

  const transporter =
    config.mode === "preview"
      ? nodemailer.createTransport({
          buffer: true,
          newline: "unix",
          streamTransport: true,
        })
      : nodemailer.createTransport({
          auth: { pass: config.pass, user: config.user },
          host: config.host,
          port: config.port,
          secure: config.port === 465,
        });
  const result = await transporter.sendMail({
    from:
      config.mode === "preview"
        ? "PUDU CRM Local <preview@pudu.test>"
        : config.from,
    html: input.content.replaceAll("\n", "<br />"),
    subject: input.subject,
    text: input.content,
    to: input.recipient,
  });

  return { messageId: result.messageId, mode: config.mode };
}
