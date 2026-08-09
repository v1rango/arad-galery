import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: user.id },
      select: { productId: true },
    });

    const ids = wishlistItems.map((item) => item.productId);

    return NextResponse.json({
      success: true,
      data: ids,
    });
  } catch (error) {
    console.error("خطا در دریافت IDها:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}