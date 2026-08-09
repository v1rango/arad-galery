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
      <div className="mt-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-royal-500/10" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-16 bg-royal-500/10 rounded-md" />
                <div className="h-4 w-full bg-royal-500/10 rounded-md" />
                <div className="h-4 w-3/4 bg-royal-500/10 rounded-md" />
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
    <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <ProductJsonLd product={serializedProduct} />

      <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6 flex-wrap">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-royal-500 transition-colors"
        >
          <Home size={14} />
          <span>خانه</span>
        </Link>
        <ChevronLeft size={14} className="text-gray-400" />
        <Link href="/products" className="hover:text-royal-500 transition-colors">
          محصولات
        </Link>
        {serializedProduct.category && (
          <>
            <ChevronLeft size={14} className="text-gray-400" />
            <span className="text-royal-500 font-medium">
              {serializedProduct.category.name}
            </span>
          </>
        )}
        <ChevronLeft size={14} className="text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300 font-medium line-clamp-1">
          {serializedProduct.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
        <div>
          <ProductGallery
            images={serializedProduct.images.map((img) => img.url)}
            title={serializedProduct.title}
          />
        </div>
        <div>
          <ProductInfo product={serializedProduct} />
        </div>
      </div>

      <div className="mb-12">
        <ProductTabs product={serializedProduct} />
      </div>

      <RelatedProducts products={serializedRelated} />
    </div>
  );
}