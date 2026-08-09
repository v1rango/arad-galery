import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            wishlist: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: users.length,
      admins: users.filter((u) => u.role === "ADMIN").length,
      regular: users.filter((u) => u.role === "USER").length,
      withOrders: users.filter((u) => u._count.orders > 0).length,
    };

    return NextResponse.json({
      success: true,
      data: users,
      stats,
    });
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      { success: false, error: "خطای سرور" },
      { status: 500 }
    );
  }
}