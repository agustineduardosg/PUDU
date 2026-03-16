"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    await prisma.contactSubmission.create({
      data: {
        name,
        company,
        email,
        interest,
        message,
      },
    });

    revalidatePath("/");
    return { success: "¡Solicitud enviada con éxito! Nos contactaremos pronto." };
  } catch (error) {
    console.error("Error submitting form:", error);
    return { error: "Hubo un problema al enviar tu solicitud. Inténtalo de nuevo." };
  }
}
