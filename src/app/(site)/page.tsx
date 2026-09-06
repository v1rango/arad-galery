import { ShieldCheck, Truck, Award } from "lucide-react";
import ProductSection from "@/components/product/ProductSection";
import CategoryBar from "@/components/layout/CategoryBar";
import Hero from "@/components/layout/Hero";
import nextDynamic from "next/dynamic";
import { prisma } from "@/lib/prisma";
import { Product } from "@/types/product";

const AnimatedShowcase = nextDynamic(() => import("@/components/product/AnimatedShowcase"), {
  loading: () => <div className="h-[400px] rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 animate-pulse"></div>,
  ssr: true,
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getHomeData() {
  const topSellingItems = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        paymentStatus: "PAID",
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 4,
  });

  const bestSellerIds = topSellingItems.map((item) => item.productId);

  let bestSellers: Product[] = [];

  if (bestSellerIds.length > 0) {
    const bestSellerProducts = await prisma.product.findMany({
      where: {
        id: { in: bestSellerIds },
        isActive: true,
      },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        specs: { orderBy: { order: "asc" } },
      },
    });

    bestSellers = bestSellerIds
      .map((id) => bestSellerProducts.find((p) => p.id === id))
      .filter((p): p is (typeof bestSellerProducts)[number] => p !== undefined)
      .map((p) => JSON.parse(JSON.stringify(p)) as Product);
  }

  if (bestSellers.length < 4) {
    const remaining = 4 - bestSellers.length;
    const existingIds = bestSellers.map((p) => p.id);

    const fallbackProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { notIn: existingIds },
      },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        specs: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      take: remaining,
    });

    const fallbackParsed = JSON.parse(JSON.stringify(fallbackProducts)) as Product[];
    bestSellers = [...bestSellers, ...fallbackParsed];
  }

  const newArrivals = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      specs: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const categories = await prisma.category.findMany({
    where: { 
      parentId: null
    },
    take: 8,
    orderBy: { createdAt: "asc" }
  });

  return {
    bestSellers,
    newArrivals: JSON.parse(JSON.stringify(newArrivals)) as Product[],
    categories: JSON.parse(JSON.stringify(categories)) as any[],
  };
}

export default async function Home() {
  const { bestSellers, newArrivals, categories } = await getHomeData();

  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-royal-500" />,
      title: "ضمانت اصالت ۱۰۰٪",
      desc: "تمامی محصولات اورجینال و دارای ضمانت اصالت کالا",
    },
    {
      icon: <Truck className="w-8 h-8 text-blush-500" />,
      title: "ارسال سریع و مطمئن",
      desc: "ارسال تخصصی به سراسر کشور در کمترین زمان ممکن",
    },
    {
      icon: <Award className="w-8 h-8 text-royal-500" />,
      title: "تضمین بهترین قیمت",
      desc: "قیمت‌های رقابتی به همراه جشنواره‌ها و تخفیف‌های ویژه",
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      <Hero />

      <div className="space-y-6">
        <AnimatedShowcase products={bestSellers} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryBar categories={categories} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductSection
          title="پرفروش‌ترین محصولات"
          subtitle="محبوب‌ترین محصولات از دید مشتریان آراد گالری"
          products={bestSellers}
          viewAllHref="/products"
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 luxury-shadow flex flex-col items-center text-center space-y-4 hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductSection
          title="جدیدترین محصولات"
          subtitle="تازه‌ترین محصولاتی که به فروشگاه اضافه شده‌اند"
          products={newArrivals}
          viewAllHref="/products"
        />
      </div>
    </div>
  );
}