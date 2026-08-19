"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tag,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Percent,
  DollarSign,
  Calendar,
  Users,
  Power,
} from "lucide-react";
import toast from "react-hot-toast";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number;
  startsAt: string;
  expiresAt: string | null;
  isActive: boolean;
  _count: { usages: number };
  createdAt: string;
};

function formatPrice(n: number): string {
  return n.toLocaleString("fa-IR");
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("fa-IR");
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCoupons = async (searchQuery = "") => {
    setIsLoading(true);
    try {
      const url = searchQuery
        ? `/api/admin/coupons?search=${encodeURIComponent(searchQuery)}`
        : "/api/admin/coupons";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch {
      toast.error("خطا در بارگذاری کوپن‌ها");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCoupons(search);
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`آیا از حذف کوپن "${code}" مطمئن هستید؟`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("کوپن حذف شد");
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error(data.error || "خطا در حذف");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setDeletingId(null);
    }
  };

  const isCouponExpired = (coupon: Coupon): boolean => {
    if (!coupon.expiresAt) return false;
    return new Date(coupon.expiresAt) < new Date();
  };

  const isCouponFull = (coupon: Coupon): boolean => {
    if (!coupon.usageLimit) return false;
    return coupon.usageCount >= coupon.usageLimit;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1 flex items-center gap-2">
            <Tag size={28} className="text-royal-500" />
            <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
              کدهای تخفیف
            </span>
          </h1>
          <p className="text-sm text-gray-500">مدیریت کدهای تخفیف فروشگاه</p>
        </div>

        <Link
          href="/admin/coupons/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} />
          <span>افزودن کوپن جدید</span>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو بر اساس کد یا توضیحات..."
            className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors"
        >
          جستجو
        </button>
      </form>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={40} className="text-royal-500 animate-spin mb-3" />
          <p className="text-sm text-gray-500">در حال بارگذاری...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white dark:bg-royal-500/5 rounded-2xl border border-royal-500/10 p-10 text-center">
          <Tag size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">هیچ کوپنی ثبت نشده است</p>
          <Link
            href="/admin/coupons/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors"
          >
            <Plus size={16} />
            <span>افزودن اولین کوپن</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {coupons.map((coupon) => {
            const expired = isCouponExpired(coupon);
            const full = isCouponFull(coupon);
            const inactive = !coupon.isActive || expired || full;

            return (
              <div
                key={coupon.id}
                className={`bg-white dark:bg-royal-500/5 rounded-2xl border p-4 transition-all ${
                  inactive
                    ? "border-gray-300/30 opacity-70"
                    : "border-royal-500/10 hover:border-royal-500/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-lg font-black text-gray-900 dark:text-white font-mono"
                        dir="ltr"
                      >
                        {coupon.code}
                      </span>
                      {coupon.isActive && !expired && !full ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 font-bold">
                          فعال
                        </span>
                      ) : expired ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 font-bold">
                          منقضی
                        </span>
                      ) : full ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 font-bold">
                          تمام شده
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-600 font-bold">
                          غیرفعال
                        </span>
                      )}
                    </div>
                    {coupon.description && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {coupon.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/admin/coupons/${coupon.id}/edit`}
                      className="p-2 rounded-lg hover:bg-royal-500/10 text-royal-500 transition-colors"
                      aria-label="ویرایش"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(coupon.id, coupon.code)}
                      disabled={deletingId === coupon.id}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors disabled:opacity-50"
                      aria-label="حذف"
                    >
                      {deletingId === coupon.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    {coupon.discountType === "PERCENTAGE" ? (
                      <>
                        <Percent size={12} className="text-royal-500" />
                        <span className="font-bold">{coupon.discountValue}٪</span>
                      </>
                    ) : (
                      <>
                        <DollarSign size={12} className="text-royal-500" />
                        <span className="font-bold">
                          {formatPrice(coupon.discountValue)} ت
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <Users size={12} className="text-blush-500" />
                    <span>
                      {coupon._count.usages}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""} استفاده
                    </span>
                  </div>

                  {coupon.minOrderAmount > 0 && (
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 col-span-2">
                      <span className="text-[10px]">حداقل سفارش:</span>
                      <span className="font-bold">
                        {formatPrice(coupon.minOrderAmount)} ت
                      </span>
                    </div>
                  )}

                  {coupon.expiresAt && (
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 col-span-2">
                      <Calendar size={12} className="text-orange-500" />
                      <span>انقضا: {formatDate(coupon.expiresAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}