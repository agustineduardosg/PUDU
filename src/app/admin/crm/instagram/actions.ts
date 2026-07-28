"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { processInstagramWebhook } from "@/lib/instagram/inbound";
import { requireAdmin } from "@/lib/require-admin";

function clean(value: unknown, maxLength = 4000) {
  return String(value || "").trim().slice(0, maxLength);
}

export async function simulateInstagramInbound(formData: FormData) {
  await requireAdmin();
  if (process.env.CRM_DEMO_MODE === "true") {
    throw new Error("El simulador requiere una base PostgreSQL activa.");
  }

  const username = clean(formData.get("username"), 120)
    .toLowerCase()
    .replace(/^@/, "");
  const text = clean(formData.get("message"));
  if (!username || !text) {
    throw new Error("Completa la cuenta de Instagram y el mensaje.");
  }

  const senderId = `sim-${username}`;
  await processInstagramWebhook(
    {
      object: "instagram",
      entry: [
        {
          id: "pudu-instagram-local",
          time: Date.now(),
          messaging: [
            {
              message: { mid: `sim-mid-${randomUUID()}`, text },
              recipient: { id: "pudu-instagram-local" },
              sender: { id: senderId, username },
              timestamp: Date.now(),
            },
          ],
        },
      ],
    },
    "SIMULATOR",
  );

  revalidatePath("/admin");
  revalidatePath("/admin/crm");
  revalidatePath("/admin/crm/instagram");
}
