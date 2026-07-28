"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { crmDemoLeads } from "@/data/crmDemo";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const company = formData.get("company") as string;
  const email = formData.get("email") as string;
  const interest = formData.get("interest") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Todos los campos obligatorios son necesarios." };
  }

  try {
    // 1. Guardar en Base de Datos
    const submission = await prisma.contactSubmission.create({
      data: { name, company, email, interest, message },
    });

    // 2. Configurar Transportador (Zoho)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 3. Enviar Correo
    await transporter.sendMail({
      from: `"PUDU Ecosystem" <${process.env.SMTP_USER}>`,
      to: "agustineduardosg@puduit.tech, puduit_solutions@puduit.tech",
      subject: `🚀 Nuevo Lead: ${name} - ${interest}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #10B981;">Nuevo Contacto desde PUDU Landing</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Empresa/Cargo:</strong> ${company || "No especificado"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Interés:</strong> ${interest}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Mensaje:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
          <footer style="margin-top: 20px; font-size: 12px; color: #666;">
            Enviado automáticamente desde el motor PUDU Ecosystem. ID: ${submission.id}
          </footer>
        </div>
      `,
    });

    revalidatePath("/");
    return { success: "¡Solicitud enviada con éxito! Nos contactaremos pronto." };
  } catch (error) {
    console.error("Error submitting form:", error);
    return { error: "Hubo un problema al enviar tu solicitud. Inténtalo de nuevo." };
  }
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
