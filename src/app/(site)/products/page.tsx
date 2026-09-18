import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductsClient from "@/components/product/ProductsClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { Product, CategoryWithChildren } from "@/types/product";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://arad-gallery.ir";

type Props = {
  searchParams: Promise<{
    category?: string;
    sub?: string;
    page?: string;
    search?: string;
  }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category: categorySlug, sub: subSlug } = await searchParams;

  let title = "فروشگاه و خرید لوازم آرایشی و بهداشتی اورجینال";
  let description =
    "مشاهده و خرید آنلاین برترین لوازم آرایشی و مراقبت از پوست و مو اورجینال از برندهای معتبر جهانی در آراد گالری با ضمانت اصالت کالا و ارسال سریع به سراسر ایران.";
  let canonical = `${BASE_URL}/products`;

  if (subSlug) {
    const subCategory = await prisma.category.findUnique({
      where: { slug: subSlug },
    });
    if (subCategory) {
      title = subCategory.seoTitle || `خرید انواع ${subCategory.name} اورجینال`;
      description =
        subCategory.seoDescription ||
        `خرید آنلاین انواع ${subCategory.name} اصل با بهترین قیمت، ضمانت اصالت و ارسال سریع از فروشگاه آراد گالری.`;
      canonical = `${BASE_URL}/products?sub=${subSlug}`;
    }
  } else if (categorySlug) {
    const mainCategory = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (mainCategory) {
      title = mainCategory.seoTitle || `خرید محصولات ${mainCategory.name} اورجینال`;
      description =
        mainCategory.seoDescription ||
        `خرید اینترنتی انواع محصولات ${mainCategory.name} اصل از معتبرترین برندهای جهان در آراد گالری با تضمین اصالت و ارسال فوری.`;
      canonical = `${BASE_URL}/products?category=${categorySlug}`;
    }
  }

  return {
    title,
    description: description.slice(0, 160),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: canonical,
      siteName: "آراد گالری",
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 160),
    },
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category: categorySlug, sub: subSlug } = await searchParams;

  const where: any = { isActive: true };

  if (subSlug) {
    where.category = { slug: subSlug };
  } else if (categorySlug) {
    where.OR = [
      { category: { slug: categorySlug } },
      { category: { parent: { slug: categorySlug } } },
    ];
  }

  const [productsRaw, total, categoriesRaw] = await Promise.all([
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
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const products = JSON.parse(JSON.stringify(productsRaw)) as Product[];
  const categories = JSON.parse(JSON.stringify(categoriesRaw)) as CategoryWithChildren[];

  const currentCategory = categories.find((c) => c.slug === categorySlug);
  const currentSub = currentCategory?.children?.find((s) => s.slug === subSlug);

  const breadcrumbs = [
    { name: "خانه", url: `${BASE_URL}/` },
    { name: "محصولات", url: `${BASE_URL}/products` },
    ...(currentCategory
      ? [{ name: currentCategory.name, url: `${BASE_URL}/products?category=${currentCategory.slug}` }]
      : []),
    ...(currentSub
      ? [{ name: currentSub.name, url: `${BASE_URL}/products?sub=${currentSub.slug}` }]
      : []),
  ];

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ProductsClient
        initialProducts={products}
        categories={categories}
        initialPagination={{
          page: 1,
          pageSize: PAGE_SIZE,
          total,
          totalPages,
          hasMore: 1 < totalPages,
        }}
        categorySlug={categorySlug}
        subSlug={subSlug}
      />
    </>
  );
}
