import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "احراز هویت نشده" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { success: false, error: "ایمیل معتبر نیست" },
          { status: 400 }
        );
      }

      const existing = await prisma.user.findFirst({
        where: {
          email: email.trim(),
          NOT: { id: user.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: "این ایمیل قبلاً استفاده شده" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name?.trim() || null,
        email: email?.trim() || null,
      },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updated,
      message: "اطلاعات به‌روزرسانی شد",
    });
  } catch (error) {
    console.error("خطا در به‌روزرسانی پروفایل:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}