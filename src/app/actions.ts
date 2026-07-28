"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { crmDemoLeads } from "@/data/crmDemo";

function formValue(formData: FormData, field: string, maxLength: number) {
  return String(formData.get(field) || "").trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function submitContactForm(formData: FormData) {
  const name = formValue(formData, "name", 160);
  const company = formValue(formData, "company", 200);
  const email = formValue(formData, "email", 254).toLowerCase();
  const phone = formValue(formData, "phone", 40);
  const interest = formValue(formData, "interest", 200);
  const message = formValue(formData, "message", 4000);
  const utmSource = formValue(formData, "utmSource", 120);
  const utmMedium = formValue(formData, "utmMedium", 120);
  const utmCampaign = formValue(formData, "utmCampaign", 180);
  const utmContent = formValue(formData, "utmContent", 180);
  const landingPath = formValue(formData, "landingPath", 500);
  const referrer = formValue(formData, "referrer", 500);
  const conversionSessionKey = formValue(
    formData,
    "conversionSessionKey",
    120,
  );

  if (!name || !email || !message) {
    return { error: "Todos los campos obligatorios son necesarios." };
  }
  if (!email.includes("@") || !email.includes(".")) {
    return { error: "Ingresa un correo válido." };
  }

  let submission: { id: string };

  try {
    submission = await prisma.contactSubmission.create({
      data: {
        company: company || null,
        email,
        interest,
        landingPath: landingPath || null,
        message,
        name,
        phone: phone || null,
        referrer: referrer || null,
        utmCampaign: utmCampaign || null,
        utmContent: utmContent || null,
        utmMedium: utmMedium || null,
        utmSource: utmSource || null,
      },
    });
  } catch (error) {
    console.error("Error saving contact submission:", error);
    return {
      error:
        "No pudimos registrar tu solicitud. Inténtalo nuevamente en unos minutos.",
    };
  }

  if (conversionSessionKey) {
    try {
      await prisma.conversionSession.upsert({
        create: {
          events: {
            create: {
              name: "LEAD_SUBMITTED",
              path: landingPath || "/",
              metadata: { interest },
            },
          },
          firstPath: landingPath || "/",
          firstReferrer: referrer || null,
          leadId: submission.id,
          sessionKey: conversionSessionKey,
          utmCampaign: utmCampaign || null,
          utmContent: utmContent || null,
          utmMedium: utmMedium || null,
          utmSource: utmSource || null,
        },
        update: {
          events: {
            create: {
              name: "LEAD_SUBMITTED",
              path: landingPath || "/",
              metadata: { interest },
            },
          },
          leadId: submission.id,
        },
        where: { sessionKey: conversionSessionKey },
      });
    } catch (error) {
      // The lead is already safe in the CRM. Analytics should not make the
      // visitor resubmit the form if attribution fails.
      console.error("Contact saved, but conversion attribution failed:", error);
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"PUDU Ecosystem" <${process.env.SMTP_USER}>`,
      to: "agustineduardosg@puduit.tech, puduit_solutions@puduit.tech",
      subject: `🚀 Nuevo Lead: ${name} - ${interest}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #10B981;">Nuevo Contacto desde PUDU Landing</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p><strong>Empresa/Cargo:</strong> ${escapeHtml(company || "No especificado")}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Teléfono:</strong> ${escapeHtml(phone || "No especificado")}</p>
          <p><strong>Interés:</strong> ${escapeHtml(interest)}</p>
          <p><strong>Origen:</strong> ${escapeHtml([utmSource, utmMedium, utmCampaign].filter(Boolean).join(" / ") || "Directo")}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Mensaje:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${escapeHtml(message)}</p>
          <footer style="margin-top: 20px; font-size: 12px; color: #666;">
            Enviado automáticamente desde el motor PUDU Ecosystem. ID: ${submission.id}
          </footer>
        </div>
      `,
    });
  } catch (error) {
    // El prospecto ya quedó guardado en el CRM. Una falla de notificación no
    // debe hacer que la persona reenvíe el formulario y genere duplicados.
    console.error("Contact saved, but notification email failed:", error);
  }

  revalidatePath("/");
  return {
    success:
      "¡Solicitud recibida! Revisaremos tu caso y te contactaremos dentro de 1 día hábil.",
  };
}

export async function saveQuote(data: {
  clientName: string;
  clientRut: string;
  clientEmail: string;
  validUntil: string;
  subtotal: number;
  iva: number;
  total: number;
  notes: string;
  items: {
    serviceId: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}) {
  try {
    const quote = await prisma.quote.create({
      data: {
        clientName: data.clientName,
        clientRut: data.clientRut,
        clientEmail: data.clientEmail,
        validUntil: data.validUntil,
        subtotal: data.subtotal,
        iva: data.iva,
        total: data.total,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            serviceId: item.serviceId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
    });

    revalidatePath("/admin");
    return { success: true, quoteId: quote.id };
  } catch (error) {
    console.error("Error saving quote:", error);
    return { error: "No se pudo guardar la cotización en la base de datos." };
  }
}

export async function getDashboardData() {
  if (process.env.CRM_DEMO_MODE === "true") {
    return {
      metrics: {
        quotesCount: 0,
        totalValue: 0,
        dbStatus: "DEMO",
      },
      recentQuotes: [],
      recentLeads: crmDemoLeads.slice(0, 5),
    };
  }

  try {
    const [quotesCount, totalProposed, recentQuotes, recentLeads] = await Promise.all([
      prisma.quote.count(),
      prisma.quote.aggregate({
        _sum: {
          total: true,
        },
      }),
      prisma.quote.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.contactSubmission.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return {
      metrics: {
        quotesCount,
        totalValue: totalProposed._sum.total || 0,
        dbStatus: "OK",
      },
      recentQuotes,
      recentLeads,
    };
  } catch (error: unknown) {
    console.error("CRITICAL: Error fetching dashboard data:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido de base de datos";
    // Return empty state instead of crashing, but include error info for the dev
    return {
      metrics: {
        quotesCount: 0,
        totalValue: 0,
        dbStatus: "ERROR",
        errorMessage,
      },
      recentQuotes: [],
      recentLeads: [],
      error: true
    };
  }
}
export async function getAllLeads() {
  if (process.env.CRM_DEMO_MODE === "true") {
    return crmDemoLeads;
  }

  try {
    const leads = await prisma.contactSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return leads;
  } catch (error) {
    console.error("Error fetching all leads:", error);
    throw new Error("No se pudieron cargar los prospectos.");
  }
}
export async function getAllQuotes() {
  if (process.env.CRM_DEMO_MODE === "true") {
    return [];
  }

  try {
    const quotes = await prisma.quote.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    });
    return quotes;
  } catch (error) {
    console.error("Error fetching all quotes:", error);
    throw new Error("No se pudieron cargar las cotizaciones.");
  }
}
