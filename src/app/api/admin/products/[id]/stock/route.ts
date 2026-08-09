import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { notifyLowStock, notifyOutOfStock } from "@/lib/notifications";

const LOW_STOCK_THRESHOLD = 3;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { action, value } = body;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    let newStock = product.stockCount;

    if (action === "increment") {
      newStock = product.stockCount + 1;
    } else if (action === "decrement") {
      newStock = Math.max(0, product.stockCount - 1);
    } else if (action === "set" && typeof value === "number") {
      newStock = Math.max(0, Math.floor(value));
    } else {
      return NextResponse.json(
        { success: false, error: "action نامعتبر" },
        { status: 400 }
      );
    }

    const shouldBeInStock = newStock > 0;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        stockCount: newStock,
        inStock: shouldBeInStock,
      },
    });

    if (newStock === 0 && product.stockCount > 0) {
      await notifyOutOfStock(product.title, product.id);
    } else if (
      newStock > 0 &&
      newStock <= LOW_STOCK_THRESHOLD &&
      product.stockCount > LOW_STOCK_THRESHOLD
    ) {
      await notifyLowStock(product.title, product.id, newStock);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        stockCount: updated.stockCount,
        inStock: updated.inStock,
      },
    });
  } catch (error) {
    console.error("خطا در تغییر موجودی:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}