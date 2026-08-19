import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "برای استفاده از کد تخفیف باید وارد شوید" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "کد تخفیف را وارد کنید" },
        { status: 400 }
      );
    }

    if (typeof subtotal !== "number" || subtotal <= 0) {
      return NextResponse.json(
        { success: false, error: "مبلغ سبد خرید نامعتبر است" },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "کد تخفیف نامعتبر است" },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, error: "این کد تخفیف غیرفعال است" },
        { status: 400 }
      );
    }

    const now = new Date();

    if (coupon.startsAt > now) {
      return NextResponse.json(
        { success: false, error: "این کد تخفیف هنوز فعال نشده است" },
        { status: 400 }
      );
    }

    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json(
        { success: false, error: "این کد تخفیف منقضی شده است" },
        { status: 400 }
      );
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: "ظرفیت این کد تخفیف به پایان رسیده" },
        { status: 400 }
      );
    }

    const userUsageCount = await prisma.couponUsage.count({
      where: {
        couponId: coupon.id,
        userId: user.id,
      },
    });

    if (userUsageCount >= coupon.perUserLimit) {
      return NextResponse.json(
        { success: false, error: "شما قبلاً از این کد تخفیف استفاده کرده‌اید" },
        { status: 400 }
      );
    }

    if (subtotal < coupon.minOrderAmount) {
      const remaining = coupon.minOrderAmount - subtotal;
      return NextResponse.json(
        {
          success: false,
          error: `حداقل مبلغ سفارش برای این کد ${coupon.minOrderAmount.toLocaleString("fa-IR")} تومان است (${remaining.toLocaleString("fa-IR")} تومان دیگر بخرید)`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;

    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = Math.floor((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        couponId: coupon.id,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        description: coupon.description,
      },
      message: `کد تخفیف اعمال شد (${discountAmount.toLocaleString("fa-IR")} تومان تخفیف)`,
    });
  } catch (error) {
    console.error("خطا در بررسی کد تخفیف:", error);
    return NextResponse.json(
      { success: false, error: "خطا در بررسی کد تخفیف" },
      { status: 500 }
    );
  }
}