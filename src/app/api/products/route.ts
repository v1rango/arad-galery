import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 12;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const categorySlug = searchParams.get("category");
    const subSlug = searchParams.get("sub");

    const skip = (page - 1) * PAGE_SIZE;

    // ساخت شرط‌های فیلتر
    const where: any = { isActive: true };

    if (subSlug) {
      // فیلتر بر اساس زیردسته مشخص
      where.category = { slug: subSlug };
    } else if (categorySlug) {
      // فیلتر بر اساس دسته اصلی (شامل خود دسته یا زیردسته‌های آن)
      where.OR = [
        { category: { slug: categorySlug } },
        { category: { parent: { slug: categorySlug } } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            include: { parent: true },
          },
          images: { orderBy: { order: "asc" } },
          specs: { orderBy: { order: "asc" } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
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