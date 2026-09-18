import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://arad-gallery.ir";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({
        select: {
          slug: true,
          updatedAt: true,
          parentId: true,
        },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
    ]);

    const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
      url: c.parentId
        ? `${BASE_URL}/products?sub=${encodeURIComponent(c.slug.trim())}`
        : `${BASE_URL}/products?category=${encodeURIComponent(c.slug.trim())}`,
      lastModified: c.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.85,
    }));

    const productPages: MetadataRoute.Sitemap = products.map((p) => {
      const cleanSlug = p.slug.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
      return {
        url: `${BASE_URL}/products/${encodeURIComponent(cleanSlug)}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });

    return [...staticPages, ...categoryPages, ...productPages];
  } catch (error) {
    console.error("خطا در ساخت sitemap:", error);
    return staticPages;
  }
}
