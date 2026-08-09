"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Package,
  User,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MessageSquare,
  Save,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: string;
  paymentRef: string | null;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  customerNote: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    phone: string;
  };
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

const statusOptions: Array<{
  value: OrderStatus;
  label: string;
  icon: typeof Clock;
  color: string;
}> = [
  { value: "PENDING", label: "در انتظار", icon: Clock, color: "yellow" },
  { value: "PROCESSING", label: "در حال آماده‌سازی", icon: Package, color: "blue" },
  { value: "SHIPPED", label: "ارسال شده", icon: Truck, color: "purple" },
  { value: "DELIVERED", label: "تحویل شده", icon: CheckCircle, color: "green" },
  { value: "CANCELLED", label: "لغو شده", icon: XCircle, color: "red" },
];

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

export default function AdminOrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("PENDING");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();

        if (!data.success) {
          setNotFound(true);
          return;
        }

        setOrder(data.data);
        setSelectedStatus(data.data.status);
        setAdminNote(data.data.adminNote || "");
      } catch {
        toast.error("خطا در بارگذاری سفارش");
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handleSave = async () => {
    if (!order) return;

    const changed =
      selectedStatus !== order.status || adminNote !== (order.adminNote || "");

    if (!changed) {
      toast("تغییری برای ذخیره وجود نداره", { icon: "ℹ️" });
      return;
    }

    setIsSaving(true);
    toast.loading("در حال ذخیره...", { id: "save" });

    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          adminNote,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("تغییرات ذخیره شد ✨", { id: "save" });
        router.refresh();
      } else {
        toast.error(data.error || "خطا در ذخیره", { id: "save" });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "save" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-royal-500/20 border-t-royal-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-black mb-2">سفارش پیدا نشد</h1>
        <Link
          href="/admin/orders"
          className="flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-royal-500/10 text-royal-500 font-bold hover:bg-royal-500/20 transition-colors"
        >
          <ArrowRight size={18} />
          <span>بازگشت به لیست</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-black">
              <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
                سفارش
              </span>
            </h1>
            <span
              className="text-xl md:text-2xl font-black text-gray-900 dark:text-white"
              dir="ltr"
            >
              {order.orderNumber}
            </span>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={12} />
            <span>{formatDate(order.createdAt)}</span>
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors"
        >
          <ArrowRight size={18} />
          <span className="hidden sm:inline">بازگشت</span>
        </Link>
      </div>

      <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-4">
        <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10">
          🔄 تغییر وضعیت سفارش
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {statusOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = selectedStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-br from-royal-500 to-blush-500 text-white shadow-lg shadow-royal-500/30"
                    : "bg-royal-500/5 text-gray-700 dark:text-gray-300 hover:bg-royal-500/10"
                }`}
              >
                <Icon size={20} />
                <span className="text-[11px] font-bold text-center leading-tight">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
            <MessageSquare size={14} />
            <span>یادداشت داخلی (فقط شما می‌بینید)</span>
          </label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="مثلاً: با مشتری تماس گرفتم، فردا ارسال میشه..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>در حال ذخیره...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>ذخیره تغییرات</span>
            </>
          )}
        </button>
      </section>

      <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-3">
        <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
          <User size={18} className="text-royal-500" />
          <span>اطلاعات مشتری</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-[11px] text-gray-500 mb-1">نام و نام خانوادگی</div>
            <div className="font-bold text-gray-900 dark:text-white">
              {order.address.fullName}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-gray-500 mb-1">شماره تماس</div>
            <a
              href={`tel:${order.address.phone}`}
              className="font-bold text-royal-500 hover:text-blush-500 transition-colors flex items-center gap-1"
              dir="ltr"
            >
              <Phone size={14} />
              <span>{order.address.phone}</span>
            </a>
          </div>
        </div>

        {order.customerNote && (
          <div className="pt-3 border-t border-royal-500/10">
            <div className="text-[11px] text-blush-500 font-bold mb-1">
              💬 یادداشت مشتری:
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-7">
              {order.customerNote}
            </p>
          </div>
        )}
      </section>

      <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-3">
        <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
          <MapPin size={18} className="text-royal-500" />
          <span>آدرس تحویل</span>
        </h2>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-gray-400 mt-1 shrink-0" />
            <span className="text-gray-700 dark:text-gray-300 leading-7">
              {order.address.province}، {order.address.city}،{" "}
              {order.address.address}
            </span>
          </div>
          <div className="text-xs text-gray-500 mr-6" dir="ltr">
            کد پستی: {order.address.postalCode}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5">
        <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 mb-3 border-b border-royal-500/10 flex items-center gap-2">
          <Package size={18} className="text-royal-500" />
          <span>محصولات ({order.items.length.toLocaleString("fa-IR")} مورد)</span>
        </h2>

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
      </section>

      <section className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-5 space-y-3">
        <h2 className="text-base font-black text-gray-900 dark:text-white pb-3 border-b border-royal-500/10 flex items-center gap-2">
          <CreditCard size={18} className="text-royal-500" />
          <span>خلاصه مالی</span>
        </h2>

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

          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-blush-500">تخفیف</span>
              <span className="font-bold text-blush-500">
                {formatPrice(order.discountAmount)}-
              </span>
            </div>
          )}

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

          <div className="pt-3 border-t border-royal-500/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">وضعیت پرداخت:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  order.paymentStatus === "PAID"
                    ? "bg-green-500/10 text-green-600"
                    : "bg-yellow-500/10 text-yellow-600"
                }`}
              >
                {order.paymentStatus === "PAID" ? "پرداخت شده" : "منتظر پرداخت"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}