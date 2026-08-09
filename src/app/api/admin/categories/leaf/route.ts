import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        _count: {
          select: { children: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const leafCategories = categories
      .filter((c) => c._count.children === 0)
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        parentName: c.parent?.name || null,
        fullName: c.parent ? `${c.parent.name} → ${c.name}` : c.name,
      }));

    return NextResponse.json({
      success: true,
      data: leafCategories,
    });
  } catch (error) {
    console.error("خطا در دریافت دسته‌بندی‌ها:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}