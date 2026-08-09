import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "احراز هویت نشده" },
        { status: 401 }
      );
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            category: true,
            images: { orderBy: { order: "asc" } },
            specs: { orderBy: { order: "asc" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const products = wishlistItems
      .filter((item) => item.product.isActive)
      .map((item) => item.product);

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("خطا در دریافت علاقه‌مندی‌ها:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}