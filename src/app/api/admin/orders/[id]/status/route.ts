import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

const VALID_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminNote } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: "وضعیت نامعتبر" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json(
        { success: false, error: "سفارش پیدا نشد" },
        { status: 404 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status as never,
        adminNote: adminNote !== undefined ? adminNote : order.adminNote,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "وضعیت سفارش به‌روزرسانی شد",
    });
  } catch (error) {
    console.error("خطا در تغییر وضعیت:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}