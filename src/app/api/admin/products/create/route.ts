import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const {
      title,
      slug,
      brand,
      description,
      price,
      discountPrice,
      stockCount,
      isNew,
      categoryId,
      images,
      specs,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = body;

    if (!title || !slug || !brand || !categoryId || !price) {
      return NextResponse.json(
        { success: false, error: "فیلدهای اجباری را کامل کنید" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "محصولی با این slug قبلاً ثبت شده" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { success: false, error: "دسته‌بندی نامعتبر است" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        brand,
        description: description || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
        price: parseInt(price),
        discountPrice: discountPrice ? parseInt(discountPrice) : null,
        stockCount: parseInt(stockCount) || 0,
        inStock: parseInt(stockCount) > 0,
        isNew: !!isNew,
        categoryId,
        images: {
          create: (images || []).map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
        specs: {
          create: (specs || [])
            .filter((s: { key: string; value: string }) => s.key && s.value)
            .map((s: { key: string; value: string }, index: number) => ({
              key: s.key,
              value: s.value,
              order: index,
            })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: "محصول با موفقیت اضافه شد",
    });
  } catch (error) {
    console.error("خطا در ساخت محصول:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ساخت محصول" },
      { status: 500 }
    );
  }
}