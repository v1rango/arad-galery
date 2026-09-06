import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronLeft, Home } from "lucide-react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import { Product } from "@/types/product";

const RelatedProducts = dynamic(
  () => import("@/components/product/RelatedProducts"),
  {
    loading: () => (
      <div className="mt-16 space-y-6">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800/80 overflow-hidden animate-pulse flex flex-col justify-between p-4 space-y-4"
            >
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
                <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-md" />
                <div className="h-4 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  }
);

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      specs: { orderBy: { order: "asc" } },
    },
  });
  return product;
}

async function getRelatedProducts(currentId: string, categoryId: string) {
  const MAX_RELATED = 4;

  const sameCategory = await prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      NOT: { id: currentId },
    },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      specs: { orderBy: { order: "asc" } },
    },
    take: MAX_RELATED,
  });

  if (sameCategory.length < MAX_RELATED) {
    const needed = MAX_RELATED - sameCategory.length;
    const others = await prisma.product.findMany({
      where: {
        isActive: true,
        NOT: {
          id: { in: [currentId, ...sameCategory.map((p) => p.id)] },
        },
      },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        specs: { orderBy: { order: "asc" } },
      },
      take: needed,
    });
    return [...sameCategory, ...others];
  }

  return sameCategory;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "محصول یافت نشد | آراد گالری",
      description: "متأسفانه محصول مورد نظر یافت نشد",
    };
  }

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const productUrl = `${BASE_URL}/products/${product.slug}`;
  const firstImage = product.images[0]?.url;
  const imageUrl = firstImage
    ? firstImage.startsWith("http")
      ? firstImage
      : `${BASE_URL}${firstImage}`
    : `${BASE_URL}/images/logo-light.webp`;

  const price = product.discountPrice || product.price;
  const priceText = price.toLocaleString("fa-IR");

  const title = product.seoTitle || `${product.title} | آراد گالری`;
  const description =
    product.seoDescription ||
    product.description ||
    `خرید ${product.title} از برند ${product.brand} با قیمت ${priceText} تومان. ارسال سریع و ضمانت اصالت کالا. آراد گالری، فروشگاه معتبر لوازم آرایشی و بهداشتی.`;

  const keywords = product.seoKeywords
    ? product.seoKeywords.split(",").map((k) => k.trim())
    : [
        product.title,
        product.brand,
        product.category?.name || "",
        "لوازم آرایشی",
        "خرید آنلاین",
        "آراد گالری",
      ].filter(Boolean);

  return {
    title,
    description: description.slice(0, 160),
    keywords,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: productUrl,
      siteName: "آراد گالری",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 160),
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId);

  const serializedProduct = JSON.parse(JSON.stringify(product)) as Product;
  const serializedRelated = JSON.parse(JSON.stringify(relatedProducts)) as Product[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-10 md:space-y-14">
      <ProductJsonLd product={serializedProduct} />

      {/* Breadcrumb Nav */}
      <nav className="flex items-center gap-2 text-xs font-bold text-zinc-400 flex-wrap">
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:text-royal-600 dark:hover:text-royal-400 transition-colors"
        >
          <Home size={14} />
          <span>خانه</span>
        </Link>
        <ChevronLeft size={14} className="text-zinc-300 dark:text-zinc-700" />
        <Link 
          href="/products" 
          className="hover:text-royal-600 dark:hover:text-royal-400 transition-colors"
        >
          محصولات
        </Link>
        {serializedProduct.category && (
          <>
            <ChevronLeft size={14} className="text-zinc-300 dark:text-zinc-700" />
            <Link
              href={`/products?category=${serializedProduct.category.slug}`}
              className="text-royal-600 dark:text-royal-400 hover:underline"
            >
              {serializedProduct.category.name}
            </Link>
          </>
        )}
        <ChevronLeft size={14} className="text-zinc-300 dark:text-zinc-700" />
        <span className="text-zinc-800 dark:text-zinc-200 font-black line-clamp-1">
          {serializedProduct.title}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-24">
          <ProductGallery
            images={serializedProduct.images.map((img) => img.url)}
            title={serializedProduct.title}
          />
        </div>
        <div>
          <ProductInfo product={serializedProduct} />
        </div>
      </div>

      {/* Detailed Specifications & Reviews Tabs */}
      <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800/80">
        <ProductTabs product={serializedProduct} />
      </div>

      {/* Related Products Carousel / Grid */}
      <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800/80">
        <RelatedProducts products={serializedRelated} />
      </div>
    </div>
  );
}