import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
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

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    if (slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "این slug قبلاً استفاده شده" },
          { status: 400 }
        );
      }
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

    const newStockCount = parseInt(stockCount) || 0;

    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productSpec.deleteMany({ where: { productId: id } });

    const updated = await prisma.product.update({
      where: { id },
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
        stockCount: newStockCount,
        inStock: newStockCount > 0,
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
      data: updated,
      message: "محصول با موفقیت به‌روزرسانی شد",
    });
  } catch (error) {
    console.error("خطا در آپدیت محصول:", error);
    return NextResponse.json(
      { success: false, error: "خطا در آپدیت محصول" },
      { status: 500 }
    );
  }
}