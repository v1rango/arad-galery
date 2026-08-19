import { prisma } from "./prisma";

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetIn: number;
};

export async function rateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = new Date();

  try {
    const existing = await prisma.rateLimit.findUnique({
      where: { identifier },
    });

    if (!existing || existing.resetAt < now) {
      const resetAt = new Date(now.getTime() + windowMs);
      await prisma.rateLimit.upsert({
        where: { identifier },
        create: {
          identifier,
          count: 1,
          resetAt,
        },
        update: {
          count: 1,
          resetAt,
        },
      });

      return {
        success: true,
        remaining: maxRequests - 1,
        resetIn: windowMs,
      };
    }

    if (existing.count >= maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetIn: existing.resetAt.getTime() - now.getTime(),
      };
    }

    const updated = await prisma.rateLimit.update({
      where: { identifier },
      data: { count: { increment: 1 } },
    });

    return {
      success: true,
      remaining: maxRequests - updated.count,
      resetIn: existing.resetAt.getTime() - now.getTime(),
    };
  } catch (error) {
    console.error("خطای Rate Limit:", error);
    return {
      success: true,
      remaining: maxRequests,
      resetIn: windowMs,
    };
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export async function cleanupExpiredRateLimits(): Promise<number> {
  try {
    const result = await prisma.rateLimit.deleteMany({
      where: {
        resetAt: { lt: new Date() },
      },
    });
    return result.count;
  } catch (error) {
    console.error("خطای پاک‌سازی Rate Limit:", error);
    return 0;
  }
}