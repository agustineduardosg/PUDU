import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!(await verifyAdminSessionToken(token))) {
    redirect("/admin/login");
  }
}
