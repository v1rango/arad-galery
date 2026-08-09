import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const result = await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} نوتیفیکیشن به‌روزرسانی شد`,
    });
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}