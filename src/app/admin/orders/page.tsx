"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  Phone,
} from "lucide-react";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type OrderUser = {
  id: string;
  name: string | null;
  phone: string;
};

type OrderItem = {
  id: string;
  productTitle: string;
  quantity: number;
  totalPrice: number;
};

type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  user: OrderUser;
  items: OrderItem[];
  customerNote: string | null;
};

type FilterOption = "all" | "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  PENDING: {
    label: "در انتظار",
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: Clock,
  },
  PROCESSING: {
    label: "در حال آماده‌سازی",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: Package,
  },
  SHIPPED: {
    label: "ارسال شده",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: Truck,
  },
  DELIVERED: {
    label: "تحویل شده",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "لغو شده",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: XCircle,
  },
};

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("خطا در بارگذاری سفارش‌ها:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (filter !== "all") {
      result = result.filter((o) => o.status === filter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.user.phone.includes(q) ||
          (o.user.name && o.user.name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [orders, search, filter]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      processing: orders.filter((o) => o.status === "PROCESSING").length,
      shipped: orders.filter((o) => o.status === "SHIPPED").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-black mb-1">
          <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
            مدیریت سفارش‌ها
          </span>
        </h1>
        <p className="text-sm text-gray-500">
          {stats.total.toLocaleString("fa-IR")} سفارش در مجموع
        </p>
      </div>

      <div className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو با شماره سفارش، نام یا موبایل..."
            className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-gray-500 ml-1">
            <Filter size={12} />
            <span>فیلتر:</span>
          </div>

          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="همه"
            count={stats.total}
          />
          <FilterButton
            active={filter === "PENDING"}
            onClick={() => setFilter("PENDING")}
            label="در انتظار"
            count={stats.pending}
            color="yellow"
          />
          <FilterButton
            active={filter === "PROCESSING"}
            onClick={() => setFilter("PROCESSING")}
            label="در حال آماده‌سازی"
            count={stats.processing}
            color="blue"
          />
          <FilterButton
            active={filter === "SHIPPED"}
            onClick={() => setFilter("SHIPPED")}
            label="ارسال شده"
            count={stats.shipped}
            color="purple"
          />
          <FilterButton
            active={filter === "DELIVERED"}
            onClick={() => setFilter("DELIVERED")}
            label="تحویل شده"
            count={stats.delivered}
            color="green"
          />
          <FilterButton
            active={filter === "CANCELLED"}
            onClick={() => setFilter("CANCELLED")}
            label="لغو شده"
            count={stats.cancelled}
            color="red"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 animate-pulse"
            >
              <div className="h-4 w-32 bg-royal-500/10 rounded mb-3" />
              <div className="h-3 w-full bg-royal-500/10 rounded mb-2" />
              <div className="h-3 w-3/4 bg-royal-500/10 rounded" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 hover:border-royal-500/30 hover:shadow-lg hover:shadow-royal-500/5 transition-all p-4"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center shrink-0">
                      <Package size={18} className="text-white" />
                    </div>
                    <div>
                      <div
                        className="text-sm font-black text-gray-900 dark:text-white"
                        dir="ltr"
                      >
                        {order.orderNumber}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border ${
                      statusConfig[order.status].color
                    }`}
                  >
                    <StatusIcon size={12} />
                    <span>{statusConfig[order.status].label}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-royal-500/10">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">
                      مشتری
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {order.user.name || "بدون نام"}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">
                      موبایل
                    </div>
                    <div
                      className="text-xs font-bold text-gray-900 dark:text-white truncate"
                      dir="ltr"
                    >
                      {order.user.phone}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">
                      تعداد کالا
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                      {order.items.length.toLocaleString("fa-IR")} مورد
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">
                      مبلغ کل
                    </div>
                    <div className="text-xs font-black text-royal-500">
                      {formatPrice(order.totalAmount)}{" "}
                      <span className="text-[9px] font-normal">تومان</span>
                    </div>
                  </div>
                </div>

                {order.customerNote && (
                  <div className="mt-3 pt-3 border-t border-royal-500/10">
                    <div className="text-[10px] text-blush-500 font-bold mb-1">
                      💬 یادداشت مشتری:
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {order.customerNote}
                    </p>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-royal-500/10 flex items-center gap-3">
                  <a
                    href={`tel:${order.user.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs text-royal-500 font-bold hover:text-blush-500 transition-colors"
                  >
                    <Phone size={12} />
                    <span>تماس</span>
                  </a>
                  <div className="flex items-center gap-1 text-xs text-royal-500 font-bold mr-auto">
                    <Eye size={12} />
                    <span>مشاهده جزئیات</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10">
          <div className="w-20 h-20 rounded-full bg-royal-500/10 flex items-center justify-center mb-4">
            <Package size={40} className="text-royal-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            سفارشی یافت نشد
          </h3>
          <p className="text-gray-500 text-sm">
            {search
              ? "با این جستجو نتیجه‌ای پیدا نشد"
              : "هنوز سفارشی ثبت نشده"}
          </p>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
  color = "royal",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color?: "royal" | "yellow" | "blue" | "purple" | "green" | "red";
}) {
  const colors = {
    royal: active
      ? "bg-gradient-to-l from-royal-500 to-blush-500 text-white"
      : "bg-royal-500/10 text-royal-500 hover:bg-royal-500/20",
    yellow: active
      ? "bg-yellow-500 text-white"
      : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20",
    blue: active
      ? "bg-blue-500 text-white"
      : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    purple: active
      ? "bg-purple-500 text-white"
      : "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
    green: active
      ? "bg-green-500 text-white"
      : "bg-green-500/10 text-green-600 hover:bg-green-500/20",
    red: active
      ? "bg-red-500 text-white"
      : "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${colors[color]}`}
    >
      <span>{label}</span>
      <span className="text-[10px] opacity-80">
        {count.toLocaleString("fa-IR")}
      </span>
    </button>
  );
}