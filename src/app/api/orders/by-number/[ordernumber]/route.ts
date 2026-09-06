import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber?: string; ordernumber?: string }> }
) {
  try {
    const resolvedParams = await params;
    // خواندن هم به صورت حروف کوچک و هم بزرگ برای جلوگیری از ارور
    const orderNumber = resolvedParams.ordernumber || resolvedParams.orderNumber;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "شماره سفارش نامعتبر است" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "لطفاً وارد شوید" },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        paymentStatus: true,
        paymentMethod: true,
        receiptImageUrl: true,
        userId: true,
        status: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "سفارش یافت نشد" },
        { status: 404 }
      );
    }

    // فقط صاحب سفارش یا ادمین دسترسی داشته باشد
    if (order.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        receiptImageUrl: order.receiptImageUrl,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Error fetching order by number:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت سفارش" },
      { status: 500 }
    );
  }
}