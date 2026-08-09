import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orderItems: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    if (product._count.orderItems > 0) {
      await prisma.product.update({
        where: { id },
        data: {
          isActive: false,
          inStock: false,
          stockCount: 0,
        },
      });

      return NextResponse.json({
        success: true,
        message: "محصول به‌خاطر وجود در سفارش‌های قبلی، غیرفعال شد",
        wasSoftDeleted: true,
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "محصول حذف شد",
      wasSoftDeleted: false,
    });
  } catch (error) {
    console.error("خطا در حذف محصول:", error);
    return NextResponse.json(
      { success: false, error: "خطا در حذف محصول" },
      { status: 500 }
    );
  }
}