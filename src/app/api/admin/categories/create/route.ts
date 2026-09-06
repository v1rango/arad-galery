import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { name, slug, emoji, image, parentId } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "نام و slug الزامی است" },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "این slug قبلاً استفاده شده" },
        { status: 400 }
      );
    }

    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        return NextResponse.json(
          { success: false, error: "دسته‌ی والد پیدا نشد" },
          { status: 400 }
        );
      }
      if (parent.parentId) {
        return NextResponse.json(
          { success: false, error: "زیردسته نمی‌تونه زیردسته داشته باشه" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        emoji: emoji?.trim() || null,
        image: image || null, // ذخیره آدرس عکس در دیتابیس
        parentId: parentId || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: "دسته‌بندی اضافه شد",
    });
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ساخت دسته" },
      { status: 500 }
    );
  }
}