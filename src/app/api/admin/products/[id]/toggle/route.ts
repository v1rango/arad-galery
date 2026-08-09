import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    console.error("خطا در تغییر وضعیت:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}