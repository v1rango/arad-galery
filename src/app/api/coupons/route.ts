import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim() || "";

    const where = search
      ? {
          OR: [
            { code: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { usages: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.error("خطا در دریافت کوپن‌ها:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscountAmount,
      minOrderAmount,
      usageLimit,
      perUserLimit,
      startsAt,
      expiresAt,
      isActive,
    } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "کد کوپن الزامی است" },
        { status: 400 }
      );
    }

    if (!discountType || !["PERCENTAGE", "FIXED"].includes(discountType)) {
      return NextResponse.json(
        { success: false, error: "نوع تخفیف نامعتبر است" },
        { status: 400 }
      );
    }

    if (typeof discountValue !== "number" || discountValue <= 0) {
      return NextResponse.json(
        { success: false, error: "مقدار تخفیف باید مثبت باشد" },
        { status: 400 }
      );
    }

    if (discountType === "PERCENTAGE" && discountValue > 100) {
      return NextResponse.json(
        { success: false, error: "تخفیف درصدی نمی‌تواند بیش از 100 باشد" },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "کدی با این نام قبلاً ثبت شده" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: normalizedCode,
        description: description?.trim() || null,
        discountType,
        discountValue: parseInt(discountValue.toString()),
        maxDiscountAmount: maxDiscountAmount ? parseInt(maxDiscountAmount.toString()) : null,
        minOrderAmount: minOrderAmount ? parseInt(minOrderAmount.toString()) : 0,
        usageLimit: usageLimit ? parseInt(usageLimit.toString()) : null,
        perUserLimit: perUserLimit ? parseInt(perUserLimit.toString()) : 1,
        startsAt: startsAt ? new Date(startsAt) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({
      success: true,
      data: coupon,
      message: "کوپن با موفقیت ساخته شد",
    });
  } catch (error) {
    console.error("خطا در ساخت کوپن:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ساخت کوپن" },
      { status: 500 }
    );
  }
}