"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
  Eye,
} from "lucide-react";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    productTitle: string;
    quantity: number;
  }>;
};

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
  return new Date(dateStr).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders/me");
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("خطا در بارگذاری:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-royal-500/10">
        <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
          <Package size={20} className="text-royal-500" />
          <span>سفارش‌های من</span>
        </h2>
        {!isLoading && orders.length > 0 && (
          <span className="text-xs text-gray-500">
            {orders.length.toLocaleString("fa-IR")} سفارش
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-royal-500/5 rounded-2xl border border-royal-500/10 p-4 animate-pulse"
            >
              <div className="h-4 w-32 bg-royal-500/10 rounded mb-3" />
              <div className="h-3 w-full bg-royal-500/10 rounded" />
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <Link
                key={order.id}
                href={`/profile/orders/${order.id}`}
                className="block bg-royal-500/5 rounded-2xl border border-royal-500/10 hover:border-royal-500/30 hover:shadow-lg hover:shadow-royal-500/5 transition-all p-4"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div>
                    <div
                      className="text-sm font-black text-gray-900 dark:text-white mb-1"
                      dir="ltr"
                    >
                      {order.orderNumber}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {formatDate(order.createdAt)}
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

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-royal-500/10">
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

                <div className="mt-3 pt-3 border-t border-royal-500/10 flex items-center gap-1 text-xs text-royal-500 font-bold">
                  <Eye size={12} />
                  <span>مشاهده جزئیات</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-royal-500/20 to-blush-500/20 flex items-center justify-center mb-4">
            <Package size={40} className="text-royal-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            هنوز سفارشی نداری
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md">
            بعد از اولین خریدت، سفارش‌هات اینجا نمایش داده میشه.
          </p>
          <Link
            href="/products"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5"
          >
            <ShoppingBag size={18} />
            <span>شروع خرید</span>
          </Link>
        </div>
      )}
    </div>
  );
}