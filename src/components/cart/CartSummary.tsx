"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Tag, CreditCard, Truck, Info, X, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import toast from "react-hot-toast";

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

export default function CartSummary() {
  const [discountCode, setDiscountCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [shippingSettings, setShippingSettings] = useState({
    shippingCost: 50000,
    freeShippingThreshold: 2000000,
  });

  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const totalDiscount = useCartStore((state) => state.getTotalDiscount());
  const originalTotal = useCartStore((state) => state.getOriginalTotal());
  const totalItems = useCartStore((state) => state.getTotalItems());
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success) {
          setShippingSettings({
            shippingCost: data.data.shippingCost,
            freeShippingThreshold: data.data.freeShippingThreshold,
          });
        }
      } catch {}
    }
    loadSettings();
  }, []);

  const SHIPPING_COST = shippingSettings.shippingCost;
  const FREE_SHIPPING_THRESHOLD = shippingSettings.freeShippingThreshold;

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : SHIPPING_COST;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const finalPrice = Math.max(0, totalPrice - couponDiscount + shippingCost);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;

  const handleApplyDiscount = async () => {
    const code = discountCode.trim();

    if (!code) {
      toast.error("لطفاً کد تخفیف را وارد کنید");
      return;
    }

    if (totalPrice === 0) {
      toast.error("سبد خرید خالی است");
      return;
    }

    setIsApplying(true);
    toast.loading("در حال بررسی کد...", { id: "coupon" });

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          subtotal: totalPrice,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        applyCoupon(data.data);
        toast.success(data.message || "کد تخفیف اعمال شد ✨", { id: "coupon" });
        setDiscountCode("");
      } else {
        toast.error(data.error || "کد تخفیف نامعتبر است", { id: "coupon" });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: "coupon" });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.success("کد تخفیف حذف شد");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApplyDiscount();
    }
  };

  return (
    <div className="lg:sticky lg:top-20 bg-white dark:bg-royal-500/5 rounded-3xl border border-royal-500/10 p-5 md:p-6">
      <h2 className="text-lg font-black mb-5 pb-4 border-b border-royal-500/10">
        <span className="bg-gradient-to-l from-royal-500 to-blush-500 bg-clip-text text-transparent">
          خلاصه سبد خرید
        </span>
      </h2>

      <div className="mb-5">
        {appliedCoupon ? (
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-start gap-2">
              <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-bold text-green-700 dark:text-green-400" dir="ltr">
                    {appliedCoupon.code}
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                    aria-label="حذف کد تخفیف"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-green-700 dark:text-green-400 leading-6">
                  {appliedCoupon.discountType === "PERCENTAGE"
                    ? `${appliedCoupon.discountValue}٪ تخفیف`
                    : `${formatPrice(appliedCoupon.discountValue)} تومان تخفیف`}
                  {" — "}
                  <span className="font-bold">
                    {formatPrice(appliedCoupon.discountAmount)} تومان
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              کد تخفیف دارید؟
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  onKeyDown={handleKeyDown}
                  disabled={isApplying}
                  placeholder="کد تخفیف را وارد کنید"
                  dir="ltr"
                  className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-royal-500/5 border border-royal-500/10 focus:border-royal-500 focus:outline-none text-sm text-gray-900 dark:text-white transition-colors disabled:opacity-50 text-right"
                />
              </div>
              <button
                onClick={handleApplyDiscount}
                disabled={isApplying}
                className="px-4 py-2.5 rounded-xl bg-royal-500/10 text-royal-500 text-sm font-bold hover:bg-royal-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isApplying ? <Loader2 size={16} className="animate-spin" /> : "ثبت"}
              </button>
            </div>
          </>
        )}
      </div>

      {!isFreeShipping && (
        <div className="mb-5 p-3 rounded-xl bg-blush-500/10 border border-blush-500/20">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-blush-500 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-6">
              با خرید{" "}
              <span className="font-bold text-blush-500">
                {formatPrice(remainingForFreeShipping)} تومان
              </span>{" "}
              دیگر، ارسال شما{" "}
              <span className="font-bold text-blush-500">رایگان</span> می‌شود!
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3 pb-5 border-b border-royal-500/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            تعداد کالاها
          </span>
          <span className="font-bold text-gray-900 dark:text-white">
            {totalItems.toLocaleString("fa-IR")} عدد
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">قیمت کالاها</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {formatPrice(originalTotal)} تومان
          </span>
        </div>

        {totalDiscount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-blush-500">سود شما از خرید</span>
            <span className="font-bold text-blush-500">
              {formatPrice(totalDiscount)}-
            </span>
          </div>
        )}

        {appliedCoupon && couponDiscount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600 flex items-center gap-1">
              <Tag size={12} />
              <span>کد تخفیف ({appliedCoupon.code})</span>
            </span>
            <span className="font-bold text-green-600">
              {formatPrice(couponDiscount)}-
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Truck size={14} />
            <span>هزینه ارسال</span>
          </div>
          {isFreeShipping ? (
            <span className="font-bold text-green-600">رایگان</span>
          ) : (
            <span className="font-bold text-gray-900 dark:text-white">
              {formatPrice(shippingCost)} تومان
            </span>
          )}
        </div>
      </div>

      <div className="py-5 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
          مبلغ قابل پرداخت
        </span>
        <div className="text-left">
          <div className="text-xl md:text-2xl font-black text-royal-500">
            {formatPrice(finalPrice)}
          </div>
          <div className="text-[10px] text-gray-500">تومان</div>
        </div>
      </div>

      <Link
        href="/checkout"
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-l from-royal-500 to-blush-500 text-white font-bold hover:shadow-2xl hover:shadow-royal-500/30 transition-all duration-300 hover:-translate-y-0.5"
      >
        <CreditCard size={20} />
        <span>ادامه فرآیند خرید</span>
      </Link>

      <p className="text-[11px] text-gray-500 text-center mt-4 leading-5">
        با کلیک روی دکمه بالا، به مرحله ثبت آدرس و پرداخت هدایت می‌شوید
      </p>
    </div>
  );
}