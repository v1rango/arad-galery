import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  Plus,
} from "lucide-react";

async function getDashboardStats() {
  const [totalProducts, totalUsers, lowStockProducts, outOfStockProducts] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.product.findMany({
        where: {
          isActive: true,
          inStock: true,
          stockCount: { gt: 0, lte: 3 },
        },
        select: {
          id: true,
          title: true,
          stockCount: true,
          slug: true,
        },
        take: 5,
      }),
      prisma.product.count({
        where: {
          isActive: true,
          OR: [{ inStock: false }, { stockCount: 0 }],
        },
      }),
    ]);

  return {
    totalProducts,
    totalUsers,
    lowStockProducts,
    outOfStockProducts,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black mb-2">
          <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
            داشبورد
          </span>
        </h1>
        <p className="text-sm text-gray-500">مروری بر وضعیت فروشگاه</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="محصولات فعال"
          value={stats.totalProducts}
          color="royal"
        />
        <StatCard
          icon={Users}
          label="کاربران"
          value={stats.totalUsers}
          color="blush"
        />
        <StatCard
          icon={ShoppingBag}
          label="سفارش‌های امروز"
          value={0}
          color="green"
        />
        <StatCard
          icon={AlertTriangle}
          label="ناموجود"
          value={stats.outOfStockProducts}
          color="red"
        />
      </div>

      <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 md:p-6">
        <h2 className="text-lg font-black mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-royal-500" />
          <span>کارهای سریع</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            <span>افزودن محصول جدید</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 p-4 rounded-2xl bg-royal-500/10 text-royal-500 font-bold hover:bg-royal-500/20 transition-all"
          >
            <Package size={20} />
            <span>مدیریت محصولات</span>
          </Link>
        </div>
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="bg-white dark:bg-royal-500/5 rounded-3xl border-2 border-orange-500/30 p-5 md:p-6">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-orange-500">
            <AlertTriangle size={20} />
            <span>محصولات کم‌موجود</span>
          </h2>
          <div className="space-y-2">
            {stats.lowStockProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products`}
                className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 transition-colors"
              >
                <span className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                  {product.title}
                </span>
                <span className="text-xs font-black text-orange-500 shrink-0 mr-2">
                  فقط {product.stockCount.toLocaleString("fa-IR")} عدد
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Package;
  label: string;
  value: number;
  color: "royal" | "blush" | "green" | "red";
}) {
  const colors = {
    royal: "from-royal-500 to-royal-600 shadow-royal-500/20",
    blush: "from-blush-500 to-blush-600 shadow-blush-500/20",
    green: "from-green-500 to-emerald-600 shadow-green-500/20",
    red: "from-red-500 to-red-600 shadow-red-500/20",
  };

  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 md:p-5">
      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3 shadow-lg`}
      >
        <Icon size={22} className="text-white" />
      </div>
      <div className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-1">
        {value.toLocaleString("fa-IR")}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}