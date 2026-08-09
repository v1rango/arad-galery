import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 12;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * PAGE_SIZE;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          category: true,
          images: { orderBy: { order: "asc" } },
          specs: { orderBy: { order: "asc" } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.product.count({
        where: { isActive: true },
      }),
    ]);

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("خطا در دریافت محصولات:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت محصولات",
      },
      { status: 500 }
    );
  }
}