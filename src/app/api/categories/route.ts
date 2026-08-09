import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // فقط دسته‌های اصلی (parentId = null) رو می‌گیریم
    // و زیردسته‌هاشون (children) رو هم include می‌کنیم
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: {
          orderBy: { name: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error("خطا در دریافت دسته‌بندی‌ها:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت دسته‌بندی‌ها",
      },
      { status: 500 }
    );
  }
}