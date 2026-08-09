import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        specs: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "محصول پیدا نشد",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("خطا در دریافت محصول:", error);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت محصول",
      },
      { status: 500 }
    );
  }
}