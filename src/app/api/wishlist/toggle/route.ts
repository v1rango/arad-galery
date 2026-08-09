import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "برای این کار باید وارد شوید" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "شناسه محصول الزامی است" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({
        success: true,
        action: "removed",
        message: "از علاقه‌مندی‌ها حذف شد",
      });
    }

    await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId,
      },
    });

    return NextResponse.json({
      success: true,
      action: "added",
      message: "به علاقه‌مندی‌ها اضافه شد",
    });
  } catch (error) {
    console.error("خطا در تغییر علاقه‌مندی:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}