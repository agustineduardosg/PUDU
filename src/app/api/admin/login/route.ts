import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";

type AttemptState = {
  count: number;
  resetAt: number;
};

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const globalForAttempts = globalThis as typeof globalThis & {
  puduLoginAttempts?: Map<string, AttemptState>;
};

const loginAttempts =
  globalForAttempts.puduLoginAttempts ?? new Map<string, AttemptState>();

if (process.env.NODE_ENV !== "production") {
  globalForAttempts.puduLoginAttempts = loginAttempts;
}

function getClientKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getAttemptState(clientKey: string) {
  const now = Date.now();
  const current = loginAttempts.get(clientKey);

  if (!current || current.resetAt <= now) {
    const fresh = { count: 0, resetAt: now + ATTEMPT_WINDOW_MS };
    loginAttempts.set(clientKey, fresh);
    return fresh;
  }

  return current;
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);
  const attempts = getAttemptState(clientKey);

  if (attempts.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera 15 minutos." },
      { status: 429 },
    );
  }

  let password = "";

  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!(await verifyAdminPassword(password))) {
    attempts.count += 1;
    loginAttempts.set(clientKey, attempts);

    return NextResponse.json(
      { error: "Credenciales inválidas." },
      { status: 401 },
    );
  }

  try {
    const token = await createAdminSessionToken();
    const response = NextResponse.json({ success: true });

    loginAttempts.delete(clientKey);
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      maxAge: ADMIN_SESSION_MAX_AGE,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("No se pudo crear la sesión administrativa:", error);
    return NextResponse.json(
      { error: "El acceso administrativo no está configurado." },
      { status: 503 },
    );
  }
}
