import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params;
    let decoded = rawSlug;
    try {
      decoded = decodeURIComponent(rawSlug).trim();
    } catch {
      decoded = rawSlug.trim();
    }
    const clean = decoded.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
    const lower = clean.toLowerCase();

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: clean },
          { slug: lower },
          { slug: decoded },
          { slug: rawSlug },
          { slug: `\u200B${clean}` },
          { slug: { equals: clean, mode: "insensitive" } },
          { slug: { equals: decoded, mode: "insensitive" } },
          { slug: { equals: rawSlug, mode: "insensitive" } },
        ],
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
        variants: {
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