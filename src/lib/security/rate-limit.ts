import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

type RateLimitOptions = {
  identifier: string;
  limit: number;
  scope: string;
  windowMs: number;
};

function hashIdentifier(identifier: string) {
  const salt =
    process.env.ABUSE_HASH_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    "pudu-rate-limit";

  return createHash("sha256")
    .update(`${salt}:${identifier}`)
    .digest("hex");
}

export async function requestIdentifier(extra = "") {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 240) || "unknown";

  return `${ip}|${userAgent}|${extra}`;
}

export function requestIdentifierFromHeaders(
  requestHeaders: Headers,
  extra = "",
) {
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 240) || "unknown";

  return `${ip}|${userAgent}|${extra}`;
}

export async function consumeRateLimit({
  identifier,
  limit,
  scope,
  windowMs,
}: RateLimitOptions) {
  const keyHash = hashIdentifier(identifier);
  const now = new Date();

  return prisma.$transaction(async (transaction) => {
    const current = await transaction.abuseThrottle.findUnique({
      where: { scope_keyHash: { keyHash, scope } },
    });

    if (!current) {
      await transaction.abuseThrottle.create({
        data: { keyHash, scope, windowStartedAt: now },
      });
      return { allowed: true, remaining: Math.max(0, limit - 1) };
    }

    const expired =
      current.windowStartedAt.getTime() + windowMs <= now.getTime();

    if (expired) {
      await transaction.abuseThrottle.update({
        data: { count: 1, windowStartedAt: now },
        where: { id: current.id },
      });
      return { allowed: true, remaining: Math.max(0, limit - 1) };
    }

    if (current.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs:
          current.windowStartedAt.getTime() + windowMs - now.getTime(),
      };
    }

    await transaction.abuseThrottle.update({
      data: { count: { increment: 1 } },
      where: { id: current.id },
    });

    return {
      allowed: true,
      remaining: Math.max(0, limit - current.count - 1),
    };
  });
}
