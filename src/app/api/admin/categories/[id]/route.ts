import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, emoji } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "نام و slug الزامی است" },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "دسته پیدا نشد" },
        { status: 404 }
      );
    }

    if (slug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "این slug قبلاً استفاده شده" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        emoji: emoji?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "دسته به‌روزرسانی شد",
    });
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            children: true,
            products: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "دسته پیدا نشد" },
        { status: 404 }
      );
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `این دسته ${category._count.products} محصول داره و قابل حذف نیست`,
        },
        { status: 400 }
      );
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `این دسته ${category._count.children} زیردسته داره. اول زیردسته‌ها رو حذف کن`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "دسته حذف شد",
    });
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}