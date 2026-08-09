"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Package,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  CreditCard,
} from "lucide-react";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  customerNote: string | null;
  createdAt: string;
  address: {
    fullName: string;
    phone: string;
    province: string;
    city: string;
    address: string;
    postalCode: string;
  };
  items: Array<{
    id: string;
    productTitle: string;
    productBrand: string;
    productImage: string | null;
    price: number;
    discountPrice: number | null;
    quantity: number;
    totalPrice: number;
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  params: Promise<{ id: string }>;
};

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6 md:p-8">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-12 h-12 border-4 border-royal-500/20 border-t-royal-500 rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6 md:p-8 text-center">
        <h2 className="text-xl font-black mb-2">سفارش پیدا نشد</h2>
        <Link
          href="/profile/orders"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-royal-500/10 text-royal-500 font-bold hover:bg-royal-500/20 transition-colors"
        >
          <ArrowRight size={18} />
          <span>بازگشت به لیست</span>
        </Link>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status].icon;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">شماره سفارش</div>
            <div
              className="text-lg font-black text-gray-900 dark:text-white"
              dir="ltr"
            >
              {order.orderNumber}
            </div>
          </div>

          <Link
            href="/profile/orders"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-royal-500/10 text-royal-500 text-xs font-bold hover:bg-royal-500/20 transition-colors"
          >
            <ArrowRight size={14} />
            <span>بازگشت</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 flex-wrap pt-4 border-t border-royal-500/10">
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${
              statusConfig[order.status].color
            }`}
          >
            <StatusIcon size={14} />
            <span>{statusConfig[order.status].label}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar size={12} />
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6">
        <h3 className="text-base font-black text-gray-900 dark:text-white mb-4 pb-3 border-b border-royal-500/10 flex items-center gap-2">
          <MapPin size={18} className="text-royal-500" />
          <span>آدرس تحویل</span>
        </h3>

        <div className="space-y-2 text-sm">
          <div className="font-bold text-gray-900 dark:text-white">
            {order.address.fullName}
          </div>
          <div className="text-gray-600 dark:text-gray-400 leading-7">
            {order.address.province}، {order.address.city}،{" "}
            {order.address.address}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-3" dir="ltr">
            <span>کد پستی: {order.address.postalCode}</span>
            <span>|</span>
            <span>{order.address.phone}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6">
        <h3 className="text-base font-black text-gray-900 dark:text-white mb-4 pb-3 border-b border-royal-500/10 flex items-center gap-2">
          <Package size={18} className="text-royal-500" />
          <span>محصولات ({order.items.length.toLocaleString("fa-IR")} مورد)</span>
        </h3>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 pb-3 last:pb-0 border-b border-royal-500/10 last:border-b-0"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-royal-500/5 shrink-0">
                {item.productImage && (
                  <Image
                    src={item.productImage}
                    alt={item.productTitle}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-royal-500 font-medium mb-0.5">
                  {item.productBrand}
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                  {item.productTitle}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  {item.quantity.toLocaleString("fa-IR")} ×{" "}
                  {formatPrice(item.discountPrice ?? item.price)} تومان
                </div>
              </div>

              <div className="text-sm font-black text-royal-500 shrink-0">
                {formatPrice(item.totalPrice)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-6">
        <h3 className="text-base font-black text-gray-900 dark:text-white mb-4 pb-3 border-b border-royal-500/10 flex items-center gap-2">
          <CreditCard size={18} className="text-royal-500" />
          <span>خلاصه مالی</span>
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">قیمت کالاها</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {formatPrice(order.subtotal)} تومان
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">هزینه ارسال</span>
            {order.shippingCost === 0 ? (
              <span className="font-bold text-green-600">رایگان</span>
            ) : (
              <span className="font-bold text-gray-900 dark:text-white">
                {formatPrice(order.shippingCost)} تومان
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-royal-500/10 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              مبلغ کل
            </span>
            <div className="text-left">
              <div className="text-lg font-black text-royal-500">
                {formatPrice(order.totalAmount)}
              </div>
              <div className="text-[10px] text-gray-500">تومان</div>
            </div>
          </div>
        </div>

        {order.customerNote && (
          <div className="mt-4 pt-4 border-t border-royal-500/10">
            <div className="text-[11px] text-blush-500 font-bold mb-1">
              💬 یادداشت شما:
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-6">
              {order.customerNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}