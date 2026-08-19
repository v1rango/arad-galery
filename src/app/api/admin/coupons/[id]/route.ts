import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { usages: true },
        },
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "کوپن یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.error("خطا در دریافت کوپن:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
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

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "کوپن یافت نشد" },
        { status: 404 }
      );
    }

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "کد کوپن الزامی است" },
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

    if (normalizedCode !== existing.code) {
      const duplicate = await prisma.coupon.findUnique({
        where: { code: normalizedCode },
      });
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: "کدی با این نام قبلاً ثبت شده" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        code: normalizedCode,
        description: description?.trim() || null,
        discountType,
        discountValue: parseInt(discountValue.toString()),
        maxDiscountAmount: maxDiscountAmount ? parseInt(maxDiscountAmount.toString()) : null,
        minOrderAmount: minOrderAmount ? parseInt(minOrderAmount.toString()) : 0,
        usageLimit: usageLimit ? parseInt(usageLimit.toString()) : null,
        perUserLimit: perUserLimit ? parseInt(perUserLimit.toString()) : 1,
        startsAt: startsAt ? new Date(startsAt) : existing.startsAt,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "کوپن با موفقیت به‌روزرسانی شد",
    });
  } catch (error) {
    console.error("خطا در به‌روزرسانی کوپن:", error);
    return NextResponse.json(
      { success: false, error: "خطا در به‌روزرسانی کوپن" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "کوپن یافت نشد" },
        { status: 404 }
      );
    }

    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "کوپن حذف شد",
    });
  } catch (error) {
    console.error("خطا در حذف کوپن:", error);
    return NextResponse.json(
      { success: false, error: "خطا در حذف کوپن" },
      { status: 500 }
    );
  }
}