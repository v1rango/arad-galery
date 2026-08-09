import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function DELETE() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const productsWithOrders = await prisma.product.findMany({
      where: {
        orderItems: {
          some: {},
        },
      },
      select: { id: true },
    });

    const productIdsWithOrders = productsWithOrders.map((p) => p.id);

    const deletedResult = await prisma.product.deleteMany({
      where: {
        id: { notIn: productIdsWithOrders },
      },
    });

    const softDeletedResult = await prisma.product.updateMany({
      where: {
        id: { in: productIdsWithOrders },
      },
      data: {
        isActive: false,
        inStock: false,
        stockCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      deleted: deletedResult.count,
      softDeleted: softDeletedResult.count,
      message: `${deletedResult.count} محصول حذف شد و ${softDeletedResult.count} محصول (که سفارش داشتن) غیرفعال شد`,
    });
  } catch (error) {
    console.error("خطا در حذف محصولات:", error);
    return NextResponse.json(
      { success: false, error: "خطا در حذف محصولات" },
      { status: 500 }
    );
  }
}