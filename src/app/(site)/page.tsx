import Link from "next/link";
import { Sparkles, ArrowLeft, ShieldCheck, Truck, Award } from "lucide-react";
import ProductSection from "@/components/product/ProductSection";
import { prisma } from "@/lib/prisma";
import { Product } from "@/types/product";


export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getHomeProducts() {
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
    take: 4,
  });

  return {
    bestSellers,
    newArrivals: JSON.parse(JSON.stringify(newArrivals)) as Product[],
  };
}

export default async function Home() {
  const { bestSellers, newArrivals } = await getHomeProducts();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-royal-500/10 via-white to-blush-500/10 dark:from-royal-500/20 dark:via-black dark:to-blush-500/20" />

        <div className="absolute top-20 right-10 w-72 h-72 bg-royal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blush-500/20 rounded-full blur-3xl" />

        <div className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-royal-500/10 text-royal-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>مجموعه‌ی جدید بهاره رسید</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.4] pb-2 mb-6">
              <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                زیبایی
              </span>
              <span className="text-gray-900 dark:text-white"> را با ما تجربه کنید</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-8 mb-10">
              خرید آنلاین لوازم آرایشی و بهداشتی اورجینال از برندهای معتبر
              با ارسال سریع به سراسر کشور
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-royal-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <span>مشاهده محصولات</span>
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/about"
                className="px-8 py-4 border-2 border-royal-500/20 text-royal-500 font-bold rounded-2xl hover:bg-royal-500/10 transition-all duration-300"
              >
                درباره ما
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProductSection
        title="پرفروش‌ترین محصولات"
        subtitle="محبوب‌ترین محصولات از دید مشتریان آراد گالری"
        products={bestSellers}
        viewAllHref="/products"
      />

      <section className="py-16 border-t border-royal-500/10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-8 rounded-3xl bg-royal-500/5 border border-royal-500/10 hover:border-royal-500/30 hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center">
                <ShieldCheck size={30} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-royal-500 mb-2">ضمانت اصالت</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-7">
                تمامی محصولات اورجینال و دارای ضمانت اصالت کالا
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-royal-500/5 border border-royal-500/10 hover:border-royal-500/30 hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center">
                <Truck size={30} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-royal-500 mb-2">ارسال سریع</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-7">
                ارسال به سراسر کشور در کمترین زمان ممکن
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-royal-500/5 border border-royal-500/10 hover:border-royal-500/30 hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center">
                <Award size={30} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-royal-500 mb-2">بهترین قیمت</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-7">
                قیمت‌های رقابتی و تخفیف‌های ویژه برای مشتریان
              </p>
            </div>
          </div>
        </div>
      </section>

      <ProductSection
        title="جدیدترین محصولات"
        subtitle="تازه‌ترین محصولاتی که به فروشگاه اضافه شدن"
        products={newArrivals}
        viewAllHref="/products"
      />
    </div>
  );
}